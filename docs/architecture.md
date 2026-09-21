# Arquitetura do Sistema — VitrineLocal

Este documento descreve a arquitetura técnica completa, o fluxo de dados de ponta a ponta e o desacoplamento modular do ecossistema **VitrineLocal**.

---

## 1. Visão Geral e Fluxo de Valor de Ponta a Ponta

O VitrineLocal opera como um pipeline contínuo de 4 módulos integrados através de contratos de dados estritos, transformando uma busca geográfica em propostas comerciais de alto impacto (Visual Pitch).

```mermaid
flowchart TD
    subgraph ENTRADA["Entrada do Operador"]
        Input[Nicho + Localidade<br/>ex: 'Oficinas em Moema, SP']
    end

    subgraph MOD1["Módulo 1: Maps Radar (Scraper & Filtros)"]
        Browser[Playwright Headless Stealth]
        Maps[(Google Maps Web)]
        RawExtractor[DOM Parser de Cards]
        AntiSiteFilter{Filtro Anti-Site:<br/>Tem site próprio?}
        ScoreFilter[Avaliador de Score:<br/>Rating >= 4.0 & Reviews >= 5]
        NormPhone[Normalizador E.164<br/>+ Identificador Celular/Fixo]
        LeadsDB[(Leads Qualificados)]

        Browser --> Maps
        Maps --> RawExtractor
        RawExtractor --> AntiSiteFilter
        AntiSiteFilter -- Sim: Desqualifica --> Discarded[Arquivo / Descarte]
        AntiSiteFilter -- Não / Só Rede Social --> ScoreFilter
        ScoreFilter --> NormPhone
        NormPhone --> LeadsDB
    end

    subgraph MOD2["Módulo 2: Brand Extractor (Identidade Visual)"]
        AssetCrawler[Coletor de Fotos & Avatar]
        ColorEngine[Motor de Paleta de Cores<br/>Primária, Secundária, Contraste]
        ReviewEngine[Extrator de Prova Social<br/>Depoimentos 5 Estrelas]
        BrandProfile[(Brand Profile)]

        LeadsDB --> AssetCrawler
        AssetCrawler --> ColorEngine
        AssetCrawler --> ReviewEngine
        ColorEngine & ReviewEngine --> BrandProfile
    end

    subgraph MOD3["Módulo 3: Site Engine (Templates & Preview)"]
        TemplateLib[Biblioteca de Templates Tailwind<br/>Saúde, Gastronomia, Automotivo, Serviços]
        DataInjection[Injetor de Dados Dinâmicos<br/>CSS Variables + Conteúdo Real + CTA WhatsApp]
        PublicEdge[Hospedagem & Edge Cache Next.js]
        PreviewUrl[URL Pública de Demonstração<br/>preview.vitrinelocal.com.br/empresa]

        BrandProfile --> DataInjection
        TemplateLib --> DataInjection
        DataInjection --> PublicEdge
        PublicEdge --> PreviewUrl
    end

    subgraph MOD4["Módulo 4: Outreach CRM (Copy Gemini & Pipeline)"]
        GeminiAPI[Google Gemini API<br/>Prompt Consultivo + Schema Zod]
        CopyGen[Copy Personalizada de Abordagem<br/>Elogio + Alerta de Mercado + Link Preview]
        CRMHub[Pipeline Comercial & Kanban<br/>Mapeado ➔ Preview ➔ Contatado ➔ Fechado]
        ChannelDisparo[Disparo Comercial<br/>WhatsApp Web / Mensageria]

        PreviewUrl --> GeminiAPI
        LeadsDB --> GeminiAPI
        GeminiAPI --> CopyGen
        CopyGen --> CRMHub
        CRMHub --> ChannelDisparo
    end

    Input --> Browser
```

---

## 2. Arquitetura em Camadas e Desacoplamento Modular (Clean Architecture)

Cada módulo do sistema é uma unidade isolada que não depende dos detalhes de implementação dos outros módulos. A comunicação ocorre exclusivamente através de **DTOs tipados e Schemas Zod compartilhados**.

