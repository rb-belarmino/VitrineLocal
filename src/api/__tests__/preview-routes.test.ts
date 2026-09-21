import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createApp } from '../server';
import { NotFoundError } from '../../shared/errors/app-error';
import { SiteEngineService } from '../../modules/site-engine/site-engine.service';
import { PreviewSiteConfig } from '../../modules/site-engine/site-engine.types';

describe('Preview Routes (Integration)', () => {
  let app: express.Express;
  let mockSiteService: {
    buildSiteConfig: ReturnType<typeof vi.fn>;
    renderPreviewHtml: ReturnType<typeof vi.fn>;
    resolveSlug: ReturnType<typeof vi.fn>;
  };

  const validUuid = '11111111-2222-3333-4444-555555555555';
  const validSlug = 'oficina-precision-moema';

  const mockConfig: PreviewSiteConfig = {
    leadId: validUuid,
    slug: validSlug,
    businessName: 'Oficina Precision',
    category: 'Oficina mecânica',
    nicheTheme: 'automotivo',
    contact: {
      phoneRaw: '(11) 98888-1111',
      phoneNormalized: '11988881111',
      isMobile: true,
      address: 'Av Santo Amaro, 100 - Moema',
      whatsappLink: 'https://wa.me/5511988881111',
    },
    theme: {
      primaryColor: '#0066CC',
      secondaryColor: '#FF6600',
      backgroundColor: '#FFFFFF',
      textColor: '#111111',
      paletteSource: 'EXTRACTED',
    },
    content: {
      headline: 'Manutenção de Qualidade',
      subheadline: 'Sua oficina de confiança em Moema',
      aboutText: 'Serviços completos com garantia.',
      keyServices: ['Revisão', 'Freios'],
      callToAction: 'Fale Conosco',
    },
    gallery: {
      heroImageUrl: 'https://example.com/hero.jpg',
      logoUrl: null,
      photos: [],
    },
    socialProof: {
      rating: 4.8,
      reviewCount: 20,
      testimonials: [],
    },
    visualPitch: {
      badgeText: 'Demonstração criada para Oficina Precision',
      ctaText: 'Quero este site',
      ctaWhatsappLink: 'https://wa.me/5511999998888',
    },
    meta: {
      title: 'Oficina Precision | Site Oficial',
      description: 'Sua oficina de confiança em Moema',
      ogImage: 'https://example.com/hero.jpg',
      canonicalUrl: `https://preview.vitrinelocal.com.br/preview/${validSlug}`,
    },
  };

  const mockHtml = `<!DOCTYPE html><html lang="pt-BR"><head><title>Oficina Precision | Site Oficial</title><style>:root { --brand-primary: #0066CC; }</style></head><body><h1>Oficina Precision</h1></body></html>`;

  beforeEach(() => {
    mockSiteService = {
      buildSiteConfig: vi.fn(),
      renderPreviewHtml: vi.fn(),
      resolveSlug: vi.fn(),
    };

    app = createApp(
      undefined,
      undefined,
      undefined,
      mockSiteService as unknown as SiteEngineService,
    );
  });

  describe('GET /preview/:identifier', () => {
    it('deve retornar HTML 200 ao buscar por ID (UUID)', async () => {
      mockSiteService.renderPreviewHtml.mockResolvedValue(mockHtml);

      const res = await request(app).get(`/preview/${validUuid}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text).toContain('<!DOCTYPE html>');
      expect(res.text).toContain('Oficina Precision');
      expect(mockSiteService.renderPreviewHtml).toHaveBeenCalledWith(validUuid);
    });

    it('deve retornar HTML 200 ao buscar por slug amigável', async () => {
      mockSiteService.renderPreviewHtml.mockResolvedValue(mockHtml);

      const res = await request(app).get(`/preview/${validSlug}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text).toContain('<!DOCTYPE html>');
      expect(mockSiteService.renderPreviewHtml).toHaveBeenCalledWith(validSlug);
    });

    it('deve incluir o badge de demonstração e link comercial do Visual Pitch no HTML retornado', async () => {
      const htmlWithBadge = `<!DOCTYPE html><html><body><aside class="vl-pitch-badge"><p>Demonstração exclusiva</p><a href="https://wa.me/5511999998888">Quero este site</a></aside><h1>Oficina Precision</h1></body></html>`;
      mockSiteService.renderPreviewHtml.mockResolvedValue(htmlWithBadge);

      const res = await request(app).get(`/preview/${validSlug}`);

      expect(res.status).toBe(200);
      expect(res.text).toContain('vl-pitch-badge');
      expect(res.text).toContain('Demonstração exclusiva');
      expect(res.text).toContain('https://wa.me/5511999998888');
    });

    it('deve retornar 404 caso o lead/slug não seja encontrado', async () => {
      mockSiteService.renderPreviewHtml.mockRejectedValue(
        new NotFoundError('Lead não encontrado para o identificador inexistente'),
      );

      const res = await request(app).get('/preview/inexistente');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('NotFoundError');
    });
  });

  describe('GET /api/preview/:id/config', () => {
    it('deve retornar JSON 200 com PreviewSiteConfig para UUID válido', async () => {
      mockSiteService.buildSiteConfig.mockResolvedValue(mockConfig);

      const res = await request(app).get(`/api/preview/${validUuid}/config`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.leadId).toBe(validUuid);
      expect(res.body.data.slug).toBe(validSlug);
      expect(res.body.data.nicheTheme).toBe('automotivo');
      expect(mockSiteService.buildSiteConfig).toHaveBeenCalledWith(validUuid);
    });

    it('deve retornar 400 se o identificador não for um UUID válido', async () => {
      const res = await request(app).get('/api/preview/not-a-uuid/config');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('ValidationError');
      expect(mockSiteService.buildSiteConfig).not.toHaveBeenCalled();
    });

    it('deve retornar 404 se o lead não for encontrado', async () => {
      mockSiteService.buildSiteConfig.mockRejectedValue(new NotFoundError('Lead não encontrado'));

      const res = await request(app).get(`/api/preview/${validUuid}/config`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('NotFoundError');
    });
  });
});
