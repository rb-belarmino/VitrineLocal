import { GoogleGenAI } from '@google/genai';
import { OutreachCopyInput } from '../outreach.types';
import { CopyGenerator } from './copy-generator';
import { Logger } from '../../../shared/logger/logger';

export interface GeneratedOutreachResult {
  messageText: string;
  generatedVia: 'GEMINI_AI' | 'FALLBACK_SYNTHESIZER';
}

export class GeminiOutreachAdapter {
  private client: GoogleGenAI | null = null;
  private readonly fallbackGenerator = new CopyGenerator();

  constructor(injectedClient?: GoogleGenAI) {
    if (injectedClient) {
      this.client = injectedClient;
    } else if (process.env['GEMINI_API_KEY']) {
      this.client = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });
    }
  }

  public async generate(input: OutreachCopyInput): Promise<GeneratedOutreachResult> {
    if (!this.client) {
      return {
        messageText: this.fallbackGenerator.generateDeterministic(input),
        generatedVia: 'FALLBACK_SYNTHESIZER',
      };
    }

    try {
      const prompt = `Você é um especialista em prospecção consultiva B2B (metodologia Visual Pitch).
Crie uma mensagem curta, profissional e muito educada para WhatsApp para o proprietário de um negócio local.

DADOS DA EMPRESA:
- Nome: ${input.businessName}
- Categoria: ${input.category}
- Avaliação Google Maps: ${input.rating} estrelas (${input.reviewCount} avaliações)
- Link da Demonstração (Landing Page criada): ${input.previewUrl}

REGRAS:
1. NÃO soe como vendedor insistente nem use clichês de telemarketing.
2. Inicie parabenizando sinceramente pela excelente reputação e nota ${input.rating} no Google.
3. Mencione que notou que o perfil deles no Google não possui um site próprio oficial.
4. Apresente o link da prévia exclusiva que preparamos para eles: ${input.previewUrl}
5. Finalize perguntando educadamente o que acharam da estrutura, sem qualquer compromisso.
6. Retorne APENAS o texto da mensagem para WhatsApp (use quebras de linha e emojis moderados).`;

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text?.trim();
      if (!text || text.length < 20) {
        throw new Error('Resposta do Gemini vazia ou muito curta.');
      }

      return {
        messageText: text,
        generatedVia: 'GEMINI_AI',
      };
    } catch (err) {
      Logger.warn(
        `Falha na geração de abordagem via Gemini para "${input.businessName}". Acionando fallback.`,
        { error: err instanceof Error ? err.message : String(err) },
      );

      return {
        messageText: this.fallbackGenerator.generateDeterministic(input),
        generatedVia: 'FALLBACK_SYNTHESIZER',
      };
    }
  }
}
