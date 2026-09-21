import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { SaudeTemplate } from '../components/SaudeTemplate';
import { PreviewSiteConfig } from '../site-engine.types';

describe('SaudeTemplate (Unit - Pro Redesign)', () => {
  const mockConfig: PreviewSiteConfig = {
    leadId: '22222222-3333-4444-5555-666666666666',
    slug: 'instituto-odontologico-alvorada',
    businessName: 'Instituto Odontológico Alvorada',
    category: 'Clínica Odontológica & Ortodontia',
    nicheTheme: 'saude',
    contact: {
      phoneRaw: '(11) 97777-6666',
      phoneNormalized: '11977776666',
      isMobile: true,
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
      whatsappLink: 'https://wa.me/5511977776666',
    },
    theme: {
      primaryColor: '#0284C7',
      secondaryColor: '#0D9488',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      paletteSource: 'FALLBACK_NICHE',
    },
    content: {
      headline: 'Seu Sorriso e Bem-Estar com Tecnologia e Cuidado Humanizado',
      subheadline: 'Tratamentos modernos, indolores e corpo clínico especializado.',
      aboutText: 'Mais de 12 anos cuidando da saúde bucal com excelência e biossegurança.',
      keyServices: ['Implantes Dentários', 'Invisalign & Aparelhos', 'Clareamento a Laser', 'Harmonização Orofacial'],
      callToAction: 'Agendar Avaliação no WhatsApp',
    },
    gallery: {
      heroImageUrl: 'https://example.com/clinica-hero.jpg',
      logoUrl: null,
      photos: [],
    },
    socialProof: {
      rating: 4.9,
      reviewCount: 185,
      testimonials: [
        {
          authorName: 'Patrícia Mendes',
          rating: 5,
          text: 'Atendimento excepcional e sem dor! Sempre tive pavor de dentista e aqui me senti acolhida.',
          relativeTime: 'há 1 mês',
        },
      ],
    },
    visualPitch: {
      badgeText: 'Demonstração VitrineLocal',
      ctaText: 'Quero um site assim',
      ctaWhatsappLink: 'https://wa.me/5511888888888',
    },
    meta: {
      title: 'Instituto Odontológico Alvorada',
      description: 'Clínica odontológica de referência',
      ogImage: null,
      canonicalUrl: 'https://preview.vitrinelocal.com.br/preview/instituto-odontologico-alvorada',
    },
  };

  it('deve renderizar a atmosfera Clean Clinic com autoridade e selos de biossegurança', () => {
    const html = renderToString(<SaudeTemplate config={mockConfig} />);

    expect(html).toContain('Instituto Odontológico Alvorada');
    expect(html).toContain('Seu Sorriso e Bem-Estar');
    expect(html).toContain('4.9');
    expect(html).toContain('185');
    expect(html).toContain('Agendar Avaliação no WhatsApp');
    expect(html).toContain('Biossegurança');
  });

  it('deve renderizar a seção de Perguntas Frequentes (FAQ) com acordeão nativo HTML details e summary', () => {
    const html = renderToString(<SaudeTemplate config={mockConfig} />);

    expect(html).toContain('<details');
    expect(html).toContain('<summary');
    expect(html).toContain('Dúvidas Frequentes');
    expect(html).toContain('Aceitam convênio');
  });

  it('deve utilizar fallback de imagem Unsplash CDN quando heroImageUrl for nulo', () => {
    const configSemFoto: PreviewSiteConfig = {
      ...mockConfig,
      gallery: {
        heroImageUrl: null,
        logoUrl: null,
        photos: [],
      },
    };

    const html = renderToString(<SaudeTemplate config={configSemFoto} />);
    expect(html).toContain('images.unsplash.com');
  });

  it('deve conter a StickyMobileBar com CTA de saúde adaptado', () => {
    const html = renderToString(<SaudeTemplate config={mockConfig} />);

    expect(html).toContain('md:hidden');
    expect(html).toContain('fixed bottom-0');
    expect(html).toContain('pb-24');
  });
});
