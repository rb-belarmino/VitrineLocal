# Tasks: Módulo 3 — Site Engine (Templates Dinâmicos & Visual Pitch Preview)

**Feature**: Módulo 3 — Site Engine  
**Branch**: `003-site-engine`  
**Status**: Ready for Implementation  
**Specification**: [specs/003-site-engine/spec.md](./spec.md)  
**Implementation Plan**: [specs/003-site-engine/plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estruturação de diretórios e evolução do schema do banco de dados

- [x] T001 Criar estrutura de diretórios do módulo em `src/modules/site-engine/{core,templates,repositories,__tests__}`
- [x] T002 Atualizar `prisma/schema.prisma` adicionando campo `slug String? @unique` ao modelo `QualifiedLead`
- [x] T003 [P] Copiar schemas e tipos de contratos em `src/modules/site-engine/schemas/site-engine.schemas.ts` e `src/modules/site-engine/site-engine.types.ts`
- [x] T004 Executar `npx prisma db push` e `npx prisma generate` para sincronizar o banco SQLite e atualizar o Prisma Client

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Componentes fundamentais de domínio, segurança e persistência que bloqueiam todas as User Stories

> **⚠️ CRITICAL**: Nenhuma User Story pode ser iniciada antes da conclusão desta fase

- [x] T005 [P] Escrever testes unitários para `SlugGenerator` em `src/modules/site-engine/__tests__/slug-generator.test.ts`
- [x] T006 [P] Implementar `SlugGenerator` com normalização kebab-case (`nome-bairro`) e resolução de colisão em `src/modules/site-engine/core/slug-generator.ts`
- [x] T007 [P] Escrever testes unitários para `HtmlSanitizer` anti-XSS em `src/modules/site-engine/__tests__/html-sanitizer.test.ts`
- [x] T008 [P] Implementar `HtmlSanitizer` com escapamento estrito de entidades HTML em `src/modules/site-engine/core/html-sanitizer.ts`
- [x] T009 [P] Escrever testes unitários para `NicheDetector` em `src/modules/site-engine/__tests__/niche-detector.test.ts`
- [x] T010 [P] Implementar `NicheDetector` mapeando categorias para `NicheTheme` em `src/modules/site-engine/core/niche-detector.ts`
- [x] T011 [P] Escrever testes unitários para `SiteConfigBuilder` em `src/modules/site-engine/__tests__/site-config-builder.test.ts`
- [x] T012 Implementar `SiteConfigBuilder` consolidando `QualifiedLead` e `BrandProfile` no DTO `PreviewSiteConfig` em `src/modules/site-engine/core/site-config-builder.ts`
- [x] T013 Escrever testes de integração para `SiteEngineRepository` em `src/modules/site-engine/__tests__/site-engine-repository.test.ts`
- [x] T014 Implementar `SiteEngineRepository` para busca por ID ou slug e atualização de slug em `src/modules/site-engine/repositories/site-engine.repository.ts`

**Checkpoint**: Fundação pronta — gerador de slug, sanitizador anti-XSS, detector de nicho, montador de DTO e repositório 100% testados e funcionais.

---

## Phase 3: User Story 1 - Renderização Dinâmica da Landing Page de Demonstração (Priority: P1) 🎯 MVP

**Goal**: Permitir que operadores e clientes acessem uma landing page React Server Components responsiva e funcional via Next.js 16.3.5 App Router (`/preview/[slug]`) com extração Just-In-Time automática caso o perfil ainda não exista.

**Independent Test**: Acessar `http://localhost:3000/preview/[slug]` em um lead com ou sem perfil e verificar retorno HTTP 200 com HTML gerado via RSC, variáveis CSS injetadas e botão de WhatsApp funcional.

### Tests for User Story 1 (TDD) ⚠️

> **NOTE: Escrever os testes primeiro e garantir que FALHEM antes da implementação**

- [x] T015 [P] [US1] Escrever testes unitários para `BasePreviewLayout` em `src/modules/site-engine/__tests__/base-layout.test.ts`
- [x] T016 [P] [US1] Escrever testes unitários de orquestração do `SiteEngineService` (incluindo fluxo JIT e erro 404) em `src/modules/site-engine/__tests__/site-engine-service.test.ts`
- [x] T017 [P] [US1] Escrever testes unitários/integração para os templates React do Site Engine em `src/modules/site-engine/__tests__/templates.test.ts`

### Implementation for User Story 1

- [x] T018 [P] [US1] Implementar componente `BasePreviewLayout` com injeção de CSS custom properties, fontes e meta tags em `src/modules/site-engine/components/BasePreviewLayout.tsx`
- [x] T019 [US1] Implementar `SiteEngineService` com resolução de slug, montagem de config e extração JIT via `BrandExtractorService` em `src/modules/site-engine/site-engine.service.ts`
- [x] T020 [US1] Criar rota dinâmica Next.js 16.3.5 `app/preview/[slug]/page.tsx` consumindo `SiteEngineService`
- [x] T021 [US1] Criar Route Handler Next.js `app/api/preview/[leadId]/config/route.ts`

**Checkpoint**: MVP do Site Engine concluído no Next.js 16.3.5. Páginas de preview renderizam via RSC por slug com suporte a JIT extraction e endpoints de configuração.

---

## Phase 4: User Story 2 - Adaptação Semântica e Temática por Nicho de Mercado (Priority: P2)

**Goal**: Renderizar layouts e estruturas de seções especializadas para Saúde, Automotivo, Gastronomia, Beleza e Serviços Gerais como componentes React com base na categoria do lead.

**Independent Test**: Gerar previews para leads de diferentes verticais e validar no DOM renderizado a presença de seções temáticas correspondentes.

### Implementation for User Story 2

- [x] T022 [P] [US2] Implementar componente React `SaudeTemplate` (agendamento, diferenciais de atendimento, equipe e depoimentos) em `src/modules/site-engine/components/SaudeTemplate.tsx`
- [x] T023 [P] [US2] Implementar componente React `AutomotivoTemplate` (orçamento rápido, socorro/guincho, marcas e serviços mecânicos) em `src/modules/site-engine/components/AutomotivoTemplate.tsx`
- [x] T024 [P] [US2] Implementar componente React `GastronomiaTemplate` (cardápio visual, especialidades, fotos de pratos e delivery) em `src/modules/site-engine/components/GastronomiaTemplate.tsx`
- [x] T025 [P] [US2] Implementar componente React `BelezaTemplate` (procedimentos estéticos, galeria visual e agendamento) em `src/modules/site-engine/components/BelezaTemplate.tsx`
- [x] T026 [P] [US2] Implementar componente React `GeralTemplate` (serviços locais universais de fallback) em `src/modules/site-engine/components/GeralTemplate.tsx`
- [x] T027 [US2] Implementar seletor dinâmico de templates React por nicho em `src/modules/site-engine/components/TemplateSelector.tsx`

**Checkpoint**: Biblioteca completa com os 5 nichos temáticos operando em React com seleção dinâmica e fallback transparente.

---

## Phase 5: User Story 3 - Banner de Demonstração e Conversão do Visual Pitch (Priority: P3)

**Goal**: Incluir barra/selo sutil de demonstração ("Quero este site para minha empresa") com CTA que abre o WhatsApp comercial da VitrineLocal com mensagem pré-formatada.

**Independent Test**: Inspecionar o componente gerado e verificar a presença do badge de demonstração e o link com `https://wa.me/...` contendo `leadId` e nome da empresa.

### Implementation for User Story 3

- [x] T028 [US3] Implementar componente React `VisualPitchBadge` com texto de aviso e botão direto para WhatsApp da VitrineLocal em `src/modules/site-engine/components/VisualPitchBadge.tsx`
- [x] T029 [US3] Integrar `VisualPitchBadge` no topo/rodapé de `BasePreviewLayout` em `src/modules/site-engine/components/BasePreviewLayout.tsx`

**Checkpoint**: O ciclo de conversão do Visual Pitch está fechado no Next.js 16.3.5. O dono do negócio pode reivindicar o site com 1 clique.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentação, validação dos 5 quality gates e testes de regressão

- [x] T030 [P] Criar documentação técnica da API de preview em `docs/api-preview.md`
- [x] T031 [P] Adicionar seção 'MÓDULO 3: SITE ENGINE (VISUAL PITCH PREVIEWS)' em `radar.http` com requisições de teste (`GET /preview/:slug`, `GET /api/preview/:id/config`)
- [x] T032 Atualizar `docs/architecture.md` detalhando Next.js 16.3.5 App Router e o fluxo de templates do Módulo 3
- [x] T033 Executar validação completa dos 5 Quality Gates locais (`npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run audit`, `npm run test:coverage`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — inicia imediatamente.
- **Foundational (Phase 2)**: Depende da Phase 1 — BLOQUEIA as User Stories.
- **User Story 1 (Phase 3)**: Depende da Phase 2 — entrega o MVP de renderização e rotas.
- **User Story 2 (Phase 4)**: Depende da Phase 3 — desacopla e especializa os 5 templates de nicho.
- **User Story 3 (Phase 5)**: Depende das fases 3 e 4 — finaliza o badge e links de conversão do Visual Pitch.
- **Polish (Phase 6)**: Depende da conclusão de todas as User Stories.

---

## Parallel Opportunities

```bash
# Execução paralela na Fundação (Phase 2):
Task T005 & T006: SlugGenerator
Task T007 & T008: HtmlSanitizer
Task T009 & T010: NicheDetector
Task T011 & T012: SiteConfigBuilder

# Execução paralela na User Story 2 (Phase 4):
Task T024: SaudeTemplate
Task T025: AutomotivoTemplate
Task T026: GastronomiaTemplate
Task T027: BelezaTemplate
Task T028: GeralTemplate
```

---

## Implementation Strategy

1. **MVP First (Phase 1, 2 e 3)**: Obter a primeira rota `/preview/:id` e `/preview/:slug` devolvendo HTML5 funcional e responsivo com dados e cores reais do lead.
2. **Especialização de Nichos (Phase 4)**: Expandir para os 5 templates específicos do mercado local.
3. **Conversão Comercial (Phase 5)**: Integrar o selo e CTA direto de fechamento para o WhatsApp da VitrineLocal.
4. **Validação Estrita (Phase 6)**: Rodar os 5 Quality Gates garantindo 100% de conformidade com a Constituição.
