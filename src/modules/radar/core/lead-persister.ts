import { randomUUID } from 'crypto';
import { RawMapsLead, QualifiedLead } from '../schemas/radar.schemas';
import { WebsiteClassifier } from './website-classifier';
import { LeadScorer } from './lead-scorer';
import { PhoneNormalizer } from './phone-normalizer';
import { ILeadRepository } from '../repositories/lead.repository';

export class LeadPersister {
  constructor(private readonly repository: ILeadRepository) {}

  /**
   * Processa um RawMapsLead, aplica as regras de qualificação e persiste idempotentemente.
   */
  public async processAndSave(rawLead: RawMapsLead, searchJobId?: string): Promise<QualifiedLead> {
    // 1. Classificação de website
    const websiteResult = WebsiteClassifier.classify(rawLead.website);

    // 2. Avaliação de score comercial
    const scoreResult = LeadScorer.evaluate({
      websiteType: websiteResult.type,
      rating: rawLead.rating,
      reviewCount: rawLead.reviewCount
    });

    // 3. Normalização telefônica
    const normalizedPhone = PhoneNormalizer.normalize(rawLead.phone);

    // Determina status e motivo de descarte
    const status = scoreResult.status;
    const disqualificationReason = scoreResult.disqualificationReason ?? websiteResult.disqualificationReason;

    const qualifiedLead: QualifiedLead = {
      id: randomUUID(),
      businessName: rawLead.businessName,
      category: rawLead.category,
      address: rawLead.address ?? null,
      phoneRaw: rawLead.phone ?? null,
      phoneNormalized: normalizedPhone?.e164 ?? null,
      isMobile: normalizedPhone?.isMobile ?? false,
      websiteRaw: rawLead.website ?? null,
      websiteType: websiteResult.type,
      socialLinks: websiteResult.socialLinks,
      rating: rawLead.rating,
      reviewCount: rawLead.reviewCount,
      qualificationScore: scoreResult.score,
      status,
      disqualificationReason,
      mapsUrl: rawLead.mapsUrl,
      searchJobId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 4. Salva idempotentemente no repositório Prisma
    await this.repository.saveLead(qualifiedLead, searchJobId);

    return qualifiedLead;
  }
}
