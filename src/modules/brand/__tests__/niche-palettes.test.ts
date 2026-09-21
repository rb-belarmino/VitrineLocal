import { describe, it, expect } from 'vitest';
import { getNichePalette, NICHE_PALETTES } from '../core/niche-palettes';

describe('NichePalettes (Unit)', () => {
  it('deve retornar a paleta de saúde/odontologia para termos relacionados a dentista ou clínica', () => {
    const palette1 = getNichePalette('Clínica Odontológica');
    const palette2 = getNichePalette('Dentista');
    const palette3 = getNichePalette('Consultório Médico');

    expect(palette1.paletteSource).toBe('FALLBACK_NICHE');
    expect(palette1.primaryColor).toBe(NICHE_PALETTES['saude']!.primaryColor);
    expect(palette2.primaryColor).toBe(NICHE_PALETTES['saude']!.primaryColor);
    expect(palette3.primaryColor).toBe(NICHE_PALETTES['saude']!.primaryColor);
  });

  it('deve retornar a paleta automotiva para termos relacionados a oficina, mecânica ou auto', () => {
    const palette = getNichePalette('Oficina Mecânica em Moema');

    expect(palette.paletteSource).toBe('FALLBACK_NICHE');
    expect(palette.primaryColor).toBe(NICHE_PALETTES['automotivo']!.primaryColor);
  });

  it('deve retornar a paleta gastronômica para restaurantes, pizzarias ou lanchonetes', () => {
    const palette = getNichePalette('Pizzaria Tradicional');

    expect(palette.paletteSource).toBe('FALLBACK_NICHE');
    expect(palette.primaryColor).toBe(NICHE_PALETTES['gastronomia']!.primaryColor);
  });

  it('deve retornar a paleta de beleza/estética para salão, estética ou barbearia', () => {
    const palette = getNichePalette('Salão de Beleza & Spa');

    expect(palette.paletteSource).toBe('FALLBACK_NICHE');
    expect(palette.primaryColor).toBe(NICHE_PALETTES['beleza']!.primaryColor);
  });

  it('deve retornar a paleta padrão/serviços caso a categoria não coincida com nenhum nicho específico', () => {
    const palette = getNichePalette('Empresa de Consultoria Desconhecida');

    expect(palette.paletteSource).toBe('FALLBACK_NICHE');
    expect(palette.primaryColor).toBe(NICHE_PALETTES['padrao']!.primaryColor);
  });

  it('todas as paletas do catálogo devem possuir cores válidas no padrão HEX #RRGGBB', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;

    Object.values(NICHE_PALETTES).forEach((pal) => {
      expect(pal.primaryColor).toMatch(hexRegex);
      expect(pal.secondaryColor).toMatch(hexRegex);
      expect(pal.backgroundColor).toMatch(hexRegex);
      expect(pal.textColor).toMatch(hexRegex);
    });
  });
});
