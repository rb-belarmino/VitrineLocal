# Research & Architecture Decisions: Brand Extractor (Módulo 2)

## 1. Extração e Análise de Cores & Acessibilidade

### Contexto

O Módulo 2 precisa receber imagens do comércio (fotos de capa, logotipo, fachada) e determinar uma paleta de 4 cores coerentes para alimentar os templates CSS do Módulo 3:

- `--color-primary`: Cor dominante/marca da empresa.
- `--color-secondary`: Cor de destaque/acento para botões e chamadas.
- `--color-background`: Fundo da página (geralmente branco puro `#FFFFFF` ou escuro profundo `#0F172A`).
- `--color-text`: Texto legível com alto contraste relativo (WCAG AA >= 4.5:1).

### Decisão Técnica

1. **Algoritmo de Cores**:
   - Usar um módulo leve em TypeScript puro para quantização de cores (histograma e median cut simplificado) e cálculo de luminância relativa conforme W3C WCAG 2.1:
     $$\text{Luminância} = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$$
     $$\text{Contraste} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
   - Não utilizar bibliotecas com binários nativos pesados (ex: `node-canvas` ou `sharp`) que complicam pipelines de CI e instalações cross-platform. Para imagens remotas do Google Maps, o scraper Playwright pode capturar a imagem ou extrair paletas diretamente no contexto do browser (`canvas.getImageData`), ou o backend processa o buffer JPEG/PNG via biblioteca pura JS (`colorthief` ou implementação TypeScript limpa).
2. **Normalização de Contraste**:
   - Se a cor de fundo calculada for clara (luminância > 0.5), o texto é fixado em `#0F172A` (slate dark).
   - Se a cor de fundo for escura (luminância <= 0.5), o texto é fixado em `#F8FAFC` (slate light).
   - A cor primária da marca é preservada em headers, badges e destaques.

### Alternativas Consideradas

- _Delegar 100% da extração de cores para a Gemini Vision API_: Avaliado, mas descartado como caminho primário devido a custo extra de tokens e latência desnecessária para operações matemáticas simples de pixels. Gemini será focado no processamento semântico de textos.
- _Node-Canvas / C++ bindings_: Rejeitado por violar a premissa de builds limpos e portabilidade instantânea em Node 24 LTS sem ferramentas de compilação C++.

---

## 2. Paletas de Cores de Fallback por Nicho

### Decisão

Criar um dicionário tipado e curado (`NICHE_COLOR_PALETTES`) para as principais categorias comerciais mapeadas pelo Radar:

```typescript
export interface BrandPalette {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  paletteSource: 'EXTRACTED' | 'FALLBACK_NICHE';
}
```

Exemplos pré-calibrados:

- **Saúde / Odontologia / Clínicas**: Primária `#0284C7` (Sky Blue), Secundária `#0D9488` (Teal), Fundo `#FFFFFF`, Texto `#0F172A`.
- **Oficinas Mecânicas / Automotivo**: Primária `#EA580C` (Amber/Orange), Secundária `#334155` (Slate), Fundo `#0F172A`, Texto `#F8FAFC`.
- **Gastronomia / Restaurantes**: Primária `#DC2626` (Warm Red), Secundária `#D97706` (Amber), Fundo `#FFFBEB`, Texto `#1C1917`.
- **Estética / Beleza / Salão**: Primária `#BE185D` (Rose), Secundária `#F472B6` (Pink), Fundo `#FFFFFF`, Texto `#1E293B`.
- **Serviços Gerais / Padrão**: Primária `#2563EB` (Royal Blue), Secundária `#4F46E5` (Indigo), Fundo `#FFFFFF`, Texto `#0F172A`.

---

## 3. Curadoria de Depoimentos do Google Maps

### Contexto

O Google Maps exibe abas de avaliações com notas de 1 a 5 estrelas, fotos de autores e comentários.

### Decisão

- O scraper Playwright navega para o link do perfil do Maps e aciona a aba/seção de avaliações ("Comentários").
- Filtra apenas avaliações com nota 5 estrelas (`aria-label` contendo "5 estrelas" ou pontuação 5.0).
- Algoritmo de seleção:
  1. Remove depoimentos sem texto (comprimento de comentário = 0).
  2. Ordena os comentários restantes por comprimento decrescente de texto (`review.text.length`).
  3. Seleciona os top 3 a 5 depoimentos mais completos.
  4. Extrai: `authorName`, `authorPhotoUrl`, `rating` (5), `relativeTime` (ex: "há 2 meses") e `text`.

---

## 4. Síntese Semântica com Google Gemini API (`@google/genai`)

### Decisão

- Utilizar a biblioteca oficial `@google/genai` (ou chamada HTTP autenticada via SDK com a chave `GEMINI_API_KEY`).
- Modelo recomendado: `gemini-2.5-flash` (ou `gemini-1.5-flash`), com temperatura `0.3` (para alta consistência e fidelidade comercial).
- Formato de saída: **JSON Estruturado** via `responseSchema` ou prompt rigoroso com validação Zod:
  - `headline`: Frase impactante de 5 a 9 palavras para a dobra principal.
  - `subheadline`: Subtítulo explicativo contextualizando o serviço e a região.
  - `aboutText`: Parágrafo de 3 a 4 frases transmitindo autoridade, compromisso e humanização.
  - `keyServices`: Array de 3 a 6 serviços essenciais identificados nas avaliações e nicho.
  - `callToAction`: Frase de ação direta focada em conversão para o WhatsApp do comércio.
- **Fallback Resiliente**: Caso a API do Gemini esteja fora do ar ou ocorra erro de cota (429/500), o sistema aciona um gerador de template textual determinístico baseado no nome e categoria do lead, garantindo que o pipeline nunca quebre.

---

## 5. Arquitetura Modular e Isolamento

### Decisão

- Módulo isolado em `src/modules/brand/`:
  - `core/`: Algoritmos puros (extrator de paleta, cálculo de luminância, curador de reviews, dicionário de nichos).
  - `services/`: `BrandExtractorService` coordenando o fluxo (Playwright + Gemini + Prisma).
  - `adapters/`: Adaptador Gemini (`GeminiClient`) e Scraper (`MapsBrandScraper`).
  - `repositories/`: `BrandRepository` para persistência via Prisma.
- Nenhuma dependência acoplada com código interno do Módulo 1 (Maps Radar); a interface de integração é feita via ID do lead (`leadId`) e leitura do banco.
