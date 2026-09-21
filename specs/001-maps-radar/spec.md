# Feature Specification: Módulo 1 — Maps Radar (Scraper & Qualificação de Leads)

**Feature Branch**: `001-maps-radar`  
**Created**: 2026-09-21  
**Status**: Ready for Implementation (Planning Phase)  
**Input**: Documento de Visão & Arquitetura do VitrineLocal — Módulo 1 (Radar do Google Maps) + Princípios de Engenharia de Produção e TDD

---

## 1. Visão & Propósito do Módulo

O **Maps Radar** é o primeiro módulo da cadeia do VitrineLocal e atua como o motor de mineração e qualificação de oportunidades locais.

### Objetivo Central
Mapear e minerar automaticamente comércios e prestadores de serviços no **Google Maps** (via automação headless resiliente com Playwright, sem dependência de APIs pagas do Google Places), filtrando rigorosamente apenas empresas de alta reputação que **não possuem website próprio** (ou que utilizam apenas redes sociais como página web).

---

## Clarifications

### Session 2026-09-21
- Q: De que forma o operador irá acionar e consumir as buscas do Maps Radar nesta primeira entrega do Módulo 1? → A: API HTTP / REST (Opção B): Servidor web expondo rota `POST /api/radar/search` recebendo payload JSON com parâmetros e retornando os resultados estruturados de leads.
- Q: Como o endpoint `POST /api/radar/search` deve se comportar durante a raspagem (considerando tempos de 15 a 45s)? → A: Job Assíncrono com Polling (Opção B): Retorna `202 Accepted` com `jobId` imediatamente; processa o scraping em background e expõe `GET /api/radar/jobs/:id` para acompanhar status (`PENDING`, `RUNNING`, `COMPLETED`, `FAILED`) e recuperar os leads minerados ao término.
- Q: Como o sistema deve lidar com os estabelecimentos que forem desqualificados pelos filtros? → A: Persistir com Status Desqualificado (Opção A): Salva no banco com `status: 'DISQUALIFIED'` e o motivo do descarte em `disqualificationReason` (ex: `HAS_WEBSITE`, `LOW_RATING`, `LOW_REVIEWS`), criando histórico que impede re-processamento em buscas futuras.
- Q: Como o scraper deve se comportar quando o Google Maps esgotar os resultados do bairro antes de atingir o limite solicitado? → A: Concluir com o Disponível (Opção A): Interrompe a rolagem ao detectar o fim do feed de resultados do Maps e conclui o job com sucesso (`COMPLETED`), preservando estritamente o escopo geográfico solicitado.
- Q: Como o Maps Radar deve gerenciar a concorrência quando múltiplos jobs de busca forem disparados simultaneamente? → A: Fila Sequencial (Opção A): Execução FIFO com concorrência máxima de 1 job ativo por vez; novos jobs entram como `PENDING` e aguardam a conclusão do job atual, otimizando o consumo de RAM e protegendo a reputação do IP.

---

## 2. Princípios de Engenharia & Qualidade (Production Standard)

1. **TDD Estrito (Red-Green-Refactor):**
   - Toda regra de parsing de DOM, detecção de website vs. rede social, normalização de telefone e filtros de qualificação deve ser desenvolvida primeiro através de testes que falham.
2. **Quality Gates & CI Local:**
   - Nenhuma linha de código é aceita sem passar por:
     - TypeScript estrito (`strict: true`, zero `any`);
     - Linter (ESLint/Biome) sem warnings;
     - Auditoria de dependências (`npm audit`);
     - Segurança estática (SAST & Secret Detection);
     - Suíte de testes 100% verde com Vitest.
3. **Resiliência e Tolerância a Falhas:**
   - Scrapers enfrentam latências de rede e alterações visuais. O motor deve implementar retries exponenciais, delays humanos aleatórios, timeouts configuráveis e isolamento total de falhas (um erro em um lead não derruba o lote).
4. **Isolamento de Testes (Offline-First Testing):**
   - Testes unitários e de integração NÃO devem depender de chamadas ativas à internet. Utilizaremos fixtures HTML estáticas gravadas do Google Maps para testar os seletores e parsers de forma determinística e ultrarrápida.

---

## 3. User Scenarios & Testing (Priorizados)

### User Story 1 - Extração de Leads via Google Maps (Priority: P1)

