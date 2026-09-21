# Data Model & Design Tokens: 005-pro-templates

**Feature**: [spec.md](./spec.md) | **Date**: 2026-09-21  
**Status**: Completed (Phase 1)

---

## 1. Entidades & Estruturas de Dados

### 1.1 PreviewSiteConfig (Consumido pelos Templates)
O contrato principal consumido pelos 5 templates provém de `PreviewSiteConfig`:

```typescript
export interface PreviewSiteConfig {
  leadId: string;
  slug: string;
  businessName: string;
  category: string;
  nicheTheme: 'saude' | 'automotivo' | 'gastronomia' | 'beleza' | 'geral';
  contact: {
    phoneRaw: string | null;
    phoneNormalized: string | null;
    isMobile: boolean;
    address: string | null;
    whatsappLink: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    paletteSource: 'EXTRACTED' | 'FALLBACK_NICHE';
  };
  content: {
    headline: string;
    subheadline: string;
    aboutText: string;
    keyServices: string[];
    callToAction: string;
  };
  gallery: {
    heroImageUrl: string | null;
    logoUrl: string | null;
    photos: string[];
  };
  socialProof: {
    rating: number;
    reviewCount: number;
    testimonials: Array<{
      authorName: string;
      rating: number;
      text: string;
      relativeTime?: string;
    }>;
  };
  visualPitch: {
    badgeText: string;
    ctaText: string;
    ctaWhatsappLink: string;
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

## 2. Catálogo de Imagens Curadas de Fallback (Unsplash CDN)

Quando `gallery.heroImageUrl` for `null` ou vazio, o template resolve a foto principal a partir do utilitário `getNicheFallbackHeroImage(nicheTheme, category, businessName)`:

```typescript
export interface NicheHeroFallbackMap {
  gastronomia: string;
  saude: string;
  automotivo: string;
  beleza: {
    salao: string;
    barbearia: string;
  };
  geral: string;
}

export const FALLBACK_NICHE_HERO_IMAGES: NicheHeroFallbackMap = {
  gastronomia:
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  saude:
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
  automotivo:
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
  beleza: {
    salao:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    barbearia:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
  },
  geral:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
};
```

---

## 3. Variante Estética de Beleza / Barbearia

```typescript
export type BelezaVariant = 'salao' | 'barbearia';

export function detectBelezaVariant(category: string, businessName: string): BelezaVariant {
  const combined = `${category} ${businessName}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const isBarbearia =
    combined.includes('barbearia') ||
    combined.includes('barber') ||
    combined.includes('barba') ||
    combined.includes('navalha') ||
    combined.includes('corte masculino');

  return isBarbearia ? 'barbearia' : 'salao';
}
```

---

## 4. Design Tokens por Template

### 4.1 GastronomiaTemplate
* **Tema Base**: Stone 950 (`#0c0a09`) e Stone 900 (`#1c1917`).
* **Textos**: White (`#ffffff`), Stone 200 (`#e7e5e4`) e Stone 400 (`#a8a29e`).
* **Acentos**: Amber 500 (`#f59e0b`) e Red 600 (`#dc2626`).
* **CTAs**: WhatsApp verde/âmbar de alto destaque.
* **Componente de Ação**: Sticky Mobile Bar inferior com "Fazer Pedido / Ver Cardápio".

### 4.2 SaudeTemplate
* **Tema Base**: Fundo White puro com sessões alternadas em Sky 50 (`#f0f9ff`) e Slate 50.
* **Textos**: Slate 900 (`#0f172a`), Slate 600 (`#475569`).
* **Acentos**: Sky 600 (`#0284c7`) e Teal 600 (`#0d9488`).
* **FAQ**: Accordion nativo com `<details class="group ...">` e `<summary>`.
* **Componente de Ação**: Sticky Mobile Bar inferior com "Agendar Consulta".

### 4.3 AutomotivoTemplate
* **Tema Base**: Dark Slate 950 (`#020617`) e Slate 900 (`#0f172a`).
* **Textos**: Slate 100 (`#f1f5f9`), Slate 400 (`#94a3b8`).
* **Acentos**: Orange 600 (`#ea580c`), Amber 500 e Slate 700 para bordas mecânicas.
* **Badges**: Garantia de peças, diagnóstico computadorizado, orçamento expresso.
* **Componente de Ação**: Sticky Mobile Bar inferior com "Solicitar Orçamento / Guincho".

### 4.4 BelezaTemplate (Modo Salão vs. Barbearia)
* **Modo Salão / Estética**:
  * Fundo: Rose 50/White suave.
  * Acentos: Rose 600 (`#e11d48`) e Pink 700 (`#be185d`).
  * Estilo editorial, fotos verticais e cartões de procedimentos delicados.
* **Modo Barbearia**:
  * Fundo: Zinc 950 (`#09090b`) e Zinc 900 (`#18181b`).
  * Acentos: Amber 600 (`#d97706` couro/madeira) e Zinc 400.
  * Estilo vintage industrial, fotos rústicas e cartões de corte clássico/barba.
* **Componente de Ação**: Sticky Mobile Bar inferior com "Reservar Horário".

### 4.5 GeralTemplate
* **Tema Base**: White e Slate 50 (`#f8fafc`).
* **Textos**: Slate 900 (`#0f172a`), Slate 600.
* **Acentos**: Blue 600 (`#2563eb`) e Indigo 600 (`#4f46e5`).
* **Componente de Ação**: Sticky Mobile Bar inferior com "Falar no WhatsApp".
