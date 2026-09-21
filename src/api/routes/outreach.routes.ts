import { Router, Request, Response, NextFunction } from 'express';
import { OutreachService } from '../../modules/outreach/outreach.service';
import {
  GenerateOutreachParamsSchema,
  UpdateStatusParamsSchema,
  LeadStatusUpdateSchema,
} from '../../modules/outreach/schemas/outreach.schemas';
import { ValidationError } from '../../shared/errors/app-error';

export function createOutreachRoutes(outreachService: OutreachService): Router {
  const router = Router();

  // POST /api/outreach/generate/:leadId -> Gera abordagem comercial Visual Pitch via IA
  router.post('/generate/:leadId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = GenerateOutreachParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        throw new ValidationError(
          'Parâmetro leadId inválido. Deve ser um UUID.',
          parsedParams.error.format() as unknown as Record<string, unknown>,
        );
      }

      const result = await outreachService.generateMessage(parsedParams.data.leadId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  });

  // PATCH /api/outreach/leads/:id/status -> Atualiza estágio no funil
  router.patch('/leads/:id/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = UpdateStatusParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        throw new ValidationError(
          'Parâmetro id inválido. Deve ser um UUID.',
          parsedParams.error.format() as unknown as Record<string, unknown>,
        );
      }

      const parsedBody = LeadStatusUpdateSchema.safeParse(req.body);
      if (!parsedBody.success) {
        throw new ValidationError(
          'Corpo da requisição inválido para atualização de status.',
          parsedBody.error.format() as unknown as Record<string, unknown>,
        );
      }

      await outreachService.updateLeadStatus(parsedParams.data.id, parsedBody.data);
      res.status(200).json({
        success: true,
        message: 'Status atualizado com sucesso.',
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
