import { WebsiteClassification } from '../schemas/radar.schemas';

export interface ClassificationResult {
  type: WebsiteClassification;
  isQualified: boolean;
  socialLinks: string[];
  disqualificationReason?: string;
}

export class WebsiteClassifier {
  private static readonly SOCIAL_DOMAINS = [
    'instagram.com',
    'instagr.am',
    'facebook.com',
    'fb.com',
    'fb.me',
    'linktr.ee',
    'wa.me',
    'whatsapp.com',
    'tiktok.com',
    'youtube.com',
    'beacons.ai',
    'bio.link',
    'ifood.com.br',
    'cardapio.digital',
    'ola.click'
  ];

  /**
   * Classifica a URL do estabelecimento.
   */
  public static classify(rawUrl: string | null | undefined): ClassificationResult {
    if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '' || rawUrl.trim() === 'about:blank') {
      return {
        type: 'NO_WEBSITE',
        isQualified: true,
        socialLinks: []
      };
    }

    const trimmed = rawUrl.trim();
    let parsedUrl: URL;

    try {
      const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://') 
        ? trimmed 
        : `https://${trimmed}`;
      parsedUrl = new URL(withProtocol);
    } catch {
      // Se não for possível parsear como URL válida, trata como sem website
      return {
        type: 'NO_WEBSITE',
        isQualified: true,
        socialLinks: []
      };
    }

    const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, '');

    const isSocial = this.SOCIAL_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (isSocial) {
      return {
        type: 'SOCIAL_ONLY',
        isQualified: true,
        socialLinks: [trimmed]
      };
    }

    return {
      type: 'OWN_WEBSITE',
      isQualified: false,
      socialLinks: [],
      disqualificationReason: 'HAS_WEBSITE'
    };
  }
}
