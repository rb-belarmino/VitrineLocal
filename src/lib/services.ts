import { prisma } from './prisma';
import { RadarService } from '../modules/radar/radar.service';
import { BrandExtractorService } from '../modules/brand/brand.service';
import { BrandRepository } from '../modules/brand/repositories/brand.repository';
import { SiteEngineService } from '../modules/site-engine/site-engine.service';
import { SiteEngineRepository } from '../modules/site-engine/repositories/site-engine.repository';
import { OutreachService } from '../modules/outreach/outreach.service';

export const radarService = new RadarService(prisma);
export const brandRepository = new BrandRepository(prisma);
export const brandService = new BrandExtractorService(brandRepository);
export const siteEngineRepository = new SiteEngineRepository(prisma);
export const siteEngineService = new SiteEngineService(siteEngineRepository, brandService);
export const outreachService = new OutreachService(prisma);
