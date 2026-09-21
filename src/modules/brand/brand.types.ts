import {
  TestimonialItem,
  BrandPalette,
  SemanticContent,
  BrandProfileResponse,
} from './schemas/brand.schemas';

export type { TestimonialItem, BrandPalette, SemanticContent, BrandProfileResponse };

export interface RawReview {
  authorName: string;
  authorPhotoUrl?: string | undefined;
  rating: number;
  relativeTime: string;
  text: string;
}

export interface ExtractedVisuals {
  logoUrl: string | null;
  heroImageUrl: string | null;
  galleryUrls: string[];
}

export interface BrandExtractionInput {
  leadId: string;
  businessName: string;
  category: string;
  mapsUrl: string;
  socialLinks?: string[] | undefined;
  force?: boolean | undefined;
}

export interface CreateBrandProfileInput {
  leadId: string;
  logoUrl?: string | null | undefined;
  heroImageUrl?: string | null | undefined;
  galleryUrls: string[];
  palette: BrandPalette;
  content: SemanticContent;
  testimonials: TestimonialItem[];
  status?: 'COMPLETED' | 'FAILED' | undefined;
  errorMessage?: string | null | undefined;
}
