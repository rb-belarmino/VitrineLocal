export interface NormalizedPhone {
  raw: string;
  e164: string;
  isMobile: boolean;
  ddd: string;
}

export class PhoneNormalizer {
  // DDDs válidos no Brasil conforme a ANATEL
  private static readonly VALID_DDDS = new Set([
    '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
    '21', '22', '24', // RJ
    '27', '28', // ES
    '31', '32', '33', '34', '35', '37', '38', // MG
    '41', '42', '43', '44', '45', '46', // PR
    '47', '48', '49', // SC
    '51', '53', '54', '55', // RS
    '61', // DF
    '62', '64', // GO
    '63', // TO
    '65', '66', // MT
    '67', // MS
    '68', // AC
    '69', // RO
    '71', '73', '74', '75', '77', // BA
    '79', // SE
    '81', '87', // PE
    '82', // AL
    '83', // PB
    '84', // RN
    '85', '88', // CE
    '86', '89', // PI
    '91', '93', '94', // PA
    '92', '97', // AM
    '95', // RR
    '96', // AP
    '98', '99'  // MA
  ]);

  /**
   * Normaliza uma string de telefone para o padrão E.164 brasileiro (+55...).
   */
  public static normalize(rawPhone: string | null | undefined): NormalizedPhone | null {
    if (!rawPhone || typeof rawPhone !== 'string') {
      return null;
    }

    // Extrai apenas dígitos
    let digits = rawPhone.replace(/\D/g, '');

    // Se começar com 55 (código do país) e tiver mais de 11 dígitos, remove o prefixo 55
    if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
      digits = digits.slice(2);
    }

    // Se começar com 0 (ex: 011...), remove o 0 inicial
    if (digits.startsWith('0') && (digits.length === 11 || digits.length === 12)) {
      digits = digits.slice(1);
    }

    // Telefones válidos no Brasil com DDD têm 10 dígitos (fixo) ou 11 dígitos (celular)
    if (digits.length !== 10 && digits.length !== 11) {
      return null;
    }

    const ddd = digits.slice(0, 2);
    if (!this.VALID_DDDS.has(ddd)) {
      return null;
    }

    const numberPart = digits.slice(2);

    // Celular no Brasil tem 9 dígitos e começa com 9
    const isMobile = digits.length === 11 && numberPart.startsWith('9');

    const e164 = `+55${digits}`;

    return {
      raw: rawPhone.trim(),
      e164,
      isMobile,
      ddd
    };
  }
}
