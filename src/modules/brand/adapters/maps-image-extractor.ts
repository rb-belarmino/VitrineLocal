import * as cheerio from 'cheerio';
import { Page } from 'playwright';
import { ExtractedVisuals } from '../brand.types';
import { Logger } from '../../../shared/logger/logger';

/**
 * Converte URLs de miniaturas do Google CDN para resolução alta (1200x800 ou s1600).
 */
export function upgradeGooglePhotoUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  if (url.includes('googleusercontent.com')) {
    // Substitui parâmetros =w...-h... por =w1200-h800-k-no
    if (/=w\d+-h\d+/.test(url)) {
      return url.replace(/=w\d+-h\d+[^?]*/, '=w1200-h800-k-no');
    }
    // Substitui =s... por =s1600
    if (/=s\d+/.test(url)) {
      return url.replace(/=s\d+[^?]*/, '=s1600');
    }
  }

  return url;
}

/**
 * Extrai URLs de imagens do HTML do perfil do Google Maps via Cheerio.
 */
export function parseVisualsFromHtml(html: string): ExtractedVisuals {
  const $ = cheerio.load(html);
  const foundUrls: string[] = [];

  // Busca todas as imagens pertencentes ao Google CDN
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('googleusercontent.com') && !src.includes('clear.png')) {
      const highRes = upgradeGooglePhotoUrl(src);
      if (!foundUrls.includes(highRes)) {
        foundUrls.push(highRes);
      }
    }
  });

  if (foundUrls.length === 0) {
    return {
      logoUrl: null,
      heroImageUrl: null,
      galleryUrls: []
    };
  }

  const heroImageUrl = foundUrls[0] ?? null;
  const logoUrl = foundUrls[0] ?? null;
  const galleryUrls = foundUrls.slice(1, 6);

  return {
    logoUrl,
    heroImageUrl,
    galleryUrls
  };
}

/**
 * Scraper Playwright para navegar no Maps e extrair imagens de alta resolução.
 */
export class MapsImageExtractor {
  async extract(page: Page, mapsUrl: string): Promise<ExtractedVisuals> {
    try {
      Logger.info(`Extraindo imagens do perfil: ${mapsUrl}`);
      await page.goto(mapsUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Aguarda 1s para o feed carregar as imagens
      await page.waitForTimeout(1000);

      const html = await page.content();
      const visuals = parseVisualsFromHtml(html);
      Logger.info(`Imagens extraídas: Hero=${visuals.heroImageUrl ? 'Sim' : 'Não'}, Galeria=${visuals.galleryUrls.length}`);
      return visuals;
    } catch (err) {
      Logger.warn(
        `Falha ao extrair imagens do Google Maps para ${mapsUrl}`,
        err instanceof Error ? { error: err.message } : { error: String(err) }
      );
      return {
        logoUrl: null,
        heroImageUrl: null,
        galleryUrls: []
      };
    }
  }
}
