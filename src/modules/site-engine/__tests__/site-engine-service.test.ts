import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteEngineService } from '../site-engine.service';
import { SiteEngineRepository } from '../repositories/site-engine.repository';
import { BrandExtractorService } from '../../brand/brand.service';
import { SlugGenerator } from '../core/slug-generator';
import { SiteConfigBuilder } from '../core/site-config-builder';
import { TemplateRegistry } from '../templates/template-registry';
import { NotFoundError } from '../../../shared/errors/app-error';
import { QualifiedLead, BrandProfile } from '@prisma/client';

describe('SiteEngineService (Unit)', () => {
  let mockRepo: SiteEngineRepository;
  let mockBrandService: BrandExtractorService;
  let slugGenerator: SlugGenerator;
  let configBuilder: SiteConfigBuilder;
  let templateRegistry: TemplateRegistry;
  let service: SiteEngineService;

  const mockLead: QualifiedLead = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    slug: 'oficina-precision-moema',
    businessName: 'Oficina Precision',
    category: 'Oficina mecânica',
    address: 'Av Santo Amaro, 100 - Moema',
    phoneRaw: '11 98888-1111',
    phoneNormalized: '11988881111',
    isMobile: true,
    websiteRaw: null,
    websiteType: 'NO_WEBSITE',
    socialLinks: '[]',
    rating: 4.8,
    reviewCount: 20,
    qualificationScore: 85,
    status: 'QUALIFIED',
    disqualificationReason: null,
    mapsUrl: 'https://maps.google.com/?cid=123',
    searchJobId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProfile: BrandProfile = {
    id: 'b1ffcd88-8d1c-4fe9-aa7e-7cc8ae491b22',
    leadId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    primaryColor: '#0066CC',
    secondaryColor: '#FF6600',
    backgroundColor: '#FFFFFF',
    textColor: '#111111',
    paletteSource: 'EXTRACTED',
    headline: 'Manutenção de Qualidade',
    subheadline: 'Sua oficina de confiança em Moema',
    aboutText: 'Serviços completos com garantia.',
    keyServices: '["Revisão", "Freios"]',
    callToAction: 'Fale Conosco',
    logoUrl: null,
    heroImageUrl: null,
    galleryUrls: '[]',
    testimonials: '[]',
    status: 'COMPLETED',
    errorMessage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockRepo = {
      findByIdOrSlug: vi.fn(),
      updateSlug: vi.fn(),
      isSlugAvailable: vi.fn().mockResolvedValue(true),
    } as unknown as SiteEngineRepository;

    mockBrandService = {
      extractBrand: vi.fn(),
    } as unknown as BrandExtractorService;

    slugGenerator = new SlugGenerator();
    configBuilder = new SiteConfigBuilder();
    templateRegistry = new TemplateRegistry();

    service = new SiteEngineService(
      mockRepo,
      mockBrandService,
      slugGenerator,
      configBuilder,
      templateRegistry,
    );
  });

  it('deve montar o PreviewSiteConfig com sucesso quando o lead já possui perfil', async () => {
    vi.spyOn(mockRepo, 'findByIdOrSlug').mockResolvedValue({
      lead: mockLead,
      profile: mockProfile,
    });

    const config = await service.buildSiteConfig('oficina-precision-moema');

    expect(config.leadId).toBe(mockLead.id);
    expect(config.slug).toBe('oficina-precision-moema');
    expect(config.nicheTheme).toBe('automotivo');
    expect(mockBrandService.extractBrand).not.toHaveBeenCalled();
  });

  it('deve disparar extração JIT sob demanda se o lead existir mas não tiver BrandProfile', async () => {
    // Primeira chamada: sem perfil
    vi.spyOn(mockRepo, 'findByIdOrSlug')
      .mockResolvedValueOnce({
        lead: mockLead,
        profile: null,
      })
      // Segunda chamada após extração: com perfil
      .mockResolvedValueOnce({
        lead: mockLead,
        profile: mockProfile,
      });

    vi.spyOn(mockBrandService, 'extractBrand').mockResolvedValue({
      id: mockProfile.id,
      leadId: mockLead.id,
      businessName: mockLead.businessName,
      category: mockLead.category,
      logoUrl: null,
      heroImageUrl: null,
      galleryUrls: [],
      palette: {
        primaryColor: mockProfile.primaryColor,
        secondaryColor: mockProfile.secondaryColor,
        backgroundColor: mockProfile.backgroundColor,
        textColor: mockProfile.textColor,
        paletteSource: 'EXTRACTED',
      },
      content: {
        headline: mockProfile.headline,
        subheadline: mockProfile.subheadline,
        aboutText: mockProfile.aboutText,
        keyServices: ['Revisão', 'Freios'],
        callToAction: mockProfile.callToAction,
      },
      testimonials: [],
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const config = await service.buildSiteConfig(mockLead.id);

    expect(mockBrandService.extractBrand).toHaveBeenCalledWith(mockLead.id);
    expect(config.leadId).toBe(mockLead.id);
    expect(config.content.headline).toBe(mockProfile.headline);
  });

  it('deve gerar e salvar slug se o lead ainda não possuir slug cadastrado', async () => {
    const leadWithoutSlug: QualifiedLead = {
      ...mockLead,
      slug: null,
    };

    vi.spyOn(mockRepo, 'findByIdOrSlug').mockResolvedValue({
      lead: leadWithoutSlug,
      profile: mockProfile,
    });

    const config = await service.buildSiteConfig(mockLead.id);

    expect(mockRepo.updateSlug).toHaveBeenCalledWith(
      mockLead.id,
      expect.stringContaining('oficina-precision'),
    );
    expect(config.slug).toContain('oficina-precision');
  });

  it('deve desambiguar slug caso o nome base já esteja ocupado por outro lead', async () => {
    const leadWithoutSlug: QualifiedLead = {
      ...mockLead,
      slug: null,
    };

    vi.spyOn(mockRepo, 'findByIdOrSlug').mockResolvedValue({
      lead: leadWithoutSlug,
      profile: mockProfile,
    });

    // Primeira verificação do slug base retorna falso (ocupado), segunda (-2) retorna true (livre)
    vi.spyOn(mockRepo, 'isSlugAvailable')
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const config = await service.buildSiteConfig(mockLead.id);

    expect(config.slug).toMatch(/-2$/);
    expect(mockRepo.updateSlug).toHaveBeenCalledWith(mockLead.id, expect.stringMatching(/-2$/));
  });

  it('deve lançar erro caso a extração JIT ocorra mas o perfil continue indisponível', async () => {
    vi.spyOn(mockRepo, 'findByIdOrSlug')
      .mockResolvedValueOnce({
        lead: mockLead,
        profile: null,
      })
      .mockResolvedValueOnce({
        lead: mockLead,
        profile: null,
      });

    vi.spyOn(mockBrandService, 'extractBrand').mockResolvedValue({
      id: mockProfile.id,
      leadId: mockLead.id,
      businessName: mockLead.businessName,
      category: mockLead.category,
      logoUrl: null,
      heroImageUrl: null,
      galleryUrls: [],
      palette: {
        primaryColor: mockProfile.primaryColor,
        secondaryColor: mockProfile.secondaryColor,
        backgroundColor: mockProfile.backgroundColor,
        textColor: mockProfile.textColor,
        paletteSource: 'EXTRACTED',
      },
      content: {
        headline: mockProfile.headline,
        subheadline: mockProfile.subheadline,
        aboutText: mockProfile.aboutText,
        keyServices: ['Revisão'],
        callToAction: mockProfile.callToAction,
      },
      testimonials: [],
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await expect(service.buildSiteConfig(mockLead.id)).rejects.toThrow(NotFoundError);
  });

  it('deve lançar NotFoundError se o identificador não corresponder a nenhum lead', async () => {
    vi.spyOn(mockRepo, 'findByIdOrSlug').mockResolvedValue(null);

    await expect(service.buildSiteConfig('inexistente-123')).rejects.toThrow(NotFoundError);
  });

  it('deve renderizar o HTML completo do preview através do template correto', async () => {
    vi.spyOn(mockRepo, 'findByIdOrSlug').mockResolvedValue({
      lead: mockLead,
      profile: mockProfile,
    });

    const html = await service.renderPreviewHtml('oficina-precision-moema');

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Oficina Precision');
    expect(html).toContain('--brand-primary: #0066CC;');
  });
});
