import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { OutreachService } from '../../modules/outreach/outreach.service';

export function createPortalRoutes(outreachService?: OutreachService): Router {
  const router = Router();
  const portalHtmlPath = path.resolve(__dirname, '../../portal/index.html');

  const servePortal = (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (fs.existsSync(portalHtmlPath)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.sendFile(portalHtmlPath);
      } else {
        res.status(404).send('Portal HTML não encontrado.');
      }
    } catch (err) {
      next(err);
    }
  };

  router.get('/', servePortal);
  router.get('/dashboard', servePortal);

  if (outreachService) {
    router.get('/api/portal/stats', async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const stats = await outreachService.getPortalStats();
        res.status(200).json({
          success: true,
          data: stats,
        });
      } catch (err) {
        next(err);
      }
    });
  }

  return router;
}
