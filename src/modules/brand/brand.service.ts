import { Page, BrowserContext } from 'playwright';
import { BrandRepository } from './repositories/brand.repository';
import { BrowserPool } from '../radar/scraper/browser-pool';
import { MapsImageExtractor } from './adapters/maps-image-extractor';
import { SocialImageExtractor } from './adapters/social-image-extractor';
import { MapsReviewScraper } from './adapters/maps-review-scraper';
import { GeminiSynthesizer } from './adapters/gemini-synthesizer';
import { curateTopReviews } from './core/review-curator';
import { extractPaletteFromSamples } from './core/color-extractor';
import { BrandProfileResponse } from './brand.types';
import { NotFoundError } from '../../shared/errors/app-error';
import { Logger } from '../../shared/logger/logger';

export class BrandExtractorService {
  constructor(
    private readonly repository: BrandRepository,
    private readonly browserPool: BrowserPool = new BrowserPool(),
    private readonly imageExtractor: MapsImageExtractor = new MapsImageExtractor(),
    private readonly socialExtractor: SocialImageExtractor = new SocialImageExtractor(),
    private readonly reviewScraper: MapsReviewScraper = new MapsReviewScraper(),
    private readonly synthesizer: GeminiSynthesizer = new GeminiSynthesizer(),
  ) {}

  async getBrandProfile(leadId: string): Promise<BrandProfileResponse> {
    const profile = await this.repository.findByLeadId(leadId);
    if (!profile) {
      throw new NotFoundError(`Nenhum perfil de marca encontrado para o lead ${leadId}`);
    }
    return profile;
  }

  async extractBrand(leadId: string, force = false): Promise<BrandProfileResponse> {
    const lead = await this.repository.findLeadById(leadId);
    if (!lead) {
      throw new NotFoundError(`Lead com ID ${leadId} não foi encontrado.`);
    }

    // Caching/Idempotência: se já existe e não foi forçado, retorna do banco
    if (!force) {
      const existing = await this.repository.findByLeadId(leadId);
      if (existing) {
        Logger.info(`Retornando BrandProfile em cache para o lead ${leadId}`);
        return existing;
      }
    }

    Logger.info(`Iniciando extração de marca para lead: "${lead.businessName}" (${leadId})`);

    let page: Page | null = null;
    let context: BrowserContext | null = null;

    try {
      const poolWithAcquire = this.browserPool as unknown as {
        acquireContext?: () => Promise<{ page: Page; context: BrowserContext }>;
      };
      if (typeof poolWithAcquire.acquireContext === 'function') {
        const session = await poolWithAcquire.acquireContext();
        page = session.page;
        context = session.context;
      } else {
        const browser = await BrowserPool.getBrowser();
        context = await BrowserPool.createStealthContext(browser);
        page = await context.newPage();
      }

      // 1. Extração de Fotos do Google Maps
      const visuals = await this.imageExtractor.extract(page, lead.mapsUrl);

      // 2. Fallback Social (Instagram) se houver carência de imagens no Maps (< 3 fotos)
      let socialLinks: string[] = [];
      try {
        socialLinks = JSON.parse(lead.socialLinks || '[]');
      } catch {
        socialLinks = [];
      }

      if (visuals.galleryUrls.length < 3 && socialLinks.length > 0) {
        const instagramUrl = socialLinks.find((l) => l.includes('instagram.com'));
        if (instagramUrl) {
          const socialPhotos = await this.socialExtractor.extractFromSocial(instagramUrl);
          if (socialPhotos.length > 0) {
            visuals.galleryUrls.push(...socialPhotos);
            if (!visuals.heroImageUrl && socialPhotos[0]) {
              visuals.heroImageUrl = socialPhotos[0];
            }
          }
        }
      }

      // 3. Extração e Curadoria de Depoimentos 5 Estrelas
      const rawReviews = await this.reviewScraper.extract(page, lead.mapsUrl);
      const testimonials = curateTopReviews(rawReviews, 5);

      // 4. Determinação de Paleta de Cores (com fallback por nicho e contraste WCAG AA)
      const palette = extractPaletteFromSamples([], lead.category);

      // 5. Síntese Semântica com Gemini AI
      const content = await this.synthesizer.synthesize(
        lead.businessName,
        lead.category,
        testimonials,
      );

      // 6. Persistência via Repositório
      const savedProfile = await this.repository.upsert({
        leadId,
        logoUrl: visuals.logoUrl,
        heroImageUrl: visuals.heroImageUrl,
        galleryUrls: visuals.galleryUrls,
        palette,
        content,
        testimonials,
        status: 'COMPLETED',
      });

      Logger.info(
        `BrandProfile extraído e persistido com sucesso para ${lead.businessName} (${leadId})`,
      );
      return savedProfile;
    } catch (err: unknown) {
      Logger.error(
        `Erro durante extração de marca para o lead ${leadId}`,
        err instanceof Error ? { message: err.message, stack: err.stack } : { error: String(err) },
      );
      throw err;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch {
          // ignora erro ao fechar página
        }
      }
      if (context) {
        try {
          await context.close();
        } catch {
          // ignora erro ao fechar contexto
        }
      }
    }
  }
}
