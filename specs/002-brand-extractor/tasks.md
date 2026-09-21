# Tasks: Brand Extractor (Módulo 2)

**Input**: Design artifacts from `/specs/002-brand-extractor/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`)
**Prerequisites**: Módulo 1 (Maps Radar) operacional e Constitution VitrineLocal ativa (TDD obrigatório, TypeScript estrito, zero warnings).

---

## Phase 1: Setup (Shared Infrastructure & Dependencies)

**Purpose**: Instalação de dependências e estruturação de pastas do módulo

- [x] T001 Instalar dependência oficial da Google Gemini API `@google/genai` no package.json
- [x] T002 Criar estrutura de diretórios para o módulo em `src/modules/brand/` (`core/`, `adapters/`, `repositories/`, `schemas/`, `__tests__/`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Modelagem de dados Prisma, contratos Zod e repositório de persistência

**⚠️ CRITICAL**: Nenhuma história de usuário pode ser finalizada antes da conclusão desta fundação.

- [x] T003 Atualizar schema Prisma em `prisma/schema.prisma` adicionando modelo `BrandProfile` com relação 1:1 com `QualifiedLead` e rodar `prisma db push`
- [x] T004 [P] Implementar schemas Zod e DTOs de validação em `src/modules/brand/schemas/brand.schemas.ts` a partir do contrato `specs/002-brand-extractor/contracts/brand-extractor.contract.ts`
- [x] T005 [P] Definir tipos TypeScript e interfaces de domínio em `src/modules/brand/brand.types.ts`
- [x] T006 [P] Escrever testes unitários para o repositório em `src/modules/brand/__tests__/brand-repository.test.ts`
- [x] T007 Implementar repositório `BrandRepository` em `src/modules/brand/repositories/brand.repository.ts` garantindo operações de busca por leadId, upsert de perfil e tratamento de idempotência

**Checkpoint**: Fundação pronta - banco atualizado e repositório testado e aprovado.

---

## Phase 3: User Story 1 - Extração de Identidade Visual e Paleta de Cores (Priority: P1) 🎯 MVP

**Goal**: Extrair fotos de alta resolução, logotipo candidato, paleta de cores dominante com contraste WCAG AA e catálogo de fallback por nicho comercial.

**Independent Test**: Pode ser verificado fornecendo URLs de imagens do Maps e calculando a paleta de 4 cores (primária, secundária, fundo e texto) com contraste garantido.

### Tests for User Story 1 (TDD - Write First) ⚠️

- [x] T008 [P] [US1] Escrever testes unitários para o dicionário de paletas de nicho em `src/modules/brand/__tests__/niche-palettes.test.ts`
- [x] T009 [P] [US1] Escrever testes unitários para o extrator de cores e cálculo de contraste WCAG em `src/modules/brand/__tests__/color-extractor.test.ts`
- [x] T010 [P] [US1] Escrever testes para o extrator de imagens e fotos do Maps em `src/modules/brand/__tests__/maps-image-extractor.test.ts`

### Implementation for User Story 1

- [x] T011 [P] [US1] Implementar dicionário de paletas de nicho e normalizador de categoria em `src/modules/brand/core/niche-palettes.ts`
- [x] T012 [P] [US1] Implementar algoritmo de quantização de cores e normalizador de contraste acessível em `src/modules/brand/core/color-extractor.ts`
- [x] T013 [US1] Implementar extrator de imagens e fotos de capa via Playwright em `src/modules/brand/adapters/maps-image-extractor.ts` (reaproveitando browser pool do radar)
- [x] T014 [US1] Implementar fallback para link social (Instagram) em `src/modules/brand/adapters/social-image-extractor.ts` quando o Maps tiver menos de 3 imagens

**Checkpoint**: User Story 1 funcional e testável de forma 100% isolada.

---

## Phase 4: User Story 2 - Curadoria de Prova Social e Avaliações Reais (Priority: P2)

**Goal**: Extrair depoimentos do Google Maps e selecionar de 3 a 5 avaliações 5 estrelas mais completas e expressivas.

**Independent Test**: Fornecer lista de avaliações brutas mockadas e validar que o algoritmo descarta avaliações sem texto ou negativas e ranqueia pelo tamanho do comentário descritivo.

### Tests for User Story 2 (TDD - Write First) ⚠️

- [x] T015 [P] [US2] Escrever testes unitários para o curador de avaliações em `src/modules/brand/__tests__/review-curator.test.ts`
- [x] T016 [P] [US2] Escrever testes unitários para o scraper de avaliações do Maps em `src/modules/brand/__tests__/maps-review-scraper.test.ts`

### Implementation for User Story 2

- [x] T017 [P] [US2] Implementar curador e seletor heurístico de reviews em `src/modules/brand/core/review-curator.ts` (filtro 5 estrelas, descarte de comentários vazios, ordenação por extensão)
- [x] T018 [US2] Implementar scraper de avaliações via Playwright em `src/modules/brand/adapters/maps-review-scraper.ts`

**Checkpoint**: Histórias 1 e 2 funcionam independentemente e podem rodar em conjunto.

---

## Phase 5: User Story 3 - Síntese Semântica de Conteúdo com IA (Priority: P3)

**Goal**: Gerar headline, subheadline, parágrafo sobre a empresa, lista de serviços prováveis e chamada para ação através da Google Gemini API (`@google/genai`) com fallback determinístico.

**Independent Test**: Chamar o sintetizador com dados do lead e verificar a geração dos 5 campos semânticos formatados, além de testar o fallback imediato em caso de erro na API do Gemini.

### Tests for User Story 3 (TDD - Write First) ⚠️

- [x] T019 [P] [US3] Escrever testes unitários para o adaptador do Gemini e gerador de fallback em `src/modules/brand/__tests__/gemini-synthesizer.test.ts`

### Implementation for User Story 3

- [x] T020 [US3] Implementar sintetizador de conteúdo semântico com `@google/genai` e gerador de fallback em `src/modules/brand/adapters/gemini-synthesizer.ts`

**Checkpoint**: Todas as histórias de usuário possuem seus componentes individuais e adaptadores implementados e testados.

---

## Phase 6: Orchestration, Service Layer & API Endpoints

**Purpose**: Unificar os componentes no serviço principal, implementar caching/idempotência e disponibilizar as rotas HTTP REST.

### Tests for Service and API (TDD - Write First) ⚠️

- [x] T021 [P] Escrever testes unitários para o serviço orquestrador em `src/modules/brand/__tests__/brand-service.test.ts`
- [x] T022 [P] Escrever testes de integração das rotas REST em `src/api/__tests__/brand-routes.test.ts`

### Implementation

- [x] T023 Implementar `BrandExtractorService` em `src/modules/brand/brand.service.ts` unindo US1, US2 e US3, com suporte a cache no banco SQLite e parâmetro `force=true`
- [x] T024 Implementar rotas Express `POST /api/brand/extract/:leadId` e `GET /api/brand/:leadId` em `src/api/routes/brand.routes.ts`
- [x] T025 Registrar rotas de marca no servidor principal em `src/api/server.ts`

**Checkpoint**: API REST operacional respondendo nos endpoints `/api/brand/*`.

---

## Phase 7: Polish & Quality Gates

**Purpose**: Validação dos 5 Quality Gates inegociáveis, documentação e REST Client

- [x] T026 [P] Atualizar arquivo de requisições `radar.http` incluindo as chamadas completas do Brand Extractor (`POST /api/brand/extract/:leadId` e `GET /api/brand/:leadId`)
- [x] T027 [P] Atualizar documentação da API em `docs/api-brand.md`
- [x] T028 [P] Atualizar documentação de arquitetura em `docs/architecture.md`
- [x] T029 Executar bateria completa de testes e cobertura com `npm run test:coverage` (meta >= 85%)
- [x] T030 Executar verificação de tipagem estrita com `npm run typecheck`
- [x] T031 Executar verificação de linter e formatação com `npm run lint` e `npm run format:check`
- [x] T032 Executar auditoria de segurança de dependências com `npm run audit`
- [x] T033 Executar compilação de produção com `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: Inicializa dependências `@google/genai` e diretórios.
2. **Foundational (Phase 2)**: Atualiza Prisma e contratos Zod (Bloqueia US1, US2, US3).
3. **User Stories (Phases 3, 4, 5)**:
   - US1 (Identidade Visual & Cores)
   - US2 (Curadoria de Depoimentos)
   - US3 (Síntese Semântica IA)
     _(Podem ser desenvolvidas de forma desacoplada ou sequencial)_.
4. **Orquestração & API (Phase 6)**: Conecta US1, US2 e US3 no serviço e expõe endpoints.
5. **Quality Gates & Polish (Phase 7)**: Garantia de produção e CI verde.

### Parallel Opportunities

- T004, T005, T006 (Contratos, Tipos e Testes do Repositório) em paralelo.
- T008, T009, T010 (Testes de US1) em paralelo.
- T011, T012 (Lógica pura de nicho e cores) em paralelo.
- T015, T016 (Testes de US2) em paralelo.
- T026, T027, T028 (Documentação e testes REST Client) em paralelo.

---

## Implementation Strategy (MVP First)

1. **Passo 1**: Setup + Fundação (Prisma schema + Repositório + Schemas Zod).
2. **Passo 2**: User Story 1 (Cores, Contraste, Fallback por Nicho e Imagens) — **MVP Visual Entregue**.
3. **Passo 3**: User Story 2 (Curadoria de Depoimentos 5 Estrelas) — **Prova Social Entregue**.
4. **Passo 4**: User Story 3 (Síntese Semântica Gemini) — **Conteúdo Persuasivo Entregue**.
5. **Passo 5**: Orquestrador e Rotas de API (`/api/brand/extract/:leadId`).
6. **Passo 6**: Verificação dos 5 Quality Gates locais e documentação.
