import * as cheerio from 'cheerio';
import { Logger } from '../../../shared/logger/logger';

export function parseInstagramPublicImage(html: string): string | null {
  const $ = cheerio.load(html);
  const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
  return ogImage && ogImage.startsWith('http') ? ogImage : null;
}

export class SocialImageExtractor {
  async extractFromSocial(socialUrl: string): Promise<string[]> {
    if (!socialUrl || !socialUrl.startsWith('http')) {
      return [];
    }

    try {
      const response = await fetch(socialUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        return [];
      }

      const html = await response.text();
      const image = parseInstagramPublicImage(html);
      return image ? [image] : [];
    } catch (err) {
      Logger.warn(
        `Não foi possível extrair mídia social de ${socialUrl}`,
        err instanceof Error ? { error: err.message } : { error: String(err) }
      );
      return [];
    }
  }
}