*Como operador do VitrineLocal, desejo informar um nicho e uma localidade geográfica (ex: "Oficinas Mecânicas em Moema, SP") e extrair a lista bruta de estabelecimentos comerciais encontrados com seus dados cadastrais essenciais.*

- **Why this priority:** É o mecanismo fundamental de coleta do sistema; sem a extração de dados brutos, nenhuma análise de qualificação é possível.
- **Independent Test:** Pode ser testado fornecendo um snapshot de busca do Maps ou rodando o scraper em modo headless controlado com mock de página de resultados, verificando se a lista de estabelecimentos extraída contém nome, nota, contagem de reviews, telefone, endereço, categoria e link de website.

**Acceptance Scenarios:**
1. **Given** um termo de busca válido (nicho e cidade/bairro), **When** o Playwright executa a navegação na busca do Google Maps e rola a lista de resultados (`div[role="feed"]`), **Then** o sistema extrai cada card visível sem perder dados obrigatórios.
2. **Given** um estabelecimento sem telefone ou endereço informado no Maps, **When** o extrator processa o card, **Then** os campos ausentes são registrados como `null` de forma segura sem lançar exceções de runtime.
3. **Given** uma instabilidade de rede ou lentidão no carregamento de um item, **When** o timeout individual de 5 segundos expira, **Then** o sistema registra um aviso estruturado no log e continua o processamento do próximo item do lote.

---

### User Story 2 - Filtro Anti-Site e Qualificação de Presença Digital (Priority: P1)

*Como motor de qualificação, desejo inspecionar o campo de website de cada lead minerado e classificá-lo estritamente entre "Qualificado para Prospecção" (sem site ou apenas rede social) e "Desqualificado" (já possui site próprio).*

- **Why this priority:** O diferencial competitivo do VitrineLocal apoia-se em abordar empresas sem site. Prospectar empresas que já possuem bons sites queima o canal de vendas e desperdiça processamento.
- **Independent Test:** Pode ser testado unitariamente fornecendo uma bateria de URLs variadas (domínios próprios, links de Instagram, Facebook, Linktree, URLs nulas, encurtadores) e verificando se o classificador rotula 100% dos casos de acordo com as regras de negócio.

**Acceptance Scenarios:**
1. **Given** um lead onde o campo de website é nulo, vazio ou ausente, **When** o classificador avalia o lead, **Then** o lead é classificado como `QUALIFIED_NO_WEBSITE`.
2. **Given** um lead onde o website aponta para redes sociais (ex: `instagram.com/oficinaexemplo`, `facebook.com/...`, `linktr.ee/...`, `wa.me/...`), **When** o classificador avalia o lead, **Then** o lead é classificado como `QUALIFIED_SOCIAL_ONLY` e o link da rede é preservado para o Módulo 2.
3. **Given** um lead onde o website é um domínio próprio ativo (ex: `www.oficinaautopecas.com.br`), **When** o classificador avalia o lead, **Then** o lead é classificado como `DISQUALIFIED_HAS_WEBSITE`.

---

### User Story 3 - Filtro de Reputação & Score Comercial (Priority: P2)

*Como operador comercial, desejo priorizar automaticamente empresas com alta reputação local (nota >= 4.0 e pelo menos 5 avaliações) para focar abordagens em negócios que já faturam e têm clientes ativos.*

- **Why this priority:** Empresas com péssima reputação (ex: nota 2.5) ou abandonadas (0 avaliações) possuem baixa propensão de compra e alto risco de inadimplência.
- **Independent Test:** Pode ser testado unitariamente passando objetos de leads com diferentes combinações de `rating` e `reviewCount` e validando o status de prioridade (`HIGH_PRIORITY`, `STANDARD_PRIORITY`, `LOW_PRIORITY`).

**Acceptance Scenarios:**
1. **Given** um lead sem site com nota 4.8 e 85 avaliações, **When** o avaliador de score processa o lead, **Then** ele é marcado como `HIGH_PRIORITY` (`score: 90+`).
2. **Given** um lead sem site com nota 3.5 ou apenas 1 avaliação, **When** o avaliador de score processa o lead, **Then** ele é marcado como `LOW_PRIORITY` e arquivado para abordagem secundária.

---

### User Story 4 - Normalização de Contatos & Deduplicação (Priority: P2)

*Como sistema, desejo normalizar números de telefone para o formato padrão E.164 (ex: `+5511998765432`), identificar se é celular/WhatsApp ou fixo, e evitar leads duplicados na base de dados.*

