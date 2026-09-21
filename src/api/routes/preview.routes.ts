import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SiteEngineService } from '../../modules/site-engine/site-engine.service';
import { ValidationError } from '../../shared/errors/app-error';

const LeadIdParamSchema = z.object({
  id: z.string().uuid(),
});

export function createPreviewHtmlRoutes(siteEngineService: SiteEngineService): Router {
  const router = Router();

  // GET /preview/:identifier (UUID ou slug amigável) -> Renderiza página HTML5
  router.get('/:identifier', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { identifier } = req.params;
      if (!identifier || typeof identifier !== 'string') {
        throw new ValidationError('Identificador não informado.');
      }

      const html = await siteEngineService.renderPreviewHtml(identifier);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(html);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function createPreviewApiRoutes(siteEngineService: SiteEngineService): Router {
  const router = Router();

  // GET /api/preview/:id/config -> Retorna DTO estruturado PreviewSiteConfig
  router.get('/:id/config', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = LeadIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        throw new ValidationError(
          'Parâmetro id inválido. Deve ser um UUID.',
          parsed.error.format() as unknown as Record<string, unknown>,
        );
      }

      const config = await siteEngineService.buildSiteConfig(parsed.data.id);
      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
