# Feature Specification: 005-pro-templates (Professional Niche Templates)

**Feature Branch**: `005-pro-templates`  
**Created**: 2026-09-21  
**Status**: Draft  
**Input**: User description: "vamos planejar para desenvolvermos uma spec para ajustarmos os templates com mais profissionalismo baseando-se em modelos de sites do Figma Community para os nossos nichos"

---


## Overview & Context

O módulo **Site Engine** (Módulo 3) do VitrineLocal é responsável por renderizar páginas públicas de demonstração em `/preview/[slug]` no ecossistema Next.js 16.3.5 (App Router / React 19). Essas páginas são a peça central da abordagem comercial do Módulo 4 (Outreach CRM): quando o empresário local recebe o link via WhatsApp, a primeira impressão visual determina a taxa de conversão do pitch.

Esta especificação define o redesenho e aprimoramento profissional dos templates do Site Engine, inspirando-se nos padrões de landing pages de alta conversão do **Figma Community** para os 4 nichos prioritários do sistema (Gastronomia, Saúde/Odonto, Automotivo, Beleza/Barbearia) e o template Geral.

## Clarifications

### Session 2026-09-21

- Q: Como o template de Beleza deve tratar a diferença visual entre Salões de Beleza/Estética feminina e Barbearias masculinas? → A: Option A — Detecção automática dentro de `BelezaTemplate` (variante Vintage Dark/Wood para termos como "barbearia/barber" e variante Editorial Rosé/Luxe para salões e clínicas de estética).
- Q: Como as seções interativas de perguntas frequentes (FAQ) e expansão de conteúdo devem ser implementadas no Next.js App Router? → A: Option A — Utilizar a tag HTML nativa `<details>` e `<summary>` estilizada com Tailwind CSS, garantindo interatividade de acordeão nativa sem JavaScript client-side adicional, preservando o carregamento ultrarrápido dos Server Components.
- Q: Qual deve ser a composição de ações da barra fixa inferior (Sticky Mobile Bar) nos smartphones? → A: Option A — Foco único no botão de WhatsApp de largura total com CTA adaptado ao nicho ("Pedir no WhatsApp", "Agendar Consulta", "Orçamento no WhatsApp", etc.), maximizando a taxa de conversão direta sem dispersão de cliques.
- Q: Qual estratégia visual de fallback deve ser exibida quando o lead minerado não possuir fotos no Google Maps (`gallery.heroImageUrl` ausente)? → A: Option B — Utilizar banco de fotos curadas de alta definição (Unsplash CDN com cache) selecionadas especificamente por nicho e subnicho (pratos apetitosos para gastronomia, consultório acolhedor para saúde, oficina moderna para automotivo, salão/barbearia premium para beleza), garantindo que a prévia nunca fique vazia e sempre transmita alta sofisticação.
- Q: Qual deve ser o posicionamento e formato do selo de demonstração (`VisualPitchBadge`) do VitrineLocal nas páginas de preview? → A: Option A — Floating pill sutil no canto superior direito com efeito backdrop blur ("Demonstração VitrineLocal • Quero um site assim") combinada com assinatura elegante no rodapé, mantendo o hero 100% desobstruído para o lead.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Experiência Visual Imersiva em Gastronomia (Priority: P1)

Como dono de um restaurante, bar, hamburgueria ou cafeteria que recebeu um preview do VitrineLocal, quero ver uma landing page com visual moderno, fotos bem enquadradas, destaques de cardápio e botão de pedidos claro, para que eu sinta orgulho imediato da presença digital do meu negócio e queira contratar a solução.

**Why this priority**: Gastronomia é um dos nichos mais ativos no Google Maps e com maior apelo estético visual imediato (comida atrai pelos olhos).

**Independent Test**: Renderizar `/preview/[slug-gastronomia]` com dados de teste contendo fotos, nota Google e cardápio, verificando se a estrutura visual (hero com floating badge, destaques e sticky CTA mobile) é renderizada de forma elegante e responsiva.

