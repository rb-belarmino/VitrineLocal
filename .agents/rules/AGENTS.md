# AGENTS.md — Regras de Operação e Governança dos Agentes (VitrineLocal)

> **Filosofia Central (Engenharia de Produção & Production-Ready):**
> IAs são geradores de texto estatísticos ultra-rápidos que atuam como estagiários/júniores hiperativos. Elas **NUNCA** devem ter carta branca para codificar sem rédeas. A disciplina de engenharia, tipagem estrita, testes automatizados (TDD), análise estática de segurança e pipelines de CI inquebráveis são a única garantia de software em nível de produção.

---

## 1. Princípios Inegociáveis (Non-Negotiable Core)

1. **Test-Driven Development (TDD) Obrigatório:**
   - Nenhum código de produção deve ser escrito antes do teste existir e falhar (**Red**).
   - O código escrito deve ser o estritamente necessário para fazer o teste passar (**Green**).
   - Em seguida, melhore a estrutura sem quebrar os testes (**Refactor**).
   - Testes unitários para regras de negócio isoladas, testes de integração para fluxos de banco/scraping/APIs, e testes E2E para interfaces e fluxos críticos.

2. **Quality Gates & CI Local Rigoroso (Production Ready):**
   - Antes de considerar qualquer tarefa finalizada, TODO o pipeline de validação deve rodar com sucesso:
     - **Typecheck:** TypeScript em modo estrito (`strict: true`, zero `any` não justificado).
     - **Linting & Formatting:** ESLint / Biome sem warnings nem erros.
     - **Auditoria de Dependências:** `npm audit` / verificação de vulnerabilidades conhecidas sem alertas críticos/altos.
     - **Segurança Estática (SAST & Secret Detection):** Varredura de segredos (chaves de API, senhas, tokens) e padrões inseguros.
     - **Suíte de Testes:** 100% dos testes verdes.

3. **Arquitetura Modular Desacoplada (Clean Architecture / Hexagonal):**
   - O sistema é dividido estritamente nos 4 módulos:
     - `Module 1: Maps Radar` (Scraper Playwright)
     - `Module 2: Brand Extractor` (Extrator visual e semântico)
     - `Module 3: Site Engine` (Renderizador de templates dinâmicos)
     - `Module 4: Outreach CRM` (Copywriting IA e funil de vendas)
   - Nenhum módulo deve depender diretamente dos detalhes de implementação do outro; a comunicação se dá por interfaces (Ports/Adapters) e schemas tipados compartilhados (ex: Zod / schemas TypeScript).

4. **Tratamento de Erros, Resiliência e Observabilidade:**
   - Scrapers e chamadas a APIs de IA são propensos a falhas de rede, captchas, mudanças de DOM e rate limits.
   - Toda operação I/O deve conter timeouts explícitos, retries exponenciais configuráveis e logs estruturados com contexto.
   - Falhas no scraping de um lead não devem derrubar o lote inteiro (isolamento de falhas).

5. **Privacidade e Segurança por Padrão:**
   - Respeito a dados sensíveis.
   - Nenhuma chave de API (Google, OpenAI, Anthropic, Gemini, Supabase) em código ou commits; uso estrito de variáveis de ambiente com validação em tempo de boot (ex: via Zod schema no `process.env`).

---

## 2. Fluxo de Trabalho do Agente

1. **Leitura e Alinhamento:**
   - O agente deve sempre consultar o PRD/Spec em `specs/` e a Constituição em `.specify/memory/constitution.md` antes de propor alterações arquiteturais ou de código.
2. **Proposta e Validação:**
   - O agente apresenta planos e especificações antes de iniciar modificações destrutivas ou de larga escala.
3. **Ciclo de Implementação:**
   - Escrever testes -> Executar testes (verificar falha) -> Implementar funcionalidade -> Executar testes (verificar sucesso) -> Rodar linter/typecheck/audit -> Validar cobertura.
4. **Sem Alucinações de Dependências:**
   - Não inventar bibliotecas nem adicionar dependências pesadas/desnecessárias sem justificativa técnica explícita.
