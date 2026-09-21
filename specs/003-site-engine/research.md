# Research & Architecture Decisions: Módulo 3 — Site Engine

**Feature**: Módulo 3 — Site Engine (Templates Dinâmicos & Visual Pitch Preview)  
**Date**: 2026-09-21  
**Status**: Approved

---

## 1. Motor de Renderização e Entrega (Next.js 16.3.5 App Router & RSC)

### Decisão

Utilizar o **Next.js na versão 16.3.5 (App Router, React 19, Turbopack)** com **React Server Components (RSC)** na rota dinâmica `/preview/[slug]`. Os templates de nicho são implementados como componentes React puros renderizados no servidor, com estilização Tailwind CSS e injeção de CSS Variables dinâmicas.

### Racional

1. **Unificação Tecnológica**: Toda a aplicação (previews, portal administrativo e APIs) opera sob um único ecossistema full-stack moderno, eliminando a discrepância entre backend Express e frontend estático.
2. **React Server Components (RSC)**: Os previews rodam exclusivamente no servidor, gerando HTML enxuto com zero bundle de JavaScript desnecessário para o cliente, mantendo o carregamento ultrarrápido (Lighthouse 90+) e SEO/OpenGraph perfeito.
3. **Imunidade a XSS Nativa**: O JSX do React 19 realiza escape automático de strings contra injeção de tags HTML maliciosas, complementado por tipagem estrita de Zod.
4. **Turbopack & Hot-Reloading**: O compilador Turbopack do Next.js 16.3.5 proporciona inicialização e atualizações instantâneas no ciclo de desenvolvimento.

### Alternativas Avaliadas

- **Express + Strings de HTML puro**: Foi utilizado na prova de conceito inicial, mas apresentava manutenção difícil de layouts complexos e exigia manter dois processos ou servidores separados do portal. Substituído pelo Next.js 16.3.5.
- **EJS / Mustache / Handlebars**: Rejeitado por falta de tipagem estrita e ausência de integração moderna com componentes React.

---

## 2. Estratégia de CSS & Estilização (Tailwind CSS + CSS Custom Properties)

### Decisão

Injetar o CSS minificado do **Tailwind CSS** diretamente no `<style>` do `<head>` ou servi-lo com cache agressivo, combinando-o com **Variáveis CSS customizadas** (`--brand-primary`, `--brand-secondary`, `--brand-accent`, `--brand-contrast`) calculadas pelo Módulo 2 (`BrandProfile`).

### Racional

1. **Zero Render-Blocking Requests**: A página carrega sem "Flash of Unstyled Content" (FOUC), pois o CSS essencial acompanha o primeiro pacote TCP do HTML.
2. **Personalização Dinâmica Instantânea**: O mesmo template Tailwind renderiza com as cores reais da marca do cliente usando classes que referenciam variáveis nativas (ex: `bg-[var(--brand-primary)]`).
3. **Acessibilidade WCAG AA**: A cor do texto sobre o fundo da marca é determinada dinamicamente através do cálculo de luminância relativa (`contrastTextColor`), assegurando contraste mínimo de 4.5:1.

---

## 3. Padrão de Projeto da Biblioteca de Templates (Strategy Pattern)

### Decisão

Implementar o padrão **Strategy** através da interface `NicheTemplate`:

```typescript
export interface NicheTemplate {
  readonly niche: 'saude' | 'automotivo' | 'gastronomia' | 'beleza' | 'geral';
  render(config: PreviewSiteConfig): string;
}
```

Com 5 estratégias concretas:

1. `SaudeTemplate`: Clínicas, Dentistas, Médicos (foco em agendamento, diferenciais biossegurança, equipe, depoimentos e endereço).
2. `AutomotivoTemplate`: Oficinas mecânicas, Autocentros, Funilaria (foco em orçamento rápido, socorro/guincho, marcas atendidas e revisões).
3. `GastronomiaTemplate`: Restaurantes, Pizzarias, Cafés (foco em pratos do cardápio, fotos reais de comida, reserva de mesa e delivery WhatsApp).
4. `BelezaTemplate`: Salões de beleza, Barbearias, Spas (foco em procedimentos/cortes, galeria estética, avaliações e agendamento).
5. `GeralTemplate`: Padrão resiliente para qualquer outra categoria de serviço local.

### Racional

Segue o princípio Open-Closed (OCP): novos nichos podem ser adicionados criando uma nova classe/estratégia sem modificar o orquestrador do Site Engine.

---

## 4. Geração e Resolução de Slugs Amigáveis

### Decisão

Persistir o campo `slug` no modelo `QualifiedLead` do Prisma com índice único (`@unique`), gerado na criação ou primeira requisição via algoritmo kebab-case:
`{nome-empresa}-{bairro}` (ex: `clinica-sorriso-moema`). Em caso de colisão, adiciona-se sufixo numérico ou hash curto de 4 caracteres.

### Racional

1. URLs como `vitrinelocal.com.br/preview/oficina-precision-moema` passam confiança ao cliente quando compartilhadas no WhatsApp.
2. Indexação direta no SQLite: a busca por slug (`prisma.qualifiedLead.findUnique({ where: { slug } })`) é executada em < 2ms.

---

## 5. Extração Just-In-Time (JIT) Sob Demanda

### Decisão

No endpoint `/preview/:leadId` ou `/preview/:slug`, se o lead existir mas seu `brandProfile` for nulo:

1. O `SiteEngineService` aciona o `BrandExtractorService.extractBrand(leadId)`.
2. O perfil extraído é salvo no banco de dados.
3. A página é renderizada e devolvida imediatamente.
4. Se o lead não existir no banco de dados, retorna HTTP 404.

### Racional

Garante resiliência operacional total: se o operador comercial enviar o link antes de disparar manualmente a extração da marca, o sistema se auto-recupera e exibe a landing page pronta.
