import { NicheDetector } from './niche-detector';
import { PreviewSiteConfig, PreviewTestimonialItem } from '../site-engine.types';

export interface SiteConfigBuilderOptions {
  vitrineLocalWhatsapp?: string;
  baseUrl?: string;
}

export interface LeadInputData {
  id: string;
  slug?: string | null;
  businessName: string;
  category: string;
  address?: string | null;
  phoneRaw?: string | null;
  phoneNormalized?: string | null;
  isMobile: boolean;
  rating: number;
  reviewCount: number;
  mapsUrl: string;
}

export interface BrandProfileInputData {
  id: string;
  leadId: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  paletteSource: string;
  headline: string;
  subheadline: string;
  aboutText: string;
  keyServices: string; // JSON string
  callToAction: string;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  galleryUrls: string; // JSON string
  testimonials: string; // JSON string
}

export class SiteConfigBuilder {
  private readonly nicheDetector: NicheDetector;
  private readonly vitrineLocalWhatsapp: string;
  private readonly baseUrl: string;

  constructor(options: SiteConfigBuilderOptions = {}) {
    this.nicheDetector = new NicheDetector();
    this.vitrineLocalWhatsapp = options.vitrineLocalWhatsapp || '5511999998888';
    this.baseUrl = options.baseUrl || 'https://preview.vitrinelocal.com.br';
  }

  public build(lead: LeadInputData, profile: BrandProfileInputData): PreviewSiteConfig {
    const nicheTheme = this.nicheDetector.detect(lead.category);
    const keyServices = this.parseJsonArray<string>(profile.keyServices);
    const photos = this.parseJsonArray<string>(profile.galleryUrls);
    const testimonials = this.parseJsonArray<PreviewTestimonialItem>(profile.testimonials);

    const whatsappLink = this.buildLeadWhatsappLink(lead.phoneNormalized, lead.businessName);
    const ctaWhatsappLink = this.buildVitrineLocalWhatsappLink(lead.businessName, lead.id);

    const slug = lead.slug || lead.id;
    const canonicalUrl = `${this.baseUrl}/preview/${slug}`;

    return {
      leadId: lead.id,
      slug,
      businessName: lead.businessName,
      category: lead.category,
      nicheTheme,
      contact: {
        phoneRaw: lead.phoneRaw ?? null,
        phoneNormalized: lead.phoneNormalized ?? null,
        isMobile: lead.isMobile,
        address: lead.address ?? null,
        whatsappLink,
      },
      theme: {
        primaryColor: profile.primaryColor,
        secondaryColor: profile.secondaryColor,
        backgroundColor: profile.backgroundColor,
        textColor: profile.textColor,
        paletteSource: profile.paletteSource === 'FALLBACK_NICHE' ? 'FALLBACK_NICHE' : 'EXTRACTED',
      },
      content: {
        headline: profile.headline,
        subheadline: profile.subheadline,
        aboutText: profile.aboutText,
        keyServices,
        callToAction: profile.callToAction,
      },
      gallery: {
        heroImageUrl: profile.heroImageUrl ?? null,
        logoUrl: profile.logoUrl ?? null,
        photos,
      },
      socialProof: {
        rating: lead.rating,
        reviewCount: lead.reviewCount,
        testimonials,
      },
      visualPitch: {
        badgeText: `Demonstração exclusiva criada para ${lead.businessName} pela VitrineLocal`,
        ctaText: 'Quero este site para minha empresa',
        ctaWhatsappLink,
      },
      meta: {
        title: `${lead.businessName} | Site Oficial`,
        description: profile.subheadline || profile.headline,
        ogImage: profile.heroImageUrl || profile.logoUrl || null,
        canonicalUrl,
      },
    };
  }

  private buildLeadWhatsappLink(
    phoneNormalized: string | null | undefined,
    businessName: string,
  ): string {
    if (!phoneNormalized) {
      return '#';
    }
    const cleanPhone = phoneNormalized.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(
      `Olá! Gostaria de mais informações sobre os serviços da ${businessName}.`,
    );
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  }

  private buildVitrineLocalWhatsappLink(businessName: string, leadId: string): string {
    const text = encodeURIComponent(
      `Olá! Vi a demonstração que a VitrineLocal criou para a empresa "${businessName}" (ID: ${leadId}) e quero adquirir/personalizar o site definitivo!`,
    );
    return `https://wa.me/${this.vitrineLocalWhatsapp}?text=${text}`;
  }

  private parseJsonArray<T>(rawJson?: string | null): T[] {
    if (!rawJson) return [];
    try {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed)) {
        return parsed as T[];
      }
      return [];
    } catch {
      return [];
    }
  }
}
