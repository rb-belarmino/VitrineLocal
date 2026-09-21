import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { AutomotivoTemplate } from '../components/AutomotivoTemplate';
import { PreviewSiteConfig } from '../site-engine.types';

describe('AutomotivoTemplate (Unit - Pro Redesign)', () => {
  const mockConfig: PreviewSiteConfig = {
    leadId: '33333333-4444-5555-6666-777777777777',
    slug: 'oficina-precision-auto',
    businessName: 'Precision Auto Center',
    category: 'Mecânica Automotiva & Injeção Eletrônica',
    nicheTheme: 'automotivo',
    contact: {
      phoneRaw: '(11) 96666-5555',
      phoneNormalized: '11966665555',
      isMobile: true,
      address: 'Av. das Nações Unidas, 3000 - Santo Amaro, São Paulo - SP',
      whatsappLink: 'https://wa.me/5511966665555',
    },
    theme: {
      primaryColor: '#EA580C',
      secondaryColor: '#334155',
      backgroundColor: '#020617',
      textColor: '#F8FAFC',
      paletteSource: 'FALLBACK_NICHE',
    },
    content: {
      headline: 'Mecânica de Confiança, Diagnóstico Preciso e Orçamento Rápido',
      subheadline: 'Equipamentos computadorizados de última geração e garantia total em peças e serviços.',
      aboutText: 'Mais de 20 anos cuidando de veículos nacionais e importados.',
      keyServices: ['Revisão Preventiva Geral', 'Injeção Eletrônica & Scanner', 'Freios e ABS', 'Suspensão e Alinhamento 3D'],
      callToAction: 'Solicitar Orçamento no WhatsApp',
    },
    gallery: {
      heroImageUrl: 'https://example.com/oficina-hero.jpg',
      logoUrl: null,
      photos: [],
    },
    socialProof: {
      rating: 4.8,
      reviewCount: 240,
      testimonials: [
        {
          authorName: 'Ricardo Alencar',
          rating: 5,
          text: 'Mecânica transparente e honesta! Fizeram o diagnóstico exato e entregaram no mesmo dia.',
          relativeTime: 'há 3 semanas',
        },
      ],
    },
    visualPitch: {
      badgeText: 'Demonstração VitrineLocal',
      ctaText: 'Quero um site assim',
      ctaWhatsappLink: 'https://wa.me/5511888888888',
    },
    meta: {
      title: 'Precision Auto Center | Mecânica em São Paulo',
      description: 'Oficina mecânica especializada',
      ogImage: null,
      canonicalUrl: 'https://preview.vitrinelocal.com.br/preview/oficina-precision-auto',
    },
  };

  it('deve renderizar tema Dark Industrial de alto contraste com badges de garantia e diagnóstico', () => {
    const html = renderToString(<AutomotivoTemplate config={mockConfig} />);

    expect(html).toContain('Precision Auto Center');
    expect(html).toContain('Mecânica de Confiança');
    expect(html).toContain('4.8');
    expect(html).toContain('240');
    expect(html).toContain('Garantia em Peças e Serviços');
    expect(html).toContain('Diagnóstico Computadorizado');
  });

  it('deve utilizar fallback de foto de oficina Unsplash CDN quando heroImageUrl for nulo', () => {
    const configSemFoto: PreviewSiteConfig = {
      ...mockConfig,
      gallery: {
        heroImageUrl: null,
        logoUrl: null,
        photos: [],
      },
    };

    const html = renderToString(<AutomotivoTemplate config={configSemFoto} />);
    expect(html).toContain('images.unsplash.com');
  });

  it('deve conter a StickyMobileBar com CTA automotivo de orçamento expresso', () => {
    const html = renderToString(<AutomotivoTemplate config={mockConfig} />);

    expect(html).toContain('md:hidden');
    expect(html).toContain('fixed bottom-0');
    expect(html).toContain('pb-24');
    expect(html).toContain('Solicitar Orçamento no WhatsApp');
  });
});
