# Data Model: Brand Extractor (Módulo 2)

## Prisma Schema Extension

O modelo `BrandProfile` estabelece uma relação 1:1 com o `QualifiedLead` persistido no SQLite.

```prisma
model BrandProfile {
  id              String         @id @default(uuid())
  leadId          String         @unique
  lead            QualifiedLead  @relation(fields: [leadId], references: [id], onDelete: Cascade)

  // Mídias Visuais (URLs remotas de alta resolução)
  logoUrl         String?
  heroImageUrl    String?
  galleryUrls     String         @default("[]") // JSON stringified array: string[]

  // Identidade de Cores & CSS
  primaryColor    String         // HEX (ex: "#0284C7")
  secondaryColor  String         // HEX (ex: "#0D9488")
  backgroundColor String         // HEX (ex: "#FFFFFF" ou "#0F172A")
  textColor       String         // HEX com alto contraste WCAG AA (ex: "#0F172A")
  paletteSource   String         // "EXTRACTED" | "FALLBACK_NICHE"

  // Síntese Semântica de Conteúdo (Gemini AI)
  headline        String
  subheadline     String
  aboutText       String
  keyServices     String         @default("[]") // JSON stringified array: string[]
  callToAction    String

  // Prova Social & Depoimentos Curados
  testimonials    String         @default("[]") // JSON stringified array: TestimonialItem[]

  // Estado e Metadados
  status          String         @default("COMPLETED") // "COMPLETED" | "FAILED"
  errorMessage    String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([leadId])
  @@index([status])
}
```

Atualização necessária no modelo `QualifiedLead` em `prisma/schema.prisma`:

```prisma
model QualifiedLead {
  // ... campos existentes ...
  brandProfile           BrandProfile?
}
```

---

## Estruturas de Dados Tipadas (TypeScript / Zod)

### TestimonialItem

```typescript
export interface TestimonialItem {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number; // 5
  relativeTime: string; // ex: "há 3 meses"
  text: string;
}
```

### BrandPaletteDTO

```typescript
export interface BrandPaletteDTO {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  paletteSource: 'EXTRACTED' | 'FALLBACK_NICHE';
}
```

### BrandProfileDTO (Resposta da API)

```typescript
export interface BrandProfileDTO {
  id: string;
  leadId: string;
  businessName: string;
  category: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  galleryUrls: string[];
  palette: BrandPaletteDTO;
  content: {
    headline: string;
    subheadline: string;
    aboutText: string;
    keyServices: string[];
    callToAction: string;
  };
  testimonials: TestimonialItem[];
  status: 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}
```
