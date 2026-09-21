# Tasks: Módulo 4 — Outreach CRM & Portal Web de Operações

**Feature**: Módulo 4 — Outreach CRM & Portal Web  
**Branch**: `004-outreach-crm`  
**Status**: Completed  
**Specification**: [specs/004-outreach-crm/spec.md](./spec.md)  
**Implementation Plan**: [specs/004-outreach-crm/plan.md](./plan.md)  
**Data Model**: [specs/004-outreach-crm/data-model.md](./data-model.md)  
**Contracts**: [specs/004-outreach-crm/contracts/outreach.contract.ts](./contracts/outreach.contract.ts)  
**Quickstart**: [specs/004-outreach-crm/quickstart.md](./quickstart.md)

---

## Phase 1: Setup (Database Schema & Schemas Zod)

**Purpose**: Sincronização do schema Prisma com o SQLite e tipagens do domínio Outreach CRM

- [x] T001 Atualizar modelo `QualifiedLead` com `outreachCopy String?`, `contactedAt DateTime?` e índice `@@index([contactedAt])` em `prisma/schema.prisma`
- [x] T002 Executar migração do SQLite e regenerar cliente Prisma com `npx prisma db push && npx prisma generate`
- [x] T003 [P] Atualizar schemas Zod e tipos em `src/modules/outreach/schemas/outreach.schemas.ts` e `src/modules/outreach/outreach.types.ts` com `outreachCopy`, `contactedAt` e `PortalStatsResponse`

---

## Phase 2: Foundational (Outreach Core Engine & Gemini Adapter)

**Purpose**: Motor de geração de abordagem consultiva Visual Pitch com Gemini e fallback determinístico

- [x] T004 [P] Escrever testes unitários para `CopyGenerator` cobrindo os 4 pilares do Visual Pitch (elogio, problema, preview, CTA) em `src/modules/outreach/__tests__/copy-generator.test.ts`
- [x] T005 [P] Implementar `CopyGenerator` estruturando a abordagem consultiva com fallback determinístico em `src/modules/outreach/core/copy-generator.ts`
- [x] T006 [P] Escrever testes unitários para `GeminiOutreachAdapter` cobrindo `@google/genai` e fallback em `src/modules/outreach/__tests__/gemini-outreach-adapter.test.ts`
- [x] T007 [P] Implementar `GeminiOutreachAdapter` com SDK `@google/genai` (`gemini-2.5-flash`) e fallback resiliente em `src/modules/outreach/core/gemini-outreach-adapter.ts`
- [x] T008 Escrever testes unitários para `OutreachService` com mocks do Prisma em `src/modules/outreach/__tests__/outreach-service.test.ts`
- [x] T009 Implementar `OutreachService` com geração de mensagem e persistência de `outreachCopy` e `contactedAt` em `src/modules/outreach/outreach.service.ts`

**Checkpoint**: Core de Outreach testado e pronto com fallback resiliente.

---

## Phase 3: User Story 1 - Portal Web Dashboard & Gestão de Leads (Priority: P1) 🎯 MVP

**Goal**: Permitir que o operador acesse `http://localhost:3001/` ou `/dashboard`, visualize métricas em tempo real, navegue na lista de leads qualificados e abra os previews em nova aba com 1 clique.

**Independent Test**: Acessar `GET /` no navegador, verificar renderização do dashboard com KPIs do SQLite, filtros por nicho/status e clique em "Ver Site" abrindo `/preview/:slug`.

### Tests for User Story 1

- [x] T010 [P] [US1] Escrever testes de integração para as rotas `GET /`, `GET /dashboard` e `GET /api/portal/stats` em `src/api/__tests__/portal-routes.test.ts`

### Implementation for User Story 1

- [x] T011 [US1] Implementar serviço do portal com cálculo consolidado de KPIs e entrega do HTML em `src/portal/portal-service.ts`
- [x] T012 [US1] Implementar rotas `portal.routes.ts` em `src/api/routes/portal.routes.ts` e registrar no `src/api/server.ts`
- [x] T013 [P] [US1] Implementar interface responsiva Tailwind CSS com tabela de leads, filtros rápidos, contadores de KPI e botão de preview em `src/portal/index.html`

**Checkpoint**: Dashboard MVP operacional servido diretamente pelo Express com visualização de leads e previews.

---

## Phase 4: User Story 2 - Varredura Interativa do Radar pelo Portal (Priority: P2)

**Goal**: Permitir que o operador inicie buscas no Google Maps pelo portal e acompanhe o progresso em tempo real com atualização automática dos leads.

