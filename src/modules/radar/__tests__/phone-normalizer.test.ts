import { describe, it, expect } from 'vitest';
import { PhoneNormalizer } from '../core/phone-normalizer';

describe('PhoneNormalizer (E.164 & WhatsApp Detection)', () => {
  it('deve normalizar celular de São Paulo com 9 dígitos e máscara padrão', () => {
    const result = PhoneNormalizer.normalize('(11) 98765-4321');
    expect(result).toEqual({
      raw: '(11) 98765-4321',
      e164: '+5511987654321',
      isMobile: true,
      ddd: '11',
    });
  });

  it('deve normalizar telefone fixo de São Paulo com 8 dígitos', () => {
    const result = PhoneNormalizer.normalize('(11) 3214-5678');
    expect(result).toEqual({
      raw: '(11) 3214-5678',
      e164: '+551132145678',
      isMobile: false,
      ddd: '11',
    });
  });

  it('deve normalizar celular de outros DDDs (ex: Rio de Janeiro 21, Minas 31, Paraná 41)', () => {
    const rj = PhoneNormalizer.normalize('21 99999-8888');
    expect(rj?.e164).toBe('+5521999998888');
    expect(rj?.isMobile).toBe(true);

    const pr = PhoneNormalizer.normalize('+55 41 98888-7777');
    expect(pr?.e164).toBe('+5541988887777');
    expect(pr?.isMobile).toBe(true);
  });

  it('deve retornar null para strings vazias ou nulas', () => {
    expect(PhoneNormalizer.normalize(null)).toBeNull();
    expect(PhoneNormalizer.normalize('')).toBeNull();
    expect(PhoneNormalizer.normalize('   ')).toBeNull();
  });

  it('deve lidar com números de 8 dígitos que não possuem nono dígito', () => {
    const result = PhoneNormalizer.normalize('11 5055-1122');
    expect(result?.isMobile).toBe(false);
    expect(result?.e164).toBe('+551150551122');
  });

  it('deve rejeitar números inválidos com quantidade insuficiente de dígitos', () => {
    expect(PhoneNormalizer.normalize('12345')).toBeNull();
    expect(PhoneNormalizer.normalize('telefone')).toBeNull();
  });
});
