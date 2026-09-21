# Feature Specification: Brand Extractor (Módulo 2)

**Feature Branch**: `002-brand-extractor`

**Created**: 2026-09-21

**Status**: Draft

**Input**: User description: "Módulo 2: Brand Extractor — Extrator visual e semântico de identidade de marca para leads qualificados do Google Maps, incluindo extração de fotos, logotipo, paleta de cores dominante com fallback inteligente por nicho, curadoria de depoimentos e síntese de diferenciais comerciais com IA."

## Clarifications

### Session 2026-09-21

- Q: Como o sistema deve se comportar quando o operador solicitar a extração de marca para um lead que já possui um perfil extraído anteriormente? → A: Retornar o perfil existente persistido no banco por padrão (idempotente/cache no banco de dados via Prisma, sem necessidade de Redis); reprocessar apenas se `?force=true` for informado explicitamente.
- Q: Como o sistema deve priorizar e selecionar as 3 a 5 avaliações quando o perfil do Google Maps possuir dezenas de avaliações 5 estrelas? → A: Priorizar comentários 5 estrelas com maior extensão e detalhamento textual (maior contagem de caracteres descritivos do atendimento e qualidade do serviço).
- Q: Como o sistema deve reagir se as cores extraídas das fotos resultarem em contraste insuficiente para leitura de textos? → A: Ajustar programaticamente o contraste das cores de fundo e texto (garantindo legibilidade com proporção de contraste acessível), preservando a cor primária autêntica da marca como destaque nos elementos visuais.

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Extração de Identidade Visual e Paleta de Cores (Priority: P1)

Como operador de prospecção comercial da VitrineLocal, desejo extrair automaticamente a identidade visual (fotos do estabelecimento, logo ou foto de capa) e uma paleta de cores estilizada (cores primária, secundária, de fundo e de texto de alto contraste) para um lead qualificado, para que o renderizador de sites possa gerar uma página fiel à identidade do comércio local.

**Why this priority**: A estética visual autêntica é o pilar central do "Visual Pitch". Apresentar um site mockup com as fotos reais e as cores da empresa gera impacto imediato de pertencimento no dono do negócio.

**Independent Test**: Pode ser testado fornecendo um lead do Maps com fotos e verificando se o sistema extrai imagens válidas e calcula uma paleta com contraste legível.

**Acceptance Scenarios**:

1. **Given** um lead qualificado com fotos publicadas no perfil do Google Maps, **When** a extração visual for executada, **Then** o sistema extrai até 5 imagens em alta resolução, identifica o candidato mais provável a logo/fachada e calcula uma paleta de cores (primária, secundária, fundo e texto).
2. **Given** um estabelecimento que não possui fotos nítidas ou cuja paleta calculada apresente baixo contraste, **When** a extração for concluída, **Then** o sistema aplica automaticamente uma paleta de cores curada baseada no nicho do estabelecimento (ex: azul naval/ciano para saúde, grafite/âmbar para oficinas).

---

### User Story 2 - Curadoria de Prova Social e Avaliações Reais (Priority: P2)

Como consultor de vendas da VitrineLocal, desejo capturar os melhores depoimentos de clientes (avaliações 5 estrelas com comentários detalhados) do perfil do estabelecimento, para que a seção de depoimentos do site de demonstração destaque a autoridade e reputação do negócio na comunidade local.

**Why this priority**: Estabelecimentos sem site frequentemente possuem dezenas ou centenas de elogios no Google Maps que passam despercebidos; transformar esses reviews em prova social estruturada reforça o valor de ter um site profissional.

**Independent Test**: Pode ser testado fornecendo um perfil do Maps com 10+ avaliações e confirmando que o sistema seleciona de 3 a 5 avaliações com melhor teor de elogio, descartando comentários vazios ou negativos.

**Acceptance Scenarios**:

1. **Given** um estabelecimento com avaliações públicas no Google Maps, **When** a curadoria de depoimentos for acionada, **Then** o sistema seleciona entre 3 e 5 avaliações com nota 5 estrelas que contenham texto relevante, normalizando nome do autor, tempo relativo e conteúdo do elogio.
2. **Given** um estabelecimento com menos de 3 avaliações com texto, **When** a extração ocorrer, **Then** o sistema preserva as avaliações existentes sem corromper a estrutura e sinaliza a carência de depoimentos textuais.

---

### User Story 3 - Síntese Semântica de Conteúdo com Inteligência Artificial (Priority: P3)

Como prospector, desejo que o sistema processe o nicho, as avaliações e as características do comércio para gerar automaticamente títulos de impacto (headlines), propostas de valor em tópicos, lista de serviços prestados e uma chamada para ação (CTA) persuasiva direcionada ao WhatsApp, para preencher todas as seções do site de demonstração sem trabalho manual.

**Why this priority**: Um design visual bonito precisa de textos publicitários contextualizados para transformar o mockup em uma ferramenta de vendas irresistível.

**Independent Test**: Pode ser testado enviando os dados de um negócio e verificando se a síntese retorna textos coesos em português, com chamada clara para ação e sem alucinações de dados essenciais.

**Acceptance Scenarios**:

1. **Given** as informações consolidadas de um lead e seus depoimentos, **When** a síntese de marca for solicitada, **Then** a IA produz um título principal (Hero Headline), subtítulo de autoridade local, 3 a 4 benefícios/diferenciais e uma frase de chamada para ação direta.

---

### Edge Cases