```mermaid
flowchart LR
    subgraph Camada_Modulos["Módulos de Domínio Independentes"]
        direction TB
        M1["Módulo 1: Maps Radar<br/>• Playwright Scraper<br/>• Lead Classifier<br/>• Phone Normalizer"]
        M2["Módulo 2: Brand Extractor<br/>• Color Thief / Palette<br/>• Asset Extractor<br/>• Review Extractor"]
        M3["Módulo 3: Site Engine<br/>• React / Tailwind Components<br/>• Dynamic CSS Theme Injector<br/>• Public Edge Renderer"]
        M4["Módulo 4: Outreach CRM<br/>• Gemini AI Service<br/>• Funnel Pipeline Manager<br/>• Outreach Dispatcher"]
    end

    subgraph Camada_Contratos["Contratos & Schemas Compartilhados (Zod)"]
        direction TB
        C1["QualifiedLeadSchema"]
        C2["BrandProfileSchema"]
        C3["PreviewSiteConfigSchema"]
        C4["OutreachMessageSchema"]
    end

    subgraph Camada_Infra["Infraestrutura & Persistência"]
        direction TB
        DB[(Banco de Dados Relacional<br/>PostgreSQL / SQLite / Supabase)]
        Cache[(Edge Cache / Redis)]
        GeminiClient[Google Gen AI Client]
        BrowserEngine[Playwright Chromium Engine]
    end

    M1 --> C1
    C1 --> M2 & M3 & M4
    M2 --> C2
    C2 --> M3
    M3 --> C3
    C3 --> M4
    M4 --> C4

    M1 -.-> BrowserEngine
    M1 & M2 & M3 & M4 -.-> DB
    M3 -.-> Cache
    M4 -.-> GeminiClient
```

---

## 3. Modelo de Entidades e Ciclo de Vida do Lead

```mermaid
stateDiagram-v2
    [*] --> MINERADO: Módulo 1 (Extração do Google Maps)
    MINERADO --> QUALIFICADO: Passou no filtro anti-site e nota >= 4.0
    MINERADO --> DESQUALIFICADO: Já possui site próprio ou nota baixa
    
    QUALIFICADO --> IDENTIDADE_EXTRAIDA: Módulo 2 (Cores, fotos e depoimentos)
    IDENTIDADE_EXTRAIDA --> PREVIEW_PUBLICADO: Módulo 3 (Landing Page pronta)
    
    PREVIEW_PUBLICADO --> ABORDAGEM_GERADA: Módulo 4 (Copy criada via Gemini)
    ABORDAGEM_GERADA --> CONTATADO: Mensagem enviada pelo operador
    
    CONTATADO --> EM_NEGOCIACAO: Cliente respondeu / visualizou preview
    EM_NEGOCIACAO --> CONVERTIDO: Venda fechada (Site contratado)
    EM_NEGOCIACAO --> PERDIDO: Recusou proposta
```

---

## 4. Esteira de Produção & Quality Gates (CI/CD)

Nenhum código entra em produção ou é integrado à branch principal sem passar pelos cinco filtros inegociáveis de engenharia:

```mermaid
flowchart TD
    Push[Commit / Push do Agente ou Dev] --> CI[Pipeline GitHub Actions]
    
    subgraph Gates["5 Quality Gates Automatizados"]
        G1[1. Typecheck: tsc --noEmit<br/>TypeScript Strict, zero 'any']
        G2[2. Linter: ESLint<br/>Zero warnings permitidos]
        G3[3. Auditor: npm audit<br/>Zero vulnerabilidades altas/críticas]
        G4[4. Segurança Estática SAST & Secrets<br/>Gitleaks + Análise Estática]
        G5[5. Testes Automatizados<br/>Vitest 100% verde + Cobertura]
    end

    CI --> G1 --> G2 --> G3 --> G4 --> G5
    G5 --> Pass[Build Aprovado para Produção]
    G1 -- Falha --> Block[Build Quebrado / Rejeitado]
    G2 -- Falha --> Block
    G3 -- Falha --> Block
    G4 -- Falha --> Block
    G5 -- Falha --> Block
```