**Acceptance Scenarios**:
1. **Given** um lead de gastronomia com nota 4.8 e fotos de pratos, **When** o lead acessa a página no celular ou desktop, **Then** o topo exibe hero com destaque de imagem, badge translúcido de reputação Google ("4.8 ★") e botão direto para WhatsApp de pedidos.
2. **Given** a seção de especialidades, **When** o usuário rola a página, **Then** os serviços/pratos são apresentados em cards modernos com micro-badges (ex: "Mais Pedido", "Especialidade") em vez de lista de texto simples.
3. **Given** um usuário navegando em dispositivo móvel, **When** ele navega pelo conteúdo, **Then** uma barra flutuante inferior (*sticky WhatsApp bar*) permite contato imediato com 1 toque.

---

### User Story 2 - Credibilidade Clínica e Acolhimento em Saúde (Priority: P1)

Como dentista, médico ou gestor de clínica que abriu o link de demonstração, quero ver uma página limpa, sóbria e altamente profissional, transmitindo biossegurança, autoridade técnica e facilidade para o paciente agendar uma consulta.

**Why this priority**: Negócios de saúde dependem criticamente de autoridade e confiança. Layouts amadores afastam esse público de ticket médio elevado.

**Independent Test**: Renderizar `/preview/[slug-saude]` e validar a exibição dos cards de procedimentos, depoimentos de pacientes com notas reais e seção de FAQ em acordeão.

**Acceptance Scenarios**:
1. **Given** um lead do nicho de saúde, **When** a página é renderizada, **Then** o layout adota paleta clínica asséptica (azul médico/teal com fundo branco/gelo), cantos arredondados e tipografia focada em legibilidade.
2. **Given** dados de avaliações do Google Maps, **When** exibidos na seção de depoimentos, **Then** as mensagens de pacientes aparecem com formato humanizado com avatar, estrelas e destaque para alívio/satisfação.
3. **Given** dúvidas comuns de pacientes (ex: convênios, formas de pagamento, agendamento), **When** o usuário interage com o FAQ, **Then** as respostas expandem de forma fluida.

---

### User Story 3 - Força Técnica e Transparência no Nicho Automotivo (Priority: P2)

Como proprietário de oficina mecânica ou centro automotivo, quero ver uma landing page com visual escuro de alto contraste, foco em garantia, diagnóstico computadorizado e socorro rápido, para atrair motoristas que buscam confiança e rapidez.

**Why this priority**: O cliente automotivo busca segurança e rapidez contra desconfianças comuns de mecânica.

**Independent Test**: Renderizar `/preview/[slug-automotivo]` e verificar contraste acessível no tema escuro, selos de garantia e botão de socorro/orçamento rápido.

**Acceptance Scenarios**:
1. **Given** um lead do nicho automotivo, **When** a página carrega, **Then** o tema adota Dark Slate (`#0F172A`) com destaques em Laranja Performance (`#EA580C`) ou Amarelo Racing, com alto contraste e legibilidade.
2. **Given** a lista de serviços mecânicos, **When** renderizada, **Then** exibe badges de garantias técnicas e botão de chamada para guincho/orçamento expresso via WhatsApp.

---

### User Story 4 - Sofisticação Editorial em Beleza e Bem-Estar (Priority: P2)

Como proprietária de salão de beleza, clínica estética ou proprietário de barbearia, quero ver uma página sofisticada que valorize o portfólio visual de cortes e procedimentos, com agendamento ágil.

**Why this priority**: Beleza é vendida por aspiração, sofisticação e resultados visíveis.

**Independent Test**: Renderizar `/preview/[slug-beleza]` e validar a apresentação editorial, galeria de transformações e CTA de reserva de horário.

**Acceptance Scenarios**:
1. **Given** um lead de salão/estética ou barbearia, **When** a prévia é aberta, **Then** o layout reflete estética refinada com tipografia elegante e destaque para os principais tratamentos/cortes.
2. **Given** fotos de trabalhos realizados, **When** dispostas na galeria, **Then** são exibidas em grid com proporção consistente (aspect-ratio 4:5 ou 1:1) com suporte a zoom ou navegação limpa.

