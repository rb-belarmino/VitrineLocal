import { NicheTheme } from '../site-engine.types';

interface NicheRule {
  exactOrWordRegex?: RegExp[];
  keywords: string[];
  niche: NicheTheme;
}

/**
 * Detector semântico de nicho a partir do texto de categoria extraído do Google Maps.
 */
export class NicheDetector {
  private static readonly RULES: NicheRule[] = [
    {
      // Beleza antes de saúde para capturar "Clínica de estética" corretamente
      keywords: [
        'estética',
        'estetica',
        'salão',
        'salao',
        'barbearia',
        'cabelereir',
        'cabeleireir',
        'beleza',
        'manicure',
        'pedicure',
        'spa',
        'massagem',
        'massoterapia',
      ],
      niche: 'beleza',
    },
    {
      keywords: [
        'odonto',
        'dentist',
        'clínica',
        'clinica',
        'médic',
        'medic',
        'saúde',
        'saude',
        'fisioter',
        'hospital',
        'psicol',
        'terapia',
      ],
      niche: 'saude',
    },
    {
      keywords: [
        'oficina',
        'mecânic',
        'mecanic',
        'auto',
        'pneu',
        'funilaria',
        'moto',
        'veículo',
        'veiculo',
        'troca de óleo',
        'troca de oleo',
      ],
      niche: 'automotivo',
    },
    {
      keywords: [
        'restaurante',
        'pizzaria',
        'hambúrguer',
        'hamburguer',
        'café',
        'cafe',
        'padaria',
        'comida',
        'gastronom',
        'bistrô',
        'bistro',
        'lanchonete',
      ],
      exactOrWordRegex: [/\bbar\b/i, /\bbars\b/i],
      niche: 'gastronomia',
    },
  ];

  /**
   * Mapeia categoria para NicheTheme. Se nenhuma regra bater, retorna 'geral' (fallback).
   */
  public detect(category?: string | null): NicheTheme {
    if (!category) return 'geral';

    const normalized = category.toLowerCase().trim();

    for (const rule of NicheDetector.RULES) {
      if (rule.keywords.some((kw) => normalized.includes(kw))) {
        return rule.niche;
      }
      if (rule.exactOrWordRegex?.some((re) => re.test(normalized))) {
        return rule.niche;
      }
    }

    return 'geral';
  }
}
