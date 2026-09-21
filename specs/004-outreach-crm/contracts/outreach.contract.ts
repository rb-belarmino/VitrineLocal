import { z } from 'zod';

export const LeadStatusUpdateSchema = z.object({
  status: z.enum(['QUALIFIED', 'CONTACTED', 'NEGOTIATING', 'CONVERTED', 'DISQUALIFIED']),
  notes: z.string().optional(),
  outreachCopy: z.string().optional(),
});

export const OutreachMessageResponseSchema = z.object({
  leadId: z.string().uuid(),
  businessName: z.string(),
  phoneNormalized: z.string().nullable(),
  isMobile: z.boolean(),
  previewUrl: z.string().url(),
  messageText: z.string().min(10),
  whatsappDispatchLink: z.string().url(),
  generatedVia: z.enum(['GEMINI_AI', 'FALLBACK_SYNTHESIZER']),
});

export const PortalStatsResponseSchema = z.object({
  totalMined: z.number().int().nonnegative(),
  totalQualified: z.number().int().nonnegative(),
  totalPreviewsReady: z.number().int().nonnegative(),
  totalContacted: z.number().int().nonnegative(),
  totalConverted: z.number().int().nonnegative(),
});

export type LeadStatusUpdate = z.infer<typeof LeadStatusUpdateSchema>;
export type OutreachMessageResponse = z.infer<typeof OutreachMessageResponseSchema>;
export type PortalStatsResponse = z.infer<typeof PortalStatsResponseSchema>;
