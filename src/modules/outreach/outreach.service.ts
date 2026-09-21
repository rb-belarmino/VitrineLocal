import { PrismaClient } from '@prisma/client';
import { IOutreachService } from './outreach.types';
import { OutreachMessageResponse, LeadStatusUpdate } from './schemas/outreach.schemas';
import { GeminiOutreachAdapter } from './core/gemini-outreach-adapter';
import { CopyGenerator } from './core/copy-generator';
import { NotFoundError } from '../../shared/errors/app-error';

export class OutreachService implements IOutreachService {
  private readonly baseUrl: string;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly geminiAdapter: GeminiOutreachAdapter = new GeminiOutreachAdapter(),
    private readonly copyGenerator: CopyGenerator = new CopyGenerator(),
    baseUrl?: string,
  ) {
    this.baseUrl = baseUrl || process.env['BASE_URL'] || 'http://localhost:3001';
  }

  public async generateMessage(leadId: string): Promise<OutreachMessageResponse> {
    const lead = await this.prisma.qualifiedLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundError(`Lead não encontrado com o ID "${leadId}".`);
    }

    const previewSlug = lead.slug || lead.id;
    const previewUrl = `${this.baseUrl}/preview/${previewSlug}`;

    const generated = await this.geminiAdapter.generate({
      businessName: lead.businessName,
      category: lead.category,
      rating: lead.rating,
      reviewCount: lead.reviewCount,
      previewUrl,
      phoneNormalized: lead.phoneNormalized,
      isMobile: lead.isMobile,
    });

    const whatsappDispatchLink = this.copyGenerator.buildWhatsappLink(
      lead.phoneNormalized,
      generated.messageText,
    );

    await this.prisma.qualifiedLead.update({
      where: { id: lead.id },
      data: {
        outreachCopy: generated.messageText,
      },
    });

    return {
      leadId: lead.id,
      businessName: lead.businessName,
      phoneNormalized: lead.phoneNormalized,
      isMobile: lead.isMobile,
      previewUrl,
      messageText: generated.messageText,
      whatsappDispatchLink,
      generatedVia: generated.generatedVia,
    };
  }

  public async updateLeadStatus(leadId: string, update: LeadStatusUpdate): Promise<void> {
    const lead = await this.prisma.qualifiedLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundError(`Lead não encontrado com o ID "${leadId}".`);
    }

    const dataToUpdate: {
      status: string;
      outreachCopy?: string;
      contactedAt?: Date;
    } = {
      status: update.status,
    };

    if (update.outreachCopy) {
      dataToUpdate.outreachCopy = update.outreachCopy;
    }

    if (update.status === 'CONTACTED' && !lead.contactedAt) {
      dataToUpdate.contactedAt = new Date();
    }

    await this.prisma.qualifiedLead.update({
      where: { id: leadId },
      data: dataToUpdate,
    });
  }

  public async getPortalStats(): Promise<{
    totalMined: number;
    totalQualified: number;
    totalPreviewsReady: number;
    totalContacted: number;
    totalConverted: number;
  }> {
    const [totalMined, totalQualified, totalPreviewsReady, totalContacted, totalConverted] =
      await Promise.all([
        this.prisma.qualifiedLead.count(),
        this.prisma.qualifiedLead.count({
          where: { status: 'QUALIFIED' },
        }),
        this.prisma.qualifiedLead.count({
          where: {
            brandProfile: {
              isNot: null,
            },
          },
        }),
        this.prisma.qualifiedLead.count({
          where: {
            status: { in: ['CONTACTED', 'NEGOTIATING'] },
          },
        }),
        this.prisma.qualifiedLead.count({
          where: { status: 'CONVERTED' },
        }),
      ]);

    return {
      totalMined,
      totalQualified,
      totalPreviewsReady,
      totalContacted,
      totalConverted,
    };
  }
}
