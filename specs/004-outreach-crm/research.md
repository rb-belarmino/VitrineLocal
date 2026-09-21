# Technical Research: Módulo 4 — Outreach CRM & Portal Web

**Feature**: Módulo 4 — Outreach CRM & Portal Web  
**Created**: 2026-09-21

---

## 1. Arquitetura da Interface Web do Portal (Dashboard)

### Decisão Técnica: Dashboard Integrado em Next.js 16.3.5 (App Router, React 19, Tailwind CSS)

- **Contexto**: A plataforma VitrineLocal unifica seu ecossistema web e de APIs no framework Next.js 16.3.5 (App Router). Para o portal operacional do operador, implementamos uma interface reativa, responsiva e performática que consome diretamente os Route Handlers (`app/api/*`) e os serviços do núcleo da aplicação.
- **Racional da Adoção do Next.js 16.3.5**:
  - Elimina a necessidade de servidores HTTP redundantes;
  - Unifica o portal administrativo, as páginas de preview (`/preview/[slug]`) e os Route Handlers em um único runtime em `http://localhost:3000`;
  - Permite utilizar componentes React com Tailwind CSS, tipagem estrita de propriedades e gerenciamento de estado claro no cliente para modais, filtros e formulários interativos.
- **Decisão**: **Dashboard Integrado no Next.js 16.3.5 App Router (`src/app/page.tsx`)**. Carrega instantaneamente, conta com hot-reloading via Turbopack e executa com um único comando `npm run dev`.

---

## 2. Acompanhamento de Jobs do Radar em Tempo Real

### Decisão Técnica: Polling Inteligente no Cliente

- **Contexto**: Quando o operador preenche o formulário de busca no Google Maps e clica em "Iniciar Mineração", o backend responde `202 Accepted` com `{ jobId }` e executa a extração em background.
- **Implementação**:
  - O painel exibe um card com animação de spinner e status: _"Minerando estabelecimentos no Google Maps..."_.
  - O frontend executa polling assíncrono a cada 1.500ms em `GET /api/radar/jobs/:jobId`.
  - Ao atingir `COMPLETED`, o card exibe badge de sucesso com a quantidade de estabelecimentos minerados e recarrega a tabela de leads automaticamente.
  - Se atingir `FAILED`, exibe o motivo da falha com botão de nova tentativa.

---

## 3. Motor de Copywriting Consultivo (Visual Pitch) com Gemini IA

### Decisão Técnica: Integração com `@google/genai` e Fallback Determinístico

- **Metodologia Visual Pitch**:
  - A abordagem NÃO deve parecer uma mensagem genérica de vendas ("Olá, vendo sites por R$ 500").
  - Ela deve seguir 4 etapas consultivas:
    1. **Elogio Genuíno**: Menciona a excelente nota no Google Maps (ex: "Vi que a Clínica Sorriso tem nota 4.9 no Google com dezenas de avaliações positivas!").
    2. **Alerta de Perda de Mercado**: Observa com respeito que, ao procurar pelo site oficial, apenas redes sociais ou nenhum link foi encontrado, fazendo a empresa perder clientes para concorrentes.
    3. **Apresentação da Solução Pronta**: "Preparamos uma demonstração exclusiva de como seria a nova presença digital da Clínica Sorriso: [LINK_PREVIEW]".
    4. **Call-to-Action Sem Compromisso**: "O que achou da estrutura? Sem compromisso algum, podemos ajustar detalhes se fizer sentido para vocês."
- **Resiliência**:
  - Se `GEMINI_API_KEY` estiver configurada, o modelo `gemini-2.5-flash` sintetiza a copy sob medida.
  - Se a chave não existir ou houver rate limit / falha de rede, um sintetizador determinístico monta a mensagem com os mesmos 4 pilares utilizando os dados do `QualifiedLead` e `BrandProfile`.

---

## 4. Gestão de Estágios do Funil (Pipeline CRM) & Persistência de Copy

### Decisão Técnica: Máquina de Estados e Persistência Direta no `QualifiedLead`

- **Estados do Lead**:
  - `QUALIFIED`: Minerado e qualificado, aguardando primeiro contato.
  - `CONTACTED`: Mensagem de abordagem enviada via WhatsApp (confirmada pelo operador).
  - `NEGOTIATING`: Cliente respondeu, visualizou o preview e iniciou conversa.
  - `CONVERTED`: Proposta fechada (contratação de site).
  - `DISQUALIFIED`: Recusou abordagem ou lead desqualificado.
- **Preview Pronto como Indicador Dinâmico**:
  - Não há status `PREVIEW_READY` no banco; o portal avalia `lead.brandProfile !== null` para exibir o badge e habilitar o botão de preview instantâneo.
- **Persistência de Copy e Timestamp**:
  - Ao gerar a mensagem ou ao atualizar para `CONTACTED`, persistimos `outreachCopy` (texto da copy final personalizada) e `contactedAt` (data/hora do contato) diretamente no `QualifiedLead`.
  - **Alternativa Rejeitada**: Tabela separada `OutreachInteraction` descartada por adicionar overhead de joins e complexidade prematura no MVP.

---

## 5. UX de Disparo via WhatsApp e Confirmação Guiada

### Decisão Técnica: Modal com Textarea Editável, URL Dinâmica e Diálogo de Confirmação

- **Edição em Tempo Real**:
  - A mensagem gerada pelo Gemini ou fallback é carregada em um `<textarea>` editável.
  - Cada caractere digitado atualiza a URL de disparo `https://wa.me/55...` com `encodeURIComponent(novoTexto)` em tempo real.
  - Inclui botão de 1 clique "Copiar Mensagem" para a área de transferência (`navigator.clipboard.writeText`).
- **Confirmação Guiada**:
  - Ao clicar em "Abrir WhatsApp Web", a janela externa é aberta e o portal exibe um banner/diálogo: _"Mensagem enviada com sucesso no WhatsApp?"_.
  - O status só transiciona para `CONTACTED` (com envio de `outreachCopy` e `contactedAt`) mediante confirmação positiva do operador.

---

## 6. Resiliência Operacional para Telefones Fixos

### Decisão Técnica: Tratamento Flexível com Alerta Visual

- **Contexto**: No Brasil, muitas clínicas e pequenas empresas cadastram seus números fixos no WhatsApp Business. Bloquear o envio impediria contato com leads legítimos.
- **Implementação**:
  - Quando `lead.isMobile === false`, o portal exibe um badge visual de alerta: `Fixo / Comercial`.
  - O botão do WhatsApp permanece ativo, mas com aviso explicativo.
  - O operador conta com o botão "Copiar Mensagem" para abordar o cliente via chamada de voz ou outros meios caso o número fixo não tenha WhatsApp.
