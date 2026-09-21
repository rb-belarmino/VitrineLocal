# Research: 005-pro-templates (Figma-Inspired Professional Templates)

**Feature**: [spec.md](./spec.md) | **Date**: 2026-09-21  
**Status**: Completed (Phase 0)

---

## 1. Pesquisa de Arquitetura & Decisões Técnicas

### Decisão 1: Server Components Puros (RSC) vs. Interatividade no Cliente
* **Decisão**: Todos os 5 templates de nicho permanecem como React Server Components (RSC) puros no Next.js 16.3.5.
* **Racional**:
  1. O principal vetor de conversão é o empresário abrir o link de preview recebido pelo WhatsApp. O First Contentful Paint (FCP) e o Time to Interactive (TTI) precisam ser imediatos (< 1.2s).
  2. Qualquer interatividade de expansão (como o FAQ acordeão de saúde e serviços extras) é implementada usando tags HTML nativas `<details>` e `<summary>` com estilização Tailwind CSS (`transition-all`, pseudo-elementos de chevron e marcadores estéticos).
  3. Isso reduz o JavaScript bundle do cliente a zero para a página de preview, eliminando qualquer risco de layout shift ou erro de hidratação no React 19.
* **Alternativas avaliadas**:
  * *Componentes Client-Side com Framer Motion*: Proporcionam transições animadas fluidas, mas aumentam o bundle em ~35KB e atrasam a renderização no primeiro frame em redes 3G/4G móveis. Rejeitado para o preview público.

---

### Decisão 2: Curadoria de Imagens Fallback via Unsplash CDN
* **Decisão**: Implementar um catálogo fixo tipado de imagens de alta resolução do Unsplash CDN (`FALLBACK_NICHE_HERO_IMAGES`), categorizado por nicho e subnicho.
* **Racional**:
  1. No scraping do Google Maps, muitos estabelecimentos não possuem fotos enviadas ou possuem fotos de baixa qualidade (fotos escuras de cardápio de papel ou recibos).
  2. O catálogo provê URLs fixas e testadas com dimensões otimizadas (`w=1200&q=80&auto=format`), com temas:
     * `gastronomia`: Prato gourmet / mesa refinada de restaurante.
     * `saude`: Consultório médico/odontológico moderno, claro e acolhedor.
     * `automotivo`: Oficina limpa e tecnológica com elevador automotivo e iluminação de precisão.
     * `beleza.salao`: Salão de beleza sofisticado com espelhos e iluminação editorial.
     * `beleza.barbearia`: Barbearia vintage clássica com poltronas de couro e tijolos aparentes.
     * `geral`: Escritório comercial contemporâneo e vibrante.
* **Alternativas avaliadas**:
  * *SVGs vetoriais abstratos*: Estáveis, porém não geram o mesmo impacto emocional de credibilidade e desejo imediato para o dono do negócio local quanto fotos reais de alta qualidade.

---

### Decisão 3: Variante Dinâmica de Barbearia vs. Salão de Beleza
* **Decisão**: Criar um detector leve embutido ou utilitário `detectBelezaVariant(config)` que avalia `category`, `businessName` e `keyServices`. Se contiver termos como `barbearia`, `barber`, `barba`, `corte masculino` ou `bigode`, ativa o subtema `barbearia` (Dark Wood/Leather/Black); caso contrário, ativa `salao` (Editorial Rosé/Luxe).
* **Racional**:
  1. Permite manter o contrato do `TemplateRegistry` enxuto com os 5 nichos centrais, sem inflar a lista de nichos principais.
  2. Garante que uma barbearia masculina receba uma identidade vintage/industrial escura de altíssimo padrão, enquanto um salão de estética receba o padrão luxo/rosé.

---

### Decisão 4: Floating Pill do VisualPitchBadge e Sticky Mobile Bar
* **Decisão**: 
  * `VisualPitchBadge`: Posicionado como `fixed top-4 right-4 z-50` em telas maiores e `relative` ou discreto com `backdrop-blur-md bg-white/80 dark:bg-stone-900/80 border border-white/20 shadow-lg rounded-full`, contendo link direto para o WhatsApp comercial do VitrineLocal.
  * `Sticky Mobile Bar`: Barra fixa em telas `< 768px` posicionada em `fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 dark:bg-stone-950/95 backdrop-blur border-t border-stone-200 dark:border-stone-800` com botão de largura total em destaque para ação direta no WhatsApp do estabelecimento.
* **Racional**:
  1. Elimina qualquer sobreposição de conteúdo através de um padding inferior (`pb-24`) adicionado ao container principal nas telas móveis.
  2. Garante que o prospect sempre tenha o botão de ação à vista enquanto rola a página no celular.

---

### Decisão 5: Conformidade Estrita com Design Tokens do Figma
* **Gastronomia**:
  * Fundo: `#0c0a09` (Stone 950) / `#1c1917` (Stone 900)
  * Destaques: `#f59e0b` (Amber 500) e `#dc2626` (Red 600)
  * Tipografia: Fontes serifadas elegantes nos títulos e sans-serif no corpo.
* **Saúde**:
  * Fundo: `#ffffff` e `#f0f9ff` (Sky 50)
  * Destaques: `#0284c7` (Sky 600) e `#0d9488` (Teal 600)
  * Cantos: `rounded-2xl` e `rounded-3xl` com sombras suaves (*soft shadows*).
* **Automotivo**:
  * Fundo: `#0f172a` (Slate 900) e `#020617` (Slate 950)
  * Destaques: `#ea580c` (Orange 600) e acentos em amarelo racing.
  * Badges com cantos ligeiramente mais retos e bordas industriais (`border-slate-800`).
* **Beleza (Salão)**:
  * Fundo: `#fff1f2` (Rose 50) e `#ffffff`
  * Destaques: `#be185d` (Pink 700) e `#fda4af` (Rose 300).
* **Beleza (Barbearia)**:
  * Fundo: `#18181b` (Zinc 900) e `#09090b` (Zinc 950)
  * Destaques: `#d97706` (Amber 600 / Couro envelhecido) e `#71717a` (Zinc 500).
* **Geral**:
  * Fundo: `#ffffff` e `#f8fafc` (Slate 50)
  * Destaques: `#2563eb` (Blue 600) e `#4f46e5` (Indigo 600).