---

### User Story 5 - Consistência e Polimento no Template Geral (Priority: P3)

Como lead de qualquer outro segmento de serviços locais (ex: pet shop, reformas, contabilidade), quero ver uma landing page padrão no estilo "Modern Agency / Local SaaS", flexível e profissional.

**Why this priority**: Garante que leads que não se enquadram nos 4 nichos específicos continuem recebendo uma prévia de alto nível.

**Independent Test**: Renderizar `/preview/[slug-geral]` e verificar que todos os blocos de conteúdo e contato se adaptam harmonicamente.

**Acceptance Scenarios**:
1. **Given** qualquer categoria não especializada, **When** o `GeralTemplate` for acionado, **Then** exibe layout equilibrado em Azul Royal / Slate, com hero, serviços, depoimentos, mapa e contato.

---

## Edge Cases

- **Ausência de fotos ou heroImageUrl**: O template deve aplicar automaticamente uma foto profissional curada de alta resolução via Unsplash CDN com cache, selecionada estritamente para o nicho/subnicho correspondente, impedindo que a landing page fique com aspecto de rascunho ou wireframe.
- **Textos longos ou títulos exagerados coletados do Google Maps**: Headlines e nomes empresariais extensos devem truncar ou quebrar de forma harmoniosa com suporte a `break-words` e `clamp`.
- **Ausência de depoimentos**: Quando `socialProof.testimonials` for vazio, o template deve exibir um card alternativo de autoridade baseado apenas na nota média e volume de avaliações do Google, sem seções em branco.
- **WhatsApp sem DDD ou formato inválido**: O sanitizer existente deve garantir links válidos `https://wa.me/...` sem gerar links vazios ou quebrados.
- **Dispositivos com telas ultra-estreitas (<= 360px)**: A barra fixa inferior não deve sobrepor o rodapé nem bloquear botões essenciais.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer componentes de template dedicados e modularizados para os 5 contextos no Next.js 16.3.5 / Tailwind CSS: `GastronomiaTemplate`, `SaudeTemplate`, `AutomotivoTemplate`, `BelezaTemplate` (com alternância automática de variante visual entre Salão/Estética e Barbearia) e `GeralTemplate`.
- **FR-002**: Cada template DEVE incorporar uma seção **Hero de Alta Conversão**, contendo:
  - Título atraente baseado no headline gerado;
  - Subtítulo explicativo com localização/cidade;
  - Badge flutuante de reputação Google com nota numérica e total de avaliações;
  - Imagem de destaque com aspect-ratio consistente e fallback de foto curada profissional em alta definição (Unsplash CDN) caso o lead não possua fotos no Google Maps;
  - Botão de Ação Primário (CTA WhatsApp) com mensagem personalizada pré-configurada.
- **FR-003**: Cada template DEVE conter uma seção **Especialidades / Serviços em Destaque**, com cards estilizados segundo a linguagem visual do nicho (ícones temáticos, micro-badges de popularidade e descrições concisas).
- **FR-004**: Cada template DEVE conter uma seção **Prova Social & Avaliações**, formatando os depoimentos coletados em cards com aspas/estrelas e nome do cliente verificado.
- **FR-005**: Cada template DEVE conter uma seção **Informações Práticas & Localização**, exibindo endereço com link direto para o Google Maps/Waze, telefone formatado e horários de funcionamento (se disponíveis).
- **FR-006**: Todos os templates DEVEM conter uma **Sticky Bar Mobile** fixa no rodapé da visualização mobile (< 768px) com foco único em botão de largura total para contato direto via WhatsApp, estilizado com ícone e texto de ação contextualizado ao nicho ("Pedir pelo WhatsApp", "Agendar Consulta", "Solicitar Orçamento", etc.).
- **FR-007**: O componente `VisualPitchBadge` (selo de demonstração do VitrineLocal informando que a página é uma prévia e permitindo contratação) DEVE ser posicionado como uma pílula translúcida flutuante (*floating pill* com *backdrop blur*) no canto superior direito sem empurrar o layout do hero para baixo, complementada por uma discreta assinatura institucional no rodapé.
- **FR-008**: O design system DEVE utilizar as paletas de cores do nicho (`niche-palettes.ts`) e suportar a cor primária extraída da marca (`theme.primaryColor`) via CSS variables ou inline styles aplicados aos elementos de ênfase (botões, badges, destaques).
- **FR-009**: Todos os textos e links DEVEM passar pelo sanitizador de HTML (`html-sanitizer.ts`) garantindo zero vulnerabilidades de injeção XSS.
- **FR-010**: Todos os componentes DEVEM manter conformidade estrita com TypeScript (`strict: true`, zero `any`) e testes automatizados em Vitest cobrindo renderização e fallbacks.

