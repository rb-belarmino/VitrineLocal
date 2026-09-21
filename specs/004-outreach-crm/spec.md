# Feature Specification: Módulo 4 — Outreach CRM & Portal Web de Operações

**Feature Branch**: `004-outreach-crm`  
**Created**: 2026-09-21  
**Status**: Ready for Planning  
**Input**: "Portal web para que possamos fazer as buscas, ver os resultados e gerenciar o projeto todo por lá (prospecção, leads, previews, abordagens com IA e funil comercial)"

---

## 1. Visão Geral e Proposta de Valor

O **Portal Web da VitrineLocal (Módulo 4: Outreach CRM)** é a interface central de comando operacional da plataforma. Ele conecta os 3 módulos anteriores (Radar de Scraper, Extrator de Marca e Motor de Landing Pages SSR) em uma experiência web visual, responsiva e intuitiva, permitindo que operadores comerciais realizem prospecção ativa de ponta a ponta sem tocar em terminais ou arquivos HTTP:

1. **Radar Visual**: Disparar buscas no Google Maps com feedback em tempo real do status do robô.
2. **Central de Leads**: Tabela interativa com filtros, busca textual, notas de reputação, score comercial e link direto para o site de demonstração (`/preview/:id` ou `/preview/:slug`).
3. **Copywriting com IA (Outreach)**: Geração de abordagens hiper-personalizadas consultivas via Google Gemini API (`@google/genai`) utilizando o método Visual Pitch (elogio genuíno à reputação + alerta de ausência de site próprio + link do preview exclusivo).
4. **Funil Comercial (Pipeline)**: Gestão de status do lead (`QUALIFIED` -> `CONTACTED` -> `NEGOTIATING` -> `CONVERTED` / `DISQUALIFIED`), com indicador/filtro dinâmico de "Preview Pronto" (baseado na existência de `BrandProfile`) e 1 clique para abrir o WhatsApp Web com mensagem pré-preenchida.

---

## Clarifications

### Session 2026-09-21

- Q: Como os estados do funil comercial devem ser modelados no banco de dados e na interface em relação ao status de preview pronto e descarte? → A: Status no banco: `QUALIFIED`, `CONTACTED`, `NEGOTIATING`, `CONVERTED`, `DISQUALIFIED`. "Preview Pronto" é tratado como um filtro/badge visual derivado da existência de `BrandProfile` associado ao lead.
- Q: As mensagens de abordagem geradas pela IA e o registro de envio no WhatsApp devem ser persistidos no banco de dados ou mantidos de forma efêmera no frontend? → A: Persistir última copy gerada e data de contato diretamente no lead (campos opcionais `outreachCopy` e `contactedAt` no `QualifiedLead`).
- Q: A transição do status do lead para `CONTACTED` deve ocorrer automaticamente ao clicar no botão de WhatsApp ou exigir confirmação manual do operador? → A: Confirmação manual guiada: abre o WhatsApp Web e exibe confirmação no portal ("Você confirmou o envio da mensagem?"), atualizando para `CONTACTED` apenas após clique positivo do operador.
- Q: Como o portal deve se comportar quando o lead possuir apenas telefone fixo (isMobile === false)? → A: Flexível com alerta: exibir badge "Fixo", manter o botão do WhatsApp ativo e adicionar botão de 1 clique "Copiar Mensagem" para flexibilidade operacional.
- Q: O operador deve poder editar a mensagem gerada pela IA diretamente no portal antes de abrir o WhatsApp? → A: Sim: campo editável no portal com atualização em tempo real do link `wa.me` e persistência da copy final ajustada em `outreachCopy`.

---

## 2. User Scenarios & Testing _(mandatory)_

### User Story 1 - Portal Web Dashboard & Gestão de Leads (Priority: P1) 🎯 MVP

O operador acessa a URL raiz (`http://localhost:3001/` ou `/dashboard`) no navegador e visualiza um painel moderno com métricas consolidadas (Total de Leads, Qualificados, Previews Prontos, Convertidos), tabela interativa de leads minerados com filtros rápidos por nicho/status e botões para visualizar o preview de qualquer lead em nova aba.

**Why this priority**: É a interface visual que resolve imediatamente a dor do usuário de visualizar e gerenciar os resultados de forma gráfica e integrada.

**Independent Test**: Acessar `GET /` no navegador, verificar carregamento do Dashboard com dados reais do SQLite, filtrar leads por categoria e clicar em "Ver Site" para abrir o preview do estabelecimento.

**Acceptance Scenarios**:

