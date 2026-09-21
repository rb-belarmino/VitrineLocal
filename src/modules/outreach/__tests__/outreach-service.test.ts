import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OutreachService } from '../outreach.service';
import { GeminiOutreachAdapter } from '../core/gemini-outreach-adapter';
import { CopyGenerator } from '../core/copy-generator';
import { NotFoundError } from '../../../shared/errors/app-error';
import { PrismaClient, QualifiedLead } from '@prisma/client';

describe('OutreachService (Unit)', () => {
  let mockPrisma: PrismaClient;
  let mockGeminiAdapter: GeminiOutreachAdapter;
  let mockCopyGenerator: CopyGenerator;
  let service: OutreachService;

  const mockLead: QualifiedLead = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    slug: 'oficina-precision-moema',
    businessName: 'Oficina Precision',
    category: 'Oficina mecânica',
    address: 'Av Santo Amaro, 100 - Moema',
    phoneRaw: '(11) 98888-1111',
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
    outreachCopy: null,
    contactedAt: null,
    mapsUrl: 'https://maps.google.com/?cid=123',
    searchJobId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockPrisma = {
      qualifiedLead: {
        findUnique: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
    } as unknown as PrismaClient;

    mockGeminiAdapter = {
      generate: vi.fn().mockResolvedValue({
        messageText: 'Mensagem de teste gerada',
        generatedVia: 'GEMINI_AI',
      }),
    } as unknown as GeminiOutreachAdapter;

    mockCopyGenerator = {
      buildWhatsappLink: vi.fn().mockReturnValue('https://wa.me/5511988881111?text=teste'),
      generateDeterministic: vi.fn(),
    } as unknown as CopyGenerator;

    service = new OutreachService(mockPrisma, mockGeminiAdapter, mockCopyGenerator);
  });

  it('deve gerar mensagem e link do WhatsApp com sucesso para um lead existente e persistir outreachCopy', async () => {
    vi.spyOn(mockPrisma.qualifiedLead, 'findUnique').mockResolvedValue(mockLead);
    vi.spyOn(mockPrisma.qualifiedLead, 'update').mockResolvedValue({
      ...mockLead,
      outreachCopy: 'Mensagem de teste gerada',
    });

    const result = await service.generateMessage(mockLead.id);

    expect(result.leadId).toBe(mockLead.id);
    expect(result.businessName).toBe('Oficina Precision');
    expect(result.messageText).toBe('Mensagem de teste gerada');
    expect(result.whatsappDispatchLink).toContain('https://wa.me/');
    expect(result.generatedVia).toBe('GEMINI_AI');

    expect(mockPrisma.qualifiedLead.update).toHaveBeenCalledWith({
      where: { id: mockLead.id },
      data: { outreachCopy: 'Mensagem de teste gerada' },
    });
  });

  it('deve lançar NotFoundError se o lead não existir ao tentar gerar mensagem', async () => {
    vi.spyOn(mockPrisma.qualifiedLead, 'findUnique').mockResolvedValue(null);

    await expect(service.generateMessage('inexistente-123')).rejects.toThrow(NotFoundError);
  });

  it('deve atualizar o status do lead no Prisma com sucesso e preencher contactedAt ao marcar como CONTACTED', async () => {
    vi.spyOn(mockPrisma.qualifiedLead, 'findUnique').mockResolvedValue(mockLead);
    vi.spyOn(mockPrisma.qualifiedLead, 'update').mockResolvedValue({
      ...mockLead,
      status: 'CONTACTED',
      outreachCopy: 'Copy personalizada',
      contactedAt: new Date(),
    });

    await service.updateLeadStatus(mockLead.id, {
      status: 'CONTACTED',
      outreachCopy: 'Copy personalizada',
    });

    expect(mockPrisma.qualifiedLead.update).toHaveBeenCalledWith({
      where: { id: mockLead.id },
      data: {
        status: 'CONTACTED',
        outreachCopy: 'Copy personalizada',
        contactedAt: expect.any(Date),
      },
    });
  });

  it('deve lançar NotFoundError ao tentar atualizar status de lead inexistente', async () => {
    vi.spyOn(mockPrisma.qualifiedLead, 'findUnique').mockResolvedValue(null);

    await expect(
      service.updateLeadStatus('inexistente-123', { status: 'CONTACTED' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('deve retornar métricas consolidadas do portal corretamente', async () => {
    vi.spyOn(mockPrisma.qualifiedLead, 'count')
      .mockResolvedValueOnce(30) // totalMined
      .mockResolvedValueOnce(20) // totalQualified
      .mockResolvedValueOnce(15) // totalPreviewsReady
      .mockResolvedValueOnce(10) // totalContacted
      .mockResolvedValueOnce(5); // totalConverted

    const stats = await service.getPortalStats();

    expect(stats).toEqual({
      totalMined: 30,
      totalQualified: 20,
      totalPreviewsReady: 15,
      totalContacted: 10,
      totalConverted: 5,
    });
  });
});
