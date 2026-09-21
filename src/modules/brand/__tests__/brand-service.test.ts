import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrandExtractorService } from '../brand.service';
import { NotFoundError } from '../../../shared/errors/app-error';
import { BrandRepository } from '../repositories/brand.repository';
import { BrowserPool } from '../../radar/scraper/browser-pool';
import { MapsImageExtractor } from '../adapters/maps-image-extractor';
import { SocialImageExtractor } from '../adapters/social-image-extractor';
import { MapsReviewScraper } from '../adapters/maps-review-scraper';
import { GeminiSynthesizer } from '../adapters/gemini-synthesizer';

describe('BrandExtractorService (Unit)', () => {
  let mockRepository: {
    findLeadById: ReturnType<typeof vi.fn>;
    findByLeadId: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
  };
  let mockImageExtractor: {
    extract: ReturnType<typeof vi.fn>;
  };
  let mockSocialExtractor: {
    extractFromSocial: ReturnType<typeof vi.fn>;
  };
  let mockReviewScraper: {
    extract: ReturnType<typeof vi.fn>;
  };
  let mockSynthesizer: {
    synthesize: ReturnType<typeof vi.fn>;
  };
  let mockBrowserPool: {
    acquireContext: ReturnType<typeof vi.fn>;
  };
  let service: BrandExtractorService;

  const mockLead = {
    id: 'lead-123',
    businessName: 'Oficina Precision',
    category: 'Oficina Mecânica',
    mapsUrl: 'https://maps.google.com/place/precision',
    socialLinks: JSON.stringify(['https://instagram.com/precision']),
  };

  const mockExistingProfile = {
    id: 'profile-123',
    leadId: 'lead-123',
    businessName: 'Oficina Precision',
    category: 'Oficina Mecânica',
    logoUrl: 'https://cdn.example.com/logo.jpg',
    heroImageUrl: 'https://cdn.example.com/hero.jpg',
    galleryUrls: ['https://cdn.example.com/img1.jpg'],
    palette: {
      primaryColor: '#EA580C',
      secondaryColor: '#334155',
      backgroundColor: '#0F172A',
      textColor: '#F8FAFC',
      paletteSource: 'EXTRACTED' as const,
    },
    content: {
      headline: 'Oficina Precision Moema',
      subheadline: 'Confiança e precisão',
      aboutText: 'Mais de 10 anos de experiência.',
      keyServices: ['Mecânica Geral'],
      callToAction: 'Fale no WhatsApp',
    },
    testimonials: [],
    status: 'COMPLETED' as const,
    createdAt: '2026-09-21T12:00:00.000Z',
    updatedAt: '2026-09-21T12:00:00.000Z',
  };

  beforeEach(() => {
    mockRepository = {
      findLeadById: vi.fn(),
      findByLeadId: vi.fn(),
      upsert: vi.fn(),
    };
    mockImageExtractor = {
      extract: vi.fn(),
    };
    mockSocialExtractor = {
      extractFromSocial: vi.fn(),
    };
    mockReviewScraper = {
      extract: vi.fn(),
    };
    mockSynthesizer = {
      synthesize: vi.fn(),
    };
    mockBrowserPool = {
      acquireContext: vi.fn().mockResolvedValue({
        page: {
          close: vi.fn(),
        },
        context: {
          close: vi.fn(),
        },
      }),
    };

    service = new BrandExtractorService(
      mockRepository as unknown as BrandRepository,
      mockBrowserPool as unknown as BrowserPool,
      mockImageExtractor as unknown as MapsImageExtractor,
      mockSocialExtractor as unknown as SocialImageExtractor,
      mockReviewScraper as unknown as MapsReviewScraper,
      mockSynthesizer as unknown as GeminiSynthesizer,
    );
  });

  describe('getBrandProfile', () => {
    it('deve lançar AppError 404 se o perfil não existir', async () => {
      mockRepository.findByLeadId.mockResolvedValue(null);

      await expect(service.getBrandProfile('non-existent')).rejects.toThrow(NotFoundError);
    });

    it('deve retornar o perfil se existir', async () => {
      mockRepository.findByLeadId.mockResolvedValue(mockExistingProfile);

      const result = await service.getBrandProfile('lead-123');
      expect(result.id).toBe('profile-123');
      expect(result.businessName).toBe('Oficina Precision');
    });
  });

  describe('extractBrand', () => {
    it('deve lançar AppError 404 se o lead não existir', async () => {
      mockRepository.findLeadById.mockResolvedValue(null);

      await expect(service.extractBrand('invalid-lead')).rejects.toThrow(NotFoundError);
    });

    it('deve retornar o perfil do cache se já existir e force=false sem abrir o browser', async () => {
      mockRepository.findLeadById.mockResolvedValue(mockLead);
      mockRepository.findByLeadId.mockResolvedValue(mockExistingProfile);

      const result = await service.extractBrand('lead-123', false);

      expect(result).toEqual(mockExistingProfile);
      expect(mockBrowserPool.acquireContext).not.toHaveBeenCalled();
    });

    it('deve executar extração completa e salvar perfil se force=true', async () => {
      mockRepository.findLeadById.mockResolvedValue(mockLead);
      mockRepository.findByLeadId.mockResolvedValue(mockExistingProfile);

      mockImageExtractor.extract.mockResolvedValue({
        logoUrl: 'https://cdn.example.com/new-logo.jpg',
        heroImageUrl: 'https://cdn.example.com/new-hero.jpg',
        galleryUrls: ['https://cdn.example.com/new1.jpg', 'https://cdn.example.com/new2.jpg'],
      });

      mockSocialExtractor.extractFromSocial.mockResolvedValue(['https://instagram.com/p1.jpg']);

      mockReviewScraper.extract.mockResolvedValue([
        {
          authorName: 'Pedro',
          rating: 5,
          relativeTime: 'há 1 mês',
          text: 'Oficina fantástica, atendimento rápido e equipe muito honesta!',
        },
      ]);

      mockSynthesizer.synthesize.mockResolvedValue({
        headline: 'Oficina Precision Moema - Cuidado Completo',
        subheadline: 'Tecnologia de ponta em revisão automotiva',
        aboutText: 'Atendendo com máxima dedicação.',
        keyServices: ['Revisão', 'Freios'],
        callToAction: 'Chame no WhatsApp agora',
      });

      mockRepository.upsert.mockResolvedValue({
        ...mockExistingProfile,
        id: 'profile-new',
      });

      const result = await service.extractBrand('lead-123', true);

      expect(mockBrowserPool.acquireContext).toHaveBeenCalled();
      expect(mockImageExtractor.extract).toHaveBeenCalled();
      expect(mockReviewScraper.extract).toHaveBeenCalled();
      expect(mockSynthesizer.synthesize).toHaveBeenCalled();
      expect(mockRepository.upsert).toHaveBeenCalled();
      expect(result.id).toBe('profile-new');
    });
  });
});
