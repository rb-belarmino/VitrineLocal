import { PrismaClient, QualifiedLead, BrandProfile } from '@prisma/client';

export interface LeadWithProfile {
  lead: QualifiedLead;
  profile: BrandProfile | null;
}

export class SiteEngineRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findById(id: string): Promise<LeadWithProfile | null> {
    const record = await this.prisma.qualifiedLead.findUnique({
      where: { id },
      include: { brandProfile: true },
    });

    if (!record) return null;

    const { brandProfile, ...lead } = record;
    return {
      lead: lead as QualifiedLead,
      profile: brandProfile,
    };
  }

  public async findBySlug(slug: string): Promise<LeadWithProfile | null> {
    const record = await this.prisma.qualifiedLead.findUnique({
      where: { slug },
      include: { brandProfile: true },
    });

    if (!record) return null;

    const { brandProfile, ...lead } = record;
    return {
      lead: lead as QualifiedLead,
      profile: brandProfile,
    };
  }

  public async findByIdOrSlug(identifier: string): Promise<LeadWithProfile | null> {
    // Tenta primeiro por ID (se tiver formato UUID ou correspondência direta)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

    if (isUuid) {
      const byId = await this.findById(identifier);
      if (byId) return byId;
    }

    // Tenta por slug
    const bySlug = await this.findBySlug(identifier);
    if (bySlug) return bySlug;

    // Fallback: se não for UUID mas for ID não-padrão
    return this.findById(identifier);
  }

  public async updateSlug(leadId: string, slug: string): Promise<void> {
    await this.prisma.qualifiedLead.update({
      where: { id: leadId },
      data: { slug },
    });
  }

  public async isSlugAvailable(slug: string, excludeLeadId?: string): Promise<boolean> {
    const existing = await this.prisma.qualifiedLead.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) return true;
    if (excludeLeadId && existing.id === excludeLeadId) return true;

    return false;
  }
}
