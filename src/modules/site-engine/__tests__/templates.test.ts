import { describe, it, expect } from 'vitest';
import { SaudeTemplate } from '../templates/saude.template';
import { AutomotivoTemplate } from '../templates/automotivo.template';
import { GastronomiaTemplate } from '../templates/gastronomia.template';
import { BelezaTemplate } from '../templates/beleza.template';
import { GeralTemplate } from '../templates/geral.template';
import { TemplateRegistry } from '../templates/template-registry';
import { PreviewSiteConfig } from '../site-engine.types';

describe('Niche Templates (Unit)', () => {
  const baseConfig: PreviewSiteConfig = {
    leadId: '11111111-2222-3333-4444-555555555555',
    slug: 'empresa-exemplo',
    businessName: 'Empresa Exemplo',
    category: 'Geral',
    nicheTheme: 'geral',
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
      headline: 'Soluções Rápidas e Confiáveis',
      subheadline: 'O melhor atendimento da região',
      aboutText: 'Mais de 10 anos oferecendo serviços com excelência.',
      keyServices: ['Serviço A', 'Serviço B'],
      callToAction: 'Solicite um Orçamento',
    },
    gallery: {
      heroImageUrl: 'https://example.com/hero.jpg',
      logoUrl: 'https://example.com/logo.png',
      photos: ['https://example.com/p1.jpg'],
    },
    socialProof: {
      rating: 4.8,
      reviewCount: 30,
      testimonials: [{ authorName: 'Maria Silva', rating: 5, text: 'Excelente serviço!' }],
    },
    visualPitch: {
      badgeText: 'Demonstração VitrineLocal',
      ctaText: 'Quero este site',
      ctaWhatsappLink: 'https://wa.me/5511888888888',
    },
    meta: {
      title: 'Empresa Exemplo | Site Oficial',
      description: 'O melhor atendimento da região',
      ogImage: null,
      canonicalUrl: 'https://preview.vitrinelocal.com.br/preview/empresa-exemplo',
    },
  };

  const minimalConfig: PreviewSiteConfig = {
    ...baseConfig,
    contact: {
      ...baseConfig.contact,
      address: null,
      phoneRaw: null,
    },
    gallery: {
      ...baseConfig.gallery,
      heroImageUrl: null,
    },
    socialProof: {
      ...baseConfig.socialProof,
      testimonials: [],
    },
  };

  it('SaudeTemplate deve renderizar seções de saúde e agendamento', () => {
    const template = new SaudeTemplate();
    expect(template.niche).toBe('saude');

    const html = template.render({ ...baseConfig, nicheTheme: 'saude' });
    expect(html).toContain('Empresa Exemplo');
    expect(html).toContain('Serviço A');
    expect(html).toContain('Agendamento');
    expect(html).toContain('https://wa.me/5511999999999');

    const minimalHtml = template.render({ ...minimalConfig, nicheTheme: 'saude' });
    expect(minimalHtml).toContain('Empresa Exemplo');
  });

  it('AutomotivoTemplate deve renderizar seções automotivas e orçamento expresso', () => {
    const template = new AutomotivoTemplate();
    expect(template.niche).toBe('automotivo');

    const html = template.render({ ...baseConfig, nicheTheme: 'automotivo' });
    expect(html).toContain('Empresa Exemplo');
    expect(html).toContain('Orçamento');
    expect(html).toContain('Serviço A');

    const minimalHtml = template.render({ ...minimalConfig, nicheTheme: 'automotivo' });
    expect(minimalHtml).toContain('Empresa Exemplo');
  });

  it('GastronomiaTemplate deve renderizar seções de cardápio e especialidades', () => {
    const template = new GastronomiaTemplate();
    expect(template.niche).toBe('gastronomia');

    const html = template.render({ ...baseConfig, nicheTheme: 'gastronomia' });
    expect(html).toContain('Empresa Exemplo');
    expect(html).toContain('Cardápio');

    const minimalHtml = template.render({ ...minimalConfig, nicheTheme: 'gastronomia' });
    expect(minimalHtml).toContain('Empresa Exemplo');
  });

  it('BelezaTemplate deve renderizar procedimentos e agendamento de horário', () => {
    const template = new BelezaTemplate();
    expect(template.niche).toBe('beleza');

    const html = template.render({ ...baseConfig, nicheTheme: 'beleza' });
    expect(html).toContain('Empresa Exemplo');
    expect(html).toContain('Procedimentos');

    const minimalHtml = template.render({ ...minimalConfig, nicheTheme: 'beleza' });
    expect(minimalHtml).toContain('Empresa Exemplo');
  });

  it('GeralTemplate deve renderizar serviços universais e contato', () => {
    const template = new GeralTemplate();
    expect(template.niche).toBe('geral');

    const html = template.render(baseConfig);
    expect(html).toContain('Empresa Exemplo');
    expect(html).toContain('Serviços');

    const minimalHtml = template.render(minimalConfig);
    expect(minimalHtml).toContain('Empresa Exemplo');
  });

  describe('TemplateRegistry', () => {
    it('deve registrar e recuperar o template correto para cada nicho', () => {
      const registry = new TemplateRegistry();

      expect(registry.getTemplate('saude').niche).toBe('saude');
      expect(registry.getTemplate('automotivo').niche).toBe('automotivo');
      expect(registry.getTemplate('gastronomia').niche).toBe('gastronomia');
      expect(registry.getTemplate('beleza').niche).toBe('beleza');
      expect(registry.getTemplate('geral').niche).toBe('geral');
    });

    it('deve retornar GeralTemplate como fallback se o nicho for desconhecido', () => {
      const registry = new TemplateRegistry();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const template = registry.getTemplate('outro' as any);
      expect(template.niche).toBe('geral');
    });
  });
});
