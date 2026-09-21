# Research: Módulo 1 — Maps Radar (Decisões Técnicas & Padrões)

Este documento registra as pesquisas técnicas, decisões de arquitetura e mitigação de riscos para a implementação do **Módulo 1: Maps Radar**.

---

## 1. Pesquisa & Decisões Tecnológicas

### 1.1 Motor de Automação Headless: Playwright vs. Puppeteer vs. Cheerio/HTTP Direto

- **Decisão:** `Playwright` com Chromium headless.
- **Racional:**
  - O Google Maps é uma Single Page Application (SPA) ultra-dinâmica baseada em WebGL, Canvas e renderização assíncrona pesada. Requer execução real de JavaScript e emulação precisa de viewport.
  - O Playwright possui suporte nativo a isolamento de contexto (`browser.newContext()`), interceptação de rotas para desabilitar carregamento de imagens/fontes pesadas (economizando 70% de banda e acelerando a raspagem), além de auto-waiting robusto para seletores dinâmicos.
- **Alternativas descartadas:**
  - _HTTP direto / Cheerio / Axios:_ O HTML estático do Google Maps não contém os estabelecimentos buscados (o feed é injetado via RPC/JSON interno cifrado após boot do JavaScript).
  - _Puppeteer:_ Menos flexível no gerenciamento de múltiplos contextos isolados e suporte cross-platform comparado ao Playwright.

### 1.2 Estratégia Anti-Bloqueio & Evasão de Detecção (Stealth Scraper)

- **Decisão:** Execução com flags de isolamento Chromium + mascaramento de `navigator.webdriver` + delays humanos gaussianos + rotação de User-Agent.
- **Racional:**
  - O Google Maps detecta bots através da flag `navigator.webdriver = true` e padrões de requisições sobre-humanas (rolagens instantâneas de 0ms).
  - Configurações adotadas:
    - Injeção de script de evasão de automação (`Object.defineProperty(navigator, 'webdriver', { get: () => undefined })`);
    - Delays pseudo-aleatórios com jitter entre rolagens de feed (1.2s a 2.8s);
    - Viewport padrão de desktop (`1280x800`);
    - Descarte de requisições de telemetria desnecessárias.
- **Alternativas consideradas:**
  - _API Oficial Google Places:_ Descartada pelo requisito central do projeto de operar com custo zero de infraestrutura na mineração inicial de prospecção.

### 1.3 Estratégia de Testes TDD & Offline Fixtures

- **Decisão:** Testes desacoplados com **HTML Fixtures estáticas** gravadas do Google Maps + Vitest.
- **Racional:**
  - Fazer testes automatizados batendo na web real do Google Maps causaria:
    1. Lentidão extrema na esteira de testes;
    2. Quebras aleatórias (network flakes);
    3. Risco de ban de IP do desenvolvedor durante ciclos TDD rápidos.
  - Com HTML fixtures reais salvas em disco (`__tests__/fixtures/`), o parser de seletores DOM e os extratores de texto executam em milissegundos de forma 100% determinística.
  - Testes E2E reais de ponta a ponta ficam separados em suíte específica de fumaça (smoke test).

### 1.4 Normalização Telefônica Brasileira (E.164 & WhatsApp Validation)

- **Decisão:** Módulo utilitário proprietário tipado com regex e validação de DDDs da ANATEL.
- **Racional:**
  - O formato brasileiro possui particularidades críticas:
    - Celulares têm 9 dígitos iniciados por `9` no DDD;
    - Telefones fixos têm 8 dígitos iniciados por `2`, `3`, `4` ou `5`;
    - Números no Maps aparecem em formatos caóticos: `(11) 98765-4321`, `011 98765 4321`, `+55 11 3456-7890`, `11987654321`.
  - O normalizador converterá todos para o formato canônico E.164 (`+5511987654321`), adicionando a tag booleana `isMobile: true/false` para alimentar a prospecção de WhatsApp.

### 1.5 Classificador Determinístico de Websites

- **Decisão:** Parser baseado no objeto `URL` nativo do Node.js com whitelist categorizada de domínios sociais e blacklist de domínios genéricos.
- **Racional:**
  - Empresas sem site comumente colocam no campo de website:
    - Instagram (`instagram.com/nomedaloja`, `instagr.am/...`)
    - Facebook (`facebook.com/...`, `fb.me/...`)
    - Agregadores de links (`linktr.ee`, `beacons.ai`, `bio.link`)
    - WhatsApp direto (`wa.me`, `api.whatsapp.com`)
    - Aplicativos de delivery (`ifood.com.br`)
  - A lógica identifica se o hostname pertence a essas redes para classificar o lead como `SOCIAL_ONLY` (altíssimo potencial de conversão). Se for um domínio genérico com TLD próprio (ex: `.com.br`, `.com`), classifica como `OWN_WEBSITE`.

### 1.6 Banco de Dados e Persistência Leve

- **Decisão:** SQLite com **Prisma ORM** (`@prisma/client` + `prisma`) integrado via Repository Pattern.
- **Racional:**
  - O Prisma ORM oferece client com tipagem estrita gerada automaticamente a partir do `schema.prisma`, migrações declarativas simples e excelente DX.
  - O padrão de Repository (`ILeadRepository`) isola a camada de dados, permitindo no futuro alternar o provider do Prisma de `file:./dev.db` (SQLite) para `postgresql://...` (Supabase/PostgreSQL) sem alterar nenhuma linha da lógica de negócio do Módulo 1.

---

## 2. Resumo de Diretrizes para o Design (Fase 1)

1. Os seletores DOM do Google Maps devem ser isolados em constantes mapeadas em `maps-selectors.ts` para fácil manutenção se o Google alterar classes CSS.
2. Toda a lógica de qualificação, score e normalização deve ser pura (sem dependência de I/O de rede ou banco), facilitando 100% de cobertura TDD.
3. A interface do Módulo 1 deve expor uma API simples:
   `radarService.search({ niche: string, location: string, limit?: number }): Promise<QualifiedLead[]>`
