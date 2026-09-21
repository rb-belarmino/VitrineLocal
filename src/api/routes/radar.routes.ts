import { Router, Request, Response } from 'express';
import { RadarService } from '../../modules/radar/radar.service';
import { SearchParamsSchema } from '../../modules/radar/schemas/radar.schemas';
import { ValidationError } from '../../shared/errors/app-error';

export function createRadarRoutes(radarService: RadarService): Router {
  const router = Router();

  /**
   * POST /api/radar/search
   * Dispara um job de busca assíncrona.
   */
  router.post('/search', async (req: Request, res: Response, next) => {
    try {
      const parseResult = SearchParamsSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError('Parâmetros de busca inválidos', {
          issues: parseResult.error.format()
        });
      }

      const job = await radarService.enqueueSearchJob(parseResult.data);
      res.status(202).json({
        success: true,
        message: 'Busca enfileirada com sucesso',
        data: job
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/radar/jobs/:id
   * Consulta o status de processamento do job.
   */
  router.get('/jobs/:id', async (req: Request, res: Response, next) => {
    try {
      const rawJobId = req.params['id'];
      if (!rawJobId || typeof rawJobId !== 'string') {
        throw new ValidationError('ID do job obrigatório');
      }
      const jobId: string = rawJobId;

      const jobDetails = await radarService.getJobStatus(jobId);
      if (!jobDetails) {
        res.status(404).json({
          success: false,
          error: 'Job não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: jobDetails
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/radar/leads
   * Retorna os leads qualificados persistidos no banco.
   */
  router.get('/leads', async (req: Request, res: Response, next) => {
    try {
      const filters: { niche?: string; location?: string; minScore?: number } = {};
      if (typeof req.query['niche'] === 'string') {
        filters.niche = req.query['niche'];
      }
      if (typeof req.query['location'] === 'string') {
        filters.location = req.query['location'];
      }
      if (req.query['minScore']) {
        const parsedScore = parseInt(String(req.query['minScore']), 10);
        if (!isNaN(parsedScore)) {
          filters.minScore = parsedScore;
        }
      }

      const leads = await radarService.getQualifiedLeads(filters);

      res.status(200).json({
        success: true,
        total: leads.length,
        data: leads
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
