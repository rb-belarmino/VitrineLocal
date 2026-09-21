import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaLeadRepository } from '../repositories/lead.repository';
import { LeadPersister } from '../core/lead-persister';

describe('PrismaLeadRepository & LeadPersister (Integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaLeadRepository(prisma);
  const persister = new LeadPersister(repository);

  beforeEach(async () => {
    await prisma.qualifiedLead.deleteMany();
    await prisma.searchJob.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve processar, qualificar e persistir um lead sem website no banco de dados', async () => {
    const job = await repository.createSearchJob({
      niche: 'Oficina Mecânica',
      location: 'Moema, São Paulo',
      limit: 10,
    });

    const lead = await persister.processAndSave(
      {
        businessName: 'Mecânica Moema Car',
        category: 'Oficina mecânica',
        address: 'Av. Moema, 100',
        phone: '(11) 98888-7777',
        website: null,
        rating: 4.8,
        reviewCount: 95,
        mapsUrl: 'https://maps.google.com/?cid=11111',
      },
      job.id,
    );

    expect(lead.status).toBe('QUALIFIED');
    expect(lead.phoneNormalized).toBe('+5511988887777');
    expect(lead.isMobile).toBe(true);
    expect(lead.qualificationScore).toBe(100);

    const saved = await repository.getLeadByMapsUrl('https://maps.google.com/?cid=11111');
    expect(saved).toBeDefined();
    expect(saved?.businessName).toBe('Mecânica Moema Car');
  });

  it('deve persistir lead desqualificado com motivo HAS_WEBSITE', async () => {
    const lead = await persister.processAndSave({
      businessName: 'Auto Center Paulista',
      category: 'Oficina mecânica',
      phone: '11 5051-2233',
      website: 'https://www.autocenterpaulista.com.br',
      rating: 4.9,
      reviewCount: 300,
      mapsUrl: 'https://maps.google.com/?cid=22222',
    });

    expect(lead.status).toBe('DISQUALIFIED');
    expect(lead.disqualificationReason).toBe('HAS_WEBSITE');

    const saved = await repository.getLeadByMapsUrl('https://maps.google.com/?cid=22222');
    expect(saved?.status).toBe('DISQUALIFIED');
  });

  it('deve atualizar dados sem duplicar quando o mesmo mapsUrl for persistido novamente', async () => {
    await persister.processAndSave({
      businessName: 'Barbearia do Silva',
      category: 'Barbearia',
      rating: 4.5,
      reviewCount: 10,
      mapsUrl: 'https://maps.google.com/?cid=33333',
    });

    // Segunda execução com mais reviews
    await persister.processAndSave({
      businessName: 'Barbearia do Silva',
      category: 'Barbearia',
      rating: 4.7,
      reviewCount: 35,
      mapsUrl: 'https://maps.google.com/?cid=33333',
    });

    const leads = await repository.getQualifiedLeads();
    expect(leads.length).toBe(1);
    expect(leads[0]?.reviewCount).toBe(35);
    expect(leads[0]?.rating).toBe(4.7);
  });
});
