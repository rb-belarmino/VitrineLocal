import { chromium, Browser, BrowserContext } from 'playwright';
import { Logger } from '../../../shared/logger/logger';

export class BrowserPool {
  private static browserInstance: Browser | null = null;

  /**
   * Obtém ou inicializa a instância do Chromium em modo headless com flags stealth.
   */
  public static async getBrowser(): Promise<Browser> {
    if (!this.browserInstance || !this.browserInstance.isConnected()) {
      Logger.info('Inicializando instância Chromium headless com flags stealth...');
      this.browserInstance = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1280,800',
          '--disable-blink-features=AutomationControlled'
        ]
      });
    }
    return this.browserInstance;
  }

  /**
   * Cria um contexto isolado configurado com User-Agent orgânico e bloqueio de imagens pesadas.
   */
  public static async createStealthContext(browser: Browser): Promise<BrowserContext> {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      locale: 'pt-BR',
      timezoneId: 'America/Sao_Paulo',
      permissions: ['geolocation']
    });

    // Injeta scripts para mascarar automação
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
    });

    // Bloqueia imagens, fontes e estilos secundários para economizar banda e acelerar scraping
    await context.route('**/*.{png,jpg,jpeg,svg,webp,gif,woff,woff2}', route => {
      void route.abort();
    });

    return context;
  }

  /**
   * Fecha o navegador ao finalizar as operações do processo.
   */
  public static async close(): Promise<void> {
    if (this.browserInstance) {
      Logger.info('Encerrando instância do browser.');
      await this.browserInstance.close();
      this.browserInstance = null;
    }
  }
}
