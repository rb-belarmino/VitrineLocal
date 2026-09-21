import { describe, it, expect } from 'vitest';
import {
  parseInstagramPublicImage,
  SocialImageExtractor,
} from '../adapters/social-image-extractor';

describe('SocialImageExtractor (Unit)', () => {
  it('deve extrair og:image de metatags públicas de uma página de rede social', () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:image" content="https://instagram.example.com/avatar.jpg" />
        </head>
        <body></body>
      </html>
    `;

    const img = parseInstagramPublicImage(mockHtml);
    expect(img).toBe('https://instagram.example.com/avatar.jpg');
  });

  it('deve retornar null se a página não contiver og:image público', () => {
    const emptyHtml = '<html><head></head><body>Login required</body></html>';
    const img = parseInstagramPublicImage(emptyHtml);
    expect(img).toBeNull();
  });

  it('deve extrair imagens com segurança e retornar lista vazia se url social for inválida', async () => {
    const extractor = new SocialImageExtractor();
    const result = await extractor.extractFromSocial('invalid-url');
    expect(result).toEqual([]);
  });
});
