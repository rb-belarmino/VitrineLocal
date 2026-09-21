# Implementation Plan: Módulo 4 — Outreach CRM & Portal Web

**Branch**: `004-outreach-crm` | **Date**: 2026-09-21 | **Spec**: [specs/004-outreach-crm/spec.md](./spec.md)

**Input**: Especificação funcional aprovada e clarificada do Portal Web de Operações e Motor de Outreach CRM.

---

## 1. Summary

O **Módulo 4 (Outreach CRM & Portal Web)** entrega a interface visual de comando operacional da VitrineLocal e o motor de copywriting consultivo com inteligência artificial:

1. **Portal Web do Operador**: Interface unificada servida pelo Next.js 16.3.5 App Router na rota `GET /` (`src/app/page.tsx`), com design responsivo (Tailwind CSS), KPIs em tempo real, filtros dinâmicos, formulário de busca com polling para o Radar e links diretos para abertura dos previews (`/preview/:slug`).
2. **Outreach CRM Engine**: Geração de abordagens no padrão Visual Pitch utilizando `@google/genai` (modelo `gemini-2.5-flash`) com fallback determinístico resiliente, modal interativo com `<textarea>` editável, recálculo em tempo real do link do WhatsApp (`https://wa.me/55...`), confirmação guiada de disparo e transição dos status do funil (`QUALIFIED`, `CONTACTED`, `NEGOTIATING`, `CONVERTED`, `DISQUALIFIED`) com persistência de `outreachCopy` e `contactedAt` no SQLite via Prisma.

---

## 2. Technical Context

- **Language/Version**: TypeScript 5.7+ / Node.js 24 LTS (`strict: true`, zero `any`).
- **Primary Framework**: Next.js 16.3.5 (App Router, Turbopack, React 19).
- **Primary Dependencies**: `next@16.3.5`, `react@^19.0.0`, `react-dom@^19.0.0`, `@google/genai`, `@prisma/client`, `zod@^3.24.2`, `tailwindcss`, `lucide-react`.
- **Storage**: SQLite local via Prisma ORM (tabela `QualifiedLead` estendida com `outreachCopy`, `contactedAt` e indexação).
- **Testing**: Vitest para testes unitários e de integração, cobertura de testes > 85%.
- **Target Platform**: Next.js App Router runtime / Navegadores modernos (Desktop e Mobile).
- **Project Type**: Full-Stack Next.js 16.3.5 Web Application & Route Handlers integrados.
- **Performance Goals**: Carregamento da página do Portal < 50ms; Route Handlers < 100ms; polling de jobs sem overhead.
- **Constraints**: Conformidade estrita com os Quality Gates locais; sem execução automática de `git commit`.
- **Scale/Scope**: Gestão de centenas de leads por sessão de prospecção com isolamento de falhas por estabelecimento.

---

## 3. Constitution Check

_GATE: Validação contra os princípios da Constituição VitrineLocal._

1. **I. Test-Driven Development (TDD) — PASS**
   - Ciclo estrito: Red (testes de rotas e serviços falham) → Green (implementação mínima) → Refactor (otimização e limpeza).
   - Testes unitários para `CopyGenerator`, `GeminiOutreachAdapter`, `OutreachService` e testes de integração para as rotas e Route Handlers.
2. **II. Production-Ready CI & Strict Quality Gates — PASS**
   - TypeScript `strict: true` (zero `any` solto); ESLint sem warnings; `npm audit` limpo; cobertura global > 85%.
3. **III. Modularidade & Arquitetura Limpa — PASS**
   - Módulo 4 isolado em `src/modules/outreach/`, consumindo dados via repositórios e expondo rotas através de Route Handlers Next.js (`src/app/api/outreach/...`).
4. **IV. Resiliência Operacional & Tolerância a Falhas — PASS**
   - Falha ou ausência da chave do Gemini aciona imediatamente o sintetizador determinístico com status `200 OK`; polling com tratamento de falhas; suporte flexível a telefones fixos.
5. **V. Segurança e Privacidade por Design — PASS**
   - `GEMINI_API_KEY` injetada via `process.env`; sanitização de textos contra injeções XSS; normalização de telefones com DDI/DDD antes do envio.
6. **VI. Padrão Tecnológico Next.js 16.3.5 — PASS**
   - Dashboard do operador construído em Next.js 16.3.5 App Router (`src/app/page.tsx`).

---

## 4. Project Structure

### Documentation & Artifacts (`specs/004-outreach-crm/`)

```text
specs/004-outreach-crm/
├── spec.md                       # Especificação da funcionalidade com Clarifications
├── plan.md                       # Este plano de implementação
├── research.md                   # Pesquisa de arquitetura e decisões técnicas (Fase 0)
├── data-model.md                 # Modelagem Prisma, máquina de estados e DTOs Zod (Fase 1)
├── quickstart.md                 # Guia de execução e cenários de validação (Fase 1)
├── contracts/
│   └── outreach.contract.ts      # Contratos Zod para status, outreach e portal stats
├── checklists/
│   └── requirements.md           # Checklist de qualidade da especificação
└── tasks.md                      # Fila de tarefas para implementação (/speckit-tasks)
```

