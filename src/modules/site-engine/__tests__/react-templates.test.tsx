import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TemplateSelector } from '../components/TemplateSelector';
import { SaudeTemplate } from '../components/SaudeTemplate';
import { AutomotivoTemplate } from '../components/AutomotivoTemplate';
import { GastronomiaTemplate } from '../components/GastronomiaTemplate';
import { BelezaTemplate } from '../components/BelezaTemplate';
import { GeralTemplate } from '../components/GeralTemplate';
import { PreviewSiteConfig } from '../site-engine.types';

describe('React Templates & Next.js 16.3.5 Components', () => {
  const baseConfig: PreviewSiteConfig = {
    leadId: '11111111-2222-3333-4444-555555555555',
    slug: 'empresa-exemplo',
    businessName: 'Clínica Sorriso Prime',
    category: 'Dentista',
    nicheTheme: 'saude',
    contact: {
      phoneRaw: '(11) 99999-9999',
      phoneNormalized: '11999999999',
      isMobile: true,
      address: 'Rua Exemplo, 123 - Centro',
      whatsappLink: 'https://wa.me/5511999999999',
    },
    theme: {
      primaryColor: '#0066CC',
      secondaryColor: '#FF6600',
      backgroundColor: '#FFFFFF',
      textColor: '#111111',
      paletteSource: 'EXTRACTED',
    },
    content: {
      headline: 'Seu Sorriso Perfeito Começa Aqui',
      subheadline: 'Tratamentos modernos e sem dor para toda a família',
      aboutText: 'Mais de 10 anos oferecendo serviços com excelência.',
      keyServices: ['Implantes', 'Clareamento Dental', 'Ortodontia'],
      callToAction: 'Agende sua Consulta',
    },
    gallery: {
      heroImageUrl: 'https://example.com/hero.jpg',
      logoUrl: 'https://example.com/logo.png',
      photos: ['https://example.com/p1.jpg'],
    },
    socialProof: {
      rating: 4.9,
      reviewCount: 45,
      testimonials: [
        { authorName: 'Maria Silva', rating: 5, text: 'Melhor atendimento odontológico de Moema!' },
      ],
    },
    visualPitch: {
      badgeText: 'Demonstração VitrineLocal',
      ctaText: 'Quero este site',
      ctaWhatsappLink: 'https://wa.me/5511888888888',
    },
    meta: {
      title: 'Clínica Sorriso Prime | Site Oficial',
      description: 'Tratamentos modernos e sem dor',
      ogImage: null,
      canonicalUrl: 'https://preview.vitrinelocal.com.br/preview/empresa-exemplo',
    },
  };

  it('deve renderizar SaudeTemplate com dados e elementos semânticos', () => {
    const html = renderToString(<SaudeTemplate config={baseConfig} />);
    expect(html).toContain('Clínica Sorriso Prime');
    expect(html).toContain('Seu Sorriso Perfeito Começa Aqui');
    expect(html).toContain('4.9');
    expect(html).toContain('Implantes');
    expect(html).toContain('Maria Silva');
  });

  it('deve renderizar AutomotivoTemplate com layout automotivo', () => {
    const autoConfig: PreviewSiteConfig = {
      ...baseConfig,
      businessName: 'Auto Mecânica Precision',
      category: 'Oficina mecânica',
      nicheTheme: 'automotivo',
      content: {
        ...baseConfig.content,
        headline: 'Revisão Completa e Diagnóstico Preciso',
        keyServices: ['Troca de Óleo', 'Freios e Suspensão'],
      },
    };
    const html = renderToString(<AutomotivoTemplate config={autoConfig} />);
    expect(html).toContain('Auto Mecânica Precision');
    expect(html).toContain('Revisão Completa');
    expect(html).toContain('Nossos Serviços Automotivos');
  });

  it('deve renderizar GastronomiaTemplate com layout gastronômico', () => {
    const gastroConfig: PreviewSiteConfig = {
      ...baseConfig,
      businessName: 'Pizzaria Bella Napoli',
      category: 'Pizzaria',
      nicheTheme: 'gastronomia',
    };
    const html = renderToString(<GastronomiaTemplate config={gastroConfig} />);
    expect(html).toContain('Pizzaria Bella Napoli');
    expect(html).toContain('Nossas Especialidades');
  });

  it('deve renderizar BelezaTemplate com layout de estética', () => {
    const belezaConfig: PreviewSiteConfig = {
      ...baseConfig,
      businessName: 'Studio Glamour Estética',
      category: 'Salão de beleza',
      nicheTheme: 'beleza',
    };
    const html = renderToString(<BelezaTemplate config={belezaConfig} />);
    expect(html).toContain('Studio Glamour Estética');
    expect(html).toContain('Procedimentos &amp; Especialidades');
  });

  it('deve renderizar GeralTemplate como fallback universal', () => {
    const geralConfig: PreviewSiteConfig = {
      ...baseConfig,
      businessName: 'Chaveiro Central 24h',
      category: 'Chaveiro',
      nicheTheme: 'geral',
    };
    const html = renderToString(<GeralTemplate config={geralConfig} />);
    expect(html).toContain('Chaveiro Central 24h');
    expect(html).toContain('Por que somos referência?');
  });

  it('TemplateSelector deve selecionar o template correto baseado no nicheTheme e injetar CSS variables', () => {
    const html = renderToString(<TemplateSelector config={baseConfig} />);
    expect(html).toContain('--brand-primary');
    expect(html).toContain('Demonstração VitrineLocal');
    expect(html).toContain('Clínica Sorriso Prime');
  });
});
