import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getPortalStats } from '../portal/stats/route';
import { GET as getPortalLeads } from '../portal/leads/route';
import { GET as getRadarLeads } from '../radar/leads/route';
import { POST as postRadarSearch } from '../radar/search/route';
import { GET as getRadarJob } from '../radar/jobs/[jobId]/route';
import { GET as getBrandProfile } from '../brand/[leadId]/route';
import { POST as postExtractBrand } from '../brand/extract/[leadId]/route';
import { GET as getPreviewConfig } from '../preview/[leadId]/config/route';
import { POST as postGenerateOutreach } from '../outreach/generate/[leadId]/route';
import { PATCH as patchLeadStatus } from '../outreach/leads/[id]/status/route';
import { brandService, outreachService, siteEngineService } from '@/lib/services';

describe('Next.js 16.3.5 Route Handlers', () => {
  describe('Portal Routes', () => {
    it('GET /api/portal/stats deve retornar estrutura com status 200', async () => {
      const req = new NextRequest('http://localhost:3000/api/portal/stats');
      const res = await getPortalStats(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
      expect(typeof json.data.totalMined).toBe('number');
    });

    it('GET /api/portal/leads deve listar leads do banco', async () => {
      const req = new NextRequest('http://localhost:3000/api/portal/leads');
      const res = await getPortalLeads(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
    });
  });

  describe('Radar Routes', () => {
    it('GET /api/radar/leads deve suportar filtros por query string', async () => {
      const req = new NextRequest('http://localhost:3000/api/radar/leads?niche=Oficina');
      const res = await getRadarLeads(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
    });

    it('POST /api/radar/search com payload válido deve enfileirar job com status 202', async () => {
      const req = new NextRequest('http://localhost:3000/api/radar/search', {
        method: 'POST',
        body: JSON.stringify({
          niche: 'Oficina Mecânica',
          location: 'Moema, São Paulo',
          limit: 5,
        }),
      });
      const res = await postRadarSearch(req);

      expect(res.status).toBe(202);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.jobId).toBeDefined();
    });

    it('POST /api/radar/search com dados inválidos deve retornar erro 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/radar/search', {
        method: 'POST',
        body: JSON.stringify({
          niche: '', // inválido
        }),
      });
      const res = await postRadarSearch(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('GET /api/radar/jobs/[jobId] inexistente deve retornar 404', async () => {
      const req = new NextRequest('http://localhost:3000/api/radar/jobs/job-inexistente-123');
      const res = await getRadarJob(req, {
        params: Promise.resolve({ jobId: 'job-inexistente-123' }),
      });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
    });
  });

  describe('Brand Routes', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('GET /api/brand/[leadId] com UUID inválido deve retornar 400', async () => {
      const req = new NextRequest(`http://localhost:3000/api/brand/invalido`);
      const res = await getBrandProfile(req, {
        params: Promise.resolve({ leadId: 'invalido' }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('GET /api/brand/[leadId] com UUID inexistente deve retornar 404', async () => {
      const req = new NextRequest(`http://localhost:3000/api/brand/${validUuid}`);
      const res = await getBrandProfile(req, {
        params: Promise.resolve({ leadId: validUuid }),
      });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('POST /api/brand/extract/[leadId] com UUID inválido deve retornar 400', async () => {
      const req = new NextRequest(`http://localhost:3000/api/brand/extract/invalido`, {
        method: 'POST',
      });
      const res = await postExtractBrand(req, {
        params: Promise.resolve({ leadId: 'invalido' }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('POST /api/brand/extract/[leadId] com sucesso deve retornar dados da marca', async () => {
      const spy = vi.spyOn(brandService, 'extractBrand').mockResolvedValueOnce({
        id: validUuid,
        leadId: validUuid,
        businessName: 'Oficina Exemplo',
        category: 'Oficina Mecânica',
        logoUrl: null,
        heroImageUrl: null,
        galleryUrls: [],
        palette: {
          primaryColor: '#0055ff',
          secondaryColor: '#ffffff',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          paletteSource: 'FALLBACK_NICHE',
        },
        content: {
          headline: 'Melhor serviço',
          subheadline: 'Qualidade e rapidez',
          aboutText: 'Descrição teste',
          keyServices: ['Revisão'],
          callToAction: 'Fale conosco',
        },
        testimonials: [],
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const req = new NextRequest(
        `http://localhost:3000/api/brand/extract/${validUuid}?force=true`,
        {
          method: 'POST',
        },
      );
      const res = await postExtractBrand(req, {
        params: Promise.resolve({ leadId: validUuid }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.palette.primaryColor).toBe('#0055ff');
      spy.mockRestore();
    });
  });

  describe('Preview Routes', () => {
    it('GET /api/preview/[leadId]/config para lead inexistente deve retornar 404', async () => {
      const req = new NextRequest('http://localhost:3000/api/preview/nao-existe/config');
      const res = await getPreviewConfig(req, {
        params: Promise.resolve({ leadId: 'nao-existe' }),
      });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('GET /api/preview/[leadId]/config com sucesso deve retornar PreviewSiteConfig', async () => {
      const mockConfig = {
        leadId: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'oficina-exemplo',
        businessName: 'Oficina Exemplo',
        category: 'Oficina',
        nicheTheme: 'automotivo' as const,
        contact: {
          phoneRaw: '(11) 99999-8888',
          phoneNormalized: '11999998888',
          isMobile: true,
          address: 'Rua Teste, 100',
          whatsappLink: 'https://wa.me/5511999998888',
        },
        theme: {
          primaryColor: '#1e3a8a',
          secondaryColor: '#f3f4f6',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          paletteSource: 'EXTRACTED' as const,
        },
        content: {
          headline: 'Sua Oficina de Confiança',
          subheadline: 'Manutenção preventiva e corretiva com tecnologia de ponta.',
          aboutText: 'Mais de 10 anos de mercado.',
          keyServices: ['Revisão', 'Freios'],
          callToAction: 'Agendar Revisão',
        },
        gallery: {
          heroImageUrl: null,
          logoUrl: null,
          photos: [],
        },
        socialProof: {
          rating: 4.8,
          reviewCount: 42,
          testimonials: [],
        },
        visualPitch: {
          badgeText: 'Demonstração criada por VitrineLocal',
          ctaText: 'Quero um site assim',
          ctaWhatsappLink: 'https://wa.me/5511999999999',
        },
        meta: {
          title: 'Oficina Exemplo - Moema',
          description: 'Sua Oficina de Confiança em São Paulo',
          ogImage: null,
          canonicalUrl: 'http://localhost:3000/preview/oficina-exemplo',
        },
      };

      const spy = vi.spyOn(siteEngineService, 'buildSiteConfig').mockResolvedValueOnce(mockConfig);

      const req = new NextRequest('http://localhost:3000/api/preview/oficina-exemplo/config');
      const res = await getPreviewConfig(req, {
        params: Promise.resolve({ leadId: 'oficina-exemplo' }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.businessName).toBe('Oficina Exemplo');
      spy.mockRestore();
    });
  });

  describe('Outreach Routes', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('POST /api/outreach/generate/[leadId] com UUID inválido deve retornar 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/outreach/generate/invalido', {
        method: 'POST',
      });
      const res = await postGenerateOutreach(req, {
        params: Promise.resolve({ leadId: 'invalido' }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('POST /api/outreach/generate/[leadId] com sucesso deve retornar copy gerada', async () => {
      const mockResult = {
        leadId: validUuid,
        businessName: 'Clínica Bem Estar',
        phoneNormalized: '11988887777',
        isMobile: true,
        messageText: 'Olá Dr. Roberto, criamos um preview para a Clínica Bem Estar.',
        whatsappDispatchLink: 'https://wa.me/5511988887777?text=Ola',
        previewUrl: 'http://localhost:3000/preview/clinica-bem-estar',
        generatedVia: 'GEMINI_AI' as const,
      };

      const spy = vi.spyOn(outreachService, 'generateMessage').mockResolvedValueOnce(mockResult);

      const req = new NextRequest(`http://localhost:3000/api/outreach/generate/${validUuid}`, {
        method: 'POST',
      });
      const res = await postGenerateOutreach(req, {
        params: Promise.resolve({ leadId: validUuid }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.businessName).toBe('Clínica Bem Estar');
      spy.mockRestore();
    });

    it('PATCH /api/outreach/leads/[id]/status com ID inválido deve retornar 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/outreach/leads/invalido/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CONTACTED' }),
      });
      const res = await patchLeadStatus(req, {
        params: Promise.resolve({ id: 'invalido' }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('PATCH /api/outreach/leads/[id]/status com corpo inválido deve retornar 400', async () => {
      const req = new NextRequest(`http://localhost:3000/api/outreach/leads/${validUuid}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'STATUS_INEXISTENTE' }),
      });
      const res = await patchLeadStatus(req, {
        params: Promise.resolve({ id: validUuid }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('PATCH /api/outreach/leads/[id]/status com dados válidos deve atualizar com 200', async () => {
      const spy = vi.spyOn(outreachService, 'updateLeadStatus').mockResolvedValueOnce({
        id: validUuid,
        status: 'CONTACTED',
      } as unknown as void);

      const req = new NextRequest(`http://localhost:3000/api/outreach/leads/${validUuid}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CONTACTED', notes: 'Enviado WhatsApp' }),
      });
      const res = await patchLeadStatus(req, {
        params: Promise.resolve({ id: validUuid }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.message).toContain('sucesso');
      spy.mockRestore();
    });
  });
});
