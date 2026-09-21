import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { DomParser } from '../scraper/dom-parser';

describe('DomParser (Offline HTML Fixtures)', () => {
  const fixturePath = path.resolve(__dirname, 'fixtures/search-feed.html');
  const htmlContent = fs.readFileSync(fixturePath, 'utf-8');

  it('deve identificar se o feed de resultados chegou ao final', () => {
    const isEndOfFeed = DomParser.hasReachedEndOfFeed(htmlContent);
    expect(isEndOfFeed).toBe(true);
  });

  it('deve extrair todos os cards de estabelecimentos da fixture', () => {
    const leads = DomParser.parseFeedCards(htmlContent);
    expect(leads.length).toBe(5);
  });

  it('deve extrair os dados completos de um estabelecimento sem website', () => {
    const leads = DomParser.parseFeedCards(htmlContent);
    const moema = leads.find((l) => l.businessName.includes('Auto Mecânica Moema Express'));

    expect(moema).toBeDefined();
    expect(moema?.businessName).toBe('Auto Mecânica Moema Express');
    expect(moema?.category).toBe('Oficina mecânica');
    expect(moema?.rating).toBe(4.9);
    expect(moema?.reviewCount).toBe(128);
    expect(moema?.address).toContain('Av. Moema, 340');
    expect(moema?.phone).toBe('(11) 98765-4321');
    expect(moema?.website).toBeNull();
    expect(moema?.mapsUrl).toContain('google.com/maps/place/Auto+Mecanica+Moema+Express');
  });

  it('deve extrair website de rede social quando presente', () => {
    const leads = DomParser.parseFeedCards(htmlContent);
    const odonto = leads.find((l) => l.businessName.includes('Studio Odonto'));

    expect(odonto).toBeDefined();
    expect(odonto?.website).toBe('https://www.instagram.com/studioodontovilanova');
  });

  it('deve extrair website próprio quando presente', () => {
    const leads = DomParser.parseFeedCards(htmlContent);
    const paulista = leads.find((l) => l.businessName.includes('Centro Automotivo Paulista'));

    expect(paulista).toBeDefined();
    expect(paulista?.website).toBe('https://www.centroautomotivopaulista.com.br');
  });
});