### Design Tokens e Diretrizes Visuais por Nicho

| Nicho | Estilo & Atmosfera (Figma) | Paleta Predominante | Tipografia / Sensação | Elementos Chave |
| :--- | :--- | :--- | :--- | :--- |
| **Gastronomia** | Dark Amber / Warm Dining | `#DC2626` (Red), `#D97706` (Amber), `#1C1917` (Stone Dark) | Serif nos títulos, acolhedor e apetitoso | Badges "Mais Pedido", hero com pratos, botão WhatsApp pedidos |
| **Saúde** | Clean Clinic / Modern Care | `#0284C7` (Sky Blue), `#0D9488` (Teal), `#FFFFFF` / `#F8FAFC` | Sans-serif moderna, geométrica e limpa | Badges de autoridade, cards de procedimentos, FAQ acordeão |
| **Automotivo** | High Contrast Dark Industrial | `#EA580C` (Orange Racing), `#0F172A` (Dark Slate), `#334155` | Sans-serif robusta, peso forte | Badges de garantia, socorro rápido, diagnóstico |
| **Beleza** | Editorial Luxe & Glow | `#BE185D` (Pink/Rose), `#F472B6`, `#0F172A` ou champanhe | Serif elegante ou sans leve e espaçada | Galeria de resultados, agendamento por horário |
| **Geral** | Modern Local Agency | `#2563EB` (Royal Blue), `#4F46E5`, `#F8FAFC` | Sans-serif versátil e corporativa | Grid equilibrado, alta legibilidade universal |

---

## Key Entities

- **PreviewSiteConfig**: Objeto estruturado contendo `businessName`, `category`, `niche`, `content` (headline, subheadline, keyServices, cta), `contact` (phone, whatsappLink, address), `socialProof` (rating, reviewCount, testimonials), `gallery` (heroImageUrl, photos) e `theme` (primaryColor, secondaryColor, backgroundColor, textColor).
- **NicheTemplateComponent**: Componente React Server/Client que recebe `PreviewSiteConfig` e renderiza a landing page especializada.
- **TemplateRegistry**: Mapeador que seleciona dinamicamente o template apropriado com base no nicho detectado ou categoria do negócio.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos 5 templates renderizam sem erros de runtime para dados completos e dados mínimos (fallbacks).
- **SC-002**: Nota de acessibilidade e contraste das cores de botões e textos em conformidade com WCAG AA.
- **SC-003**: 100% dos testes unitários de renderização de templates passando no Vitest (`npm test`).
- **SC-004**: Zero erros de TypeScript (`npm run typecheck`) e conformidade estrita no linter (`npm run lint`).
- **SC-005**: Tempo de carregamento do First Contentful Paint (FCP) da prévia inferior a 1.2s em rede simulada 4G móvel.

---

## Assumptions

- O framework unificado permanece estritamente **Next.js 16.3.5 / React 19** conforme a Constituição do VitrineLocal.
- Tailwind CSS v4 / v3 configurado no projeto é a ferramenta primária de estilização, complementada por estilos inline quando as cores forem dinâmicas (`theme.primaryColor`).
- O Módulo 2 (Brand Extractor) e o Módulo 3 (Site Engine) já possuem a infraestrutura de schemas Zod e injeção de dados via `PreviewSiteConfig`, necessitando apenas do refinamento e elevação estética dos componentes e seus testes.
