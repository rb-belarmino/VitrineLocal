import { PrismaClient } from '@prisma/client';
import { QualifiedLead, SearchParams } from '../schemas/radar.schemas';

export interface LeadFilters {
  niche?: string;
  location?: string;
  minScore?: number;
  status?: 'QUALIFIED' | 'DISQUALIFIED';
}

export interface ILeadRepository {
  createSearchJob(params: SearchParams): Promise<{ id: string }>;
  updateSearchJobStatus(jobId: string, status: 'RUNNING' | 'COMPLETED' | 'FAILED', errorMessage?: string): Promise<void>;
  updateSearchJobMetrics(jobId: string, totalFound: number, totalQualified: number, totalDisqualified: number): Promise<void>;
  saveLead(lead: QualifiedLead, searchJobId?: string): Promise<void>;
  getLeadByMapsUrl(mapsUrl: string): Promise<QualifiedLead | null>;
  getQualifiedLeads(filters?: LeadFilters): Promise<QualifiedLead[]>;
  getJobById(jobId: string): Promise<{
    id: string;
    niche: string;
    location: string;
    limitRequested: number;
    status: string;
    totalFound: number;
    totalQualified: number;
    totalDisqualified: number;
    errorMessage: string | null;
    startedAt: Date;
    finishedAt: Date | null;
    leads: QualifiedLead[];
  } | null>;
}

export class PrismaLeadRepository implements ILeadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async createSearchJob(params: SearchParams): Promise<{ id: string }> {
    const job = await this.prisma.searchJob.create({
      data: {
        niche: params.niche,
        location: params.location,
        limitRequested: params.limit,
        status: 'PENDING'
      },
      select: { id: true }
    });
    return { id: job.id };
  }

  public async updateSearchJobStatus(jobId: string, status: 'RUNNING' | 'COMPLETED' | 'FAILED', errorMessage?: string): Promise<void> {
    await this.prisma.searchJob.update({
      where: { id: jobId },
      data: {
        status,
        errorMessage: errorMessage ?? null,
        finishedAt: status === 'COMPLETED' || status === 'FAILED' ? new Date() : null
      }
    });
  }

  public async updateSearchJobMetrics(jobId: string, totalFound: number, totalQualified: number, totalDisqualified: number): Promise<void> {
    await this.prisma.searchJob.update({
      where: { id: jobId },
      data: {
        totalFound,
        totalQualified,
        totalDisqualified
      }
    });
  }

  public async saveLead(lead: QualifiedLead, searchJobId?: string): Promise<void> {
    await this.prisma.qualifiedLead.upsert({
      where: { mapsUrl: lead.mapsUrl },
      create: {
        id: lead.id,
        businessName: lead.businessName,
        category: lead.category,
        address: lead.address,
        phoneRaw: lead.phoneRaw,
        phoneNormalized: lead.phoneNormalized,
        isMobile: lead.isMobile,
        websiteRaw: lead.websiteRaw,
        websiteType: lead.websiteType,
        socialLinks: JSON.stringify(lead.socialLinks),
        rating: lead.rating,
        reviewCount: lead.reviewCount,
        qualificationScore: lead.qualificationScore,
        status: lead.status,
        disqualificationReason: lead.disqualificationReason ?? null,
        mapsUrl: lead.mapsUrl,
        searchJobId: searchJobId ?? lead.searchJobId ?? null
      },
      update: {
        businessName: lead.businessName,
        rating: lead.rating,
        reviewCount: lead.reviewCount,
        qualificationScore: lead.qualificationScore,
        status: lead.status,
        disqualificationReason: lead.disqualificationReason ?? null,
        phoneNormalized: lead.phoneNormalized,
        isMobile: lead.isMobile,
        websiteRaw: lead.websiteRaw,
        websiteType: lead.websiteType
      }
    });
  }

  public async getLeadByMapsUrl(mapsUrl: string): Promise<QualifiedLead | null> {
    const record = await this.prisma.qualifiedLead.findUnique({
      where: { mapsUrl }
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  public async getQualifiedLeads(filters?: LeadFilters): Promise<QualifiedLead[]> {
    const records = await this.prisma.qualifiedLead.findMany({
      where: {
        status: filters?.status ?? 'QUALIFIED',
        ...(filters?.niche ? { category: { contains: filters.niche } } : {}),
        ...(filters?.location ? { address: { contains: filters.location } } : {}),
        ...(filters?.minScore !== undefined ? { qualificationScore: { gte: filters.minScore } } : {})
      },
      orderBy: { qualificationScore: 'desc' }
    });

    return records.map(r => this.mapToDomain(r));
  }

  public async getJobById(jobId: string) {
    const job = await this.prisma.searchJob.findUnique({
      where: { id: jobId },
      include: {
        leads: true
      }
    });

    if (!job) return null;

    return {
      id: job.id,
      niche: job.niche,
      location: job.location,
      limitRequested: job.limitRequested,
      status: job.status,
      totalFound: job.totalFound,
      totalQualified: job.totalQualified,
      totalDisqualified: job.totalDisqualified,
      errorMessage: job.errorMessage,
      startedAt: job.startedAt,
      finishedAt: job.finishedAt,
      leads: job.leads.map(l => this.mapToDomain(l))
    };
  }

  private mapToDomain(record: {
    id: string;
    businessName: string;
    category: string;
    address: string | null;
    phoneRaw: string | null;
    phoneNormalized: string | null;
    isMobile: boolean;
    websiteRaw: string | null;
    websiteType: string;
    socialLinks: string;
    rating: number;
    reviewCount: number;
    qualificationScore: number;
    status: string;
    disqualificationReason: string | null;
    mapsUrl: string;
    searchJobId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): QualifiedLead {
    let socialLinks: string[] = [];
    try {
      socialLinks = JSON.parse(record.socialLinks);
    } catch {
      socialLinks = [];
    }

    return {
      id: record.id,
      businessName: record.businessName,
      category: record.category,
      address: record.address,
      phoneRaw: record.phoneRaw,
      phoneNormalized: record.phoneNormalized,
      isMobile: record.isMobile,
      websiteRaw: record.websiteRaw,
      websiteType: record.websiteType as 'NO_WEBSITE' | 'SOCIAL_ONLY' | 'OWN_WEBSITE',
      socialLinks,
      rating: record.rating,
      reviewCount: record.reviewCount,
      qualificationScore: record.qualificationScore,
      status: record.status as 'QUALIFIED' | 'DISQUALIFIED',
      disqualificationReason: record.disqualificationReason ?? undefined,
      mapsUrl: record.mapsUrl,
      searchJobId: record.searchJobId ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }
}
