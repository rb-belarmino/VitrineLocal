import { describe, it, expect } from 'vitest';
import { SlugGenerator } from '../core/slug-generator';

describe('SlugGenerator (Unit)', () => {
  const generator = new SlugGenerator();

  it('deve converter nome e bairro em kebab-case limpo', () => {
    const slug = generator.generate('Clínica Odonto Sorriso', 'Moema, São Paulo - SP');
    expect(slug).toBe('clinica-odonto-sorriso-moema');
  });

  it('deve lidar com caracteres especiais, acentuação e pontuação', () => {
    const slug = generator.generate("Auto Elétrica & Mecânica D'Ávila!", 'Bela Vista');
    expect(slug).toBe('auto-eletrica-mecanica-davila-bela-vista');
  });

  it('deve gerar slug consistente apenas com o nome se o endereço for nulo ou vazio', () => {
    const slug = generator.generate('Pizzaria Bella Napoli', null);
    expect(slug).toBe('pizzaria-bella-napoli');
  });

  it('deve truncar slugs excessivamente longos para no máximo 60 caracteres sem cortar no meio de hífen', () => {
    const longName =
      'Centro Especializado em Tratamento Avançado de Estética e Fisioterapia Integrativa';
    const longAddress = 'Jardim das Palmeiras Imperial, São Paulo';
    const slug = generator.generate(longName, longAddress);
    expect(slug.length).toBeLessThanOrEqual(60);
    expect(slug).not.toMatch(/-$/);
  });

  it('deve adicionar sufixo numérico ou identificador quando for solicitada desambiguação de colisão', () => {
    const baseSlug = 'oficina-precision-moema';
    const disambiguated = generator.disambiguate(baseSlug, 2);
    expect(disambiguated).toBe('oficina-precision-moema-2');
  });
});
