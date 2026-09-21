# Implementation Plan: Brand Extractor (Módulo 2)

**Branch**: `002-brand-extractor` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-brand-extractor/spec.md`

---

## Summary

O Módulo 2 (Brand Extractor) é o motor de identidade visual e enriquecimento semântico da VitrineLocal. Ele recebe um lead qualificado do Maps Radar e executa a extração automatizada de fotos em alta resolução, logotipo candidato, cálculo de paleta de cores dominante com contraste acessível (e fallback por nicho), curadoria das 3 a 5 avaliações 5 estrelas mais detalhadas do Google Maps, e síntese de conteúdo promocional com a Google Gemini API (`@google/genai`), persistindo o `BrandProfile` no SQLite via Prisma ORM.

---

## Technical Context

**Language/Version**: Node.js 24 LTS (24.18/24.21), TypeScript 5.7+ com tipagem estrita (`strict: true`, zero `any` não justificado, `exactOptionalPropertyTypes: true`).

**Primary Dependencies**:

- `@prisma/client` + `prisma` (ORM com SQLite).
- `express` + `@types/express` (REST API).
- `playwright` (extração de imagens e depoimentos do perfil Google Maps).
- `@google/genai` (SDK oficial do Google Gemini para síntese semântica estruturada).
- `zod` (validação de schemas e contratos de API).

**Storage**: SQLite via Prisma ORM (`prisma/dev.db`), tabela `BrandProfile` com chave estrangeira 1:1 para `QualifiedLead`.

**Testing**: Vitest (`vitest`) para testes unitários e de integração, `supertest` para validação de endpoints HTTP REST.

**Target Platform**: Linux / macOS (Node.js runtime local e CI).

**Project Type**: Web Service / Hexagonal Architecture Module.

**Performance Goals**: Extração completa (scraping + análise de cores + Gemini AI + persistência) em menos de 15 segundos por lead em condições normais.

**Constraints**: Resiliência com fallback total para paletas por nicho e gerador de texto estático em caso de falha de rede/IA; proporção de contraste acessível (WCAG AA ratio >= 4.5:1).

**Scale/Scope**: Operação sob demanda por lead (`POST /api/brand/extract/:leadId`), com cache idempotente no banco e suporte a re-extração forçada (`?force=true`).

---

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **I. TDD (Test-Driven Development)**: Nenhum código de produção é criado sem teste prévio (Red -> Green -> Refactor). Cobertura unitária/integração com Vitest >= 85%.
- [x] **II. Production-Ready CI & Strict Quality Gates**: Código deve compilar com zero erros de typecheck, zero warnings de ESLint, zero vulnerabilidades altas/críticas no `npm audit` e 100% dos testes verdes.
- [x] **III. Modularidade & Clean Boundaries**: Código isolado em `src/modules/brand/`, desacoplado do Módulo 1 (Maps Radar), comunicando-se unicamente via banco e DTOs/Schemas Zod.
- [x] **IV. Resiliência Operacional**: Retries com backoff exponencial para chamadas ao Gemini; fallback para paletas de cores padrão por nicho se as fotos forem insuficientes; fallback de cópia estática se a IA falhar.
- [x] **V. Segurança & Privacidade por Design**: Chave do Gemini consumida estritamente via `process.env.GEMINI_API_KEY` com validação de boot; URLs externas sanitizadas.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-brand-extractor/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: Decisões técnicas e pesquisa
├── data-model.md        # Phase 1: Modelagem Prisma e DTOs
├── quickstart.md        # Phase 1: Guia prático de execução e validação
├── contracts/           # Phase 1: Contratos e schemas Zod
│   └── brand-extractor.contract.ts
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code Layout

```text
src/
├── modules/
│   ├── brand/
│   │   ├── core/
│   │   │   ├── color-extractor.ts        # Algoritmo de cores, histograma e contraste WCAG
│   │   │   ├── niche-palettes.ts         # Dicionário de paletas de fallback por nicho
│   │   │   └── review-curator.ts         # Ordenação e curadoria dos melhores reviews 5★
│   │   ├── adapters/
│   │   │   ├── gemini-synthesizer.ts     # Cliente Google Gemini API (@google/genai) com fallback
│   │   │   └── maps-brand-scraper.ts     # Scraper Playwright de fotos e comentários do Maps
│   │   ├── repositories/
│   │   │   └── brand.repository.ts       # Operações Prisma para BrandProfile
│   │   ├── schemas/
│   │   │   └── brand.schemas.ts          # Schemas Zod para requests e responses
│   │   ├── brand.service.ts              # Orquestrador do fluxo de extração e cache
│   │   ├── brand.types.ts                # Tipos TypeScript do domínio
│   │   └── __tests__/
│   │       ├── color-extractor.test.ts
│   │       ├── niche-palettes.test.ts
│   │       ├── review-curator.test.ts
│   │       ├── gemini-synthesizer.test.ts
│   │       ├── brand-repository.test.ts
│   │       └── brand-service.test.ts
│   └── radar/                            # Módulo 1 (já em produção)
├── api/
│   ├── routes/
│   │   ├── radar.routes.ts               # Rotas do Módulo 1
│   │   └── brand.routes.ts               # POST /api/brand/extract/:leadId & GET /api/brand/:leadId
│   ├── __tests__/
│   │   └── brand-routes.test.ts          # Testes de integração de rotas com Supertest
│   └── server.ts                         # Servidor Express
└── shared/                               # Logger, erros e utilitários
```

**Structure Decision**: Arquitetura modular hexagonal fatiada por feature (`src/modules/brand/`), garantindo desacoplamento estrito, testabilidade isolada e conformidade com a Constituição.

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because                                                     |
| --------- | ---------- | ---------------------------------------------------------------------------------------- |
| Nenhuma   | N/A        | Arquitetura mantém-se minimalista, usando Prisma + SQLite sem serviços extras como Redis |
