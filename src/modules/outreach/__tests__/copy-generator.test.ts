import { describe, it, expect } from 'vitest';
import { CopyGenerator } from '../core/copy-generator';
import { OutreachCopyInput } from '../outreach.types';

describe('CopyGenerator (Unit)', () => {
  const generator = new CopyGenerator();

  const input: OutreachCopyInput = {
    businessName: 'Clínica Sorriso & Saúde',
    category: 'Clínica Odontológica',
    rating: 4.9,
    reviewCount: 38,
    previewUrl: 'https://preview.vitrinelocal.com.br/preview/clinica-sorriso-moema',
    phoneNormalized: '11987654321',
    isMobile: true,
  };

  it('deve gerar mensagem estruturada contendo elogio, observação, link e CTA', () => {
    const copy = generator.generateDeterministic(input);

    expect(copy).toContain('Clínica Sorriso & Saúde');
    expect(copy).toContain('4.9');
    expect(copy).toContain('38');
    expect(copy).toContain('https://preview.vitrinelocal.com.br/preview/clinica-sorriso-moema');
    expect(copy).toContain('site oficial');
  });

  it('deve gerar link do WhatsApp formatado com codificação segura', () => {
    const link = generator.buildWhatsappLink(input.phoneNormalized, 'Olá, tudo bem?');

    expect(link).toBe('https://wa.me/5511987654321?text=Ol%C3%A1%2C%20tudo%20bem%3F');
  });

  it('deve lidar graciosamente com telefone ausente ou nulo', () => {
    const link = generator.buildWhatsappLink(null, 'Teste');
    expect(link).toBe('https://wa.me/?text=Teste');
  });
});