1. **Given** o servidor Express rodando, **When** o operador acessa `GET /` ou `GET /dashboard`, **Then** o sistema serve uma Single Page UI moderna e responsiva com tabela de leads qualificados.
2. **Given** a listagem de leads na tela, **When** o operador clica no botão "Ver Site de Demonstração", **Then** a página abre `/preview/:slug` (ou `/preview/:id`) em uma nova aba exibindo a landing page renderizada pelo Módulo 3.
3. **Given** a tabela de leads, **When** o operador digita no campo de busca ou seleciona um filtro de status, **Then** a tabela filtra os leads em tempo real no cliente.

---

### User Story 2 - Varredura Interativa do Radar pelo Portal (Priority: P2)

O operador preenche um formulário direto no painel com nicho (ex: _"Dentista"_), localidade (_"Pinheiros, São Paulo"_) e quantidade de estabelecimentos (_5 a 20_), clica em "Iniciar Mineração" e acompanha visualmente uma barra de status que atualiza automaticamente até a conclusão, exibindo os novos leads imediatamente na tabela.

**Why this priority**: Elimina a necessidade de rodar requisições manuais via terminal (`curl`) ou REST Client (`radar.http`), tornando a prospecção autônoma e acessível.

**Independent Test**: Submeter o formulário de busca na aba "Radar" do portal, verificar o card de job com status "Em execução..." e verificar a listagem sendo atualizada com os novos leads minerados.

**Acceptance Scenarios**:

1. **Given** o formulário de busca no portal, **When** o operador preenche nicho, localidade e limite e clica em "Buscar Leads", **Then** o portal dispara `POST /api/radar/search` e exibe um card de progresso com o `jobId`.
2. **Given** um job em andamento, **When** o job é finalizado com status `COMPLETED`, **Then** o painel emite aviso de sucesso e recarrega a lista de leads com os novos registros minerados.
3. **Given** campos obrigatórios vazios ou limite inválido, **When** o operador tenta enviar o formulário, **Then** a interface impede o envio e exibe mensagens de validação claras.

---

### User Story 3 - Geração de Abordagem Comercial com IA & Disparo via WhatsApp (Priority: P3)

Para qualquer lead qualificado da lista, o operador pode clicar em "Gerar Mensagem de Abordagem" para que a IA (Google Gemini ou sintetizador fallback) gere uma mensagem persuasiva e consultiva no padrão Visual Pitch. Ao clicar em "Enviar no WhatsApp", o sistema abre diretamente o WhatsApp Web com o telefone normalizado do lead e a mensagem já formatada contendo o link do preview, exibindo um diálogo de confirmação guiada para atualizar o status do lead para `CONTACTED`.

**Why this priority**: Fecha o ciclo de vendas e prospecção ativa da plataforma, automatizando o contato com o tomador de decisão.

**Independent Test**: Executar requisição para gerar copy comercial de um lead e validar retorno de mensagem estruturada com link do preview, telefone sanitizado e atualização de status comercial no banco de dados.

**Acceptance Scenarios**:

1. **Given** um lead qualificado, **When** o operador clica em "Gerar Abordagem", **Then** o endpoint `POST /api/outreach/generate/:leadId` produz uma copy consultiva com saudação, elogio aos reviews do Google, problema (ausência de site) e o link exclusivo de preview, exibindo a mensagem em um campo `<textarea>` editável no portal.
2. **Given** a mensagem exibida no modal/portal, **When** o operador ajusta o texto no `<textarea>` ou clica em "Enviar WhatsApp", **Then** o link `wa.me` é atualizado em tempo real com o texto customizado; ao clicar no botão, o navegador abre o WhatsApp Web e o portal exibe confirmação guiada para persistir a copy final e atualizar o status do lead para `CONTACTED`.
3. **Given** um lead que respondeu positivamente, **When** o operador altera seu status no painel para `CONVERTED`, **Then** a alteração é persistida no banco via `PATCH /api/outreach/leads/:id/status`.

---

## 3. Requisitos Funcionais (Requirements)

