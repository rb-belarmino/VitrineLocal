import { z } from 'zod';
import {
  NicheThemeSchema,
  PreviewContactInfoSchema,
  PreviewBrandThemeSchema,
  PreviewContentSchema,
  PreviewTestimonialItemSchema,
  PreviewSocialProofSchema,
  PreviewVisualPitchSchema,
  PreviewMetaSchema,
  PreviewSiteConfigSchema,
} from './schemas/site-engine.schemas';

export type NicheTheme = z.infer<typeof NicheThemeSchema>;
export type PreviewContactInfo = z.infer<typeof PreviewContactInfoSchema>;
export type PreviewBrandTheme = z.infer<typeof PreviewBrandThemeSchema>;
export type PreviewContent = z.infer<typeof PreviewContentSchema>;
export type PreviewTestimonialItem = z.infer<typeof PreviewTestimonialItemSchema>;
export type PreviewSocialProof = z.infer<typeof PreviewSocialProofSchema>;
export type PreviewVisualPitch = z.infer<typeof PreviewVisualPitchSchema>;
export type PreviewMeta = z.infer<typeof PreviewMetaSchema>;
export type PreviewSiteConfig = z.infer<typeof PreviewSiteConfigSchema>;

export interface NicheTemplate {
  readonly niche: NicheTheme;
  render(config: PreviewSiteConfig): string;
}

export interface ISiteEngineService {
  buildSiteConfig(identifier: string): Promise<PreviewSiteConfig>;
  renderPreviewHtml(identifier: string): Promise<string>;
  resolveSlug(lead: { id: string; businessName: string; address?: string | null }): Promise<string>;
}
