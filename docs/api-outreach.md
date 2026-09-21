# Documentação da API: Módulo 4 (Outreach CRM & Portal Web)

O **Módulo 4 (Outreach CRM)** é o motor de prospecção comercial e o painel de controle operacional da VitrineLocal. Ele inclui o Portal Web interativo em `GET /` e `GET /dashboard`, a geração de abordagens consultivas com IA via Google Gemini (`@google/genai`) e a gestão de transição de status dos leads no funil de vendas.

---

## 1. Portal Web do Operador (Dashboard SPA)

Renderiza a interface gráfica do operador contendo métricas, formulário de varredura do Maps com acompanhamento de jobs em tempo real, tabela de leads com filtros e modal de disparo para WhatsApp Web.

- **Método**: `GET`
- **Rotas**:
  - `/`
  - `/dashboard`
- **Response**: `200 OK` (`text/html; charset=utf-8`)

---

## 2. Gerar Mensagem de Abordagem Comercial (Visual Pitch)

Gera copy consultiva hiper-personalizada contendo elogio sincero à nota do Google Maps, alerta educado sobre ausência de site oficial, apresentação do link de preview exclusivo e convite para feedback sem compromisso.

- **Método**: `POST`
- **Rota**: `/api/outreach/generate/:leadId`
- **Parâmetros**:
  - `:leadId` (UUID obrigatório do lead)

### Resposta de Sucesso (`200 OK`)

```json
{
  "success": true,
  "data": {
    "leadId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "businessName": "Oficina Precision",
    "phoneNormalized": "11988881111",
    "isMobile": true,
    "previewUrl": "http://localhost:3001/preview/oficina-precision-moema",
    "messageText": "Olá! Tudo bem? Passando para parabenizar o trabalho da equipe da Oficina Precision — vi que vocês têm uma excelente avaliação no Google (4.8★ com 20 avaliações positivas!)...",
    "whatsappDispatchLink": "https://wa.me/5511988881111?text=Ol%C3%A1!...",
    "generatedVia": "GEMINI_AI"
  }
}
```

---

## 3. Atualizar Estágio do Lead no Funil

Permite avançar o status comercial do lead conforme ele avança na negociação.

- **Método**: `PATCH`
- **Rota**: `/api/outreach/leads/:id/status`
- **Parâmetros**:
  - `:id` (UUID do lead)
- **Body**:

```json
{
  "status": "CONTACTED",
  "outreachCopy": "Copy final personalizada enviada ao cliente",
  "notes": "Observações opcionais sobre o contato"
}
```

Valores permitidos para `status`:

- `QUALIFIED`: Lead minerado e qualificado, aguardando primeiro contato.
- `CONTACTED`: Mensagem de abordagem enviada via WhatsApp (preenche automaticamente `contactedAt`).
- `NEGOTIATING`: Lead respondeu positivamente e está avaliando a proposta.
- `CONVERTED`: Proposta fechada (site contratado).
- `DISQUALIFIED`: Recusou ou não possui interesse.

### Resposta de Sucesso (`200 OK`)

```json
{
  "success": true,
  "message": "Status atualizado com sucesso."
}
```

---

## 4. Obter Métricas Consolidadas do Funil

Retorna o quantitativo consolidado de estabelecimentos em cada estágio do funil operacional.

- **Método**: `GET`
- **Rota**: `/api/portal/stats`

### Resposta de Sucesso (`200 OK`)

```json
{
  "success": true,
  "data": {
    "totalMined": 30,
    "totalQualified": 20,
    "totalPreviewsReady": 15,
    "totalContacted": 10,
    "totalConverted": 5
  }
}
```
