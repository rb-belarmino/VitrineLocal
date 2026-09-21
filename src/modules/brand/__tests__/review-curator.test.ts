import { describe, it, expect } from 'vitest';
import { curateTopReviews } from '../core/review-curator';
import { RawReview } from '../brand.types';

describe('ReviewCurator (Unit)', () => {
  it('deve descartar avaliações com nota menor que 5 estrelas', () => {
    const reviews: RawReview[] = [
      {
        authorName: 'Cliente Ruim',
        rating: 2,
        relativeTime: 'há 1 mês',
        text: 'Não gostei do serviço prestado.',
      },
      {
        authorName: 'Cliente Mediano',
        rating: 3,
        relativeTime: 'há 2 meses',
        text: 'Serviço mediano, nada de especial.',
      },
      {
        authorName: 'Cliente Bom',
        rating: 5,
        relativeTime: 'há 3 dias',
        text: 'Serviço espetacular e muito atencioso!',
      },
    ];

    const curated = curateTopReviews(reviews);

    expect(curated).toHaveLength(1);
    expect(curated[0]?.authorName).toBe('Cliente Bom');
    expect(curated[0]?.rating).toBe(5);
  });

  it('deve descartar avaliações vazias ou com menos de 10 caracteres', () => {
    const reviews: RawReview[] = [
      {
        authorName: 'Sem Texto',
        rating: 5,
        relativeTime: 'ontem',
        text: '',
      },
      {
        authorName: 'Muito Curto',
        rating: 5,
        relativeTime: 'ontem',
        text: 'Top!',
      },
      {
        authorName: 'Texto Rico',
        rating: 5,
        relativeTime: 'ontem',
        text: 'Profissionais altamente capacitados, preço justo e entrega no prazo.',
      },
    ];

    const curated = curateTopReviews(reviews);

    expect(curated).toHaveLength(1);
    expect(curated[0]?.authorName).toBe('Texto Rico');
  });

  it('deve ordenar avaliações pela extensão e riqueza de texto decrescente e limitar ao máximo de 5', () => {
    const reviews: RawReview[] = [
      {
        authorName: 'Curto 1',
        rating: 5,
        relativeTime: 'há 1 semana',
        text: 'Atendimento muito bom, recomendo a todos.',
      },
      {
        authorName: 'Longo Campeão',
        rating: 5,
        relativeTime: 'há 2 semanas',
        text: 'Melhor oficina da região! Meu carro estava com vazamento complexo no radiador e ninguém encontrava a causa. A equipe diagnosticou em 1 hora e o conserto ficou perfeito com valor honesto.',
      },
      {
        authorName: 'Médio',
        rating: 5,
        relativeTime: 'há 3 semanas',
        text: 'Gostei bastante da rapidez e do cuidado com o veículo.',
      },
      {
        authorName: 'Extra 1',
        rating: 5,
        relativeTime: 'há 1 mês',
        text: 'Sempre levo meu carro lá e nunca tive problemas.',
      },
      {
        authorName: 'Extra 2',
        rating: 5,
        relativeTime: 'há 2 meses',
        text: 'Ambiente agradável e café excelente enquanto espera.',
      },
      {
        authorName: 'Extra 3',
        rating: 5,
        relativeTime: 'há 3 meses',
        text: 'Mecânicos muito experientes e honestos.',
      },
    ];

    const curated = curateTopReviews(reviews, 5);

    expect(curated).toHaveLength(5);
    expect(curated[0]?.authorName).toBe('Longo Campeão');
    expect(curated[0]?.text.length).toBeGreaterThan(curated[1]?.text.length ?? 0);
  });

  it('deve retornar lista vazia de forma segura se array for vazio', () => {
    expect(curateTopReviews([])).toEqual([]);
  });
});
