# Quickstart: Brand Extractor (Módulo 2)

Este guia demonstra como validar e executar a extração de identidade de marca para um lead previamente qualificado no Radar.

---

## 1. Pré-requisitos

1. Ter executado uma busca no Radar (`POST /api/radar/search`) e obtido um `leadId` com status `QUALIFIED`.
2. Definir a variável de ambiente `GEMINI_API_KEY` no arquivo `.env`:
   ```env
   GEMINI_API_KEY="sua-chave-gemini-aqui"
   ```
   _(Nota: O sistema possui fallback resiliente se a chave não estiver presente ou a rede oscilar)._

---

## 2. Iniciar a API em Modo de Desenvolvimento

```bash
npm run dev
```

---

## 3. Disparar Enriquecimento de Marca

### Requisição REST Client / cURL

```http
POST http://localhost:3001/api/brand/extract/{{leadId}}
Content-Type: application/json
```

```bash
curl -X POST http://localhost:3001/api/brand/extract/<LEAD_UUID> \
  -H "Content-Type: application/json"
```

### Resposta Esperada (`200 OK`)

```json
{
  "success": true,
  "data": {
    "id": "b34e5a9f-891d-44a6-93d3-13833b934789",
    "leadId": "20d8d117-c19b-4678-be82-2985e5444c35",
    "businessName": "Oficina Mecânica Precision Car",
    "category": "Oficina Mecânica",
    "logoUrl": "https://lh5.googleusercontent.com/p/AF1QipM...",
    "heroImageUrl": "https://lh5.googleusercontent.com/p/AF1QipN...",
    "galleryUrls": [
      "https://lh5.googleusercontent.com/p/AF1QipO...",
      "https://lh5.googleusercontent.com/p/AF1QipP..."
    ],
    "palette": {
      "primaryColor": "#EA580C",
      "secondaryColor": "#334155",
      "backgroundColor": "#0F172A",
      "textColor": "#F8FAFC",
      "paletteSource": "EXTRACTED"
    },
    "content": {
      "headline": "Especialistas em Manutenção Automotiva de Alta Precisão em Moema",
      "subheadline": "Mais de 15 anos cuidando do seu veículo com transparência e tecnologia de ponta.",
      "aboutText": "A Precision Car oferece diagnóstico eletrônico avançado, revisão preventiva e mecânica geral com atendimento humanizado e garantia de peças originais.",
      "keyServices": [
        "Revisão Preventiva Completa",
        "Diagnóstico Eletrônico Computadorizado",
        "Freios, Suspensão e Câmbio",
        "Alinhamento e Balanceamento 3D"
      ],
      "callToAction": "Agende uma avaliação rápida pelo WhatsApp agora mesmo!"
    },
    "testimonials": [
      {
        "authorName": "Carlos Eduardo",
        "rating": 5,
        "relativeTime": "há 1 mês",
        "text": "Excelente atendimento! Levei meu carro com um barulho na suspensão e resolveram no mesmo dia com preço super justo."
      }
    ],
    "status": "COMPLETED",
    "createdAt": "2026-09-21T15:50:00.000Z",
    "updatedAt": "2026-09-21T15:50:00.000Z"
  }
}
```

---

## 4. Consulta do Perfil de Marca

```http
GET http://localhost:3001/api/brand/{{leadId}}
```

```bash
curl -X GET http://localhost:3001/api/brand/<LEAD_UUID>
```

---

## 5. Forçar Re-extração (Bypass do Cache no Banco)

```http
POST http://localhost:3001/api/brand/extract/{{leadId}}?force=true
```
