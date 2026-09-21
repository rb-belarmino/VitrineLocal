import { describe, it, expect } from 'vitest';
import { SiteConfigBuilder } from '../core/site-config-builder';
import { PreviewSiteConfigSchema } from '../schemas/site-engine.schemas';

describe('SiteConfigBuilder (Unit)', () => {
  const builder = new SiteConfigBuilder({
    vitrineLocalWhatsapp: '5511999998888',
    baseUrl: 'https://preview.vitrinelocal.com.br',
  });

  const mockLead = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    slug: 'clinica-odonto-moema',
    businessName: 'Clínica Odonto Moema',
    category: 'Clínica odontológica',
    address: 'Rua Canário, 200 - Moema, São Paulo - SP',
    phoneRaw: '(11) 98765-4321',
    phoneNormalized: '11987654321',
    isMobile: true,
    rating: 4.9,
    reviewCount: 45,
    mapsUrl: 'https://maps.google.com/?cid=12345',
  };

  const mockProfile = {
    id: 'b1ffcd88-8d1c-4fe9-aa7e-7cc8ae491b22',
    leadId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    primaryColor: '#0284C7',
    secondaryColor: '#0D9488',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    paletteSource: 'EXTRACTED' as const,
    headline: 'Seu Sorriso Impecável em Moema',
    subheadline: 'Tratamentos modernos e atendimento humanizado.',
    aboutText: 'Há mais de 10 anos cuidando da sua saúde bucal.',
    keyServices: '["Implantes", "Ortodontia Invisível", "Clareamento a Laser"]',
    callToAction: 'Agende sua Consulta pelo WhatsApp',
    logoUrl: 'https://lh3.googleusercontent.com/logo=s200',
    heroImageUrl: 'https://lh3.googleusercontent.com/hero=s1600',
    galleryUrls:
      '["https://lh3.googleusercontent.com/photo1=s1600", "https://lh3.googleusercontent.com/photo2=s1600"]',
    testimonials: '[{"authorName":"Carlos Silva","rating":5,"text":"Excelente atendimento!"}]',
  };

  it('deve consolidar lead e brandProfile em um PreviewSiteConfig válido', () => {
    const config = builder.build(mockLead, mockProfile);

    // Validação Zod estrita
    const parsed = PreviewSiteConfigSchema.safeParse(config);
    expect(parsed.success).toBe(true);

    expect(config.leadId).toBe(mockLead.id);
    expect(config.slug).toBe('clinica-odonto-moema');
    expect(config.businessName).toBe('Clínica Odonto Moema');
    expect(config.nicheTheme).toBe('saude');
    expect(config.contact.isMobile).toBe(true);
    expect(config.contact.whatsappLink).toContain('https://wa.me/5511987654321');
    expect(config.theme.primaryColor).toBe('#0284C7');
    expect(config.content.keyServices).toHaveLength(3);
    expect(config.gallery.photos).toHaveLength(2);
    expect(config.socialProof.testimonials).toHaveLength(1);
  });

  it('deve formatar o link de fechamento da VitrineLocal com nome do lead e ID', () => {
    const config = builder.build(mockLead, mockProfile);

    expect(config.visualPitch.ctaWhatsappLink).toContain('https://wa.me/5511999998888');
    expect(config.visualPitch.ctaWhatsappLink).toContain(
      encodeURIComponent('Clínica Odonto Moema'),
    );
    expect(config.visualPitch.ctaWhatsappLink).toContain(mockLead.id);
  });

  it('deve lidar com JSONs vazios ou malformados em campos opcionais com fallbacks seguros', () => {
    const badProfile = {
      ...mockProfile,
      keyServices: 'invalid-json',
      galleryUrls: 'null',
      testimonials: '',
    };

    const config = builder.build(mockLead, badProfile);
    expect(config.content.keyServices).toEqual([]);
    expect(config.gallery.photos).toEqual([]);
    expect(config.socialProof.testimonials).toEqual([]);
  });
});
