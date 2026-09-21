import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { GastronomiaTemplate } from '../components/GastronomiaTemplate';
import { PreviewSiteConfig } from '../site-engine.types';

describe('GastronomiaTemplate (Unit - Pro Redesign)', () => {
  const mockConfig: PreviewSiteConfig = {
    leadId: '12345678-1234-1234-1234-123456789012',
    slug: 'pizzaria-bella-napoli',
    businessName: 'Pizzaria Bella Napoli',
    category: 'Pizzaria & Restaurante Italiano',
    nicheTheme: 'gastronomia',
    contact: {
      phoneRaw: '(11) 98888-7777',
      phoneNormalized: '11988887777',
      isMobile: true,
      address: 'Rua Augusta, 1500 - Consolação, São Paulo - SP',
      whatsappLink: 'https://wa.me/5511988887777',
    },
    theme: {
      primaryColor: '#DC2626',
      secondaryColor: '#D97706',
      backgroundColor: '#0C0A09',
      textColor: '#FFFFFF',
      paletteSource: 'EXTRACTED',
    },
    content: {
      headline: 'A Autêntica Pizza Napolitana com Forno a Lenha',
      subheadline: 'Massa de fermentação natural 48h e ingredientes italianos importados.',
      aboutText: 'Mais de 15 anos servindo a melhor pizza artesanal da região.',
      keyServices: ['Pizza Margherita Gourmet', 'Calzone Tradicional', 'Burrata Artesanal', 'Carta de Vinhos'],
      callToAction: 'Fazer Pedido no WhatsApp',
    },
    gallery: {
      heroImageUrl: 'https://example.com/pizza-hero.jpg',
      logoUrl: null,
      photos: ['https://example.com/pizza-1.jpg', 'https://example.com/pizza-2.jpg'],
    },
    socialProof: {
      rating: 4.8,
      reviewCount: 312,
      testimonials: [
        {
          authorName: 'Carlos Eduardo',
          rating: 5,
          text: 'Melhor pizza napolitana que já comi em SP! Atendimento impecável.',
          relativeTime: 'há 2 semanas',
        },
      ],
    },
    visualPitch: {
      badgeText: 'Demonstração VitrineLocal',
      ctaText: 'Quero um site assim',
      ctaWhatsappLink: 'https://wa.me/5511888888888',
    },
    meta: {
      title: 'Pizzaria Bella Napoli | São Paulo',
      description: 'A autêntica pizza napolitana',
      ogImage: null,
      canonicalUrl: 'https://preview.vitrinelocal.com.br/preview/pizzaria-bella-napoli',
    },
  };

  it('deve renderizar o Hero Split com badge de nota Google e botões de ação', () => {
    const html = renderToString(<GastronomiaTemplate config={mockConfig} />);

    expect(html).toContain('Pizzaria Bella Napoli');
    expect(html).toContain('A Autêntica Pizza Napolitana');
    expect(html).toContain('4.8');
    expect(html).toContain('312');
    expect(html).toContain('Fazer Pedido no WhatsApp');
    expect(html).toContain('https://wa.me/5511988887777');
  });

  it('deve aplicar foto de fallback do Unsplash CDN quando heroImageUrl e photos forem vazios', () => {
    const configWithoutPhotos: PreviewSiteConfig = {
      ...mockConfig,
      gallery: {
        heroImageUrl: null,
        logoUrl: null,
        photos: [],
      },
    };

    const html = renderToString(<GastronomiaTemplate config={configWithoutPhotos} />);
    expect(html).toContain('images.unsplash.com');
  });

  it('deve renderizar a seção de especialidades gastronômicas com badges e cards estilizados', () => {
    const html = renderToString(<GastronomiaTemplate config={mockConfig} />);

    expect(html).toContain('Pizza Margherita Gourmet');
    expect(html).toContain('Burrata Artesanal');
    expect(html).toContain('Especialidade');
  });

  it('deve renderizar a StickyMobileBar fixa no rodapé mobile', () => {
    const html = renderToString(<GastronomiaTemplate config={mockConfig} />);

    expect(html).toContain('md:hidden');
    expect(html).toContain('fixed bottom-0');
    expect(html).toContain('pb-24');
  });

  it('deve renderizar o endereço com link para rota do Google Maps / Waze', () => {
    const html = renderToString(<GastronomiaTemplate config={mockConfig} />);

    expect(html).toContain('Rua Augusta, 1500');
    expect(html).toContain('maps.google.com');
  });
});
