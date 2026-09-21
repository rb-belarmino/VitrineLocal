import * as cheerio from 'cheerio';
import { RawMapsLead } from '../schemas/radar.schemas';
import { MapsSelectors } from './maps-selectors';

export class DomParser {
  /**
   * Verifica se a mensagem de fim de feed do Google Maps está visível no HTML.
   */
  public static hasReachedEndOfFeed(html: string): boolean {
    const $ = cheerio.load(html);
    const endNotice = $(MapsSelectors.endOfFeedNotice).text().trim();
    return endNotice.includes('final da lista') || endNotice.includes('end of the list');
  }

  /**
   * Extrai uma lista de RawMapsLead a partir do HTML do feed de resultados.
   */
  public static parseFeedCards(html: string): RawMapsLead[] {
    const $ = cheerio.load(html);
    const results: RawMapsLead[] = [];

    $(MapsSelectors.resultCard).each((_, element) => {
      const card = $(element);

      // Nome do estabelecimento
      const businessName = card.find(MapsSelectors.cardTitle).text().trim();
      if (!businessName) return;

      // Link permanente do Maps
      const mapsUrl = card.find(MapsSelectors.cardLink).attr('href') ?? '';
      if (!mapsUrl) return;

      // Nota de avaliação
      const ratingStr = card.find(MapsSelectors.ratingText).text().trim().replace(',', '.');
      const rating = parseFloat(ratingStr) || 0;

      // Contagem de avaliações: "(128)" -> 128
      const reviewCountStr = card.find(MapsSelectors.reviewCountText).text().trim();
      const reviewCountMatch = reviewCountStr.match(/\d+/);
      const reviewCount =
        reviewCountMatch && reviewCountMatch[0] ? parseInt(reviewCountMatch[0], 10) : 0;

      // Categoria e detalhes secundários
      let category = 'Serviços Locais';
      let address: string | null = null;
      let phone: string | null = null;

      card.find(MapsSelectors.infoContainer).each((_, infoEl) => {
        const text = $(infoEl).text().trim();

        // Identifica categoria (geralmente acompanhada de " · ")
        if (text.includes('·')) {
          const parts = text.split('·');
          if (parts[1]) {
            category = parts[1].trim();
          }
        }

        // Identifica endereço (geralmente contém Rua, Av., Alameda, ou traço de bairro/cidade)
        if (
          text.includes('Av.') ||
          text.includes('Rua') ||
          text.includes('Alameda') ||
          text.includes(' - ')
        ) {
          if (!address && !text.includes('(') && !text.includes('·')) {
            address = text;
          }
        }

        // Identifica telefone no padrão brasileiro (ex: (11) 98765-4321 ou 5051-2233)
        const phoneMatch = text.match(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/);
        if (phoneMatch && !phone) {
          phone = phoneMatch[0];
        }
      });

      // Website / Redes Sociais
      let website: string | null = null;
      const externalLink = card.find(MapsSelectors.externalLink).attr('href');
      if (externalLink && externalLink.startsWith('http')) {
        website = externalLink;
      }

      results.push({
        businessName,
        category,
        address,
        phone,
        website,
        rating,
        reviewCount,
        mapsUrl,
      });
    });

    return results;
  }
}
