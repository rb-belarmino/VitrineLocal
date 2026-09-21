# Research & Architecture Decisions: Módulo 3 — Site Engine

**Feature**: Módulo 3 — Site Engine (Templates Dinâmicos & Visual Pitch Preview)  
**Date**: 2026-09-21  
**Status**: Approved

---

## 1. Motor de Renderização e Entrega HTML (SSR Leve)

### Decisão

Utilizar um **Motor de Templates Funcional SSR nativo em TypeScript** com funções de componentes tipadas e sanitização nativa de entidades HTML (`escapeHtml`), sem dependência de frameworks pesados no cliente.

### Racional

1. **Velocidade Extrema**: Renderização direta em memória em menos de 10 milissegundos, com tempo total de resposta HTTP (`GET /preview/:slug` ou `:leadId`) inferior a 40ms.
2. **Zero Client-Side JavaScript**: As landing pages entregam HTML5 e CSS puros. Não há React, Vue ou runtime de cliente para hidratar, resultando em pontuação 95+ no Google Lighthouse e carregamento instantâneo em conexões móveis 3G/4G.
3. **Imunidade a XSS por Design**: Todas as variáveis mineradas ou sintetizadas por IA (depoimentos, nomes, endereços) passam obrigatoriamente pela sanitização de entidades (`&`, `<`, `>`, `"`, `'`) antes de serem interpoladas no HTML.
4. **Testabilidade Imbatível**: Componentes de template são funções puras `(config: PreviewSiteConfig) => string`, permitindo testes unitários instantâneos com Vitest e validações de DOM com Cheerio.

### Alternativas Avaliadas

- **Next.js / React SSR**: Adicionaria complexidade excessiva, build separado, overhead de hidratação no cliente e tempo de resposta superior a 300ms. Rejeitado.
- **EJS / Mustache / Handlebars**: Não possuem tipagem estrita de TypeScript em tempo de compilação, dificultando refatorações e violando nossa constituição de tipagem estrita. Rejeitado.

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
