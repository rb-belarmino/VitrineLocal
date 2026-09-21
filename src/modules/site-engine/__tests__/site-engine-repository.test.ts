import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { SiteEngineRepository } from '../repositories/site-engine.repository';

describe('SiteEngineRepository (Integration)', () => {
  const prisma = new PrismaClient();
  const repository = new SiteEngineRepository(prisma);

  const testLeadId = '99999999-9999-4999-a999-999999999999';
  const testSlug = 'oficina-teste-moema';

  beforeEach(async () => {
    await prisma.brandProfile.deleteMany();
    await prisma.qualifiedLead.deleteMany();

    await prisma.qualifiedLead.create({
      data: {
        id: testLeadId,
        slug: testSlug,
        businessName: 'Oficina Teste Moema',
        category: 'Oficina mecânica',
        address: 'Av Ibirapuera, 500 - Moema',
        phoneRaw: '11 98888-7777',
        phoneNormalized: '11988887777',
        isMobile: true,
        websiteType: 'NO_WEBSITE',
        status: 'QUALIFIED',
        rating: 4.8,
        reviewCount: 30,
        mapsUrl: 'https://maps.google.com/?cid=999000',
        brandProfile: {
          create: {
            primaryColor: '#0055FF',
            secondaryColor: '#FF5500',
            backgroundColor: '#FFFFFF',
            textColor: '#111111',
            paletteSource: 'FALLBACK_NICHE',
            headline: 'Mecânica Especializada em Moema',
            subheadline: 'Revisão e manutenção com garantia.',
            aboutText: 'Mais de 15 anos no mercado.',
            keyServices: '["Revisão Geral", "Freios", "Suspensão"]',
            callToAction: 'Fale Conosco no WhatsApp',
            galleryUrls: '["https://example.com/photo.jpg"]',
            testimonials: '[]',
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.brandProfile.deleteMany();
    await prisma.qualifiedLead.deleteMany();
    await prisma.$disconnect();
  });

  it('deve buscar lead e brandProfile pelo ID', async () => {
    const result = await repository.findById(testLeadId);
    expect(result).not.toBeNull();
    expect(result?.lead.id).toBe(testLeadId);
    expect(result?.profile?.headline).toBe('Mecânica Especializada em Moema');
  });

  it('deve buscar lead e brandProfile pelo slug', async () => {
    const result = await repository.findBySlug(testSlug);
    expect(result).not.toBeNull();
    expect(result?.lead.slug).toBe(testSlug);
    expect(result?.lead.businessName).toBe('Oficina Teste Moema');
  });

  it('deve buscar por ID ou slug de forma unificada', async () => {
    const byId = await repository.findByIdOrSlug(testLeadId);
    const bySlug = await repository.findByIdOrSlug(testSlug);

    expect(byId).not.toBeNull();
    expect(bySlug).not.toBeNull();
    expect(byId?.lead.id).toBe(bySlug?.lead.id);
  });

  it('deve atualizar o slug de um lead', async () => {
    const newSlug = 'oficina-teste-moema-renovada';
    await repository.updateSlug(testLeadId, newSlug);

    const updated = await repository.findBySlug(newSlug);
    expect(updated).not.toBeNull();
    expect(updated?.lead.id).toBe(testLeadId);
  });

  it('deve verificar disponibilidade de slug', async () => {
    const available = await repository.isSlugAvailable('slug-totalmente-novo');
    const unavailable = await repository.isSlugAvailable(testSlug);

    expect(available).toBe(true);
    expect(unavailable).toBe(false);

    // Se excluirmos o próprio lead, o slug dele é considerado disponível para ele mesmo
    const availableForSelf = await repository.isSlugAvailable(testSlug, testLeadId);
    expect(availableForSelf).toBe(true);
  });
});
