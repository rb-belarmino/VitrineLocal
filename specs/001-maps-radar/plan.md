# Implementation Plan: Módulo 1 — Maps Radar (Scraper & Lead Qualification)

**Branch**: `001-maps-radar` | **Date**: 2026-09-21 | **Spec**: [specs/001-maps-radar/spec.md](file:///Users/rodrigobelarmino/Documents/DEV/VitrineLocal/specs/001-maps-radar/spec.md)

**Input**: Feature specification from `/specs/001-maps-radar/spec.md`

---

## Summary

Implementação do motor de mineração geográfica e qualificação de oportunidades locais **Maps Radar**. Utiliza automação headless resiliente com Playwright para navegar no Google Maps a partir de um nicho e localidade (ex: *"Oficinas em Moema, SP"*), extraindo cards de empresas e aplicando filtros determinísticos para reter apenas estabelecimentos com excelente reputação (nota >= 4.0, reviews >= 5) que **não possuem website próprio** (ou utilizam apenas redes sociais), normalizando dados de contato (E.164 e identificação WhatsApp) para alimentar o funil de Visual Pitch.

---

## Technical Context

**Language/Version**: TypeScript 7.0.2 / Node.js 24.21.0 (LTS) em modo estrito (`strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`).

**Primary Dependencies**:
- `playwright` (Chromium headless com anti-fingerprinting para automação web)
- `zod` (Validação estrita de contratos e schemas em runtime)
- `cheerio` / `@types/cheerio` (Para parsing de HTML estático offline em testes com fixtures)
- `@prisma/client` / `prisma` (ORM tipado para persistência e migrações)

**Storage**: SQLite local via Prisma ORM (schema desacoplado via Repository Pattern, preparado para migração futura para PostgreSQL/Supabase sem alteração de contratos).

**Testing**: `vitest` para testes unitários com cobertura v8 + fixtures HTML offline do Google Maps (execução < 3 segundos sem dependência de internet).

**Target Platform**: Node.js runtime / macOS / Linux / GitHub Actions CI.

**Project Type**: Módulo de biblioteca e serviço com interface CLI e API tipada (`IRadarService`).

**Performance Goals**: Extração e qualificação de 20 estabelecimentos em < 15 segundos; execução dos testes unitários em < 2 segundos.

**Constraints**:
- Zero custo de API oficial do Google Places na prospecção inicial;
- Tolerância a falhas: erros em cards individuais não quebram o lote;
- Zero `any` ou typecast perigoso não justificado.

**Scale/Scope**: Mineração em lotes de 20 a 100 estabelecimentos por execução geográfica.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio Constitucional | Status | Justificativa / Validação |
|---|---|---|
| **I. Test-Driven Development (TDD)** | ✅ PASS | Suíte com Vitest planejada com fixtures estáticas para ciclo Red-Green-Refactor sem flakes de rede. |
| **II. Production-Ready Quality Gates** | ✅ PASS | Pipeline planejado com 5 gates: `typecheck`, `lint`, `audit`, `security` e `test`. |
| **III. Modularidade & Arquitetura Limpa** | ✅ PASS | O Módulo 1 é completamente desacoplado e expõe apenas contratos tipados (`IRadarService`, `QualifiedLead`). |
| **IV. Resiliência Operacional** | ✅ PASS | Delays pseudo-aleatórios, timeouts individuais e isolamento de falhas por estabelecimento. |
| **V. Segurança e Privacidade por Design** | ✅ PASS | Nenhuma credencial necessária no Módulo 1; sanitização de dados extraídos do DOM. |

*Resultado dos Gates: 100% APROVADO sem violações.*

---

## Project Structure

### Documentation (this feature)

```text
specs/001-maps-radar/
├── spec.md              # PRD e especificação funcional da feature
├── plan.md              # Este plano de implementação
├── research.md          # Fase 0: Decisões técnicas e anti-bloqueio
├── data-model.md        # Fase 1: Entidades, Schemas Zod e máquina de estados
├── quickstart.md        # Fase 1: Guia de validação prática e testes
├── contracts/           # Fase 1: Interfaces TypeScript compartilhadas
│   ├── radar-service.contract.ts
│   └── radar-events.contract.ts
└── tasks.md             # Fase 2: Tarefas ordenadas (geradas no próximo passo)
```

### Source Code (repository root)

```text
src/
├── modules/
│   └── radar/
│       ├── __tests__/
│       │   ├── fixtures/                   # Snapshots HTML estáticos do Google Maps
│       │   │   ├── search-results-feed.html
│       │   │   └── business-detail-card.html
│       │   ├── website-classifier.test.ts  # TDD: Validação de URLs vs. Redes Sociais
│       │   ├── phone-normalizer.test.ts    # TDD: Normalização E.164 e WhatsApp
│       │   ├── lead-scorer.test.ts         # TDD: Cálculo de pontuação e prioridade
│       │   └── dom-parser.test.ts          # TDD: Extração de seletores nos fixtures HTML
│       ├── core/
│       │   ├── website-classifier.ts       # Lógica pura de classificação de URLs
│       │   ├── phone-normalizer.ts         # Lógica pura de normalização de telefones
│       │   └── lead-scorer.ts              # Lógica pura de score comercial
│       ├── scraper/
│       │   ├── maps-selectors.ts           # Dicionário de seletores DOM do Google Maps
│       │   ├── dom-parser.ts               # Parser seguro do HTML com fallbacks
│       │   ├── browser-pool.ts             # Gerenciador de contexto Playwright com stealth
│       │   └── maps-scraper.ts             # Orquestrador de busca e rolagem de feed
│       ├── schemas/
│       │   └── radar.schemas.ts            # Schemas Zod validados em tempo de execução
│       ├── cli.ts                          # Interface de linha de comando para execuções avulsas
│       └── index.ts                        # Fachada pública que implementa IRadarService
├── shared/
│   ├── logger/                             # Logs estruturados com formato JSON
│   └── errors/                             # Classes de erro tipadas (ScrapingError, ValidationError)
└── config/
    └── radar.config.ts                     # Configurações de timeouts, delays e limites
```

**Structure Decision**: A estrutura foi projetada em camadas limpas (`core/` com lógica pura e zero dependência de infraestrutura, `scraper/` isolando toda interação com o Playwright/DOM e `schemas/` centralizando os contratos tipados).

---

## Complexity Tracking

*Nenhuma violação constitucional detectada. Todas as escolhas técnicas atendem diretamente aos princípios de simplicidade, tipagem estrita e testabilidade.*
