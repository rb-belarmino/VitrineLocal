# Quickstart & Verification Guide: 005-pro-templates

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Date**: 2026-09-21  
**Status**: Ready for Validation

---

## 1. Visão Geral

Este guia descreve os passos de validação automatizada e visual para os 5 templates de nicho do Site Engine desenvolvidos na especificação `005-pro-templates`.

---

## 2. Pré-Requisitos

1. Node.js >= 20.x instalado.
2. Dependências do projeto instaladas (`npm install`).
3. Banco de dados local inicializado (`npx prisma migrate dev` ou `npx prisma db push` se necessário).

---

## 3. Comandos de Validação Automatizada

### 3.1 Executar os Testes Unitários dos Templates
Executa a suíte de testes do Vitest para verificar renderização dos templates, detecção de variantes de beleza e fallbacks de imagem:

```bash
npm test -- src/modules/site-engine/__tests__/react-templates.test.tsx
```

### 3.2 Executar Typecheck Estrito
Garante que não há nenhum erro de tipagem no Next.js 16.3.5 / TypeScript:

```bash
npm run typecheck
```

### 3.3 Executar Linting & Formatação
Valida conformidade com os Quality Gates do ESLint:

```bash
npm run lint
```

---

## 4. Validação Visual Manual

1. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Acessar os slugs de teste no navegador:
   * **Gastronomia**: `http://localhost:3000/preview/demo-restaurante`
   * **Saúde**: `http://localhost:3000/preview/demo-clinica`
   * **Automotivo**: `http://localhost:3000/preview/demo-mecanica`
   * **Beleza (Salão)**: `http://localhost:3000/preview/demo-salao`
   * **Beleza (Barbearia)**: `http://localhost:3000/preview/demo-barbearia`
   * **Geral**: `http://localhost:3000/preview/demo-geral`
3. Abrir o DevTools em modo responsivo (375px e 390px - iPhone 14/15) e verificar:
   * A Sticky Mobile Bar permanece fixa no rodapé sem cobrir o conteúdo final.
   * O floating pill do `VisualPitchBadge` permanece no canto superior direito com efeito backdrop-blur.
   * O FAQ no template de Saúde abre e fecha de forma suave via `<details>`.