- **FR-001**: O servidor Express DEVE servir o Portal Web do Operador na rota raiz `GET /` e `GET /dashboard`.
- **FR-002**: O Portal DEVE ser desenvolvido com tecnologias leves, sem dependência de build separado pesado (Single Page HTML5 com Tailwind CSS moderno, design limpo, responsivo e sem bibliotecas externas desnecessárias).
- **FR-003**: O Portal DEVE exibir cards com KPIs em tempo real: Total de Leads Minerados, Leads Qualificados, Previews Prontos e Leads Contatados/Convertidos.
- **FR-004**: O Portal DEVE listar os leads com paginação ou scroll infinito, exibindo: Nome, Categoria/Nicho, Telefone, Nota Google, Score de Qualificação e Status Comercial.
- **FR-005**: O Portal DEVE fornecer formulário interativo de busca conectado a `POST /api/radar/search` com polling de status em `GET /api/radar/jobs/:jobId`.
- **FR-006**: O Portal DEVE permitir acionar enriquecimento de marca manual via `POST /api/brand/extract/:leadId` com botão com indicador de carregamento.
- **FR-007**: O Portal DEVE conter botão de abertura direta do site de demonstração (`/preview/:identifier`) com atributo `target="_blank"`.
- **FR-008**: O sistema DEVE fornecer o serviço `OutreachService` com método `generateMessage(leadId: string): Promise<OutreachMessageDTO>`.
- **FR-009**: O prompt do Gemini para geração da abordagem DEVE seguir rigorosamente a metodologia Visual Pitch:
  - Tom: Consultivo, profissional, sem parecer spam agressivo.
  - Estrutura: Elogio sincero às avaliações do Google Maps + Pergunta sobre ausência de site oficial no perfil + Apresentação do preview funcional exclusivo criado sob medida + Chamada para feedback rápido.
- **FR-010**: Se `GEMINI_API_KEY` não estiver definida ou a API do Gemini falhar, o `OutreachService` DEVE utilizar um template determinístico de fallback de alta conversão sem quebrar o fluxo.
- **FR-011**: O sistema DEVE fornecer o endpoint `POST /api/outreach/generate/:leadId` retornando a mensagem gerada e o link do WhatsApp formatado, persistindo a última copy gerada em `QualifiedLead.outreachCopy`.
- **FR-011a**: O Portal DEVE renderizar a mensagem gerada em campo `<textarea>` editável, recalculando a URL do `wa.me` dinamicamente conforme edição do operador e permitindo copiar o texto com 1 clique.
- **FR-012**: O sistema DEVE fornecer o endpoint `PATCH /api/outreach/leads/:id/status` para transição de estágios do funil: `QUALIFIED`, `CONTACTED`, `NEGOTIATING`, `CONVERTED`, `DISQUALIFIED`, atualizando `contactedAt` ao transicionar para `CONTACTED`.
- **FR-013**: Toda entrada de usuário e dado renderizado na interface DEVE ser sanitizado contra injeções XSS.
- **FR-014**: O sistema DEVE manter conformidade com os 5 Quality Gates locais (`format:check`, `typecheck`, `lint`, `audit`, `test:coverage > 85%`).
- **FR-015**: O sistema NÃO DEVE executar `git add`, `git commit` ou `git push` de acordo com as regras de governança do usuário.

---

## 4. Edge Cases & Tratamento de Erros

- **Job de Mineração Falhou ou Timeout**: O portal deve detectar status `FAILED` no polling do job e exibir mensagem de erro clara com o motivo, permitindo nova tentativa.
- **Lead sem Número Celular / Apenas Fixo**: Se `lead.isMobile === false`, o portal exibe badge de alerta visual "Telefone Fixo", mantém o botão de WhatsApp ativo (para casos de WhatsApp Business em fixo) e disponibiliza botão de 1 clique "Copiar Mensagem" para contato via chamada de voz ou outros canais.
- **Cota ou Erro de Rede da API do Gemini**: Aciona instantaneamente o gerador de copy fallback determinístico com status `200 OK` e mensagem perfeitamente contextualizada.
- **Lead Inexistente**: Responde `404 Not Found` com schema de erro padronizado `AppError`.
- **Transição de Status Inválida**: O endpoint `PATCH` valida o status via Zod Schema rejeitando valores fora do enum com `400 ValidationError`.

---

## 5. Critérios de Sucesso e Verificação

1. **Dashboard Operacional Funcional**: Acessar `http://localhost:3001/` exibe o painel com métricas, lista de leads e formulário de busca ativos.
2. **Ciclo Completo com 1 Clique**:
   - Iniciar busca de leads pelo formulário web;
   - Ver os leads aparecerem na tabela;
   - Clicar em "Ver Site" para abrir a demonstração renderizada;
   - Clicar em "Gerar Pitch" para obter a mensagem comercial personalizada com o link do preview;
   - Clicar em "WhatsApp" para disparar a abordagem.
3. **100% de Testes Verdes e CI Local**: Suíte de testes unitários e de integração passando com cobertura superior a 85%.
