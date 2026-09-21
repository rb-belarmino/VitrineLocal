import { ISiteEngineService, PreviewSiteConfig } from './site-engine.types';
import { SiteEngineRepository } from './repositories/site-engine.repository';
import { BrandExtractorService } from '../brand/brand.service';
import { SlugGenerator } from './core/slug-generator';
import { SiteConfigBuilder } from './core/site-config-builder';
import { TemplateRegistry } from './templates/template-registry';
import { renderBaseLayout } from './templates/base-layout';
import { NotFoundError } from '../../shared/errors/app-error';

export class SiteEngineService implements ISiteEngineService {
  constructor(
    private readonly siteRepo: SiteEngineRepository,
    private readonly brandService: BrandExtractorService,
    private readonly slugGenerator: SlugGenerator = new SlugGenerator(),
    private readonly configBuilder: SiteConfigBuilder = new SiteConfigBuilder(),
    private readonly templateRegistry: TemplateRegistry = new TemplateRegistry(),
  ) {}

  public async resolveSlug(lead: {
    id: string;
    businessName: string;
    address?: string | null;
  }): Promise<string> {
    const baseSlug = this.slugGenerator.generate(lead.businessName, lead.address);

    const isAvailable = await this.siteRepo.isSlugAvailable(baseSlug);
    if (isAvailable) {
      return baseSlug;
    }

    let counter = 2;
    while (counter < 100) {
      const candidate = `${baseSlug}-${counter}`;
      const candidateAvailable = await this.siteRepo.isSlugAvailable(candidate);
      if (candidateAvailable) {
        return candidate;
      }
      counter++;
    }

    // Fallback com timestamp em caso improvável de colisão de 100 slugs
    return `${baseSlug}-${Date.now()}`;
  }

  public async buildSiteConfig(identifier: string): Promise<PreviewSiteConfig> {
    const leadWithProfile = await this.siteRepo.findByIdOrSlug(identifier);

    if (!leadWithProfile) {
      throw new NotFoundError(`Lead não encontrado para o identificador "${identifier}".`);
    }

    let { lead, profile } = leadWithProfile;

    // Garante que o lead tenha slug gerado e persistido
    if (!lead.slug) {
      const generatedSlug = await this.resolveSlug(lead);
      await this.siteRepo.updateSlug(lead.id, generatedSlug);
      lead = {
        ...lead,
        slug: generatedSlug,
      };
    }

    // JIT Brand Extraction: Se o perfil de marca não existir, extrai em tempo real
    if (!profile) {
      await this.brandService.extractBrand(lead.id);
      const reloaded = await this.siteRepo.findByIdOrSlug(lead.id);
      if (!reloaded || !reloaded.profile) {
        throw new NotFoundError(`Perfil de marca não pôde ser gerado para o lead "${lead.id}".`);
      }
      lead = reloaded.lead;
      profile = reloaded.profile;
    }

    return this.configBuilder.build(lead, profile);
  }

  public async renderPreviewHtml(identifier: string): Promise<string> {
    const config = await this.buildSiteConfig(identifier);
    const template = this.templateRegistry.getTemplate(config.nicheTheme);
    const contentHtml = template.render(config);
    return renderBaseLayout(config, contentHtml);
  }
}
