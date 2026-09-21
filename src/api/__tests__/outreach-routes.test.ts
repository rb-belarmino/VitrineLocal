import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createApp } from '../server';
import { OutreachService } from '../../modules/outreach/outreach.service';
import { NotFoundError } from '../../shared/errors/app-error';

describe('Outreach Routes (Integration)', () => {
  let app: express.Express;
  let mockOutreachService: {
    generateMessage: ReturnType<typeof vi.fn>;
    updateLeadStatus: ReturnType<typeof vi.fn>;
  };

  const validUuid = '11111111-2222-3333-4444-555555555555';

  const mockResponse = {
    leadId: validUuid,
    businessName: 'Oficina Precision',
    phoneNormalized: '11988881111',
    isMobile: true,
    previewUrl: 'http://localhost:3001/preview/oficina-precision-moema',
    messageText: 'Olá! Parabéns pelas 4.8 estrelas no Google...',
    whatsappDispatchLink: 'https://wa.me/5511988881111?text=Ola',
    generatedVia: 'GEMINI_AI',
  };

  beforeEach(() => {
    mockOutreachService = {
      generateMessage: vi.fn(),
      updateLeadStatus: vi.fn(),
    };

    app = createApp(
      undefined,
      undefined,
      undefined,
      undefined,
      mockOutreachService as unknown as OutreachService,
    );
  });

  describe('POST /api/outreach/generate/:leadId', () => {
    it('deve retornar 200 com mensagem e link do WhatsApp gerados', async () => {
      mockOutreachService.generateMessage.mockResolvedValue(mockResponse);

      const res = await request(app).post(`/api/outreach/generate/${validUuid}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.leadId).toBe(validUuid);
      expect(res.body.data.messageText).toContain('4.8 estrelas');
      expect(mockOutreachService.generateMessage).toHaveBeenCalledWith(validUuid);
    });

    it('deve retornar 400 se leadId não for um UUID válido', async () => {
      const res = await request(app).post('/api/outreach/generate/invalido');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('ValidationError');
    });

    it('deve retornar 404 se o lead não for encontrado', async () => {
      mockOutreachService.generateMessage.mockRejectedValue(
        new NotFoundError('Lead não encontrado'),
      );

      const res = await request(app).post(`/api/outreach/generate/${validUuid}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('NotFoundError');
    });
  });

  describe('PATCH /api/outreach/leads/:id/status', () => {
    it('deve atualizar o status do lead para CONTACTED com sucesso', async () => {
      mockOutreachService.updateLeadStatus.mockResolvedValue(undefined);

      const res = await request(app)
        .patch(`/api/outreach/leads/${validUuid}/status`)
        .send({ status: 'CONTACTED' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockOutreachService.updateLeadStatus).toHaveBeenCalledWith(validUuid, {
        status: 'CONTACTED',
      });
    });

    it('deve atualizar o status do lead para CONTACTED com outreachCopy com sucesso', async () => {
      mockOutreachService.updateLeadStatus.mockResolvedValue(undefined);

      const res = await request(app)
        .patch(`/api/outreach/leads/${validUuid}/status`)
        .send({ status: 'CONTACTED', outreachCopy: 'Copy personalizada enviada' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockOutreachService.updateLeadStatus).toHaveBeenCalledWith(validUuid, {
        status: 'CONTACTED',
        outreachCopy: 'Copy personalizada enviada',
      });
    });

    it('deve retornar 400 se o status for inválido', async () => {
      const res = await request(app)
        .patch(`/api/outreach/leads/${validUuid}/status`)
        .send({ status: 'STATUS_INVALIDO' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('ValidationError');
    });
  });
});
