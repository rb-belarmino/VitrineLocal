import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiOutreachAdapter } from '../core/gemini-outreach-adapter';
import { OutreachCopyInput } from '../outreach.types';

describe('GeminiOutreachAdapter (Unit)', () => {
  const input: OutreachCopyInput = {
    businessName: 'Clínica Sorriso & Saúde',
    category: 'Clínica Odontológica',
    rating: 4.9,
    reviewCount: 38,
    previewUrl: 'https://preview.vitrinelocal.com.br/preview/clinica-sorriso-moema',
    phoneNormalized: '11987654321',
    isMobile: true,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve usar o sintetizador fallback se GEMINI_API_KEY não estiver definida', async () => {
    delete process.env['GEMINI_API_KEY'];
    const adapter = new GeminiOutreachAdapter();

    const result = await adapter.generate(input);

    expect(result.generatedVia).toBe('FALLBACK_SYNTHESIZER');
    expect(result.messageText).toContain('Clínica Sorriso & Saúde');
    expect(result.messageText).toContain(input.previewUrl);
  });

  it('deve usar o Google GenAI quando o cliente responder com sucesso', async () => {
    const mockClient = {
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: 'Olá! Parabéns pelas 4.9 estrelas da Clínica Sorriso & Saúde. Preparamos uma prévia: https://preview.vitrinelocal.com.br/preview/clinica-sorriso-moema',
        }),
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new GeminiOutreachAdapter(mockClient as any);

    const result = await adapter.generate(input);

    expect(result.generatedVia).toBe('GEMINI_AI');
    expect(result.messageText).toContain('Clínica Sorriso & Saúde');
  });

  it('deve acionar o fallback de forma transparente caso a API do Gemini gere erro', async () => {
    const mockClient = {
      models: {
        generateContent: vi.fn().mockRejectedValue(new Error('Rate limit exceeded 429')),
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new GeminiOutreachAdapter(mockClient as any);

    const result = await adapter.generate(input);

    expect(result.generatedVia).toBe('FALLBACK_SYNTHESIZER');
    expect(result.messageText).toContain('Clínica Sorriso & Saúde');
  });
});
