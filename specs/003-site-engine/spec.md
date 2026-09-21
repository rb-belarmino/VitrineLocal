# Feature Specification: Módulo 3 — Site Engine (Templates Dinâmicos & Visual Pitch Preview)

**Feature Branch**: `003-site-engine`  
**Created**: 2026-09-21  
**Status**: Draft  
**Input**: User description: "vamos seguir para o modulo 3" (Módulo 3: Site Engine da arquitetura VitrineLocal)

---

## 1. Contexto & Visão de Negócio

O **Módulo 3 (Site Engine)** é o coração da proposta de valor do VitrineLocal. Ele transforma os dados minerados no **Módulo 1 (Maps Radar)** e enriquecidos no **Módulo 2 (Brand Extractor)** em uma Landing Page moderna, responsiva e personalizada de alto impacto (**Visual Pitch**).

Quando o operador comercial ou o pipeline de outreach abordar o dono do estabelecimento local no Módulo 4, o cliente não receberá um "pitaco" genérico de vendas, mas sim um link público funcional com o site do seu próprio negócio já pronto, com suas fotos reais, depoimentos 5 estrelas dos seus clientes no Google Maps, paleta de cores harmonizada e botão direto para o seu WhatsApp.

---

## 2. User Scenarios & Testing _(mandatory)_

### User Story 1 - Renderização Dinâmica da Landing Page de Demonstração (Priority: P1)

Como potencial cliente (dono do negócio local) ou operador comercial da VitrineLocal,
quero abrir o link público de demonstração do meu negócio,
para visualizar uma landing page moderna, rápida e totalmente personalizada com os dados e identidade visual da minha empresa.

**Why this priority**:
Esta é a entrega central do Módulo 3. Sem uma página de alta conversão visível e responsiva, o pitch visual não existe e o funil de outreach é interrompido.

**Independent Test**:
Pode ser testado de forma isolada fazendo uma requisição HTTP `GET /preview/:leadId` (ou slug) para um lead com `BrandProfile` cadastrado, verificando o retorno de HTML 200 contendo cabeçalho hero, depoimentos reais, fotos, paleta de cores e botão de WhatsApp funcional.

**Acceptance Scenarios**:

1. **Given** um lead qualificado com `BrandProfile` persistido no banco de dados,  
   **When** uma requisição `GET /preview/:leadId` for recebida,  
   **Then** o sistema deve retornar status HTTP 200 e documento HTML5 válido com encoding UTF-8.
2. **Given** a página HTML renderizada,  
   **When** inspecionada no navegador móvel ou desktop,  
   **Then** deve exibir o nome do negócio, categoria, telefone, endereço formatado, fotos reais, notas de avaliação e botão flutuante/inline com link direto para `https://wa.me/55...`.
3. **Given** as cores primária, secundária e de destaque do `BrandProfile`,  
   **When** o CSS da página for carregado,  
   **Then** as variáveis CSS (`--brand-primary`, `--brand-secondary`, etc.) devem ser injetadas dinamicamente com contraste WCAG AA garantido.
4. **Given** que o lead não possui `BrandProfile` previamente extraído,  
   **When** o endpoint `/preview/:leadId` for acessado,  
   **Then** o serviço deve orquestrar a extração sob demanda ou retornar status HTTP 404 informativo com instrução para executar a extração inicial.

---

### User Story 2 - Adaptação Semântica e Temática por Nicho de Mercado (Priority: P2)

Como operador comercial prospectando diferentes verticais de negócio,
quero que o Site Engine selecione o template visual e estrutura de seções mais adequada para a categoria do lead (Saúde, Automotivo, Gastronomia, Beleza, Serviços Gerais),
para que a experiência do visitante seja contextual e profissional para o seu ramo específico.

**Why this priority**:
Uma clínica odontológica precisa de foco em biossegurança, equipe e agendamento; uma oficina mecânica precisa de foco em orçamento rápido, marcas atendidas e socorro/guincho; uma pizzaria precisa de cardápio e delivery. Templates segmentados aumentam dramaticamente a taxa de conversão do pitch.

