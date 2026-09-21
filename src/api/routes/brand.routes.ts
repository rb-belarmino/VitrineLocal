import { Router, Request, Response, NextFunction } from 'express';
import { BrandExtractorService } from '../../modules/brand/brand.service';
import {
  ExtractBrandParamsSchema,
  ExtractBrandQuerySchema
} from '../../modules/brand/schemas/brand.schemas';
import { ValidationError } from '../../shared/errors/app-error';

export function createBrandRoutes(brandService: BrandExtractorService): Router {
  const router = Router();

  // GET /api/brand/:leadId - Consulta perfil de marca existente
  router.get('/:leadId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = ExtractBrandParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        throw new ValidationError(
          'Parâmetro leadId inválido. Deve ser um UUID.',
          parsedParams.error.format() as unknown as Record<string, unknown>
        );
      }

      const profile = await brandService.getBrandProfile(parsedParams.data.leadId);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (err) {
      next(err);
    }
  });

  // POST /api/brand/extract/:leadId - Executa enriquecimento sob demanda (com cache e suporte a ?force=true)
  router.post('/extract/:leadId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = ExtractBrandParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        throw new ValidationError(
          'Parâmetro leadId inválido. Deve ser um UUID.',
          parsedParams.error.format() as unknown as Record<string, unknown>
        );
      }

      const parsedQuery = ExtractBrandQuerySchema.safeParse(req.query);
      const force = parsedQuery.success ? parsedQuery.data.force : false;

      const profile = await brandService.extractBrand(parsedParams.data.leadId, force);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
