import { OutreachCopyInput } from '../outreach.types';

export class CopyGenerator {
  /**
   * Gera abordagem comercial consultiva estruturada (Visual Pitch)
   * sem soar como spam automático.
   */
  public generateDeterministic(input: OutreachCopyInput): string {
    const { businessName, rating, reviewCount, previewUrl } = input;

    return `Olá! Tudo bem? Passando para parabenizar o trabalho da equipe da ${businessName} — vi que vocês têm uma excelente avaliação no Google (${rating}★ com ${reviewCount} avaliações positivas!). 👏

Reparei que vocês ainda não possuem um site próprio oficial conectado ao perfil do Google, o que muitas vezes faz clientes novos ficarem na dúvida ou irem para concorrentes.

Para demonstrar como a presença digital de vocês poderia ser ainda mais profissional, criamos sem compromisso uma demonstração exclusiva com a identidade e serviços da ${businessName}:
👉 ${previewUrl}

O que achou da estrutura? Se fizer sentido para vocês, ficaremos felizes em liberar o site oficial!`;
  }

  /**
   * Gera URL para abertura direta no WhatsApp Web / App
   */
  public buildWhatsappLink(phoneNormalized?: string | null, messageText?: string): string {
    const encoded = messageText ? encodeURIComponent(messageText) : '';
    if (!phoneNormalized) {
      return `https://wa.me/?text=${encoded}`;
    }

    const digits = phoneNormalized.replace(/\D/g, '');
    const fullNumber = digits.startsWith('55') ? digits : `55${digits}`;
    return `https://wa.me/${fullNumber}?text=${encoded}`;
  }
}
