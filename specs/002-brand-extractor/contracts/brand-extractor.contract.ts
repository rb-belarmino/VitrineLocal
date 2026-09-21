import { z } from 'zod';

export const TestimonialItemSchema = z.object({
  authorName: z.string().min(1, 'Nome do autor é obrigatório'),
  authorPhotoUrl: z.string().url().optional(),
  rating: z.number().min(1).max(5),
  relativeTime: z.string().default('recente'),
  text: z.string().min(1, 'Texto do depoimento é obrigatório'),
});

export const BrandPaletteSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Formato HEX inválido (#RRGGBB)'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Formato HEX inválido (#RRGGBB)'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Formato HEX inválido (#RRGGBB)'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Formato HEX inválido (#RRGGBB)'),
  paletteSource: z.enum(['EXTRACTED', 'FALLBACK_NICHE']),
});

export const SemanticContentSchema = z.object({
  headline: z.string().min(5, 'Headline deve ter pelo menos 5 caracteres'),
  subheadline: z.string().min(10, 'Subheadline deve ter pelo menos 10 caracteres'),
  aboutText: z.string().min(20, 'Texto institucional deve ter pelo menos 20 caracteres'),
  keyServices: z.array(z.string()).min(1, 'Ao menos um serviço deve ser listado'),
  callToAction: z.string().min(5, 'Call to Action é obrigatória'),
});

export const ExtractBrandParamsSchema = z.object({
  leadId: z.string().uuid('ID de lead inválido'),
});

export const ExtractBrandQuerySchema = z.object({
  force: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

export const BrandProfileResponseSchema = z.object({
  id: z.string().uuid(),
  leadId: z.string().uuid(),
  businessName: z.string(),
  category: z.string(),
  logoUrl: z.string().nullable(),
  heroImageUrl: z.string().nullable(),
  galleryUrls: z.array(z.string()),
  palette: BrandPaletteSchema,
  content: SemanticContentSchema,
  testimonials: z.array(TestimonialItemSchema),
  status: z.enum(['COMPLETED', 'FAILED']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TestimonialItem = z.infer<typeof TestimonialItemSchema>;
export type BrandPalette = z.infer<typeof BrandPaletteSchema>;
export type SemanticContent = z.infer<typeof SemanticContentSchema>;
export type ExtractBrandParams = z.infer<typeof ExtractBrandParamsSchema>;
export type ExtractBrandQuery = z.infer<typeof ExtractBrandQuerySchema>;
export type BrandProfileResponse = z.infer<typeof BrandProfileResponseSchema>;
