import { describe, it, expect, vi } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import {
  generateFallbackContent,
  GeminiSynthesizer
} from '../adapters/gemini-synthesizer';
import { SemanticContentSchema } from '../schemas/brand.schemas';

describe('GeminiSynthesizer (Unit)', () => {
  describe('generateFallbackContent', () => {
    it('deve gerar conteúdo semântico completo e válido no schema Zod', () => {
      const content = generateFallbackContent('Auto Mecânica Silva', 'Oficina Mecânica');

      const parseResult = SemanticContentSchema.safeParse(content);
      expect(parseResult.success).toBe(true);

      expect(content.headline).toContain('Auto Mecânica Silva');
      expect(content.aboutText.length).toBeGreaterThan(20);
      expect(content.keyServices.length).toBeGreaterThanOrEqual(3);
      expect(content.callToAction).toContain('WhatsApp');
    });

    it('deve incorporar referências a elogios quando houver depoimentos disponíveis', () => {
      const testimonials = [
        {
          authorName: 'Carlos',
          rating: 5,
          relativeTime: 'há 1 semana',
          text: 'Fizeram a troca de correia dentada perfeitamente.'
        }
      ];

      const content = generateFallbackContent('Oficina Moema', 'Oficina Mecânica', testimonials);

      expect(content.subheadline).toBeDefined();
      expect(content.aboutText).toContain('avaliações 5 estrelas');
    });
  });

  describe('synthesize with Google GenAI', () => {
    it('deve acionar fallback imediatamente se GEMINI_API_KEY não estiver definida', async () => {
      const originalKey = process.env['GEMINI_API_KEY'];
      delete process.env['GEMINI_API_KEY'];

      const synthesizer = new GeminiSynthesizer();
      const content = await synthesizer.synthesize('Clínica Sorriso', 'Dentista', []);

      expect(content.headline).toContain('Clínica Sorriso');
      expect(content.keyServices.length).toBeGreaterThan(0);

      process.env['GEMINI_API_KEY'] = originalKey;
    });

    it('deve acionar fallback resiliente se o SDK do Gemini falhar com erro de rede ou cota', async () => {
      process.env['GEMINI_API_KEY'] = 'fake-key';

      const mockClient = {
        models: {
          generateContent: vi.fn().mockRejectedValue(new Error('Quota exceeded 429'))
        }
      };

      const synthesizer = new GeminiSynthesizer(mockClient as unknown as GoogleGenAI);
      const content = await synthesizer.synthesize('Pizzaria Bella', 'Restaurante', []);

      expect(content.headline).toContain('Pizzaria Bella');
      expect(content.callToAction).toContain('WhatsApp');
    });

    it('deve formatar o retorno do Gemini se a chamada for bem-sucedida', async () => {
      process.env['GEMINI_API_KEY'] = 'fake-key';

      const mockApiResponse = {
        text: JSON.stringify({
          headline: 'Sua Saúde Bucal em Boas Mãos',
          subheadline: 'Tratamentos modernos e humanizados no coração do bairro',
          aboutText: 'Na Clínica Sorriso cuidamos de cada detalhe do seu sorriso com tecnologia.',
          keyServices: ['Implantes', 'Clareamento Dental', 'Ortodontia'],
          callToAction: 'Agende sua avaliação pelo WhatsApp agora mesmo!'
        })
      };

      const mockClient = {
        models: {
          generateContent: vi.fn().mockResolvedValue(mockApiResponse)
        }
      };

      const synthesizer = new GeminiSynthesizer(mockClient as unknown as GoogleGenAI);
      const content = await synthesizer.synthesize('Clínica Sorriso', 'Dentista', []);

      expect(content.headline).toBe('Sua Saúde Bucal em Boas Mãos');
      expect(content.keyServices).toEqual(['Implantes', 'Clareamento Dental', 'Ortodontia']);
    });
  });
});
