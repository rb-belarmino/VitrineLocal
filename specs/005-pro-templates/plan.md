# Implementation Plan: 005-pro-templates (Professional Niche Templates)

**Branch**: `005-pro-templates` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-pro-templates/spec.md`

---

## Summary

Redesenhar e elevar os 5 templates de nicho do **Site Engine** (`GastronomiaTemplate`, `SaudeTemplate`, `AutomotivoTemplate`, `BelezaTemplate` com variante de Barbearia, e `GeralTemplate`) e o componente `VisualPitchBadge`, inspirando-se em landing pages de alta conversão do **Figma Community**.

A arquitetura mantém Server Components puros no Next.js 16.3.5 / React 19, interatividade de acordeão nativa via HTML `<details>/<summary>`, Sticky Mobile Bar inferior para conversão direta no WhatsApp, acervo de fotos curadas em alta definição via Unsplash CDN para fallbacks, e zero JavaScript bundle extra no cliente.

---

## Technical Context

**Language/Version**: TypeScript 5.x (Strict mode: `strict: true`, zero `any`)  
**Primary Dependencies**: Next.js 16.3.5 (App Router, Server Components), React 19, Tailwind CSS v4 / v3  
**Storage**: N/A para templates (consumo do objeto DTO `PreviewSiteConfig` validado via Zod)  
**Testing**: Vitest (`npm test`) com testes unitários de renderização de componentes e fallbacks  
**Target Platform**: Web responsiva (Mobile-first 360px-430px, Tablet e Desktop 1024px-1920px)  
**Project Type**: Full-Stack Web Application (Next.js 16.3.5)  
**Performance Goals**: FCP < 1.2s em conexão móvel 4G; zero hidratação JS client-side para o corpo do template  
**Constraints**: WCAG AA em acessibilidade/contraste, sanitização de inputs HTML contra XSS (`html-sanitizer.ts`)  
**Scale/Scope**: 5 componentes de template + 1 componente de pitch flutuante + 1 utilitário de fallbacks e variantes  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Test-Driven Development (TDD):** Todos os componentes e utilitários de templates possuirão testes automatizados com Vitest cobrindo dados completos, dados mínimos, detecção de barbearia e fallbacks de imagem.
- [x] **II. Production-Ready CI & Strict Quality Gates:** TypeScript estrito (`strict: true`), ESLint/Biome limpo, auditoria de dependências e 100% dos testes verdes.
- [x] **III. Clean Boundaries:** Os templates apenas consomem a interface tipada `PreviewSiteConfig` do domínio do Site Engine, sem acoplamento a banco de dados ou detalhes internos de outros módulos.
- [x] **IV. Resiliência Operacional:** Fallback gracioso com banco de fotos curadas via Unsplash CDN quando o lead não possuir fotos no Google Maps; layout resistente a nomes ou textos excessivamente longos (`break-words`).
- [x] **V. Segurança e Privacidade:** Nenhuma chave exposta; sanitização de texto e links contra XSS.
- [x] **VI. Padrão Unificado Next.js 16.3.5 & React 19:** Mantido estritamente no App Router como Server Components sob `src/modules/site-engine/components` e consumido em `src/app/preview/[slug]`.

---

## Project Structure

### Documentation (this feature)

```text
specs/005-pro-templates/
├── spec.md              # Especificação de requisitos e tokens de design
├── plan.md              # Este plano de implementação
├── research.md          # Fase 0: Pesquisa técnica e decisões de arquitetura
├── data-model.md        # Fase 1: Modelos de dados, tokens e mapa de fallbacks
├── quickstart.md        # Fase 1: Guia de validação automatizada e manual
├── contracts/           # Fase 1: Contratos TypeScript de componentes e utilitários
│   └── pro-templates.contract.ts
├── checklists/
│   └── requirements.md  # Checklist de qualidade da especificação
└── tasks.md             # Fase 2: Tarefas ordenadas por dependência (gerado via /speckit-tasks)
```

### Source Code Layout

```text
src/
└── modules/
    └── site-engine/
        ├── components/
        │   ├── GastronomiaTemplate.tsx     # [MODIFY] Redesign Figma Dark Amber + Sticky Bar
        │   ├── SaudeTemplate.tsx           # [MODIFY] Redesign Figma Clean Clinic + Accordion FAQ
        │   ├── AutomotivoTemplate.tsx      # [MODIFY] Redesign Figma Dark Industrial + Badges
        │   ├── BelezaTemplate.tsx          # [MODIFY] Redesign Figma Editorial Luxe + Barbearia Switch
        │   ├── GeralTemplate.tsx           # [MODIFY] Redesign Figma Modern Local Agency
        │   ├── VisualPitchBadge.tsx        # [MODIFY] Floating pill backdrop-blur + Rodapé
        │   └── StickyMobileBar.tsx         # [NEW] Barra fixa inferior para conversão WhatsApp
        ├── core/
        │   ├── template-fallbacks.ts       # [NEW] Utilitário de fotos Unsplash e detecção barbearia
        │   └── html-sanitizer.ts           # [EXISTING] Sanitizador XSS
        ├── __tests__/
        │   ├── template-fallbacks.test.ts  # [NEW] Testes de fallbacks e variante barbearia
        │   └── react-templates.test.tsx    # [MODIFY] Suíte completa de testes dos 5 templates
        └── site-engine.types.ts            # [EXISTING] Tipos de PreviewSiteConfig
```

**Structure Decision**: Preserva a arquitetura modular limpa do VitrineLocal. Os templates residem na camada de apresentação de domínio de `site-engine/components` e são consumidos diretamente pela rota pública do Next.js em `src/app/preview/[slug]/page.tsx`.

---

## Complexity Tracking

*Nenhuma violação constitucional identificada. O design utiliza as primitivas nativas do framework sem dependências pesadas adicionais.*
