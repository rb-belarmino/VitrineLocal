import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createApp } from '../server';
import { NotFoundError } from '../../shared/errors/app-error';
import { BrandExtractorService } from '../../modules/brand/brand.service';

describe('Brand REST API Endpoints (Integration)', () => {
  let app: express.Express;
  let mockBrandService: {
    getBrandProfile: ReturnType<typeof vi.fn>;
    extractBrand: ReturnType<typeof vi.fn>;
  };

  const validUuid = '11111111-2222-3333-4444-555555555555';

  const mockProfile = {
    id: 'b34e5a9f-891d-44a6-93d3-13833b934789',
    leadId: validUuid,
    businessName: 'Oficina Precision Moema',
    category: 'Oficina Mecânica',
    logoUrl: 'https://cdn.example.com/logo.jpg',
    heroImageUrl: 'https://cdn.example.com/hero.jpg',
    galleryUrls: ['https://cdn.example.com/gallery1.jpg'],
    palette: {
      primaryColor: '#EA580C',
      secondaryColor: '#334155',
      backgroundColor: '#0F172A',
      textColor: '#F8FAFC',
      paletteSource: 'EXTRACTED',
    },
    content: {
      headline: 'Oficina Precision em Moema',
      subheadline: 'Manutenção de confiança para seu veículo',
      aboutText: 'Mais de 15 anos oferecendo os melhores serviços automotivos da região.',
      keyServices: ['Mecânica', 'Suspensão'],
      callToAction: 'Agende pelo WhatsApp',
    },
    testimonials: [
      {
        authorName: 'Carlos',
        rating: 5,
        relativeTime: 'há 1 mês',
        text: 'Excelente atendimento!',
      },
    ],
    status: 'COMPLETED',
    createdAt: '2026-09-21T12:00:00.000Z',
    updatedAt: '2026-09-21T12:00:00.000Z',
  };

  beforeEach(() => {
    mockBrandService = {
      getBrandProfile: vi.fn(),
      extractBrand: vi.fn(),
    };

    app = createApp(undefined, undefined, mockBrandService as unknown as BrandExtractorService);
  });

  describe('GET /api/brand/:leadId', () => {
    it('deve retornar 400 se o leadId não for um UUID válido', async () => {
      const res = await request(app).get('/api/brand/not-a-uuid');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('ValidationError');
    });

    it('deve retornar 404 se o perfil de marca não existir', async () => {
      mockBrandService.getBrandProfile.mockRejectedValue(
        new NotFoundError('Perfil não encontrado'),
      );

      const res = await request(app).get(`/api/brand/${validUuid}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('NotFoundError');
    });

    it('deve retornar 200 com os dados do perfil de marca quando existir', async () => {
      mockBrandService.getBrandProfile.mockResolvedValue(mockProfile);

      const res = await request(app).get(`/api/brand/${validUuid}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.businessName).toBe('Oficina Precision Moema');
      expect(res.body.data.palette.primaryColor).toBe('#EA580C');
    });
  });

  describe('POST /api/brand/extract/:leadId', () => {
    it('deve retornar 400 se o leadId não for um UUID válido', async () => {
      const res = await request(app).post('/api/brand/extract/not-a-uuid');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('deve chamar o serviço com force=false por padrão e responder 200', async () => {
      mockBrandService.extractBrand.mockResolvedValue(mockProfile);

      const res = await request(app).post(`/api/brand/extract/${validUuid}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(mockProfile.id);
      expect(mockBrandService.extractBrand).toHaveBeenCalledWith(validUuid, false);
    });

    it('deve respeitar a query param force=true', async () => {
      mockBrandService.extractBrand.mockResolvedValue(mockProfile);

      const res = await request(app).post(`/api/brand/extract/${validUuid}?force=true`);

      expect(res.status).toBe(200);
      expect(mockBrandService.extractBrand).toHaveBeenCalledWith(validUuid, true);
    });
  });
});
