import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { RadarService } from '../modules/radar/radar.service';
import { createRadarRoutes } from './routes/radar.routes';
import { BrandExtractorService } from '../modules/brand/brand.service';
import { BrandRepository } from '../modules/brand/repositories/brand.repository';
import { createBrandRoutes } from './routes/brand.routes';
import { AppError } from '../shared/errors/app-error';
import { Logger } from '../shared/logger/logger';

export function createApp(
  prismaClient?: PrismaClient,
  radarService?: RadarService,
  brandService?: BrandExtractorService,
) {
  const app = express();
  const prisma = prismaClient ?? new PrismaClient();
  const rService = radarService ?? new RadarService(prisma);
  const bService = brandService ?? new BrandExtractorService(new BrandRepository(prisma));

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Rotas do Radar (Módulo 1)
  app.use('/api/radar', createRadarRoutes(rService));

  // Rotas do Brand Extractor (Módulo 2)
  app.use('/api/brand', createBrandRoutes(bService));

  // Middleware global de tratamento de erros
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        error: err.name,
        message: err.message,
        context: err.context,
      });
      return;
    }

    Logger.error('Erro interno não tratado', err);
    res.status(500).json({
      success: false,
      error: 'InternalServerError',
      message: 'Ocorreu um erro interno no servidor.',
    });
  });

  return app;
}

export function startServer(port = 3001) {
  const app = createApp();
  return app.listen(port, () => {
    Logger.info(`VitrineLocal API rodando na porta ${port}`);
  });
}

// Inicia automaticamente se executado diretamente
if (process.env['NODE_ENV'] !== 'test' && require.main === module) {
  const port = parseInt(process.env['PORT'] ?? '3001', 10);
  startServer(port);
}
