import { describe, it, expect } from 'vitest';
import { HtmlSanitizer } from '../core/html-sanitizer';

describe('HtmlSanitizer (Unit)', () => {
  const sanitizer = new HtmlSanitizer();

  it('deve escapar caracteres especiais HTML perigosos (&, <, >, ", \')', () => {
    const raw = '<script>alert("XSS & hack")</script>\'';
    const escaped = sanitizer.escape(raw);
    expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS &amp; hack&quot;)&lt;/script&gt;&#39;');
  });

  it('deve manter texto seguro inalterado', () => {
    const safeText = 'Atendimento humanizado de segunda a sexta das 08h às 18h.';
    expect(sanitizer.escape(safeText)).toBe(safeText);
  });

  it('deve sanitizar objetos ou arrays recursivamente se fornecidos', () => {
    const data = {
      title: '<img src=x onerror=alert(1)>',
      items: ['<b>Item 1</b>', 'Texto limpo'],
      nested: {
        description: 'Promoção: 50% de desconto & brinde!',
      },
    };

    const sanitized = sanitizer.sanitizeObject(data);

    expect(sanitized.title).toBe('&lt;img src=x onerror=alert(1)&gt;');
    expect(sanitized.items[0]).toBe('&lt;b&gt;Item 1&lt;/b&gt;');
    expect(sanitized.items[1]).toBe('Texto limpo');
    expect(sanitized.nested.description).toBe('Promoção: 50% de desconto &amp; brinde!');
  });

  it('deve validar e higienizar links para prevenir javascript: e data: URIs maliciosas', () => {
    expect(sanitizer.sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizer.sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    expect(sanitizer.sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
    expect(sanitizer.sanitizeUrl('https://wa.me/5511999999999')).toBe(
      'https://wa.me/5511999999999',
    );
    expect(sanitizer.sanitizeUrl('http://maps.google.com')).toBe('http://maps.google.com');
    expect(sanitizer.sanitizeUrl('tel:+5511999999999')).toBe('tel:+5511999999999');
  });
});