- **Why this priority:** Sem telefones higienizados, o envio de abordagens comerciais por mensageria falha e números duplicados geram múltiplos contatos para a mesma empresa.
- **Independent Test:** Testado com suíte de testes unitários contendo números nos formatos `(11) 99876-5432`, `11 3234-5678`, `+55 11 98888-7777`, garantindo que todos convertam para o padrão canônico e a chave de deduplicação previna duplicatas.

**Acceptance Scenarios:**
1. **Given** uma string de telefone brasileira com espaços, traços e parênteses, **When** a função de normalização executa, **Then** ela retorna o formato E.164 válido e sinaliza se é linha móvel (`isMobile: true`) ou fixa (`isMobile: false`).
2. **Given** um lead minerado cuja URL do Maps ou par `nome + endereço normalizado` já existe no banco, **When** o processo de persistência executa, **Then** o registro existente é atualizado se houver dados novos, sem gerar lead duplicado.

---

## 4. Requisitos Detalhados

### 4.1 Requisitos Funcionais (FR)

- **FR-001 (Maps Search Automation):** O sistema DEVE inicializar uma instância do Playwright em modo headless (com argumentos stealth) para executar pesquisas no Google Maps a partir de um termo (`query`) e localização.
- **FR-002 (Infinite Scroll & Feed End Detection):** O scraper DEVE rolar a lista de resultados (`div[role="feed"]`) até atingir o limite configurado de resultados (default: 20) OU até detectar o final dos resultados disponíveis na região (indicador de fim de feed do Maps), encerrando a busca graciosamente com o total encontrado sem estender para áreas não solicitadas.
- **FR-003 (Data Scraping):** Para cada estabelecimento, o scraper DEVE extrair:
  - `businessName`: Nome do estabelecimento (string não vazia);
  - `category`: Categoria comercial exibida no Maps;
  - `address`: Endereço completo;
  - `phone`: Telefone bruto cadastrado;
  - `originalWebsite`: URL cadastrada no campo website;
  - `rating`: Nota média de 1.0 a 5.0 (float);
  - `reviewCount`: Quantidade total de avaliações (inteiro);
  - `mapsUrl`: Link permanente do local no Google Maps.
- **FR-004 (Website Classifier):** O sistema DEVE conter um classificador determinístico com regex e lista de domínios sociais conhecidos:
  - Redes Sociais reconhecidas: `instagram.com`, `facebook.com`, `fb.me`, `linktr.ee`, `wa.me`, `whatsapp.com`, `tiktok.com`, `youtube.com`, `ifood.com.br`, `beacons.ai`.
  - Classificação:
    - Se URL ausente -> `NO_WEBSITE` (Qualificado).
    - Se URL for rede social -> `SOCIAL_ONLY` (Qualificado).
    - Se URL for domínio web próprio -> `OWN_WEBSITE` (Desqualificado).
- **FR-005 (Phone Normalization):** O sistema DEVE normalizar números de telefone para o padrão E.164 (`+55...`), identificar DDD e classificar o tipo (`MOBILE` vs `LANDLINE`).
- **FR-006 (Lead Qualification Scoring):** O sistema DEVE calcular um score de 0 a 100 baseado em:
  - Ausência total de site (+40 pontos) ou apenas rede social (+30 pontos);
  - Rating >= 4.5 (+30 pontos) ou >= 4.0 (+20 pontos);
  - ReviewCount >= 50 (+30 pontos), >= 20 (+20 pontos), ou >= 5 (+10 pontos).
- **FR-007 (Deduplication & Dual-Status Storage):** O sistema DEVE persistir no banco de dados tanto os leads aprovados (`status: 'QUALIFIED'`) quanto os descartados (`status: 'DISQUALIFIED'` com o respectivo `disqualificationReason`), impedindo duplicatas através da chave única `mapsUrl` e hash `businessName + phone`, evitando que estabelecimentos já analisados sejam reprocessados em buscas futuras.
- **FR-008 (API HTTP REST Search & Job Polling):** O Módulo 1 DEVE disponibilizar rota HTTP `POST /api/radar/search` aceitando payload JSON (`{ "niche": string, "location": string, "limit"?: number }`), retornando imediatamente código `202 Accepted` com `{ "jobId": string, "status": "PENDING" }` e processando a mineração em background.
- **FR-009 (Job Status & Leads Retrieval API):** O sistema DEVE disponibilizar rota `GET /api/radar/jobs/:id` para consulta do estado do job (`PENDING`, `RUNNING`, `COMPLETED`, `FAILED`), métricas de progresso (`totalFound`, `totalQualified`) e lista final de leads, além de rota `GET /api/radar/leads` para consulta paginada de todos os leads qualificados persistidos no banco.
- **FR-010 (FIFO Queue Concurrency Control):** O sistema DEVE gerenciar os jobs de busca através de uma fila interna com concorrência máxima de 1 processo Chromium ativo por vez; novas requisições entram em estado `PENDING` na fila e executam automaticamente em ordem de chegada quando o job anterior for concluído.

