import { describe, it, expect } from 'vitest';
import { renderBaseLayout } from '../templates/base-layout';
import { PreviewSiteConfig } from '../site-engine.types';

describe('BaseLayout (Unit)', () => {
  const mockConfig: PreviewSiteConfig = {
    leadId: '98765432-1234-4567-89ab-cdef01234567',
    slug: 'clinica-sorriso-moema',
    businessName: 'Clínica Sorriso & Saúde',
    category: 'Clínica odontológica',
    nicheTheme: 'saude',
    contact: {
      phoneRaw: '(11) 98765-4321',
      phoneNormalized: '11987654321',
      isMobile: true,
      address: 'Rua Canário, 200 - Moema, São Paulo - SP',
      whatsappLink: 'https://wa.me/5511987654321',
    },
    theme: {
      primaryColor: '#0284C7',
      secondaryColor: '#0D9488',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      paletteSource: 'EXTRACTED',
    },
    content: {
      headline: 'Tratamentos Odontológicos Modernos',
      subheadline: 'Seu sorriso em boas mãos.',
      aboutText: 'Profissionais dedicados ao seu bem-estar.',
      keyServices: ['Implantes', 'Clareamento'],
      callToAction: 'Agende pelo WhatsApp',
    },
    gallery: {
      heroImageUrl: 'https://example.com/hero.jpg',
      logoUrl: 'https://example.com/logo.png',
      photos: ['https://example.com/photo1.jpg'],
    },
    socialProof: {
      rating: 4.9,
      reviewCount: 38,
      testimonials: [{ authorName: 'Ana Souza', rating: 5, text: 'Adorei a clínica!' }],
    },
    visualPitch: {
      badgeText: 'Demonstração exclusiva criada para Clínica Sorriso & Saúde pela VitrineLocal',
      ctaText: 'Quero este site para minha empresa',
      ctaWhatsappLink: 'https://wa.me/5511999998888?text=Ola',
    },
    meta: {
      title: 'Clínica Sorriso & Saúde | Site Oficial',
      description: 'Seu sorriso em boas mãos.',
      ogImage: 'https://example.com/hero.jpg',
      canonicalUrl: 'https://preview.vitrinelocal.com.br/preview/clinica-sorriso-moema',
    },
  };

  it('deve renderizar documento HTML5 válido com variáveis CSS de marca injetadas', () => {
    const html = renderBaseLayout(mockConfig, '<main>Conteúdo do Nicho</main>');

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="pt-BR">');
    expect(html).toContain('--brand-primary: #0284C7;');
    expect(html).toContain('--brand-secondary: #0D9488;');
    expect(html).toContain('--brand-text: #0F172A;');
    expect(html).toContain('Conteúdo do Nicho');
    expect(html).toContain('https://preview.vitrinelocal.com.br/preview/clinica-sorriso-moema');
  });

  it('deve sanitizar o título e meta tags para prevenir injeção de scripts', () => {
    const maliciousConfig: PreviewSiteConfig = {
      ...mockConfig,
      businessName: 'Clínica <script>alert(1)</script>',
      meta: {
        ...mockConfig.meta,
        title: 'Clínica <script>alert(1)</script> | Site Oficial',
        description: 'Descrição "onmouseover="alert(1)"',
      },
    };

    const html = renderBaseLayout(maliciousConfig, '<p>OK</p>');

    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('&quot;onmouseover=&quot;alert(1)&quot;');
  });

  it('deve renderizar botão flutuante de WhatsApp fixo com link direto', () => {
    const html = renderBaseLayout(mockConfig, '<p>OK</p>');
    expect(html).toContain('https://wa.me/5511987654321');
    expect(html).toContain('aria-label="Falar no WhatsApp"');
  });
});
