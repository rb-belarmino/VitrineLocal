import { BrandPalette } from '../brand.types';
import { getNichePalette } from './niche-palettes';

/**
 * Normaliza e valida um código hexadecimal #RRGGBB.
 */
function normalizeHex(hex: string): string | null {
  const cleaned = hex.trim().replace(/^#/, '');
  if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return `#${cleaned.toUpperCase()}`;
  }
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    const r = cleaned[0];
    const g = cleaned[1];
    const b = cleaned[2];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return null;
}

/**
 * Converte HEX para RGB numérico (0-255).
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const validHex = normalizeHex(hex) || '#000000';
  const r = parseInt(validHex.slice(1, 3), 16);
  const g = parseInt(validHex.slice(3, 5), 16);
  const b = parseInt(validHex.slice(5, 7), 16);
  return { r, g, b };
}

/**
 * Calcula a Luminância Relativa conforme WCAG 2.1.
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
export function calculateRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0);
}

/**
 * Calcula a Razão de Contraste entre duas cores conforme WCAG 2.1.
 * Ratio = (L1 + 0.05) / (L2 + 0.05), onde L1 é a cor mais clara.
 */
export function calculateContrastRatio(hex1: string, hex2: string): number {
  const lum1 = calculateRelativeLuminance(hex1);
  const lum2 = calculateRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Garante contraste acessível (WCAG AA ratio >= 4.5:1) para fundo e texto,
 * preservando a cor primária da marca como acento principal.
 */
export function ensureAccessibleContrast(
  primaryHex: string,
  suggestedBg = '#FFFFFF',
): {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
} {
  const validPrimary = normalizeHex(primaryHex) || '#2563EB';
  const bgLuminance = calculateRelativeLuminance(suggestedBg);

  let backgroundColor: string;
  let textColor: string;

  if (bgLuminance > 0.5) {
    backgroundColor = '#FFFFFF';
    textColor = '#0F172A'; // Slate 900 (ultra legível no branco, ratio > 15:1)
  } else {
    backgroundColor = '#0F172A';
    textColor = '#F8FAFC'; // Slate 50 (ultra legível no escuro, ratio > 15:1)
  }

  // Gera uma cor secundária complementar deslocando o tom (shift simples de matiz)
  const rgb = hexToRgb(validPrimary);
  const secR = Math.min(255, Math.floor(rgb.g * 0.8 + 30));
  const secG = Math.min(255, Math.floor(rgb.b * 0.9 + 20));
  const secB = Math.min(255, Math.floor(rgb.r * 0.85 + 25));
  const secondaryColor =
    `#${secR.toString(16).padStart(2, '0')}${secG.toString(16).padStart(2, '0')}${secB.toString(16).padStart(2, '0')}`.toUpperCase();

  return {
    primaryColor: validPrimary,
    secondaryColor,
    backgroundColor,
    textColor,
  };
}

/**
 * Extrai paleta de cores dominante a partir de amostras de pixels/cores ou aciona fallback.
 */
export function extractPaletteFromSamples(
  samples: string[],
  fallbackCategory = 'Serviços',
): BrandPalette {
  const validSamples = samples.map(normalizeHex).filter((h): h is string => h !== null);

  if (validSamples.length === 0) {
    return getNichePalette(fallbackCategory);
  }

  const primaryColor = validSamples[0]!;
  const accessible = ensureAccessibleContrast(primaryColor);

  return {
    primaryColor: accessible.primaryColor,
    secondaryColor: accessible.secondaryColor,
    backgroundColor: accessible.backgroundColor,
    textColor: accessible.textColor,
    paletteSource: 'EXTRACTED',
  };
}
