import { describe, it, expect } from 'vitest';
import {
  calculateRelativeLuminance,
  calculateContrastRatio,
  ensureAccessibleContrast,
  extractPaletteFromSamples
} from '../core/color-extractor';

describe('ColorExtractor & WCAG Contrast (Unit)', () => {
  describe('calculateRelativeLuminance', () => {
    it('deve calcular luminância 0 para preto puro #000000 e 1 para branco puro #FFFFFF', () => {
      expect(calculateRelativeLuminance('#000000')).toBeCloseTo(0, 4);
      expect(calculateRelativeLuminance('#FFFFFF')).toBeCloseTo(1, 4);
    });

    it('deve calcular luminância intermediária corretamente para cores conhecidas', () => {
      const redLum = calculateRelativeLuminance('#FF0000');
      const greenLum = calculateRelativeLuminance('#00FF00');
      const blueLum = calculateRelativeLuminance('#0000FF');

      // No padrão sRGB, verde contribui com a maior fatia da percepção luminosa (~0.715)
      expect(greenLum).toBeGreaterThan(redLum);
      expect(redLum).toBeGreaterThan(blueLum);
    });
  });

  describe('calculateContrastRatio', () => {
    it('deve calcular a taxa máxima de 21:1 entre preto e branco', () => {
      const ratio = calculateContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('deve calcular a taxa de 1:1 para cores idênticas', () => {
      const ratio = calculateContrastRatio('#336699', '#336699');
      expect(ratio).toBeCloseTo(1, 2);
    });
  });

  describe('ensureAccessibleContrast', () => {
    it('deve garantir contraste WCAG AA (>= 4.5:1) entre texto e fundo claro', () => {
      const result = ensureAccessibleContrast('#0284C7', '#FFFFFF');

      const contrast = calculateContrastRatio(result.textColor, result.backgroundColor);
      expect(contrast).toBeGreaterThanOrEqual(4.5);
      expect(result.backgroundColor).toBe('#FFFFFF');
      expect(result.textColor).toBe('#0F172A'); // Escuro para leitura perfeita
    });

    it('deve garantir contraste WCAG AA (>= 4.5:1) entre texto e fundo escuro', () => {
      const result = ensureAccessibleContrast('#EA580C', '#0F172A');

      const contrast = calculateContrastRatio(result.textColor, result.backgroundColor);
      expect(contrast).toBeGreaterThanOrEqual(4.5);
      expect(result.backgroundColor).toBe('#0F172A');
      expect(result.textColor).toBe('#F8FAFC'); // Claro para leitura perfeita
    });
  });

  describe('extractPaletteFromSamples', () => {
    it('deve compor paleta completa e acessível a partir de amostras de cores válidas', () => {
      const samples = ['#2563EB', '#1D4ED8', '#60A5FA'];
      const palette = extractPaletteFromSamples(samples, 'Geral');

      expect(palette.paletteSource).toBe('EXTRACTED');
      expect(palette.primaryColor).toBe('#2563EB');
      expect(palette.secondaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);

      const textContrast = calculateContrastRatio(palette.textColor, palette.backgroundColor);
      expect(textContrast).toBeGreaterThanOrEqual(4.5);
    });

    it('deve acionar fallback para a paleta do nicho se a lista de amostras for vazia ou inválida', () => {
      const palette = extractPaletteFromSamples([], 'Oficina Mecânica');

      expect(palette.paletteSource).toBe('FALLBACK_NICHE');
      expect(palette.primaryColor).toBe('#EA580C'); // Cor de oficina mecânica
    });
  });
});
