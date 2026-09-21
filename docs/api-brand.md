# Documentação da API: Módulo 2 (Brand Extractor)

O **Brand Extractor** é responsável por enriquecer leads qualificados com identidade visual, paleta de cores acessível (WCAG AA), depoimentos 5 estrelas e síntese de copy comercial via Google Gemini API (`@google/genai`).

---

## 1. Extrair Identidade de Marca (Sob Demanda)

Executa a extração completa para o lead informado. É idempotente: caso o lead já possua perfil extraído, retorna os dados em cache do SQLite em milissegundos sem gastar tempo de máquina ou tokens.

- **Método**: `POST`
- **Rota**: `/api/brand/extract/:leadId`
- **Query Params**:
  - `force` (opcional, booleano): Se `true`, ignora o cache do banco e re-extrai os dados da web e da IA.

### Resposta de Sucesso (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "b34e5a9f-891d-44a6-93d3-13833b934789",
    "leadId": "20d8d117-c19b-4678-be82-2985e5444c35",
    "businessName": "Oficina Precision Moema",
    "category": "Oficina Mecânica",
    "logoUrl": "https://lh5.googleusercontent.com/p/AF1QipM=w1200-h800-k-no",
    "heroImageUrl": "https://lh5.googleusercontent.com/p/AF1QipN=w1200-h800-k-no",
    "galleryUrls": [
      "https://lh5.googleusercontent.com/p/AF1QipO=w1200-h800-k-no",
      "https://lh5.googleusercontent.com/p/AF1QipP=w1200-h800-k-no"
    ],
    "palette": {
      "primaryColor": "#EA580C",
      "secondaryColor": "#334155",
      "backgroundColor": "#0F172A",
      "textColor": "#F8FAFC",
      "paletteSource": "EXTRACTED"
    },
    "content": {
      "headline": "Especialistas em Manutenção Automotiva de Alta Precisão",
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
        "authorPhotoUrl": "https://lh3.googleusercontent.com/a-/photo.jpg",
        "rating": 5,
        "relativeTime": "há 1 mês",
        "text": "Excelente atendimento! Resolveram no mesmo dia com preço super justo."
      }
    ],
    "status": "COMPLETED",
    "createdAt": "2026-09-21T12:00:00.000Z",
    "updatedAt": "2026-09-21T12:00:00.000Z"
  }
}
```

---

## 2. Consultar Perfil de Marca

Recupera os dados enriquecidos já persistidos para um determinado lead.

- **Método**: `GET`
- **Rota**: `/api/brand/:leadId`

### Resposta de Sucesso (`200 OK`)
Retorna o mesmo payload `{ success: true, data: { ... } }` descrito acima.

### Resposta de Erro (`404 Not Found`)
```json
{
  "success": false,
  "error": "NotFoundError",
  "message": "Nenhum perfil de marca encontrado para o lead 20d8d117-c19b-4678-be82-2985e5444c35"
}
```
