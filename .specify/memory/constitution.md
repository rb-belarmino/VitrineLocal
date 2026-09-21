# VitrineLocal Constitution

> Documento constitucional de princípios e governança técnica do ecossistema VitrineLocal.

## Core Principles

### I. Test-Driven Development (TDD) — Non-Negotiable
- Toda lógica de negócio, rotas de API, extratores, parser de dados e componentes de template devem possuir cobertura de testes automatizados.
- O ciclo estrito é: Teste Primeiro (Red) -> Código Mínimo (Green) -> Refatoração & Limpeza (Refactor).
- Testes unitários com Vitest para lógica isolada; testes de integração com Playwright/Supertest/mock de browser para scraping e renderização; testes E2E para o fluxo crítico.

### II. Production-Ready CI & Strict Quality Gates
- Cada commit e pull request deve passar obrigatoriamente por verificação automatizada completa:
  1. `typecheck`: TypeScript `strict: true`, sem tipagens soltas (`any`).
  2. `lint`: Análise estática de código com padrões rígidos (ESLint / Biome).
  3. `audit`: Auditoria de vulnerabilidades em dependências (`npm audit` / dependency check).
  4. `security`: Análise de segurança estática (SAST) e detecção de secrets/vazamento de credenciais.
  5. `test`: 100% dos testes passando sem flakes.

### III. Modularidade & Arquitetura Limpa (Clean Boundaries)
- O sistema é fatiado nos 4 domínios funcionais:
  - **Módulo 1: Maps Radar (Scraper)** — Ingestion & Discovery
  - **Módulo 2: Brand Extractor** — Identity & Enrichment
  - **Módulo 3: Site Engine** — Template Engine & Public Preview Hosting
  - **Módulo 4: Outreach CRM** — Copywriting IA & Funil Comercial
- Os módulos comunicam-se via contratos estritos (Schemas Zod / DTOs tipados). Nenhum módulo acessa estruturas internas acopladas de outro módulo.

### IV. Resiliência Operacional & Tolerância a Falhas
- Web scraping e chamadas a LLMs são sujeitos a instabilidades de rede, mudanças de interface, rate-limits e captchas.
- Todas as operações externas devem implementar:
  - Backoff exponencial com jitter;
  - Circuit breakers ou limites de retentativas;
  - Isolamento de falhas: a falha de um lead não pode abortar a fila de processamento;
  - Logs estruturados contendo IDs rastreáveis de sessão e lead.

### V. Segurança e Privacidade por Design
- Nenhuma chave de API (OpenAI, Gemini, Anthropic, banco de dados) pode ser versionada.
- Validação estrita de variáveis de ambiente no startup da aplicação.
- Proteção contra SSRF e injeção maliciosa nos links e dados coletados do scraping antes de renderizar no Site Engine.

---

## Governança do Projeto
- A Constituição tem precedência sobre qualquer atalho momentâneo ou solicitação informal de "código rápido".
- Qualquer alteração arquitetural exige atualização prévia do PRD/Spec e documentação do racional técnico.
- Nenhuma funcionalidade é dada como concluída sem validação contra os critérios de sucesso e testes automatizados.

**Version**: 1.0.0 | **Ratified**: 2026-09-21 | **Last Amended**: 2026-09-21
