import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { BelezaTemplate } from '../components/BelezaTemplate';
import { PreviewSiteConfig } from '../site-engine.types';

describe('BelezaTemplate (Unit - Pro Redesign)', () => {
  const mockSalaoConfig: PreviewSiteConfig = {
    leadId: '44444444-5555-6666-7777-888888888888',
    slug: 'studio-glow-estetica',
    businessName: 'Studio Glow Salão & Estética',
    category: 'Salão de Beleza & Estética Facial',
    nicheTheme: 'beleza',
    contact: {
      phoneRaw: '(11) 95555-4444',
      phoneNormalized: '11955554444',
      isMobile: true,
      address: 'Alameda Lorena, 800 - Jardins, São Paulo - SP',
      whatsappLink: 'https://wa.me/5511955554444',
    },
    theme: {
      primaryColor: '#BE185D',
      secondaryColor: '#F472B6',
      backgroundColor: '#FFFFFF',
      textColor: '#1E293B',
      paletteSource: 'FALLBACK_NICHE',
    },
    content: {
      headline: 'Realce sua Beleza e Autoestima com Tratamentos Exclusivos',
      subheadline: 'Equipe especializada em mechas, cronograma capilar, unhas em gel e estética.',
      aboutText: 'Ambiente aconchegante e produtos premium importados para sua melhor experiência.',
      keyServices: ['Mechas & Iluminação Capilar', 'Alongamento de Cílios', 'Unhas em Gel & Fibra', 'Design de Sobrancelhas'],
      callToAction: 'Reservar Horário no WhatsApp',
    },
    gallery: {
      heroImageUrl: null, // Testar fallback salao
      logoUrl: null,
      photos: [],
    },
    socialProof: {
      rating: 4.9,
      reviewCount: 198,
      testimonials: [
        {
          authorName: 'Camila Fernandes',
          rating: 5,
          text: 'Fiz minhas mechas e amei! Saí me sentindo linda e renovada.',
          relativeTime: 'há 1 semana',
        },
      ],
    },
    visualPitch: {
      badgeText: 'Demonstração VitrineLocal',
      ctaText: 'Quero um site assim',
      ctaWhatsappLink: 'https://wa.me/5511888888888',
    },
    meta: {
      title: 'Studio Glow | Jardins, São Paulo',
      description: 'Salão de beleza e estética premium',
      ogImage: null,
      canonicalUrl: 'https://preview.vitrinelocal.com.br/preview/studio-glow-estetica',
    },
  };

  const mockBarbeariaConfig: PreviewSiteConfig = {
    ...mockSalaoConfig,
    slug: 'lord-barbearia-vintage',
    businessName: 'Lord Barbearia Clássica',
    category: 'Barbearia & Corte Masculino',
    content: {
      ...mockSalaoConfig.content,
      headline: 'Corte Impecável, Barba na Toalha Quente e Cerveja Gelada',
      subheadline: 'O refúgio do homem contemporâneo com atendimento de alto nível e tradição navalha.',
      keyServices: ['Corte Degradê & Clássico', 'Barba Terapia com Toalha Quente', 'Tratamento Capilar Masculino', 'Pigmentação de Barba'],
      callToAction: 'Agendar Horário na Barbearia',
    },
    gallery: {
      heroImageUrl: null, // Testar fallback barbearia
      logoUrl: null,
      photos: [],
    },
  };

  it('deve renderizar a variante Salão/Estética no modo Editorial Rosé com foto de salão', () => {
    const html = renderToString(<BelezaTemplate config={mockSalaoConfig} />);

    expect(html).toContain('Studio Glow Salão &amp; Estética');
    expect(html).toContain('Realce sua Beleza');
    expect(html).toContain('4.9');
    expect(html).toContain('Mechas &amp; Iluminação Capilar');
    expect(html).toContain('images.unsplash.com');
    expect(html).toContain('md:hidden');
    expect(html).toContain('pb-24');
  });

  it('deve alternar automaticamente para a variante Barbearia (Vintage Dark/Wood) quando detectado termos masculinos', () => {
    const html = renderToString(<BelezaTemplate config={mockBarbeariaConfig} />);

    expect(html).toContain('Lord Barbearia Clássica');
    expect(html).toContain('Corte Impecável, Barba na Toalha Quente');
    expect(html).toContain('Barba Terapia');
    expect(html).toContain('images.unsplash.com');
  });
});
