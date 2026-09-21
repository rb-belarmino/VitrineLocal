import { Page } from 'playwright';
import { BrowserPool } from './browser-pool';
import { DomParser } from './dom-parser';
import { MapsSelectors } from './maps-selectors';
import { RawMapsLead, SearchParams } from '../schemas/radar.schemas';
import { Logger } from '../../../shared/logger/logger';
import { ScrapingError } from '../../../shared/errors/app-error';

export interface ScraperProgressCallback {
  (foundSoFar: number, isEndOfFeed: boolean): void;
}

export class MapsScraper {
  /**
   * Executa a busca e rolagem no Google Maps retornando a lista de RawMapsLead.
   */
  public async scrape(
    params: SearchParams,
    onProgress?: ScraperProgressCallback,
  ): Promise<RawMapsLead[]> {
    const { niche, location, limit } = params;
    const query = encodeURIComponent(`${niche} em ${location}`);
    const searchUrl = `https://www.google.com/maps/search/${query}`;

    Logger.info(
      `Iniciando scraper no Google Maps: query="${niche} em ${location}", limit=${limit}`,
    );

    const browser = await BrowserPool.getBrowser();
    const context = await BrowserPool.createStealthContext(browser);
    const page = await context.newPage();

    try {
      // Timeout geral de 30s para navegação inicial
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Espera o container de feed ou cards carregarem
      try {
        await page.waitForSelector(MapsSelectors.feedContainer, { timeout: 10000 });
      } catch {
        // Pode acontecer de não ter nenhum resultado para o termo
        Logger.warn(`Feed container não encontrado para a busca: "${niche} em ${location}"`);
        const content = await page.content();
        return DomParser.parseFeedCards(content);
      }

      const leadsMap = new Map<string, RawMapsLead>();
      let isEndOfFeed = false;
      let consecutiveStallCount = 0;
      let previousCardCount = 0;

      while (leadsMap.size < limit && !isEndOfFeed && consecutiveStallCount < 5) {
        // Extrai o conteúdo atual da página
        const html = await page.content();
        const extracted = DomParser.parseFeedCards(html);

        for (const lead of extracted) {
          if (!leadsMap.has(lead.mapsUrl)) {
            leadsMap.set(lead.mapsUrl, lead);
          }
        }

        isEndOfFeed = DomParser.hasReachedEndOfFeed(html);

        if (onProgress) {
          onProgress(leadsMap.size, isEndOfFeed);
        }

        if (leadsMap.size >= limit || isEndOfFeed) {
          break;
        }

        // Se a contagem não aumentou na rolagem anterior, incrementa contador de stall
        if (leadsMap.size === previousCardCount) {
          consecutiveStallCount++;
        } else {
          consecutiveStallCount = 0;
          previousCardCount = leadsMap.size;
        }

        // Rola o feed para baixo
        await this.scrollFeed(page);

        // Delay aleatório humano entre 1200ms e 2200ms
        const delay = Math.floor(Math.random() * 1000) + 1200;
        await page.waitForTimeout(delay);
      }

      Logger.info(
        `Scraping finalizado. Total de estabelecimentos brutos minerados: ${leadsMap.size}`,
      );
      return Array.from(leadsMap.values()).slice(0, limit);
    } catch (error) {
      Logger.error(`Erro durante o scraping de "${niche} em ${location}"`, error);
      throw new ScrapingError(
        `Falha ao minerar estabelecimentos no Google Maps: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      await page.close();
      await context.close();
    }
  }

  /**
   * Executa a rolagem do container feed no navegador.
   */
  private async scrollFeed(page: Page): Promise<void> {
    try {
      await page.evaluate((selector) => {
        const feed = document.querySelector(selector);
        if (feed) {
          feed.scrollTop += 1200;
        } else {
          window.scrollBy(0, 1200);
        }
      }, MapsSelectors.feedContainer);
    } catch {
      // Ignora erro eventual de contexto se a página estiver navegando
    }
  }
}