### Source Code (`src/`)

```text
src/
├── app/
│   ├── page.tsx                             # Dashboard operacional do CRM no Next.js 16.3.5
│   └── api/
│       ├── outreach/
│       │   ├── generate/
│       │   │   └── [leadId]/
│       │   │       └── route.ts             # POST /api/outreach/generate/:leadId
│       │   └── leads/
│       │       └── [id]/
│       │           └── status/
│       │               └── route.ts         # PATCH /api/outreach/leads/:id/status
│       └── portal/
│           ├── stats/
│           │   └── route.ts                 # GET /api/portal/stats
│           └── leads/
│               └── route.ts                 # GET /api/portal/leads
├── modules/
│   └── outreach/
│       ├── core/
│       │   ├── copy-generator.ts            # Gerador de copy estruturada (Visual Pitch)
│       │   └── gemini-outreach-adapter.ts   # Integração com Google GenAI e fallback
│       ├── schemas/
│       │   └── outreach.schemas.ts          # Schemas Zod e tipos do domínio Outreach
│       ├── outreach.service.ts              # Orquestrador de abordagem e funil de vendas
│       ├── outreach.types.ts                # Interfaces e DTOs TypeScript
│       └── __tests__/
│           ├── copy-generator.test.ts       # Testes unitários do gerador de pitch
│           └── outreach-service.test.ts     # Testes de unidade e integração do serviço
```

---

## 5. Plano de Implementação por Fases

### Phase 1: Setup, Banco de Dados & Schemas

1. Atualizar o schema Prisma (`prisma/schema.prisma`) com `outreachCopy String?` e `contactedAt DateTime?` em `QualifiedLead`.
2. Executar `npx prisma db push` e `npx prisma generate`.
3. Sincronizar os schemas Zod em `src/modules/outreach/schemas/outreach.schemas.ts` com `contracts/outreach.contract.ts`.

### Phase 2: Core de Outreach & Fallback Resiliente (TDD)

1. Criar testes unitários para `CopyGenerator` validando a metodologia Visual Pitch (elogio aos reviews, ausência de site, link de preview, CTA).
2. Implementar `CopyGenerator` com suporte à personalização de variáveis do lead.
3. Criar `GeminiOutreachAdapter` com chamada ao SDK `@google/genai` e fallback determinístico imediato quando `GEMINI_API_KEY` for omitida ou houver falha de rede.
4. Implementar `OutreachService` com geração de copy e persistência de status no Prisma.

### Phase 3: Portal Web Dashboard & Gestão de Leads (User Story 1 - P1)

1. Criar testes para os Route Handlers do Portal (`GET /api/portal/stats`, `GET /api/portal/leads`).
2. Implementar os Route Handlers do Next.js App Router em `src/app/api/portal/*`.
3. Criar `src/app/page.tsx` com:
   - Header com contadores de KPI consolidados em tempo real.
   - Tabela de leads com filtros por nicho/status, busca instantânea e badges visuais.
   - Indicador dinâmico de "Preview Pronto" e botão direto de abertura em nova aba (`/preview/:identifier`).

### Phase 4: Varredura Interativa do Radar pelo Portal (User Story 2 - P2)

1. Implementar aba "Radar" no portal com formulário intuitivo (Nicho, Localização, Quantidade).
2. Conectar com `POST /api/radar/search` e implementar polling assíncrono em `GET /api/radar/jobs/:jobId`.
3. Adicionar card de progresso em tempo real e atualização automática da tabela de leads ao concluir o job.

### Phase 5: Geração de Abordagem & Disparo WhatsApp (User Story 3 - P3)

1. Criar modal de abordagem comercial acionado pelo botão "Gerar Pitch" na tabela.
2. Integrar com `POST /api/outreach/generate/:leadId`.
3. Renderizar copy em `<textarea>` editável com recálculo em tempo real do link `https://wa.me/55...` e botão "Copiar Mensagem".
4. Adicionar suporte visual para telefones fixos (badge `Fixo` com envio flexível).
5. Implementar diálogo de confirmação guiada ao abrir o WhatsApp e disparo de `PATCH /api/outreach/leads/:id/status` salvando a copy final e atualizando status para `CONTACTED`.

### Phase 6: Documentação & Quality Gates

1. Atualizar documentação em `docs/api-outreach.md` e arquivo de chamadas HTTP `radar.http`.
2. Executar suíte completa de testes e validar os 5 Quality Gates locais (`format:check`, `typecheck`, `lint`, `audit`, `test:coverage > 85%`).

---

## 6. Complexity Tracking

Nenhuma exceção ou violação de complexidade detectada. Toda a arquitetura respeita a Constituição VitrineLocal e as decisões refinadas na etapa de clarificação.
