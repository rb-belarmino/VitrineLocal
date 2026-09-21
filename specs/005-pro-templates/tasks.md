# Tasks: 005-pro-templates (Professional Niche Templates)

**Input**: Design documents from `specs/005-pro-templates/`  
**Prerequisites**: [spec.md](./spec.md), [plan.md](./plan.md), [data-model.md](./data-model.md), [research.md](./research.md)

---

## Phase 1: Setup & Shared Infrastructure

**Purpose**: Utilitários centrais de fallbacks de imagens Unsplash CDN e detecção de variantes

- [ ] T001 Criar utilitário `src/modules/site-engine/core/template-fallbacks.ts` com catálogo `FALLBACK_NICHE_HERO_IMAGES`, função `detectBelezaVariant` (avaliando termos: `barbearia`, `barber`, `barba`, `navalha`, `corte masculino`, `bigode`) e helper `getNicheFallbackHeroImage`
- [ ] T002 [P] Criar testes unitários para fallbacks e variantes em `src/modules/site-engine/__tests__/template-fallbacks.test.ts`

---

## Phase 2: Foundational (Shared Conversion Components)

**Purpose**: Componentes compartilhados essenciais que alimentam todos os templates

**⚠️ CRITICAL**: Pré-requisito para a montagem dos templates nas fases seguintes

- [ ] T003 [P] Criar componente `src/modules/site-engine/components/StickyMobileBar.tsx` com botão de largura total em destaque para WhatsApp adaptado por nicho, camada `z-40`, visibilidade exclusiva para telas móveis (`md:hidden`) e classe utilitária de compensação de espaçamento inferior (`pb-24` nos containers principais)
- [ ] T004 [P] Atualizar `src/modules/site-engine/components/VisualPitchBadge.tsx` para o formato floating pill translúcida no topo superior direito (`z-50`, `backdrop-blur-md`, `bg-white/80 dark:bg-stone-900/80`) com link comercial do VitrineLocal e assinatura de rodapé discreta
- [ ] T005 Criar testes unitários para `StickyMobileBar` e `VisualPitchBadge` em `src/modules/site-engine/__tests__/shared-components.test.tsx` validando isolamento de camadas, links de WhatsApp sanitizados, classes responsivas e ausência de sobreposição de conteúdo

**Checkpoint**: Infraestrutura compartilhada pronta. A implementação dos templates de nicho pode ocorrer em paralelo.

---

## Phase 3: User Story 1 - GastronomiaTemplate (Priority: P1) 🎯 MVP

**Goal**: Entregar o template gastronômico redesenhado com visual de alta conversão, hero split com floating badge de nota Google, especialidades e sticky WhatsApp bar.

**Independent Test**: Renderizar `GastronomiaTemplate` com lead de restaurante e verificar presença do hero imersivo, badges "Mais Pedido", fallback de imagem Unsplash e sticky bar mobile.

### Tests for User Story 1 ⚠️
- [ ] T006 [P] [US1] Escrever testes unitários em `src/modules/site-engine/__tests__/gastronomia-template.test.tsx` validando renderização de hero split, badge de reputação Google, especialidades, fallback de fotos e sticky bar (Red)

### Implementation for User Story 1
- [ ] T007 [US1] Redesenhar `src/modules/site-engine/components/GastronomiaTemplate.tsx` com estética Dark Amber (`#0c0a09`), título serifado elegante, cards de pratos com micro-badges, integração com `StickyMobileBar` e `getNicheFallbackHeroImage` (Green)

**Checkpoint**: User Story 1 completa e testável de forma independente. MVP visual funcional!

---

## Phase 4: User Story 2 - SaudeTemplate (Priority: P1)

**Goal**: Entregar o template de saúde e clínicas odontológicas/médicas com atmosfera clean clinic, autoridade profissional, depoimentos humanizados e FAQ interativo nativo.

**Independent Test**: Renderizar `SaudeTemplate` e verificar estética asséptica moderna, cards de procedimentos, autoridade técnica e acordeão FAQ em `<details>/<summary>`.

### Tests for User Story 2 ⚠️
- [ ] T008 [P] [US2] Escrever testes unitários em `src/modules/site-engine/__tests__/saude-template.test.tsx` validando layout clean clinic, cards de tratamentos, FAQ nativo e sticky bar (Red)

### Implementation for User Story 2
- [ ] T009 [US2] Redesenhar `src/modules/site-engine/components/SaudeTemplate.tsx` com paleta Sky Blue / Teal, fundo claro, cantos suaves `rounded-2xl`, FAQ interativo com `<details><summary>` nativo e integração com `StickyMobileBar` (Green)

**Checkpoint**: User Stories 1 e 2 funcionais e independentes.

---

## Phase 5: User Story 3 - AutomotivoTemplate (Priority: P2)

**Goal**: Entregar o template automotivo com estética dark industrial de alto contraste, selos de garantia técnica e botão de socorro/orçamento rápido.