**Independent Test**:
Pode ser testado gerando o preview para leads de diferentes categorias e validando a presença de seções e copys temáticas específicas (ex: "Especialidades" para Clínicas vs. "Nossos Serviços Automotivos" para Oficinas).

**Acceptance Scenarios**:

1. **Given** um lead categorizado como "Dentista" ou "Clínica",  
   **When** a página for renderizada,  
   **Then** o template deve aplicar a estrutura temática de Saúde (destaque para agendamento, diferenciais de atendimento e profissionais).
2. **Given** um lead de categoria desconhecida ou não mapeada,  
   **When** a página for renderizada,  
   **Then** o sistema deve aplicar de forma resiliente o template "Padrão / Serviços Gerais" sem quebrar o layout.

---

### User Story 3 - Banner de Demonstração e Conversão do Visual Pitch (Priority: P3)

Como operador da VitrineLocal,
quero que a página de demonstração contenha um selo ou barra fixa elegante de aviso ("Demonstração exclusiva criada para [Nome do Negócio] pela VitrineLocal"),
para que o cliente entenda que aquilo é uma proposta de site pronta para ser contratada e personalizada definitivamente.

**Why this priority**:
Garante clareza ao lead de que se trata de uma demonstração interativa já criada para ele, com link ou gatilho para oficializar o projeto ou solicitar ajustes.

**Independent Test**:
Verificar no DOM gerado a presença da barra/badge de demonstração e o botão de ação "Quero este site para minha empresa" ou contato com a VitrineLocal.

**Acceptance Scenarios**:

1. **Given** qualquer preview gerado pelo Site Engine,  
   **When** o cliente carregar a página,  
   **Then** uma barra superior sutil ou badge flutuante deve indicar que o site é uma demonstração exclusiva.
2. **Given** a barra de demonstração,  
   **When** o lead clicar no botão de contratação/reivindicação do site,  
   **Then** deve ser direcionado para o contato comercial da VitrineLocal informando o ID do lead.

---

### Edge Cases

- **Lead sem fotos cadastradas ou com fotos indisponíveis:** O template deve utilizar placeholders vetoriais modernos e de alta qualidade com a paleta do nicho, sem exibir imagens quebradas (`404`) ou espaços em branco desconfigurados.
- **Depoimentos sem texto ou ausentes:** A seção de Prova Social deve exibir fallback elegante destacando a nota média (ex: "4.9 estrelas no Google Maps") e quantidade de avaliações, sem renderizar caixas de texto vazias.
- **Tentativa de Injeção de Código (XSS) nos dados minerados:** Nomes de estabelecimentos ou depoimentos contendo caracteres especiais (`<script>`, `onerror=`, tags HTML) devem ser rigorosamente sanitizados e escapados antes da interpolação no HTML.
- **Telefone fixo vs celular:** Se o lead possuir apenas telefone fixo, o botão de WhatsApp deve utilizar o número se for celular, ou exibir botão de ligação convencional (`tel:...`) caso não seja compatível com WhatsApp.

---

