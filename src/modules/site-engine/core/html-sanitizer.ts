/**
 * Utilitário para prevenção estrita de Cross-Site Scripting (XSS)
 * mediante escapamento de entidades HTML e higienização de URLs.
 */
export class HtmlSanitizer {
  private static readonly ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  /**
   * Escapa caracteres perigosos em strings para renderização segura em HTML.
   */
  public static escape(text: string): string {
    if (!text) return '';
    return text.replace(/[&<>"']/g, (char) => HtmlSanitizer.ESCAPE_MAP[char] || char);
  }

  public escape(text: string): string {
    return HtmlSanitizer.escape(text);
  }

  /**
   * Higieniza URLs garantindo que esquemas perigosos (javascript:, data:, vbscript:) sejam bloqueados.
   */
  public static sanitizeUrl(url?: string | null): string {
    if (!url) return '#';
    const trimmed = url.trim();

    // Rejeitar explicitamente esquemas perigosos
    if (/^(javascript|data|vbscript):/i.test(trimmed)) {
      return '#';
    }

    // Permitir https, http, tel, mailto e relativos seguros
    if (/^(https?:\/\/|tel:|mailto:|\/)/i.test(trimmed)) {
      return trimmed;
    }

    return '#';
  }

  public sanitizeUrl(url?: string | null): string {
    return HtmlSanitizer.sanitizeUrl(url);
  }

  /**
   * Percorre objetos e arrays recursivamente higienizando strings.
   */
  public static sanitizeObject<T>(data: T): T {
    if (typeof data === 'string') {
      return HtmlSanitizer.escape(data) as unknown as T;
    }
    if (Array.isArray(data)) {
      return data.map((item) => HtmlSanitizer.sanitizeObject(item)) as unknown as T;
    }
    if (data !== null && typeof data === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = HtmlSanitizer.sanitizeObject(value);
      }
      return result as unknown as T;
    }
    return data;
  }

  public sanitizeObject<T>(data: T): T {
    return HtmlSanitizer.sanitizeObject(data);
  }
}