- **Estabelecimento sem nenhuma foto cadastrada**: O sistema deve recorrer imediatamente ao catálogo de imagens temáticas padrão por categoria e aplicar a paleta do nicho.
- **Estabelecimento com notas baixas ou avaliações vazias (apenas estrelas sem texto)**: O sistema não deve quebrar nem inventar depoimentos fictícios; deve preencher a síntese baseando-se apenas na categoria e atributos conhecidos.
- **Falha de rede ou timeout ao processar conteúdo com IA**: O sistema deve tentar novamente com política de retentativa e, em caso de esgotamento, gerar uma síntese fallback predefinida por template estático.
- **Fotos em formatos corrompidos ou resoluções minúsculas**: Devem ser filtradas e descartadas na etapa de curadoria visual.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE receber como entrada um identificador de lead qualificado previamente minerado pelo Radar.
- **FR-002**: O sistema DEVE extrair as imagens do perfil do Google Maps do lead, preservando as versões de maior resolução disponíveis.
- **FR-003**: O sistema DEVE priorizar a extração de fotos e logo do perfil do Google Maps e, caso o perfil possua poucas imagens (< 3 fotos) e o lead possua perfil social (como Instagram cadastrado no Radar), realizar fallback para capturar a foto de perfil e mídias públicas do link social.
- **FR-004**: O sistema DEVE persistir as referências e URLs remotas de alta resolução das imagens coletadas (Google CDN / mídias públicas), evitando o consumo desnecessário de armazenamento em disco local.
- **FR-005**: O sistema DEVE analisar os pixels ou metadados das imagens para extrair a paleta de cores dominante (cor primária, secundária, cor de fundo e contraste para texto). Caso o contraste entre texto e fundo seja insuficiente, o sistema DEVE normalizar programaticamente a cor de fundo e texto para garantir legibilidade acessível, mantendo a cor primária original da marca.
- **FR-006**: O sistema DEVE disponibilizar paletas de cores padrão profissionais por nicho comercial, ativadas caso a paleta extraída seja insuficiente ou não atenda aos critérios de contraste acessível.
- **FR-007**: O sistema DEVE selecionar de 3 a 5 avaliações com nota máxima (5 estrelas) do perfil do negócio, ordenadas prioritariamente por extensão e riqueza descritiva do comentário textual sobre qualidade e atendimento.
- **FR-008**: O sistema DEVE utilizar modelo de linguagem inteligente para sintetizar os diferenciais do negócio, gerando título hero, resumo institucional, lista de serviços prováveis e chamada para ação comercial.
- **FR-009**: O sistema DEVE associar todos os dados visuais e semânticos extraídos diretamente ao registro do lead qualificado.
- **FR-010**: O sistema DEVE permitir a execução sob demanda da extração de identidade de marca através de interface/endpoint de API dedicado por lead (`POST /api/brand/extract/:leadId`), otimizando o consumo de tokens e recursos. Se o lead já possuir perfil de marca extraído, o sistema DEVE retornar o registro persistido imediatamente (cache no banco de dados), a menos que o parâmetro `?force=true` seja fornecido para forçar a re-extração.
- **FR-011**: O sistema DEVE expor consulta aos dados enriquecidos da marca através de interface programática tipada.

---

### Key Entities _(include if feature involves data)_

- **BrandProfile**:
  - `id`: Identificador único do enriquecimento de marca.
  - `leadId`: Referência ao lead qualificado correspondente.
  - `logoUrl`: Imagem candidata a logotipo ou avatar comercial.
  - `heroImageUrl`: Imagem principal de capa/fachada em alta resolução.
  - `galleryUrls`: Coleção de imagens suplementares do estabelecimento.
  - `primaryColor`: Código hexadecimal da cor primária.
  - `secondaryColor`: Código hexadecimal da cor de destaque/secundária.
  - `backgroundColor`: Código hexadecimal de fundo recomendado.
  - `textColor`: Código hexadecimal com alto contraste para leitura.
  - `paletteSource`: Origem da paleta (`EXTRACTED` ou `FALLBACK_NICHE`).
  - `headline`: Título promocional de alto impacto para o topo da página.
  - `subheadline`: Subtítulo descritivo da atividade local.
  - `aboutText`: Breve descrição comercial e humanizada do negócio.
  - `keyServices`: Lista de serviços ou especialidades identificados.
  - `callToAction`: Texto persuasivo com instrução de contato via WhatsApp.
  - `testimonials`: Coleção de depoimentos curados (autor, nota, texto, tempo relativo).
  - `extractionStatus`: Estado do processo (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`).
  - `extractedAt`: Data e hora de conclusão do enriquecimento.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% dos leads processados com sucesso recebem uma paleta de 4 cores com contraste visual válido (legibilidade mínima garantida).
- **SC-002**: O tempo médio de extração completa de identidade e síntese de conteúdo por lead não ultrapassa 15 segundos em condições normais de rede.
- **SC-003**: 100% dos estabelecimentos que possuem avaliações públicas com texto têm até 5 depoimentos reais selecionados sem erros de formatação.
- **SC-004**: Falhas transitórias em chamadas externas de IA ou rede são recuperadas com fallback resiliente sem que o processo aborte abruptamente.

---

## Assumptions

- O lead já possui localização, categoria e link do perfil no Google Maps cadastrados no sistema pelo Módulo 1.
- O acesso a modelos de inteligência artificial é configurado com chave de ambiente válida e suporta geração em língua portuguesa (pt-BR).
- O nicho do comércio pode ser inferido a partir da categoria primária capturada no Google Maps.
