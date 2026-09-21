import { WebsiteClassification, QualificationStatus } from '../schemas/radar.schemas';

export interface LeadScoreInput {
  websiteType: WebsiteClassification;
  rating: number;
  reviewCount: number;
}

export interface LeadScoreResult {
  score: number;
  isQualified: boolean;
  status: QualificationStatus;
  disqualificationReason?: string;
}

export class LeadScorer {
  /**
   * Avalia as métricas comerciais do lead e calcula o score de 0 a 100.
   */
  public static evaluate(input: LeadScoreInput): LeadScoreResult {
    const { websiteType, rating, reviewCount } = input;

    // Critério 1: Presença de site próprio desqualifica imediatamente
    if (websiteType === 'OWN_WEBSITE') {
      return {
        score: 0,
        isQualified: false,
        status: 'DISQUALIFIED',
        disqualificationReason: 'HAS_WEBSITE',
      };
    }

    // Critério 2: Avaliações mínimas (>= 5 reviews)
    if (reviewCount < 5) {
      return {
        score: 0,
        isQualified: false,
        status: 'DISQUALIFIED',
        disqualificationReason: 'LOW_REVIEWS',
      };
    }

    // Critério 3: Reputação mínima (rating >= 4.0)
    if (rating < 4.0) {
      return {
        score: 0,
        isQualified: false,
        status: 'DISQUALIFIED',
        disqualificationReason: 'LOW_RATING',
      };
    }

    let score = 0;

    // Pontos por ausência de site
    if (websiteType === 'NO_WEBSITE') {
      score += 40;
    } else if (websiteType === 'SOCIAL_ONLY') {
      score += 30;
    }

    // Pontos por reputação (estrelas)
    if (rating >= 4.5) {
      score += 30;
    } else if (rating >= 4.0) {
      score += 20;
    }

    // Pontos por volume de avaliações (tração comercial)
    if (reviewCount >= 50) {
      score += 30;
    } else if (reviewCount >= 20) {
      score += 20;
    } else if (reviewCount >= 5) {
      score += 10;
    }

    return {
      score,
      isQualified: true,
      status: 'QUALIFIED',
    };
  }
}
