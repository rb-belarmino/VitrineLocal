import { RawReview, TestimonialItem } from '../brand.types';

/**
 * Filtra e ranqueia as melhores avaliações do perfil:
 * - Filtra nota 5 estrelas
 * - Descarta comentários sem texto ou com menos de 10 caracteres
 * - Ordena por maior extensão e detalhamento de texto descritivo
 * - Retorna até maxReviews (padrão: 5)
 */
export function curateTopReviews(reviews: RawReview[], maxReviews = 5): TestimonialItem[] {
  if (!reviews || reviews.length === 0) {
    return [];
  }

  const valid5Star = reviews.filter((r) => {
    return r.rating >= 5 && typeof r.text === 'string' && r.text.trim().length >= 10;
  });

  // Ordena por comprimento decrescente do texto
  const sorted = valid5Star.sort((a, b) => b.text.trim().length - a.text.trim().length);

  // Limita a maxReviews
  return sorted.slice(0, maxReviews).map((r) => {
    const item: TestimonialItem = {
      authorName: r.authorName || 'Cliente Google',
      rating: 5,
      relativeTime: r.relativeTime || 'recente',
      text: r.text.trim(),
    };
    if (r.authorPhotoUrl) {
      item.authorPhotoUrl = r.authorPhotoUrl;
    }
    return item;
  });
}
