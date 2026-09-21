import { describe, it, expect } from 'vitest';
import {
  detectBelezaVariant,
  getNicheFallbackHeroImage,
  FALLBACK_NICHE_HERO_IMAGES,
} from '../core/template-fallbacks';

describe('template-fallbacks (Unit)', () => {
  describe('detectBelezaVariant', () => {
    it('deve retornar "barbearia" para categorias ou nomes com termos masculinos', () => {
      expect(detectBelezaVariant('Barbearia Tradicional', 'Navalha de Ouro')).toBe('barbearia');
      expect(detectBelezaVariant('Cabelereiro', 'Lord Barber Shop')).toBe('barbearia');
      expect(detectBelezaVariant('Estética', 'Studio Barba & Bigode')).toBe('barbearia');
      expect(detectBelezaVariant('Corte masculino e navalha', 'Studio')).toBe('barbearia');
    });

    it('deve retornar "salao" por padrão (default) para salões, clínicas e estética feminina', () => {
      expect(detectBelezaVariant('Salão de Beleza', 'Espaço VIP')).toBe('salao');
      expect(detectBelezaVariant('Clínica de Estética', 'Harmonia Estética')).toBe('salao');
      expect(detectBelezaVariant('Manicure e Pedicure', 'Esmalteria Bella')).toBe('salao');
      expect(detectBelezaVariant('Lash Designer & Cílios', 'Studio Olhar')).toBe('salao');
      expect(detectBelezaVariant('Cabeleireira', 'Studio Glow')).toBe('salao');
    });
  });

  describe('getNicheFallbackHeroImage', () => {
    it('deve retornar imagem curada de gastronomia para gastronomia', () => {
      const url = getNicheFallbackHeroImage('gastronomia');
      expect(url).toBe(FALLBACK_NICHE_HERO_IMAGES.gastronomia);
      expect(url).toContain('unsplash.com');
    });

    it('deve retornar imagem de consultório para saude', () => {
      const url = getNicheFallbackHeroImage('saude');
      expect(url).toBe(FALLBACK_NICHE_HERO_IMAGES.saude);
    });

    it('deve retornar imagem de oficina para automotivo', () => {
      const url = getNicheFallbackHeroImage('automotivo');
      expect(url).toBe(FALLBACK_NICHE_HERO_IMAGES.automotivo);
    });

    it('deve retornar foto de barbearia para beleza com termos masculinos', () => {
      const url = getNicheFallbackHeroImage('beleza', 'Barbearia Vintage', 'Dom Barber');
      expect(url).toBe(FALLBACK_NICHE_HERO_IMAGES.beleza.barbearia);
    });

    it('deve retornar foto de salão para beleza feminino', () => {
      const url = getNicheFallbackHeroImage('beleza', 'Salão de Beleza', 'Studio Bella');
      expect(url).toBe(FALLBACK_NICHE_HERO_IMAGES.beleza.salao);
    });

    it('deve retornar imagem geral como fallback para nichos desconhecidos ou geral', () => {
      expect(getNicheFallbackHeroImage('geral')).toBe(FALLBACK_NICHE_HERO_IMAGES.geral);
      expect(getNicheFallbackHeroImage('outro')).toBe(FALLBACK_NICHE_HERO_IMAGES.geral);
    });
  });
});