**Independent Test**: Preencher o formulário da aba Radar no Portal, clicar em "Iniciar Mineração", verificar o card de job com spinner e polling a cada 1.5s, e constatar a inserção automática dos novos leads na tabela após conclusão.

### Implementation for User Story 2

- [x] T014 [P] [US2] Implementar formulário interativo de busca com validação de campos (nicho, localização, limite) na aba Radar em `src/portal/index.html`
- [x] T015 [US2] Implementar conexão com `POST /api/radar/search` e polling assíncrono em `GET /api/radar/jobs/:jobId` com animação de progresso e reload em `src/portal/index.html`

**Checkpoint**: Prospecção autônoma pelo portal sem necessidade de requisições manuais via terminal.

---

## Phase 5: User Story 3 - Geração de Abordagem Comercial & WhatsApp (Priority: P3)

**Goal**: Gerar abordagens comerciais com IA para qualquer lead da tabela, permitir edição prévia do texto, abrir WhatsApp Web com confirmação guiada e gerenciar o status do funil.

**Independent Test**: Clicar em "Gerar Pitch" para um lead, editar uma frase no `<textarea>`, verificar a atualização dinâmica do link do WhatsApp, clicar em "Abrir WhatsApp Web", confirmar o envio no diálogo guiado e validar o lead atualizado para `CONTACTED` no SQLite.

### Tests for User Story 3

- [x] T016 [P] [US3] Escrever testes de integração para rotas `POST /api/outreach/generate/:leadId` e `PATCH /api/outreach/leads/:id/status` em `src/api/__tests__/outreach-routes.test.ts`

### Implementation for User Story 3

- [x] T017 [US3] Implementar rotas de outreach em `src/api/routes/outreach.routes.ts` com validação de status e persistência de `outreachCopy` e `contactedAt`
- [x] T018 [US3] Implementar modal de abordagem comercial com `<textarea>` editável e recálculo dinâmico da URL `wa.me` em tempo real em `src/portal/index.html`
- [x] T019 [US3] Implementar badge visual de telefone fixo (`isMobile === false`) e botão de 1 clique "Copiar Mensagem" no modal em `src/portal/index.html`
- [x] T020 [US3] Implementar diálogo de confirmação guiada de disparo WhatsApp que atualiza o status do lead para `CONTACTED` em `src/portal/index.html`

**Checkpoint**: Funil comercial completo de ponta a ponta com prospecção ativa e fechamento no WhatsApp.

---

## Phase 6: Polish & Quality Gates

**Purpose**: Documentação, validação dos 5 quality gates e conformidade com a Constituição

- [x] T021 [P] Criar documentação técnica da API de Outreach e Portal em `docs/api-outreach.md`
- [x] T022 [P] Atualizar coleção de chamadas REST em `radar.http` com endpoints do Módulo 4
- [x] T023 Atualizar documentação arquitetural em `docs/architecture.md` detalhando o Módulo 4
- [x] T024 Executar e validar todos os 5 Quality Gates locais (`npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run audit`, `npm run test:coverage > 85%`)

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: Sem dependências — sincroniza schema Prisma e gera tipos Zod.
2. **Foundational (Phase 2)**: Depende da Phase 1 — implementa e testa o motor de copy e adaptador Gemini.
3. **User Story 1 (Phase 3 - P1 MVP)**: Depende da Phase 2 — entrega o Dashboard visual e tabela de leads.
4. **User Story 2 (Phase 4 - P2)**: Depende da Phase 3 — integra o formulário de busca e polling do Radar.
5. **User Story 3 (Phase 5 - P3)**: Depende da Phase 3 e Phase 2 — implementa o modal de copy, edição e disparo WhatsApp.
6. **Polish (Phase 6)**: Depende de todas as User Stories concluídas.

### Parallel Opportunities

- Tarefas T003, T004, T005, T006, T007 podem rodar em paralelo pois trabalham em arquivos isolados.
- Testes T010 e T016 podem ser escritos em paralelo com a preparação dos templates.
- Tarefas de documentação T021 e T022 podem rodar em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Focus)

1. Completar Phase 1 (Setup) e Phase 2 (Foundational).
2. Implementar Phase 3 (User Story 1): rotas do portal e index.html com tabela de leads e KPIs.
3. Validar de forma independente: abrir `http://localhost:3001/` e navegar pelos previews.

### Incremental Delivery

1. Foundation + US1 (Dashboard & Previews) -> MVP Validado.
2. Adicionar US2 (Busca no Radar via Portal) -> Prospecção autônoma.
3. Adicionar US3 (Copy com IA e WhatsApp) -> Fechamento comercial ativo.
4. Polish e validação de CI local com 100% dos testes verdes e cobertura > 85%.
