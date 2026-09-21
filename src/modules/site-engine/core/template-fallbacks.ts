/**
 * Catálogo e Utilitários de Fallbacks de Imagens e Variantes de Templates
 * Módulo 3: Site Engine (VitrineLocal)
 */

export type BelezaVariant = 'salao' | 'barbearia';

export interface NicheHeroFallbackMap {
  gastronomia: string;
  saude: string;
  automotivo: string;
  beleza: {
    salao: string;
    barbearia: string;
  };
  geral: string;
}

export const FALLBACK_NICHE_HERO_IMAGES: NicheHeroFallbackMap = {
  gastronomia:
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  saude:
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
  automotivo:
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
  beleza: {
    salao:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    barbearia:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
  },
  geral:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
};

const BARBEARIA_KEYWORDS = [
  'barbearia',
  'barber',
  'barba',
  'navalha',
  'corte masculino',
  'bigode',
];

/**
 * Detecta se o negócio no nicho de beleza corresponde à variante de Barbearia masculina.
 * O padrão (default) é sempre a variante de Salão/Estética feminina.
 */
export function detectBelezaVariant(category: string, businessName: string): BelezaVariant {
  const combined = `${category} ${businessName}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const isBarbearia = BARBEARIA_KEYWORDS.some((kw) => combined.includes(kw));

  return isBarbearia ? 'barbearia' : 'salao';
}

/**
 * Resolve a imagem de fallback em alta resolução para o hero caso o lead não possua fotos.
 */
export function getNicheFallbackHeroImage(
  niche: string,
  category = '',
  businessName = ''
): string {
  const normalized = niche.toLowerCase().trim();

  if (normalized === 'gastronomia') {
    return FALLBACK_NICHE_HERO_IMAGES.gastronomia;
  }

  if (normalized === 'saude') {
    return FALLBACK_NICHE_HERO_IMAGES.saude;
  }

  if (normalized === 'automotivo') {
    return FALLBACK_NICHE_HERO_IMAGES.automotivo;
  }

  if (normalized === 'beleza') {
    const variant = detectBelezaVariant(category, businessName);
    return FALLBACK_NICHE_HERO_IMAGES.beleza[variant];
  }

  return FALLBACK_NICHE_HERO_IMAGES.geral;
}
