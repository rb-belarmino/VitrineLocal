import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrandRepository } from '../repositories/brand.repository';
import { PrismaClient } from '@prisma/client';
import { CreateBrandProfileInput } from '../brand.types';

describe('BrandRepository (Unit)', () => {
  let mockPrisma: {
    qualifiedLead: {
      findUnique: ReturnType<typeof vi.fn>;
    };
    brandProfile: {
      findUnique: ReturnType<typeof vi.fn>;
      upsert: ReturnType<typeof vi.fn>;
    };
  };
  let repository: BrandRepository;

  beforeEach(() => {
    mockPrisma = {
      qualifiedLead: {
        findUnique: vi.fn(),
      },
      brandProfile: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
      },
    };
    repository = new BrandRepository(mockPrisma as unknown as PrismaClient);
  });

  it('deve retornar null se o lead não possuir perfil de marca cadastrado', async () => {
    mockPrisma.brandProfile.findUnique.mockResolvedValue(null);

    const result = await repository.findByLeadId('non-existent-lead');

    expect(result).toBeNull();
    expect(mockPrisma.brandProfile.findUnique).toHaveBeenCalledWith({
      where: { leadId: 'non-existent-lead' },
      include: {
        lead: {
          select: {
            businessName: true,
            category: true,
          },
        },
      },
    });
  });

  it('deve formatar e retornar o BrandProfileResponse quando o perfil existir', async () => {
    const mockRecord = {
      id: 'brand-uuid-1',
      leadId: 'lead-uuid-1',
      logoUrl: 'https://cdn.example.com/logo.jpg',
      heroImageUrl: 'https://cdn.example.com/hero.jpg',
      galleryUrls: JSON.stringify(['https://cdn.example.com/photo1.jpg']),
      primaryColor: '#EA580C',
      secondaryColor: '#334155',
      backgroundColor: '#0F172A',
      textColor: '#F8FAFC',
      paletteSource: 'EXTRACTED',
      headline: 'Oficina Especializada em Moema',
      subheadline: 'Manutenção de confiança para seu veículo',
      aboutText: 'Mais de 10 anos oferecendo serviços automotivos de excelência.',
      keyServices: JSON.stringify(['Freios', 'Suspensão']),
      callToAction: 'Fale pelo WhatsApp',
      testimonials: JSON.stringify([
        {
          authorName: 'João Silva',
          rating: 5,
          relativeTime: 'há 2 semanas',
          text: 'Melhor oficina da região, resolveram rápido.',
        },
      ]),
      status: 'COMPLETED',
      createdAt: new Date('2026-09-21T12:00:00Z'),
      updatedAt: new Date('2026-09-21T12:00:00Z'),
      lead: {
        businessName: 'Precision Auto Center',
        category: 'Oficina Mecânica',
      },
    };

    mockPrisma.brandProfile.findUnique.mockResolvedValue(mockRecord);

    const result = await repository.findByLeadId('lead-uuid-1');

    expect(result).not.toBeNull();
    expect(result?.businessName).toBe('Precision Auto Center');
    expect(result?.palette.primaryColor).toBe('#EA580C');
    expect(result?.galleryUrls).toEqual(['https://cdn.example.com/photo1.jpg']);
    expect(result?.content.keyServices).toEqual(['Freios', 'Suspensão']);
    expect(result?.testimonials).toHaveLength(1);
    expect(result?.testimonials[0]?.authorName).toBe('João Silva');
  });

  it('deve realizar upsert do BrandProfile convertendo campos complexos para JSON string', async () => {
    const input: CreateBrandProfileInput = {
      leadId: 'lead-uuid-1',
      logoUrl: 'https://cdn.example.com/logo.jpg',
      heroImageUrl: 'https://cdn.example.com/hero.jpg',
      galleryUrls: ['https://cdn.example.com/photo1.jpg'],
      palette: {
        primaryColor: '#EA580C',
        secondaryColor: '#334155',
        backgroundColor: '#0F172A',
        textColor: '#F8FAFC',
        paletteSource: 'EXTRACTED',
      },
      content: {
        headline: 'Headline Teste',
        subheadline: 'Subheadline Teste',
        aboutText: 'About text descritivo longo para teste.',
        keyServices: ['Serviço A', 'Serviço B'],
        callToAction: 'Chame no WhatsApp',
      },
      testimonials: [
        {
          authorName: 'Maria',
          rating: 5,
          relativeTime: 'ontem',
          text: 'Atendimento impecável!',
        },
      ],
    };

    const mockSaved = {
      id: 'brand-saved-1',
      ...input,
      galleryUrls: JSON.stringify(input.galleryUrls),
      primaryColor: input.palette.primaryColor,
      secondaryColor: input.palette.secondaryColor,
      backgroundColor: input.palette.backgroundColor,
      textColor: input.palette.textColor,
      paletteSource: input.palette.paletteSource,
      headline: input.content.headline,
      subheadline: input.content.subheadline,
      aboutText: input.content.aboutText,
      keyServices: JSON.stringify(input.content.keyServices),
      callToAction: input.content.callToAction,
      testimonials: JSON.stringify(input.testimonials),
      status: 'COMPLETED',
      errorMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lead: {
        businessName: 'Precision Auto Center',
        category: 'Oficina Mecânica',
      },
    };

    mockPrisma.brandProfile.upsert.mockResolvedValue(mockSaved);

    const result = await repository.upsert(input);

    expect(result.id).toBe('brand-saved-1');
    expect(mockPrisma.brandProfile.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { leadId: 'lead-uuid-1' },
      }),
    );
  });
});
