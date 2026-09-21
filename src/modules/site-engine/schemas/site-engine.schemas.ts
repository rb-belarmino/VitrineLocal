import { z } from 'zod';

export const NicheThemeSchema = z.enum(['saude', 'automotivo', 'gastronomia', 'beleza', 'geral']);

export const PreviewContactInfoSchema = z.object({
  phoneRaw: z.string().nullable(),
  phoneNormalized: z.string().nullable(),
  isMobile: z.boolean(),
  address: z.string().nullable(),
  whatsappLink: z.string(),
});

export const PreviewBrandThemeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  paletteSource: z.enum(['EXTRACTED', 'FALLBACK_NICHE']),
});

export const PreviewContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  aboutText: z.string(),
  keyServices: z.array(z.string()),
  callToAction: z.string(),
});

export const PreviewTestimonialItemSchema = z.object({
  authorName: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  relativeTime: z.string().optional(),
});

export const PreviewSocialProofSchema = z.object({
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  testimonials: z.array(PreviewTestimonialItemSchema),
});

export const PreviewVisualPitchSchema = z.object({
  badgeText: z.string(),
  ctaText: z.string(),
  ctaWhatsappLink: z.string(),
});

export const PreviewMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().nullable(),
  canonicalUrl: z.string(),
});

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
