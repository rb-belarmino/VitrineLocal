import { describe, it, expect } from 'vitest';
import { WebsiteClassifier } from '../core/website-classifier';

describe('WebsiteClassifier (Filtro Anti-Site)', () => {
  it('deve classificar URLs vazias, nulas ou indefinidas como NO_WEBSITE (Qualificado)', () => {
    expect(WebsiteClassifier.classify(null)).toEqual({
      type: 'NO_WEBSITE',
      isQualified: true,
      socialLinks: []
    });
    expect(WebsiteClassifier.classify('')).toEqual({
      type: 'NO_WEBSITE',
      isQualified: true,
      socialLinks: []
    });
    expect(WebsiteClassifier.classify('   ')).toEqual({
      type: 'NO_WEBSITE',
      isQualified: true,
      socialLinks: []
    });
  });

  it('deve classificar links do Instagram como SOCIAL_ONLY (Qualificado)', () => {
    const urls = [
      'https://www.instagram.com/oficinadopedro',
      'http://instagram.com/clinica.sorriso',
      'https://instagr.am/hamburgueria',
      'https://instagram.com/p/B9xyz/'
    ];

    for (const url of urls) {
      const result = WebsiteClassifier.classify(url);
      expect(result.type).toBe('SOCIAL_ONLY');
      expect(result.isQualified).toBe(true);
      expect(result.socialLinks).toContain(url);
    }
  });

  it('deve classificar links do Facebook como SOCIAL_ONLY (Qualificado)', () => {
    const urls = [
      'https://facebook.com/mecanica.auto',
      'https://www.facebook.com/pages/Padaria-Central/12345',
      'https://fb.me/pizzariadoze'
    ];

    for (const url of urls) {
      const result = WebsiteClassifier.classify(url);
      expect(result.type).toBe('SOCIAL_ONLY');
      expect(result.isQualified).toBe(true);
    }
  });

  it('deve classificar links de agregadores e mensageria como SOCIAL_ONLY (Qualificado)', () => {
    const urls = [
      'https://linktr.ee/esteticasaude',
      'https://wa.me/5511998765432',
      'https://api.whatsapp.com/send?phone=5511998765432',
      'https://beacons.ai/salaodebeleza',
      'https://bio.link/dentistasp',
      'https://tiktok.com/@barbearia'
    ];

    for (const url of urls) {
      const result = WebsiteClassifier.classify(url);
      expect(result.type).toBe('SOCIAL_ONLY');
      expect(result.isQualified).toBe(true);
    }
  });

  it('deve classificar domínios corporativos próprios como OWN_WEBSITE (Desqualificado)', () => {
    const urls = [
      'https://www.centroautomotivopaulista.com.br',
      'http://oficinadopedro.com',
      'https://clinicasilva.med.br',
      'https://restauranteportugues.com.br/cardapio'
    ];

    for (const url of urls) {
      const result = WebsiteClassifier.classify(url);
      expect(result.type).toBe('OWN_WEBSITE');
      expect(result.isQualified).toBe(false);
      expect(result.disqualificationReason).toBe('HAS_WEBSITE');
    }
  });

  it('deve ignorar protocolos malformados e normalizar URLs', () => {
    const result = WebsiteClassifier.classify('instagram.com/padaria');
    expect(result.type).toBe('SOCIAL_ONLY');
    expect(result.isQualified).toBe(true);
  });
});
