/**
 * Contrato de Componentes e Utilitários de Templates Profissionais
 * Spec: 005-pro-templates
 */

import type { PreviewSiteConfig } from '../../../src/modules/site-engine/site-engine.types';

export interface TemplateComponentProps {
  config: PreviewSiteConfig;
}

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

export interface IProTemplateUtils {
  detectBelezaVariant(category: string, businessName: string): BelezaVariant;
  getNicheFallbackHeroImage(
    niche: string,
    category?: string,
    businessName?: string
  ): string;
}
