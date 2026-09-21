import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { GeralTemplate } from '../components/GeralTemplate';
import { PreviewSiteConfig } from '../site-engine.types';

describe('GeralTemplate (Unit - Pro Redesign)', () => {
  const mockConfig: PreviewSiteConfig = {
    leadId: '55555555-6666-7777-8888-999999999999',
    slug: 'contabilidade-alves',
    businessName: 'Alves Assessoria Contábil',
    category: 'Escritório de Contabilidade & BPO Financeiro',
    nicheTheme: 'geral',
    contact: {
      phoneRaw: '(11) 94444-3333',
      phoneNormalized: '11944443333',
      isMobile: true,
      address: 'Rua Vergueiro, 2000 - Vila Mariana, São Paulo - SP',
      whatsappLink: 'https://wa.me/5511944443333',
    },
    theme: {
      primaryColor: '#2563EB',
      secondaryColor: '#4F46E5',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      paletteSource: 'FALLBACK_NICHE',
    },
    content: {
      headline: 'Gestão Contábil Inteligente e Redução Tributária para Empresas',
      subheadline: 'Simplificamos sua contabilidade com tecnologia, conformidade fiscal e atendimento ágil.',
      aboutText: 'Mais de 18 anos prestando consultoria estratégica para empresas de todos os portes.',
      keyServices: ['Abertura de Empresas Grátis', 'BPO Financeiro & Folha', 'Planejamento Tributário', 'Consultoria Empresarial'],
      callToAction: 'Falar com um Especialista',
    },
    gallery: {
      heroImageUrl: null, // Fallback geral Unsplash
      logoUrl: null,
      photos: [],
    },
    socialProof: {
      rating: 4.9,
      reviewCount: 142,
      testimonials: [
        {
          authorName: 'Fernando Torres',
          rating: 5,
          text: 'Equipe fantástica! Reduziram minha carga tributária em mais de 20% no primeiro ano.',
          relativeTime: 'há 2 meses',
        },
      ],
    },
    visualPitch: {
      badgeText: 'Demonstração VitrineLocal',
      ctaText: 'Quero um site assim',
      ctaWhatsappLink: 'https://wa.me/5511888888888',
    },
    meta: {
      title: 'Alves Assessoria Contábil',
      description: 'Contabilidade e consultoria empresarial',
      ogImage: null,
      canonicalUrl: 'https://preview.vitrinelocal.com.br/preview/contabilidade-alves',
    },
  };

  it('deve renderizar o template geral em estilo Modern Local Agency com fallback Unsplash e sticky bar', () => {
    const html = renderToString(<GeralTemplate config={mockConfig} />);

    expect(html).toContain('Alves Assessoria Contábil');
    expect(html).toContain('Gestão Contábil Inteligente');
    expect(html).toContain('4.9');
    expect(html).toContain('142');
    expect(html).toContain('Abertura de Empresas Grátis');
    expect(html).toContain('images.unsplash.com');
    expect(html).toContain('md:hidden');
    expect(html).toContain('pb-24');
  });
});
