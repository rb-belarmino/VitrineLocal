import * as cheerio from 'cheerio';
import { Page } from 'playwright';
import { RawReview } from '../brand.types';
import { Logger } from '../../../shared/logger/logger';

export function parseReviewsFromHtml(html: string): RawReview[] {
  const $ = cheerio.load(html);
  const results: RawReview[] = [];

  // Seletores comuns de cards de avaliação do Google Maps
  const reviewCards = $('div.jftiEf, div[data-review-id]');

  reviewCards.each((_, el) => {
    const card = $(el);

    // Autor
    const authorName = card.find('.d4r55, .TSUbDb, [class*="author"]').first().text().trim();

    // Foto do autor
    const authorPhotoUrl = card.find('img.N3EgBe, img[class*="avatar"]').first().attr('src');

    // Estrelas
    const ariaLabel = card.find('.kvMYJc, span[role="img"]').first().attr('aria-label') || '';
    let rating = 0;
    const match = ariaLabel.match(/(\d([.,]\d)?)/);
    if (match && match[1]) {
      rating = parseFloat(match[1].replace(',', '.'));
    }

    // Tempo relativo
    const relativeTime = card.find('.rsqaWe, [class*="date"]').first().text().trim() || 'recente';

    // Texto do comentário
    const text = card.find('.wiI7Bm, .MyEned span, [class*="review-text"]').first().text().trim();

    if (authorName || text) {
      const reviewItem: RawReview = {
        authorName: authorName || 'Cliente Google',
        rating: isNaN(rating) ? 5 : rating,
        relativeTime,
        text,
      };
      if (authorPhotoUrl) {
        reviewItem.authorPhotoUrl = authorPhotoUrl;
      }
      results.push(reviewItem);
    }
  });

  return results;
}

export class MapsReviewScraper {
  async extract(page: Page, mapsUrl: string): Promise<RawReview[]> {
    try {
      Logger.info(`Navegando para avaliações do Maps: ${mapsUrl}`);
      await page.goto(mapsUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Tenta clicar na aba "Avaliações" se estiver visível
      const reviewsTab = page
        .locator(
          'button[role="tab"]:has-text("Avaliações"), button[role="tab"]:has-text("Comentários")',
        )
        .first();
      if (await reviewsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await reviewsTab.click().catch(() => {});
        await page.waitForTimeout(1000);
      }

      // Clica em botões "Mais" para expandir textos longos
      const moreButtons = page.locator('button.w8nwRe, button:has-text("Mais")');
      const count = await moreButtons.count().catch(() => 0);
      for (let i = 0; i < Math.min(count, 5); i++) {
        await moreButtons
          .nth(i)
          .click()
          .catch(() => {});
      }

      const html = await page.content();
      const reviews = parseReviewsFromHtml(html);
      Logger.info(`Avaliações brutas extraídas: ${reviews.length}`);
      return reviews;
    } catch (err) {
      Logger.warn(
        `Falha ao extrair avaliações do Google Maps para ${mapsUrl}`,
        err instanceof Error ? { error: err.message } : { error: String(err) },
      );
      return [];
    }
  }
}
