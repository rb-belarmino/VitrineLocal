import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { MapsScraper } from '../scraper/maps-scraper';
import { BrowserPool } from '../scraper/browser-pool';

describe('MapsScraper (Unit & Integration)', () => {
  const fixturePath = path.resolve(__dirname, 'fixtures/search-feed.html');
  const fixtureHtml = fs.readFileSync(fixturePath, 'utf-8');

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve instanciar o MapsScraper corretamente', () => {
    const scraper = new MapsScraper();
    expect(scraper).toBeInstanceOf(MapsScraper);
  });

  it('deve extrair dados e respeitar o limite solicitado via página mockada', async () => {
    const mockPage = {
      goto: vi.fn().mockResolvedValue(undefined),
      waitForSelector: vi.fn().mockResolvedValue(undefined),
      content: vi.fn().mockResolvedValue(fixtureHtml),
      evaluate: vi.fn().mockResolvedValue(undefined),
      waitForTimeout: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined)
    };

    const mockContext = {
      newPage: vi.fn().mockResolvedValue(mockPage),
      close: vi.fn().mockResolvedValue(undefined)
    };

    const mockBrowser = {
      isConnected: vi.fn().mockReturnValue(true)
    };

    vi.spyOn(BrowserPool, 'getBrowser').mockResolvedValue(mockBrowser as unknown as import('playwright').Browser);
    vi.spyOn(BrowserPool, 'createStealthContext').mockResolvedValue(mockContext as unknown as import('playwright').BrowserContext);

    const scraper = new MapsScraper();
    const results = await scraper.scrape({
      niche: 'Oficina Mecânica',
      location: 'Moema, São Paulo',
      limit: 3
    });

    expect(results.length).toBe(3);
    expect(results[0]?.businessName).toBe('Auto Mecânica Moema Express');
    expect(mockPage.goto).toHaveBeenCalledWith(
      expect.stringContaining('google.com/maps/search/Oficina%20Mec%C3%A2nica%20em%20Moema%2C%20S%C3%A3o%20Paulo'),
      expect.any(Object)
    );
    expect(mockPage.close).toHaveBeenCalled();
    expect(mockContext.close).toHaveBeenCalled();
  });
});
