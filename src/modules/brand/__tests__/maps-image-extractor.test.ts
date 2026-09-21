import { describe, it, expect } from 'vitest';
import { parseVisualsFromHtml, upgradeGooglePhotoUrl } from '../adapters/maps-image-extractor';

describe('MapsImageExtractor (Unit)', () => {
  describe('upgradeGooglePhotoUrl', () => {
    it('deve converter URLs com parâmetros de miniatura para resolução alta (w1200-h800)', () => {
      const thumbUrl = 'https://lh5.googleusercontent.com/p/AF1QipNz9=w100-h100-k-no';
      const upgraded = upgradeGooglePhotoUrl(thumbUrl);

      expect(upgraded).toBe('https://lh5.googleusercontent.com/p/AF1QipNz9=w1200-h800-k-no');
    });

    it('deve converter URLs com parâmetro =s... para =s1600', () => {
      const thumbUrl = 'https://lh3.googleusercontent.com/gps-proxy/AF1QipM=s120';
      const upgraded = upgradeGooglePhotoUrl(thumbUrl);

      expect(upgraded).toBe('https://lh3.googleusercontent.com/gps-proxy/AF1QipM=s1600');
    });

    it('deve manter URLs sem dimensões do Google inalteradas', () => {
      const plainUrl = 'https://example.com/logo.png';
      expect(upgradeGooglePhotoUrl(plainUrl)).toBe(plainUrl);
    });
  });

  describe('parseVisualsFromHtml', () => {
    it('deve extrair logo, hero image e galeria a partir do HTML do perfil do Maps', () => {
      const mockHtml = `
        <html>
          <body>
            <div class="header">
              <img src="https://lh5.googleusercontent.com/p/AF1QipHero=w400-h300-k-no" alt="Foto de Capa">
              <button aria-label="Ver fotos">
                <img src="https://lh5.googleusercontent.com/p/AF1QipPhoto1=w100-h100-k-no" alt="Ambiente">
                <img src="https://lh5.googleusercontent.com/p/AF1QipPhoto2=w100-h100-k-no" alt="Fachada">
                <img src="https://lh5.googleusercontent.com/p/AF1QipPhoto3=w100-h100-k-no" alt="Equipe">
              </button>
            </div>
          </body>
        </html>
      `;

      const visuals = parseVisualsFromHtml(mockHtml);

      expect(visuals.heroImageUrl).toBe('https://lh5.googleusercontent.com/p/AF1QipHero=w1200-h800-k-no');
      expect(visuals.logoUrl).toBe('https://lh5.googleusercontent.com/p/AF1QipHero=w1200-h800-k-no');
      expect(visuals.galleryUrls.length).toBeGreaterThan(0);
      expect(visuals.galleryUrls).toContain('https://lh5.googleusercontent.com/p/AF1QipPhoto1=w1200-h800-k-no');
    });

    it('deve retornar campos nulos e galeria vazia caso não haja fotos do Google no HTML', () => {
      const emptyHtml = '<html><body><div>Sem fotos</div></body></html>';
      const visuals = parseVisualsFromHtml(emptyHtml);

      expect(visuals.heroImageUrl).toBeNull();
      expect(visuals.logoUrl).toBeNull();
      expect(visuals.galleryUrls).toEqual([]);
    });
  });
});
