import { describe, it, expect } from 'vitest';
import { LeadScorer } from '../core/lead-scorer';

describe('LeadScorer (Score Comercial & Qualificação)', () => {
  it('deve calcular pontuação máxima (100) para lead sem site com 4.9 estrelas e 120 reviews', () => {
    const result = LeadScorer.evaluate({
      websiteType: 'NO_WEBSITE',
      rating: 4.9,
      reviewCount: 120,
    });

    expect(result.score).toBe(100);
    expect(result.isQualified).toBe(true);
    expect(result.status).toBe('QUALIFIED');
    expect(result.disqualificationReason).toBeUndefined();
  });

  it('deve pontuar lead com apenas rede social, 4.2 estrelas e 25 reviews', () => {
    // 30 (social) + 20 (rating >= 4.0) + 20 (reviews >= 20) = 70
    const result = LeadScorer.evaluate({
      websiteType: 'SOCIAL_ONLY',
      rating: 4.2,
      reviewCount: 25,
    });

    expect(result.score).toBe(70);
    expect(result.isQualified).toBe(true);
    expect(result.status).toBe('QUALIFIED');
  });

  it('deve desqualificar lead com nota abaixo de 4.0', () => {
    const result = LeadScorer.evaluate({
      websiteType: 'NO_WEBSITE',
      rating: 3.8,
      reviewCount: 50,
    });

    expect(result.isQualified).toBe(false);
    expect(result.status).toBe('DISQUALIFIED');
    expect(result.disqualificationReason).toBe('LOW_RATING');
  });

  it('deve desqualificar lead com menos de 5 avaliações', () => {
    const result = LeadScorer.evaluate({
      websiteType: 'NO_WEBSITE',
      rating: 5.0,
      reviewCount: 3,
    });

    expect(result.isQualified).toBe(false);
    expect(result.status).toBe('DISQUALIFIED');
    expect(result.disqualificationReason).toBe('LOW_REVIEWS');
  });

  it('deve desqualificar lead que possui site próprio independente de nota', () => {
    const result = LeadScorer.evaluate({
      websiteType: 'OWN_WEBSITE',
      rating: 5.0,
      reviewCount: 200,
    });

    expect(result.isQualified).toBe(false);
    expect(result.status).toBe('DISQUALIFIED');
    expect(result.disqualificationReason).toBe('HAS_WEBSITE');
  });
});
