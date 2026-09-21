import { PrismaClient, BrandProfile } from '@prisma/client';
import { BrandProfileResponse, CreateBrandProfileInput, TestimonialItem } from '../brand.types';

type BrandProfileWithLead = BrandProfile & {
  lead?: {
    businessName: string;
    category: string;
  } | null;
};

export class BrandRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findLeadById(leadId: string) {
    return this.prisma.qualifiedLead.findUnique({
      where: { id: leadId },
    });
  }

  async findByLeadId(leadId: string): Promise<BrandProfileResponse | null> {
    const record = await this.prisma.brandProfile.findUnique({
      where: { leadId },
      include: {
        lead: {
          select: {
            businessName: true,
            category: true,
          },
        },
      },
    });

    if (!record) {
      return null;
    }

    return this.mapToResponse(record);
  }

  async upsert(input: CreateBrandProfileInput): Promise<BrandProfileResponse> {
    const data = {
      logoUrl: input.logoUrl ?? null,
      heroImageUrl: input.heroImageUrl ?? null,
      galleryUrls: JSON.stringify(input.galleryUrls),
      primaryColor: input.palette.primaryColor,
      secondaryColor: input.palette.secondaryColor,
      backgroundColor: input.palette.backgroundColor,
      textColor: input.palette.textColor,
      paletteSource: input.palette.paletteSource,
      headline: input.content.headline,
      subheadline: input.content.subheadline,
      aboutText: input.content.aboutText,
      keyServices: JSON.stringify(input.content.keyServices),
      callToAction: input.content.callToAction,
      testimonials: JSON.stringify(input.testimonials),
      status: input.status ?? 'COMPLETED',
      errorMessage: input.errorMessage ?? null,
    };

    const record = await this.prisma.brandProfile.upsert({
      where: { leadId: input.leadId },
      create: {
        leadId: input.leadId,
        ...data,
      },
      update: data,
      include: {
        lead: {
          select: {
            businessName: true,
            category: true,
          },
        },
      },
    });

    return this.mapToResponse(record);
  }

  private mapToResponse(record: BrandProfileWithLead): BrandProfileResponse {
    let galleryUrls: string[] = [];
    let keyServices: string[] = [];
    let testimonials: TestimonialItem[] = [];

    try {
      galleryUrls = JSON.parse(record.galleryUrls || '[]');
    } catch {
      galleryUrls = [];
    }

    try {
      keyServices = JSON.parse(record.keyServices || '[]');
    } catch {
      keyServices = [];
    }

    try {
      testimonials = JSON.parse(record.testimonials || '[]');
    } catch {
      testimonials = [];
    }

    return {
      id: record.id,
      leadId: record.leadId,
      businessName: record.lead?.businessName ?? 'Empresa Local',
      category: record.lead?.category ?? 'Serviços',
      logoUrl: record.logoUrl,
      heroImageUrl: record.heroImageUrl,
      galleryUrls,
      palette: {
        primaryColor: record.primaryColor,
        secondaryColor: record.secondaryColor,
        backgroundColor: record.backgroundColor,
        textColor: record.textColor,
        paletteSource: record.paletteSource as 'EXTRACTED' | 'FALLBACK_NICHE',
      },
      content: {
        headline: record.headline,
        subheadline: record.subheadline,
        aboutText: record.aboutText,
        keyServices,
        callToAction: record.callToAction,
      },
      testimonials,
      status: record.status as 'COMPLETED' | 'FAILED',
      createdAt:
        record.createdAt instanceof Date
          ? record.createdAt.toISOString()
          : String(record.createdAt),
      updatedAt:
        record.updatedAt instanceof Date
          ? record.updatedAt.toISOString()
          : String(record.updatedAt),
    };
  }
}
