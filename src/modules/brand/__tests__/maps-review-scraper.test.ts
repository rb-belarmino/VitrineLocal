import { describe, it, expect } from 'vitest';
import { parseReviewsFromHtml } from '../adapters/maps-review-scraper';

describe('MapsReviewScraper (Unit)', () => {
  it('deve extrair avaliações brutas a partir do HTML com seletores do Google Maps', () => {
    const mockHtml = `
      <html>
        <body>
          <div class="jftiEf" data-review-id="rev1">
            <div class="d4r55">Carlos Eduardo</div>
            <span class="kvMYJc" role="img" aria-label="5 estrelas"></span>
            <span class="rsqaWe">há 2 semanas</span>
            <div class="MyEned"><span class="wiI7Bm">Excelente atendimento e serviço de alta qualidade!</span></div>
            <img class="N3EgBe" src="https://lh3.googleusercontent.com/a-/photo.jpg" />
          </div>
          <div class="jftiEf" data-review-id="rev2">
            <div class="d4r55">Ana Paula</div>
            <span class="kvMYJc" role="img" aria-label="4 estrelas"></span>
            <span class="rsqaWe">há 1 mês</span>
            <div class="MyEned"><span class="wiI7Bm">Bom lugar, recomendo.</span></div>
          </div>
        </body>
      </html>
    `;

    const reviews = parseReviewsFromHtml(mockHtml);

    expect(reviews).toHaveLength(2);
    expect(reviews[0]?.authorName).toBe('Carlos Eduardo');
    expect(reviews[0]?.rating).toBe(5);
    expect(reviews[0]?.relativeTime).toBe('há 2 semanas');
    expect(reviews[0]?.text).toBe('Excelente atendimento e serviço de alta qualidade!');
    expect(reviews[0]?.authorPhotoUrl).toBe('https://lh3.googleusercontent.com/a-/photo.jpg');

    expect(reviews[1]?.authorName).toBe('Ana Paula');
    expect(reviews[1]?.rating).toBe(4);
  });

  it('deve retornar lista vazia de forma segura se o HTML não contiver blocos de avaliações', () => {
    const emptyHtml = '<html><body><div>Nenhum comentário encontrado</div></body></html>';
    const reviews = parseReviewsFromHtml(emptyHtml);
    expect(reviews).toEqual([]);
  });
});
