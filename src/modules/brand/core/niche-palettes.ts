import { BrandPalette } from '../brand.types';

export const NICHE_PALETTES: Record<string, BrandPalette> = {
  saude: {
    primaryColor: '#0284C7', // Sky blue 600
    secondaryColor: '#0D9488', // Teal 600
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    paletteSource: 'FALLBACK_NICHE'
  },
  automotivo: {
    primaryColor: '#EA580C', // Orange 600
    secondaryColor: '#334155', // Slate 700
    backgroundColor: '#0F172A', // Dark Slate
    textColor: '#F8FAFC',
    paletteSource: 'FALLBACK_NICHE'
  },
  gastronomia: {
    primaryColor: '#DC2626', // Red 600
    secondaryColor: '#D97706', // Amber 600
    backgroundColor: '#FFFBEB', // Amber 50
    textColor: '#1C1917',
    paletteSource: 'FALLBACK_NICHE'
  },
  beleza: {
    primaryColor: '#BE185D', // Pink 700
    secondaryColor: '#F472B6', // Pink 400
    backgroundColor: '#FFFFFF',
    textColor: '#1E293B',
    paletteSource: 'FALLBACK_NICHE'
  },
  padrao: {
    primaryColor: '#2563EB', // Blue 600
    secondaryColor: '#4F46E5', // Indigo 600
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    paletteSource: 'FALLBACK_NICHE'
  }
};

export function getNichePalette(category: string): BrandPalette {
  const normalized = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (
    normalized.includes('dentista') ||
    normalized.includes('odont') ||
    normalized.includes('medico') ||
    normalized.includes('clinica') ||
    normalized.includes('saude') ||
    normalized.includes('fisioterap')
  ) {
    return { ...NICHE_PALETTES['saude']! };
  }

  if (
    normalized.includes('mecanic') ||
    normalized.includes('oficina') ||
    normalized.includes('auto') ||
    normalized.includes('car') ||
    normalized.includes('pneu') ||
    normalized.includes('funilaria')
  ) {
    return { ...NICHE_PALETTES['automotivo']! };
  }

  if (
    normalized.includes('restaurante') ||
    normalized.includes('pizza') ||
    normalized.includes('bar') ||
    normalized.includes('lanche') ||
    normalized.includes('comida') ||
    normalized.includes('hamburguer') ||
    normalized.includes('cafe')
  ) {
    return { ...NICHE_PALETTES['gastronomia']! };
  }

  if (
    normalized.includes('salao') ||
    normalized.includes('beleza') ||
    normalized.includes('cabelo') ||
    normalized.includes('estetica') ||
    normalized.includes('barbearia') ||
    normalized.includes('manicure') ||
    normalized.includes('spa')
  ) {
    return { ...NICHE_PALETTES['beleza']! };
  }

  return { ...NICHE_PALETTES['padrao']! };
}
