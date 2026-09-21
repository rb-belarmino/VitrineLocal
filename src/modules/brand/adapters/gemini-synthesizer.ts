import { GoogleGenAI } from '@google/genai';
import { SemanticContent, TestimonialItem } from '../brand.types';
import { SemanticContentSchema } from '../schemas/brand.schemas';
import { Logger } from '../../../shared/logger/logger';

export function generateFallbackContent(
  businessName: string,
  category: string,
  testimonials: TestimonialItem[] = []
): SemanticContent {
  const hasReviews = testimonials.length > 0;
  const reviewNote = hasReviews
    ? ' Reconhecido com excelentes avaliações 5 estrelas no Google pela dedicação e qualidade inquestionável.'
    : '';

  return {
    headline: `${businessName}: Excelência e Confiança em ${category}`,
    subheadline: `Soluções completas com atendimento de alto padrão e profissionais especializados.${reviewNote}`,
    aboutText: `Na ${businessName}, temos o compromisso de entregar o melhor serviço em ${category}. Trabalhamos com foco na sua total satisfação, oferecendo agilidade, transparência e tecnologia para garantir os melhores resultados na nossa comunidade.${reviewNote}`,
    keyServices: [
      `Atendimento Especializado em ${category}`,
      'Diagnóstico e Orçamento Sem Compromisso',
      'Profissionais Experientes e Qualificados',
      'Garantia de Qualidade e Satisfação'
    ],
    callToAction: 'Entre em contato pelo WhatsApp agora mesmo e tire suas dúvidas!'
  };
}

export class GeminiSynthesizer {
  private client: GoogleGenAI | null = null;

  constructor(injectedClient?: GoogleGenAI) {
    if (injectedClient) {
      this.client = injectedClient;
    } else if (process.env['GEMINI_API_KEY']) {
      this.client = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });
    }
  }

  async synthesize(
    businessName: string,
    category: string,
    testimonials: TestimonialItem[] = []
  ): Promise<SemanticContent> {
    if (!this.client || !process.env['GEMINI_API_KEY']) {
      Logger.info(`GEMINI_API_KEY não configurada. Utilizando sintetizador semântico fallback para ${businessName}.`);
      return generateFallbackContent(businessName, category, testimonials);
    }

    try {
      const reviewsContext = testimonials
        .map((t, idx) => `Depoimento ${idx + 1}: "${t.text}"`)
        .join('\n');

      const prompt = `
Você é um especialista em copywriting comercial e landing pages para pequenos negócios locais no Brasil.
Crie o conteúdo publicitário em formato JSON para o negócio a seguir:

Nome da Empresa: ${businessName}
Categoria/Nicho: ${category}
${reviewsContext ? `Depoimentos reais de clientes:\n${reviewsContext}` : ''}

Retorne ESTRITAMENTE um objeto JSON válido (sem tags markdown nem explicações) no seguinte formato:
{
  "headline": "Frase de alto impacto de 5 a 9 palavras para o topo da página",
  "subheadline": "Subtítulo de 1 a 2 frases destacando autoridade, agilidade e confiança",
  "aboutText": "Parágrafo institucional e persuasivo com 3 a 4 frases",
  "keyServices": ["Serviço 1", "Serviço 2", "Serviço 3", "Serviço 4"],
  "callToAction": "Chamada direta e atraente para contato pelo WhatsApp"
}
`;

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      // Remove possíveis marcadores markdown de bloco de código json
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      const validated = SemanticContentSchema.parse(parsed);
      return validated;
    } catch (err) {
      Logger.warn(
        `Falha na chamada da Gemini API para sintetizar conteúdo de ${businessName}. Acionando fallback.`,
        err instanceof Error ? { error: err.message } : { error: String(err) }
      );
      return generateFallbackContent(businessName, category, testimonials);
    }
  }
}
