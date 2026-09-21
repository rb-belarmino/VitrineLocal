# Documentação da API: Módulo 3 (Site Engine)

O **Site Engine** é responsável por renderizar em tempo real landing pages HTML5 responsivas, modernas e de alta conversão para os leads qualificados da VitrineLocal (estratégia de Visual Pitch). O motor suporta resolução dinâmica por UUID ou slug amigável, adaptação visual por nicho temático, conformidade WCAG AA e injeção do selo comercial da VitrineLocal.

---

## 1. Visualizar Landing Page de Demonstração (HTML)

Renderiza o HTML5 completo da landing page gerada para o lead. Caso o lead ainda não possua `BrandProfile` sintetizado, o Site Engine executa a extração Just-In-Time (JIT) de forma transparente.

- **Método**: `GET`
- **Rotas**:
  - `/preview/:id` (identificador UUID do lead)
  - `/preview/:slug` (slug kebab-case persistido no banco)
- **Response Header**: `Content-Type: text/html; charset=utf-8`

### Resposta de Sucesso (`200 OK`)

Documento HTML5 completo contendo:

- Metadados SEO e OpenGraph (título, descrição, canonical URL e imagem).
- Variáveis CSS injetadas no `:root` (`--brand-primary`, `--brand-secondary`, `--brand-bg`, `--brand-text`).
- Banner superior de demonstração do **Visual Pitch** com botão de reivindicação para o WhatsApp da VitrineLocal.
- Seções temáticas adaptadas ao nicho do lead (Saúde, Automotivo, Gastronomia, Beleza ou Serviços Gerais).
- Botão flutuante de WhatsApp direcionando diretamente para o atendimento do estabelecimento comercial.

### Resposta de Erro (`404 Not Found`)

```json
{
  "success": false,
  "error": "NotFoundError",
  "message": "Lead não encontrado para o identificador \"oficina-inexistente\"."
}
```

---

## 2. Consultar Configuração Estruturada do Preview (JSON DTO)

Retorna a configuração completa montada para o preview em formato JSON estruturado (`PreviewSiteConfig`), útil para depuração, integrações externas ou frontends headless.

- **Método**: `GET`
- **Rota**: `/api/preview/:id/config`
- **Parâmetros**:
  - `:id` (obrigatório, string UUID v4)

### Resposta de Sucesso (`200 OK`)

```json
{
  "success": true,
  "data": {
    "leadId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "slug": "oficina-precision-moema",
    "businessName": "Oficina Precision",
    "category": "Oficina mecânica",
    "nicheTheme": "automotivo",
    "contact": {
      "phoneRaw": "(11) 98888-1111",
      "phoneNormalized": "11988881111",
      "isMobile": true,
      "address": "Av Santo Amaro, 100 - Moema, São Paulo - SP",
      "whatsappLink": "https://wa.me/5511988881111"
    },
    "theme": {
      "primaryColor": "#0066CC",
      "secondaryColor": "#FF6600",
      "backgroundColor": "#FFFFFF",
      "textColor": "#111111",
      "paletteSource": "EXTRACTED"
    },
    "content": {
      "headline": "Manutenção de Qualidade",
      "subheadline": "Sua oficina de confiança em Moema",
      "aboutText": "Serviços completos com garantia de procedência.",
      "keyServices": ["Revisão Preventiva", "Freios e Suspensão", "Injeção Eletrônica"],
      "callToAction": "Fale Conosco no WhatsApp"
    },
    "gallery": {
      "heroImageUrl": "https://images.unsplash.com/photo-1486006920555-c77dce18193b",
      "logoUrl": null,
      "photos": []
    },
    "socialProof": {
      "rating": 4.8,
      "reviewCount": 20,
      "testimonials": [
        {
          "authorName": "Carlos Silva",
          "rating": 5,
          "text": "Excelente serviço e pontualidade!"
        }
      ]
    },
    "visualPitch": {
      "badgeText": "Demonstração exclusiva criada para Oficina Precision pela VitrineLocal",
      "ctaText": "Quero este site para minha empresa",
      "ctaWhatsappLink": "https://wa.me/5511999998888?text=Ola!%20Vi%20a%20demonstracao..."
    },
    "meta": {
      "title": "Oficina Precision | Site Oficial",
      "description": "Sua oficina de confiança em Moema",
      "ogImage": "https://images.unsplash.com/photo-1486006920555-c77dce18193b",
      "canonicalUrl": "https://preview.vitrinelocal.com.br/preview/oficina-precision-moema"
    }
  }
}
```

### Resposta de Erro de Validação (`400 Bad Request`)

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Parâmetro id inválido. Deve ser um UUID."
}
```