### 4.2 Requisitos Não-Funcionais & Quality Gates (Production Standard)

- **NFR-CI-001 (Quality Gates):** Todos os commits do Módulo 1 DEVEM passar por:
  - `npm run typecheck` (TypeScript estrito, zero `any`);
  - `npm run lint` (ESLint sem warnings);
  - `npm run audit` (zero vulnerabilidades críticas/altas);
  - `npm run test` (100% dos testes verdes).
- **NFR-TDD-002 (Test Coverage):** Cobertura de testes unitários mínima de 90% para classificadores, normalizadores e regras de negócio.
- **NFR-RES-003 (Resiliência do Scraper):** Delays aleatórios entre 1000ms e 3000ms entre ações para evitar detecção agressiva, timeouts explícitos de no máximo 10s por página de detalhe.
- **NFR-ISOL-004 (Fault Isolation):** Se a extração de um estabelecimento específico lançar erro inesperado (DOM corrompido), o erro DEVE ser capturado e registrado com contexto, permitindo que os demais estabelecimentos da lista sejam minerados normalmente.

---

## 5. Entidades e Contratos de Dados (TypeScript / Zod Schemas)

```typescript
// Schemas compartilhados para o Módulo 1

export type WebsiteClassification = 
  | 'NO_WEBSITE'       // Não possui site cadastrado
  | 'SOCIAL_ONLY'      // Aponta para Instagram, Facebook, Linktree, WhatsApp
  | 'OWN_WEBSITE';     // Possui domínio próprio

export type QualificationStatus = 
  | 'QUALIFIED'        // Aprovado para o funil (Visual Pitch)
  | 'DISQUALIFIED';    // Descartado (já tem site ou fora dos padrões)

export interface RawMapsLead {
  businessName: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  mapsUrl: string;
}

export interface QualifiedLead {
  id: string;
  businessName: string;
  category: string;
  address: string | null;
  phoneRaw: string | null;
  phoneNormalized: string | null;
  isMobile: boolean;
  websiteRaw: string | null;
  websiteType: WebsiteClassification;
  socialLinks: string[];
  rating: number;
  reviewCount: number;
  qualificationScore: number;
  status: QualificationStatus;
  disqualificationReason?: string;
  mapsUrl: string;
  minedAt: Date;
}
```

---

## 6. Edge Cases & Mitigações

1. **Google Maps exibindo página de consentimento de cookies ou Captcha:**
   - *Mitigação:* Script de inicialização do Playwright com bypass de diálogo de consentimento de cookies da UE/Google e suporte a cookies persistentes.
2. **Estabelecimento com múltiplas filiais no mesmo bairro:**
   - *Mitigação:* Diferenciação por endereço completo e `mapsUrl` único com coordenadas geográficas.
3. **Telefones no formato 0800 ou números internacionais:**
   - *Mitigação:* Parser com biblioteca ou regex compatível que identifique prefixos fora do padrão móvel/fixo brasileiro e marque `isMobile: false`.
4. **Estabelecimento fechado permanentemente:**
   - *Mitigação:* Detecção de tags `Fechado permanentemente` ou `Temporariamente fechado` no DOM para desqualificar imediatamente.

---

## 7. Critérios de Sucesso Mensuráveis (SC)

- **SC-001:** O classificador de websites deve ter acurácia de 100% em uma suíte de pelo menos 30 URLs de teste com casos extremos (subdomínios, encurtadores, redes sociais e domínios próprios).
- **SC-002:** O normalizador de telefones deve atingir 100% de sucesso em testes com todos os formatos de números brasileiros válidos.
- **SC-003:** O scraper deve ser capaz de coletar e classificar uma página de 20 estabelecimentos sem falha de runtime ou vazamento de memória.
- **SC-004:** Toda a suíte de testes unitários do Módulo 1 deve executar em menos de 3 segundos via Vitest.