## 3. Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer um endpoint HTTP `GET /preview/:leadId` que retorna a landing page completa em HTML5 responsivo.
- **FR-002**: O sistema DEVE suportar resolução híbrida por slug amigável `GET /preview/:slug` (gerado deterministicamente a partir de nome + bairro/cidade) e por identificador `GET /preview/:leadId`.
- **FR-003**: O sistema DEVE injetar as cores primária, secundária, de destaque e fundos a partir das variáveis CSS do `BrandProfile`.
- **FR-004**: O sistema DEVE renderizar os textos sintetizados pela IA (Headline, Subheadline, Diferenciais, Chamada para Ação) no layout do template.
- **FR-005**: O sistema DEVE renderizar a galeria de imagens de alta resolução extraídas, com suporte a lazy-loading nativo (`loading="lazy"`).
- **FR-006**: O sistema DEVE renderizar os depoimentos 5 estrelas selecionados com nome do avaliador, estrelas visuais e texto do comentário.
- **FR-007**: O sistema DEVE disponibilizar botão de CTA direto para WhatsApp formatado no padrão internacional `https://wa.me/55{DDD}{NUMERO}?text=...`.
- **FR-008**: O sistema DEVE incluir badge ou banner fixo de Visual Pitch indicando o status de demonstração e CTA para a VitrineLocal.
- **FR-009**: O sistema DEVE sanitizar rigorosamente todos os campos de texto interpolados para prevenir vulnerabilidades de Cross-Site Scripting (XSS).
- **FR-010**: O sistema DEVE possuir biblioteca com 5 templates temáticos especializados por nicho (Saúde/Clínicas, Automotivo/Oficinas, Gastronomia/Restaurantes, Beleza/Estética, e Serviços Gerais/Padrão), com seleção automática baseada na categoria do lead e fallback para Serviços Gerais.
- **FR-011**: O sistema DEVE disponibilizar endpoint de configuração `GET /api/preview/:leadId/config` retornando o DTO JSON dos dados consolidados de renderização.
- **FR-012**: O sistema DEVE utilizar um motor SSR leve em TypeScript gerando HTML5 responsivo com Tailwind CSS e variáveis customizadas nativas, com tempo de renderização inferior a 50ms e zero dependências de runtime pesado no cliente.

---

## 4. Key Entities _(include if feature involves data)_

- **PreviewSiteConfig**: DTO consolidado contendo os dados mesclados de `QualifiedLead` e `BrandProfile` prontos para alimentar o template:
  - `leadId`: Identificador único do lead
  - `slug`: Identificador amigável de rota pública
  - `businessName`: Nome do estabelecimento
  - `category`: Categoria ou nicho detectado
  - `nicheTheme`: Identificador do template selecionado (`saude`, `automotivo`, `gastronomia`, `beleza`, `geral`)
  - `contact`: Telefone normalizado, link de WhatsApp e endereço completo
  - `theme`: Cores primária, secundária, de destaque, contraste e estilo de fontes
  - `content`: Headline, subheadline, diferenciais, serviços sugeridos
  - `gallery`: Lista de URLs de fotos em alta resolução com atributos alt
  - `socialProof`: Nota média, total de avaliações e lista de depoimentos 5 estrelas selecionados
  - `meta`: Título SEO, meta description e OpenGraph tags para compartilhamento em redes/WhatsApp

---

## 5. Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: O tempo de renderização e resposta de `GET /preview/:leadId` deve ser inferior a 150 milissegundos para perfis já armazenados.
- **SC-002**: A pontuação de desempenho e boas práticas no mobile (Lighthouse / Performance) da página gerada deve ser superior a 90/100.
- **SC-003**: 100% dos botões de WhatsApp gerados devem abrir diretamente a conversa com o número de celular normalizado e mensagem inicial pré-formatada.
- **SC-004**: 100% dos caracteres potencialmente perigosos (XSS) em campos dinâmicos devem ser neutralizados sem quebrar o layout.
- **SC-005**: 100% dos testes unitários e de integração do Módulo 3 devem passar na suíte com cobertura superior a 85%.

---

## 6. Assumptions

- Os leads acessados via `/preview/:leadId` já passaram pelo Módulo 1 (Maps Radar) e possuem dados mínimos (nome, telefone, endereço).
- Caso o `BrandProfile` ainda não exista para o lead no momento do acesso ao preview, o sistema orquestrará a extração via `BrandExtractorService` ou instruirá o operador a acioná-lo.
- Não é necessário hospedar um painel CMS de edição em tempo real pelo cliente nesta fase; a página gerada é estritamente uma página de demonstração consultiva (Visual Pitch).
- A estilização das landing pages é compatível com navegadores modernos móveis e desktop sem dependência de JavaScript pesado no cliente.
