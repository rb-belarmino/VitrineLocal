# Implementation Plan: Módulo 3 — Site Engine (Templates Dinâmicos & Visual Pitch Preview)

**Branch**: `003-site-engine` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-site-engine/spec.md`

---

## Summary

O **Módulo 3 (Site Engine)** implementa um motor de renderização SSR leve e funcional em TypeScript que transforma o `BrandProfile` (Módulo 2) e os dados do `QualifiedLead` (Módulo 1) em landing pages responsivas de altíssima conversão (**Visual Pitch**).

O módulo conta com:

1. **Biblioteca de Templates por Nicho** usando o padrão Strategy: Saúde, Automotivo, Gastronomia, Beleza e Serviços Gerais (fallback).
2. **Injetor de CSS Custom Properties & Tailwind**: Variáveis CSS dinâmicas calculadas com WCAG AA (`--brand-primary`, etc.) sem FOUC.
3. **Roteamento Híbrido Amigável**: Acesso via `/preview/:slug` (ex: `/preview/clinica-sorriso-moema`) e `/preview/:leadId`.
4. **Sanitização XSS Nativa**: Escapamento de entidades HTML em todos os dados externos e sintetizados.
5. **Resiliência JIT (Just-In-Time)**: Extração automática da identidade visual sob demanda se o lead ainda não possuir perfil salvo no primeiro acesso.
6. **Selo de Conversão Visual Pitch**: CTA direto para o WhatsApp oficial da VitrineLocal para fechamento comercial.

---

## Technical Context

**Language/Version**: Node.js 24 LTS, TypeScript 5.7+ (`strict: true`, zero `any`)  
**Primary Framework**: Next.js 16.3.5 (App Router, Turbopack, React 19, Server Components)  
**Primary Dependencies**: `next@16.3.5`, `react@^19.0.0`, `react-dom@^19.0.0`, `tailwindcss`, `zod@^3.24.2`, `@prisma/client@^6.4.1`  
**Storage**: SQLite local (`prisma/dev.db`) com modelo `QualifiedLead` evoluído com `slug: String? @unique`  
**Testing**: Vitest 3.x com coverage v8 para testes unitários e de integração  
**Target Platform**: Next.js App Router (tempo de resposta SSR < 50ms, Lighthouse 90+)  
**Project Type**: Full-Stack Web Application / Server Components Visual Pitch Preview  
**Performance Goals**: Tempo de renderização em memória < 10ms; resposta HTTP completa < 50ms; payload minificado < 60KB  
**Constraints**: Tailwind CSS nativo, componentes React tipados, variáveis WCAG AA dinâmicas, sem vulnerabilidade XSS  
**Scale/Scope**: 5 templates React de nicho, rota dinâmica `/preview/[slug]`, Route Handler de configuração, cobertura > 85%

---

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Princípio I: TDD Obrigatório**
  - Testes unitários para cada template e detector de nicho.
  - Testes unitários para sanitização e gerador de slugs.
  - Testes de integração para as rotas e Route Handlers.
  - Ciclo Red-Green-Refactor estritamente mantido.
- [x] **Princípio II: Quality Gates & CI Local**
  - Typecheck estrito (`strict: true`), ESLint zero warnings, Prettier 100% formatado, npm audit sem vulnerabilidades altas/críticas.
- [x] **Princípio III: Clean Architecture & Desacoplamento**
  - O Site Engine comunica-se com o Módulo 2 via DTO tipado `BrandProfile` / `BrandExtractorService` e com o banco via `SiteEngineRepository`. Lógica de domínio desacoplada de detalhes do framework.
- [x] **Princípio IV: Resiliência Operacional**
  - Extração JIT com fallback inteligente para templates de nicho e cores padrão caso o perfil ainda não exista ou faltem fotos/depoimentos.
- [x] **Princípio V: Segurança e Privacidade por Design**
  - Proteção nativa contra XSS no JSX do React 19; sem exposição de segredos.
- [x] **Princípio VI: Padrão Tecnológico Next.js 16.3.5**
  - Utilização estrita do Next.js 16.3.5 App Router para renderização das páginas de preview e APIs.

---

## Project Structure

### Documentation (this feature)

```text
specs/003-site-engine/
├── spec.md              # Feature specification com 3 user stories e decisões
├── checklists/
│   └── requirements.md  # Checklist de qualidade (16/16 aprovados)
├── research.md          # Decisões de arquitetura (Next.js 16.3.5 App Router, React 19, Strategy, Tailwind, Slugs, JIT)
├── data-model.md        # Prisma Schema update e DTO PreviewSiteConfig
├── contracts/
│   └── site-engine.contract.ts # Schemas Zod e interfaces TypeScript
├── quickstart.md        # Guia prático de execução e validação
├── plan.md              # Este plano de implementação
└── tasks.md             # Tarefas de implementação
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                               # Root layout Next.js 16.3.5
│   ├── globals.css                              # Estilos globais Tailwind CSS
│   ├── preview/
│   │   └── [slug]/
│   │       └── page.tsx                         # Rota pública dinâmica RSC do Visual Pitch
│   └── api/
│       └── preview/
│           └── [leadId]/
│               └── config/
│                   └── route.ts                 # Next.js Route Handler GET /api/preview/[leadId]/config
├── modules/
│   └── site-engine/
│       ├── core/
│       │   ├── slug-generator.ts                # Gerador de slugs kebab-case com desambiguação
│       │   ├── niche-detector.ts                # Mapeador Categoria -> NicheTheme
│       │   └── site-config-builder.ts           # Montador do DTO consolidado PreviewSiteConfig
│       ├── components/
│       │   ├── BasePreviewLayout.tsx            # Wrapper de layout (SEO, metadata, fonts, styles)
│       │   ├── VisualPitchBadge.tsx             # Selo de conversão para WhatsApp VitrineLocal
│       │   ├── SaudeTemplate.tsx                # Template React para Clínicas / Dentistas
│       │   ├── AutomotivoTemplate.tsx           # Template React para Oficinas / Mecânicas
│       │   ├── GastronomiaTemplate.tsx          # Template React para Restaurantes / Delivery
│       │   ├── BelezaTemplate.tsx               # Template React para Salões / Estética
│       │   └── GeralTemplate.tsx                # Template React versátil de fallback para Serviços Gerais
│       ├── repositories/
│       │   └── site-engine.repository.ts        # Busca de lead + brandProfile por id ou slug
│       ├── site-engine.service.ts               # Orquestrador com JIT extraction e montagem de config
│       ├── site-engine.types.ts                 # Tipos TypeScript do domínio
│       └── __tests__/
│           ├── slug-generator.test.ts
│           ├── niche-detector.test.ts
│           ├── site-config-builder.test.ts
│           ├── templates.test.ts
│           ├── site-engine-service.test.ts
│           └── site-engine-repository.test.ts
```

---

## Verification Plan

### Automated Tests

- `npm run test`: Todos os testes unitários do Site Engine e testes de regressão dos Módulos 1 e 2.
- `npm run test:coverage`: Cobertura de código superior a 85% em branches, statements e functions.
- `npm run typecheck`: TypeScript compilando em modo estrito sem erros.
- `npm run lint`: ESLint sem warnings.
- `npm run format:check`: Prettier sem discrepâncias.

### Manual Verification

1. Criar ou consultar um lead qualificado no banco local.
2. Abrir no navegador `http://localhost:3000/preview/{slug}` e inspecionar layout mobile e desktop.
3. Clicar no botão do WhatsApp e no badge da VitrineLocal para testar os links diretos pré-formatados.
