# Quickstart & Guia de Validação: Módulo 1 — Maps Radar

Este guia descreve os passos práticos e determinísticos para validar o funcionamento do **Módulo 1: Maps Radar** de ponta a ponta, cobrindo testes unitários, testes com fixtures offline e execução real.

---

## 1. Pré-Requisitos

- **Node.js**: v24.21.0 (LTS)
- **TypeScript**: v7.0.2
- **npm**: v10.x ou superior
- **Prisma ORM**: `@prisma/client` + `prisma`
- **Playwright Chromium**: Instalado para o scraper

---

## 2. Validação Rápida dos Quality Gates (Pipeline Local)

Antes de qualquer execução funcional, valide a integridade do código:

```bash
# 1. Checagem de Tipagem Estrita TypeScript (zero 'any' não justificado)
npm run typecheck

# 2. Análise Estática de Código (zero warnings/erros de ESLint)
npm run lint

# 3. Auditoria de Segurança de Dependências
npm run audit

# 4. Execução de 100% da Suíte de Testes com Relatório de Cobertura
npm run test:coverage
```

**Resultado Esperado:** Todos os 4 comandos saem com código `0` e cobertura superior a 90%.

---

## 3. Cenários de Teste Automatizados (TDD / Offline Fixtures)

### Cenário A: Classificador de Websites (Filtro Anti-Site)

Testa a capacidade do motor de distinguir sites próprios de redes sociais e ausência de URL.

```bash
npx vitest run src/modules/radar/__tests__/website-classifier.test.ts
```

**Validações:**

- URLs nulas, vazias ou `about:blank` ➔ Classificadas como `NO_WEBSITE` (Aprovado).
- URLs de Instagram, Facebook, Linktree, TikTok, WhatsApp (`wa.me`) ➔ Classificadas como `SOCIAL_ONLY` (Aprovado).
- URLs de domínios corporativos (`oficinaauto.com.br`) ➔ Classificadas como `OWN_WEBSITE` (Descartado).

### Cenário B: Normalizador Telefônico & Detector WhatsApp

Testa a normalização para E.164 e identificação de celular vs. fixo.

```bash
npx vitest run src/modules/radar/__tests__/phone-normalizer.test.ts
```

**Validações:**

- `(11) 99876-5432` ➔ `+5511998765432` com `isMobile: true`.
- `(11) 3214-5678` ➔ `+551132145678` com `isMobile: false`.
- Números com prefixo de operadora ou espaços irregulares normalizados corretamente.

### Cenário C: DOM Parser Offline (Com Fixtures HTML)

Testa a extração dos seletores CSS do Google Maps contra arquivos HTML reais previamente salvos, sem necessidade de internet.

```bash
npx vitest run src/modules/radar/__tests__/dom-parser.test.ts
```

**Resultado Esperado:** 100% dos cards da fixture são parseados com título, nota, reviews, endereço e website sem lançar exceções.

---

## 4. Cenário de Execução de Demonstração (CLI)

Executa a busca de estabelecimentos localmente:

```bash
# Executa mineração de teste para 'Oficinas Mecânicas em Moema, SP' com limite de 5 leads
npm run radar:search -- --niche="Oficina Mecânica" --location="Moema, São Paulo" --limit=5
```

**Saída Estruturada Esperada no Terminal:**

```json
{
  "jobId": "d3b07384-d113-4638-9279-d5a23f4a3e81",
  "niche": "Oficina Mecânica",
  "location": "Moema, São Paulo",
  "totalFound": 5,
  "totalQualified": 3,
  "totalDisqualified": 2,
  "durationMs": 4200,
  "leads": [
    {
      "businessName": "Auto Mecânica Moema Express",
      "category": "Oficina mecânica",
      "address": "Av. Moema, 340 - Moema, São Paulo - SP",
      "phoneNormalized": "+5511987654321",
      "isMobile": true,
      "websiteType": "SOCIAL_ONLY",
      "rating": 4.9,
      "reviewCount": 82,
      "qualificationScore": 95,
      "status": "QUALIFIED"
    }
  ]
}
```