**Independent Test**: Renderizar `AutomotivoTemplate` e verificar o tema escuro em Slate 950 com acentos em Laranja Racing, badges de garantia e CTA de orçamento.

### Tests for User Story 3 ⚠️
- [ ] T010 [P] [US3] Escrever testes unitários em `src/modules/site-engine/__tests__/automotivo-template.test.tsx` validando tema escuro, selos de garantia, serviços mecânicos e sticky bar (Red)

### Implementation for User Story 3
- [ ] T011 [US3] Redesenhar `src/modules/site-engine/components/AutomotivoTemplate.tsx` com estética Dark Slate (`#020617`), acentos em Laranja Racing (`#ea580c`), cards técnicos de revisão/peças e integração com `StickyMobileBar` (Green)

**Checkpoint**: User Stories 1, 2 e 3 funcionais.

---

## Phase 6: User Story 4 - BelezaTemplate (Priority: P2)

**Goal**: Entregar o template de beleza com alternância automática entre o modo Salão/Estética (Editorial Rosé) e o modo Barbearia (Vintage Dark/Wood).

**Independent Test**: Renderizar `BelezaTemplate` com categoria "Salão de Beleza" (validando modo rosé) e com categoria "Barbearia Clássica" (validando modo escuro rústico).

### Tests for User Story 4 ⚠️
- [ ] T012 [P] [US4] Escrever testes unitários em `src/modules/site-engine/__tests__/beleza-template.test.tsx` cobrindo a renderização de ambas as variantes (Salão vs. Barbearia) e agendamento ágil (Red)

### Implementation for User Story 4
- [ ] T013 [US4] Redesenhar `src/modules/site-engine/components/BelezaTemplate.tsx` consumindo `detectBelezaVariant` (avaliando `barbearia`, `barber`, `barba`, `navalha`, `corte masculino`, `bigode`) para alternar estilos e tokens visuais (Rosé/Luxe vs. Vintage Dark/Wood), galeria de transformações e integração com `StickyMobileBar` (Green)

**Checkpoint**: User Stories 1 a 4 funcionais.

---

## Phase 7: User Story 5 - GeralTemplate (Priority: P3)

**Goal**: Entregar o template genérico/padrão no estilo Modern Local Agency para qualquer negócio de serviços locais.

**Independent Test**: Renderizar `GeralTemplate` para um pet shop ou escritório contábil e verificar adaptação harmoniosa.

### Tests for User Story 5 ⚠️
- [ ] T014 [P] [US5] Escrever testes unitários em `src/modules/site-engine/__tests__/geral-template.test.tsx` validando renderização corporativa moderna e flexibilidade (Red)

### Implementation for User Story 5
- [ ] T015 [US5] Redesenhar `src/modules/site-engine/components/GeralTemplate.tsx` com layout equilibrado em Azul Royal / Slate, grid versátil e integração com `StickyMobileBar` (Green)

**Checkpoint**: Todos os 5 templates e componentes de alta conversão implementados.

---

## Phase 8: Polish & Cross-Cutting Quality Gates

**Purpose**: Verificação unificada de qualidade, regressão e acessibilidade

- [ ] T016 Atualizar suíte de regressão em `src/modules/site-engine/__tests__/react-templates.test.tsx` para cobrir todos os 5 templates em conjunto
- [ ] T017 [P] Executar auditoria de acessibilidade e contraste das cores nos botões de ação e textos
- [ ] T018 Executar typecheck rigoroso (`npm run typecheck`) e linter (`npm run lint`)
- [ ] T019 Validar todos os cenários práticos do guia [quickstart.md](./quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Phase 1 (Setup)**: Pode iniciar imediatamente.
2. **Phase 2 (Foundational)**: Depende da Phase 1. Bloqueia a integração final dos templates.
3. **Phases 3 a 7 (User Stories)**: Dependem da Phase 2. Podem ser executadas em sequência (P1 → P2 → P3) ou em paralelo por componente.
4. **Phase 8 (Polish & Quality Gates)**: Depende da conclusão das User Stories.

### Parallel Opportunities
- Tarefas marcadas com `[P]` operam em arquivos isolados e podem ser desenvolvidas em paralelo.
- Os testes (Red) de cada história de usuário podem ser redigidos antes do componente de implementação correspondente.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Completar Phase 1 (Setup de Fallbacks e Variantes).
2. Completar Phase 2 (StickyMobileBar e VisualPitchBadge).
3. Completar Phase 3 (`GastronomiaTemplate`).
4. **Validar MVP**: Rodar `npm test -- src/modules/site-engine/__tests__/gastronomia-template.test.tsx` e inspecionar visualmente.

### Entrega Incremental
- Após o MVP, adicionar progressivamente `SaudeTemplate` (P1), `AutomotivoTemplate` (P2), `BelezaTemplate` (P2) e `GeralTemplate` (P3), rodando os Quality Gates em cada etapa.
