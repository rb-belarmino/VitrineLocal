/**
 * Utilitário determinístico para geração de slugs limpos, amigáveis e sanitizados.
 */
export class SlugGenerator {
  private readonly maxLength: number;

  constructor(maxLength = 60) {
    this.maxLength = maxLength;
  }

  /**
   * Converte nome e endereço/bairro em slug amigável em kebab-case.
   */
  public generate(businessName: string, address?: string | null): string {
    const neighborhood = this.extractNeighborhood(address);
    const combined = neighborhood ? `${businessName} ${neighborhood}` : businessName;

    return this.slugify(combined);
  }

  /**
   * Adiciona sufixo numérico de desambiguação para evitar colisão no banco de dados.
   */
  public disambiguate(baseSlug: string, count: number): string {
    return `${baseSlug}-${count}`;
  }

  private slugify(text: string): string {
    const normalized = text
      .normalize('NFD') // Decompõe acentos
      .replace(/[\u0300-\u036f]/g, '') // Remove acentuações
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-') // Converte espaços em hífens
      .replace(/-+/g, '-'); // Remove hífens duplicados

    if (normalized.length <= this.maxLength) {
      return normalized;
    }

    // Truncar sem cortar no meio de palavra
    let truncated = normalized.substring(0, this.maxLength);
    const lastHyphen = truncated.lastIndexOf('-');
    if (lastHyphen > 20) {
      truncated = truncated.substring(0, lastHyphen);
    }
    return truncated.replace(/-+$/, '');
  }

  private extractNeighborhood(address?: string | null): string | null {
    if (!address) return null;

    const trimmed = address.trim();

    // 1. Tenta formato padrão: "Logradouro, Nº - Bairro, Cidade - UF"
    const hyphenParts = trimmed.split('-').map((p) => p.trim());
    const middleHyphen = hyphenParts[1];
    if (hyphenParts.length >= 3 && middleHyphen) {
      // Pega o miolo (Bairro, Cidade)
      const firstSegment = middleHyphen.split(',')[0];
      const neighborhoodCandidate = firstSegment ? firstSegment.trim() : null;
      if (neighborhoodCandidate) return neighborhoodCandidate;
    }

    // 2. Tenta formato curto: "Bairro, Cidade - UF" ou "Bairro, Cidade"
    const commaParts = trimmed.split(',').map((p) => p.trim());
    const firstPart = commaParts[0];
    if (commaParts.length >= 2 && firstPart) {
      // Se não for logradouro com número
      if (!/\d+/.test(firstPart) && !/^(rua|av|alameda|travessa|rodovia)\b/i.test(firstPart)) {
        return firstPart;
      }
    }

    // 3. Fallback: se não tiver vírgula nem hífen estruturado
    if (commaParts.length > 0 && firstPart) {
      const words = firstPart.split(/\s+/);
      const lastWord = words[words.length - 1];
      if (words.length <= 2 && lastWord && !/\d+/.test(lastWord)) {
        return firstPart;
      }
    }

    return null;
  }
}
