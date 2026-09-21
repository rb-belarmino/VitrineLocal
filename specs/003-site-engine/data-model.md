# Data Model & Schema Design: Módulo 3 — Site Engine

**Feature**: Módulo 3 — Site Engine (Templates Dinâmicos & Visual Pitch Preview)  
**Date**: 2026-09-21  
**Status**: Approved

---

## 1. Evolução do Prisma Schema (`prisma/schema.prisma`)

Para suportar o roteamento amigável por slug indexado com garantia de unicidade sem quebrar compatibilidade retroativa com os dados existentes:

```prisma
model QualifiedLead {
  id                     String        @id @default(uuid())
  slug                   String?       @unique // Novo campo para rotas amigáveis (/preview/:slug)
  businessName           String
  category               String        @default("Serviços Locais")
  address                String?
  phoneRaw               String?
  phoneNormalized        String?
  isMobile               Boolean       @default(false)
  websiteRaw             String?
  websiteType            String        // NO_WEBSITE, SOCIAL_ONLY, OWN_WEBSITE
  socialLinks            String        @default("[]") // JSON stringified array of URLs
  rating                 Float         @default(0.0)
  reviewCount            Int           @default(0)
  qualificationScore     Int           @default(0)
  status                 String        // QUALIFIED, DISQUALIFIED
  disqualificationReason String?
  mapsUrl                String        @unique
  searchJobId            String?
  searchJob              SearchJob?    @relation(fields: [searchJobId], references: [id], onDelete: SetNull)
  brandProfile           BrandProfile?
  createdAt              DateTime      @default(now())
  updatedAt              DateTime      @updatedAt

  @@index([slug])
  @@index([status])
  @@index([phoneNormalized])
  @@index([category])
}
```

---

## 2. Entidade de Domínio e DTO Consolidado: `PreviewSiteConfig`

O DTO `PreviewSiteConfig` consolida todos os dados necessários para os componentes de template renderizarem a landing page completa sem precisar consultar o banco de dados novamente:

```typescript
export type NicheTheme = 'saude' | 'automotivo' | 'gastronomia' | 'beleza' | 'geral';

export interface PreviewContactInfo {
  phoneRaw: string | null;
  phoneNormalized: string | null;
  isMobile: boolean;
  address: string | null;
  whatsappLink: string; // https://wa.me/55... com mensagem codificada
}

export interface PreviewBrandTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  paletteSource: 'EXTRACTED' | 'FALLBACK_NICHE';
}

export interface PreviewContent {
  headline: string;
  subheadline: string;
  aboutText: string;
  keyServices: string[];
  callToAction: string;
}

export interface PreviewSocialProof {
  rating: number;
  reviewCount: number;
  testimonials: Array<{
    authorName: string;
    rating: number;
    text: string;
    relativeTime?: string;
  }>;
}

export interface PreviewSiteConfig {
  leadId: string;
  slug: string;
  businessName: string;
  category: string;
  nicheTheme: NicheTheme;
  contact: PreviewContactInfo;
  theme: PreviewBrandTheme;
  content: PreviewContent;
  gallery: {
    heroImageUrl: string | null;
    logoUrl: string | null;
    photos: string[];
  };
  socialProof: PreviewSocialProof;
  visualPitch: {
    badgeText: string;
    ctaText: string;
    ctaWhatsappLink: string; // WhatsApp oficial da VitrineLocal com leadId e empresa
  };
  meta: {
    title: string;
    description: string;
    ogImage: string | null;
    canonicalUrl: string;
  };
}
```

---

## 3. Mapeamento Categoria ➔ Nicho Temático

Regra de inferência para seleção automática do template:

| Palavras-chave na Categoria                                                 | Nicho Temático (`NicheTheme`) | Template Selecionado       |
| :-------------------------------------------------------------------------- | :---------------------------- | :------------------------- |
| `odonto`, `dentist`, `clínica`, `médic`, `saúde`, `fisioter`, `hospital`    | `saude`                       | `SaudeTemplate`            |
| `oficina`, `mecânic`, `auto`, `pneu`, `funilaria`, `moto`, `veículo`        | `automotivo`                  | `AutomotivoTemplate`       |
| `restaurante`, `pizzaria`, `bar`, `hambúrguer`, `café`, `padaria`, `comida` | `gastronomia`                 | `GastronomiaTemplate`      |
| `salão`, `barbearia`, `estética`, `cabelereir`, `beleza`, `manicure`, `spa` | `beleza`                      | `BelezaTemplate`           |
| Qualquer outra categoria                                                    | `geral`                       | `GeralTemplate` (Fallback) |
