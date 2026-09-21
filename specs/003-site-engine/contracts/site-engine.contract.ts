import { z } from 'zod';

/**
 * Contrato Zod & Schemas Tipados: Módulo 3 — Site Engine
 */

export const NicheThemeSchema = z.enum(['saude', 'automotivo', 'gastronomia', 'beleza', 'geral']);
export type NicheTheme = z.infer<typeof NicheThemeSchema>;

export const PreviewContactInfoSchema = z.object({
  phoneRaw: z.string().nullable(),
  phoneNormalized: z.string().nullable(),
  isMobile: z.boolean(),
  address: z.string().nullable(),
  whatsappLink: z.string().url(),
});
export type PreviewContactInfo = z.infer<typeof PreviewContactInfoSchema>;

export const PreviewBrandThemeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  paletteSource: z.enum(['EXTRACTED', 'FALLBACK_NICHE']),
});
export type PreviewBrandTheme = z.infer<typeof PreviewBrandThemeSchema>;

export const PreviewContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  aboutText: z.string(),
  keyServices: z.array(z.string()),
  callToAction: z.string(),
});
export type PreviewContent = z.infer<typeof PreviewContentSchema>;

export const PreviewTestimonialItemSchema = z.object({
  authorName: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  relativeTime: z.string().optional(),
});
export type PreviewTestimonialItem = z.infer<typeof PreviewTestimonialItemSchema>;

export const PreviewSocialProofSchema = z.object({
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  testimonials: z.array(PreviewTestimonialItemSchema),
});
export type PreviewSocialProof = z.infer<typeof PreviewSocialProofSchema>;

export const PreviewVisualPitchSchema = z.object({
  badgeText: z.string(),
  ctaText: z.string(),
  ctaWhatsappLink: z.string().url(),
});
export type PreviewVisualPitch = z.infer<typeof PreviewVisualPitchSchema>;

export const PreviewMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().nullable(),
  canonicalUrl: z.string(),
});
export type PreviewMeta = z.infer<typeof PreviewMetaSchema>;

export const PreviewSiteConfigSchema = z.object({
  leadId: z.string().uuid(),
  slug: z.string().min(3),
  businessName: z.string().min(1),
  category: z.string(),
  nicheTheme: NicheThemeSchema,
  contact: PreviewContactInfoSchema,
  theme: PreviewBrandThemeSchema,
  content: PreviewContentSchema,
  gallery: z.object({
    heroImageUrl: z.string().nullable(),
    logoUrl: z.string().nullable(),
    photos: z.array(z.string()),
  }),
  socialProof: PreviewSocialProofSchema,
  visualPitch: PreviewVisualPitchSchema,
  meta: PreviewMetaSchema,
});
export type PreviewSiteConfig = z.infer<typeof PreviewSiteConfigSchema>;

/**
 * Interface do Motor de Templates
 */
export interface NicheTemplate {
  readonly niche: NicheTheme;
  render(config: PreviewSiteConfig): string;
}

/**
 * Interface do Serviço Site Engine
 */
export interface ISiteEngineService {
  buildSiteConfig(identifier: string): Promise<PreviewSiteConfig>;
  renderPreviewHtml(identifier: string): Promise<string>;
  resolveSlug(lead: { id: string; businessName: string; address?: string | null }): Promise<string>;
}
