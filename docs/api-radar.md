# API Reference: Módulo 1 — Maps Radar

A API REST do Maps Radar expõe endpoints para automação de prospecção no Google Maps, operando em fila assíncrona com retorno imediato de `jobId` e consulta de status.

---

## 1. Disparar Busca de Oportunidades

Inicia um job assíncrono de mineração e qualificação no Google Maps. A requisição retorna imediatamente com código `202 Accepted`.

- **Método:** `POST`
- **Rota:** `/api/radar/search`
- **Content-Type:** `application/json`

### Payload de Entrada
```json
{
  "niche": "Oficina Mecânica",
  "location": "Moema, São Paulo - SP",
  "limit": 20
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `niche` | `string` | Sim | Nicho ou ramo do comércio (mínimo 2 caracteres) |
| `location` | `string` | Sim | Bairro, cidade ou estado de busca |
| `limit` | `number` | Não | Máximo de resultados a minerar (default: 20, máx: 100) |

### Resposta de Sucesso (`202 Accepted`)
```json
{
  "success": true,
  "message": "Busca enfileirada com sucesso",
  "data": {
    "jobId": "bf620129-f5f6-4d81-b474-90a9fbb09581",
    "status": "PENDING"
  }
}
```

---

## 2. Consultar Status do Job & Resultados

Permite realizar polling do estado do job de scraping até sua conclusão.

- **Método:** `GET`
- **Rota:** `/api/radar/jobs/:id`

### Resposta (`200 OK` - Concluído)
```json
{
  "success": true,
  "data": {
    "jobId": "bf620129-f5f6-4d81-b474-90a9fbb09581",
    "niche": "Oficina Mecânica",
    "location": "Moema, São Paulo - SP",
    "limitRequested": 20,
    "status": "COMPLETED",
    "totalFound": 20,
    "totalQualified": 12,
    "totalDisqualified": 8,
    "startedAt": "2026-09-21T15:23:44.455Z",
    "finishedAt": "2026-09-21T15:24:12.120Z",
    "leads": [
      {
        "id": "18f2d574-d419-48fe-9022-d7b328fc8ad2",
        "businessName": "Auto Mecânica Moema Express",
        "category": "Oficina mecânica",
        "address": "Av. Moema, 340 - Moema, São Paulo - SP",
        "phoneRaw": "(11) 98765-4321",
        "phoneNormalized": "+5511987654321",
        "isMobile": true,
        "websiteRaw": null,
        "websiteType": "NO_WEBSITE",
        "socialLinks": [],
        "rating": 4.9,
        "reviewCount": 128,
        "qualificationScore": 100,
        "status": "QUALIFIED",
        "mapsUrl": "https://www.google.com/maps/place/Auto+Mecanica+Moema+Express/data=!4m2!3m1!1s0x1:0x12345"
      }
    ]
  }
}
```

---

## 3. Listar Leads Qualificados

Recupera todos os estabelecimentos qualificados já persistidos na base de dados com filtros opcionais.

- **Método:** `GET`
- **Rota:** `/api/radar/leads`
- **Query Params:**
  - `niche` (opcional): filtro textual na categoria
  - `location` (opcional): filtro textual no endereço
  - `minScore` (opcional): pontuação mínima (ex: `80`)

### Resposta (`200 OK`)
```json
{
  "success": true,
  "total": 12,
  "data": [ ... ]
}
```
