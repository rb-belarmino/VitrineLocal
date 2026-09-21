import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createApp } from '../server';
import { RadarService } from '../../modules/radar/radar.service';
import { MapsScraper } from '../../modules/radar/scraper/maps-scraper';

describe('Radar REST API Endpoints (Integration)', () => {
  const prisma = new PrismaClient();
  const mockScraper = new MapsScraper();

  // Mock do scraping para não bater na rede durante o teste da API
  vi.spyOn(mockScraper, 'scrape').mockResolvedValue([
    {
      businessName: 'Clínica Odonto Moema',
      category: 'Clínica odontológica',
      address: 'Rua Canário, 200 - Moema, São Paulo - SP',
      phone: '(11) 98765-4321',
      website: null,
      rating: 4.8,
      reviewCount: 40,
      mapsUrl: 'https://maps.google.com/?cid=999888',
    },
  ]);

  const radarService = new RadarService(prisma, mockScraper);
  const app = createApp(prisma, radarService);

  beforeEach(async () => {
    await prisma.qualifiedLead.deleteMany();
    await prisma.searchJob.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /health deve responder 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/radar/search deve rejeitar payload inválido com 400', async () => {
    const res = await request(app).post('/api/radar/search').send({ niche: 'A' }); // niche curto demais e sem location

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  it('POST /api/radar/search deve enfileirar a busca e retornar 202 com jobId', async () => {
    const res = await request(app).post('/api/radar/search').send({
      niche: 'Dentista',
      location: 'Moema, São Paulo',
      limit: 5,
    });

    expect(res.status).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.data.jobId).toBeDefined();
    expect(res.body.data.status).toBe('PENDING');

    const jobId = res.body.data.jobId;

    // Aguarda processamento do job
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Consulta status do job
    const statusRes = await request(app).get(`/api/radar/jobs/${jobId}`);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.status).toBe('COMPLETED');
    expect(statusRes.body.data.totalFound).toBe(1);
    expect(statusRes.body.data.totalQualified).toBe(1);
    expect(statusRes.body.data.leads.length).toBe(1);
    expect(statusRes.body.data.leads[0].businessName).toBe('Clínica Odonto Moema');
  });

  it('GET /api/radar/leads deve listar os leads qualificados cadastrados', async () => {
    // Insere busca e aguarda
    await request(app).post('/api/radar/search').send({
      niche: 'Dentista',
      location: 'Moema, São Paulo',
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await request(app).get('/api/radar/leads');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].businessName).toBe('Clínica Odonto Moema');

    // Teste com filtros na query
    const filteredRes = await request(app).get(
      '/api/radar/leads?niche=Clínica&location=Moema&minScore=50',
    );
    expect(filteredRes.status).toBe(200);
    expect(filteredRes.body.total).toBe(1);

    const emptyRes = await request(app).get('/api/radar/leads?minScore=1000');
    expect(emptyRes.status).toBe(200);
    expect(emptyRes.body.total).toBe(0);
  });

  it('GET /api/radar/jobs/:id deve retornar 404 para job inexistente', async () => {
    const res = await request(app).get('/api/radar/jobs/id-inexistente-123');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Job não encontrado');
  });
});
