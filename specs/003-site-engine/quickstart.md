# Quickstart Guide: Módulo 3 — Site Engine

Guia rápido para testar, validar e executar a renderização das páginas de demonstração (Visual Pitch) do **Site Engine**.

---

## 1. Pré-requisitos & Banco de Dados

Certifique-se de que o SQLite e o Prisma Client estão atualizados com o novo campo `slug`:

```bash
# Sincronizar o schema com o banco SQLite local
npx prisma db push

# Regenerar os tipos do Prisma Client
npx prisma generate
```

---

## 2. Inicializar a Aplicação Next.js 16.3.5

Inicie o servidor Next.js em modo de desenvolvimento (Turbopack):

```bash
npm run dev
```

A aplicação estará ouvindo na porta padrão `http://localhost:3000`.

---

## 3. Cenários de Validação Prática

### Cenário 1: Visualizar Landing Page por Slug Amigável

Abra qualquer navegador moderno (Chrome, Safari, Firefox) ou use `curl` para acessar a landing page renderizada:

```bash
curl -I http://localhost:3000/preview/clinica-sorriso-moema
```

- **Resultado Esperado**: Status HTTP `200 OK`, `Content-Type: text/html; charset=utf-8`.
- A página exibe o layout do nicho de Saúde, paleta de cores reais injetadas dinamicamente via variáveis CSS, fotos da clínica, depoimentos 5★ e botão de WhatsApp.

### Cenário 2: Visualizar Landing Page por ID do Lead

Também é possível acessar diretamente via identificador único:

```bash
curl -I http://localhost:3000/preview/{LEAD_UUID}
```

- **Resultado Esperado**: Renderiza a mesma landing page com status HTTP `200 OK`.

### Cenário 3: Extração Just-In-Time (JIT) Automática

Acesse a rota de preview de um lead que ainda NÃO teve o `BrandProfile` extraído:

```bash
curl http://localhost:3000/preview/{NOVO_LEAD_ID}
```

- **Resultado Esperado**: O Server Component detecta a ausência do perfil, executa o `BrandExtractorService` sob demanda, salva no banco e devolve a landing page completa com status `200 OK`.

### Cenário 4: Obter Metadados e Configuração de Renderização (JSON)

Para inspecionar os dados consolidados do preview via Route Handler:

```bash
curl http://localhost:3000/api/preview/{LEAD_UUID}/config
```

- **Resultado Esperado**: Objeto JSON validado contra o `PreviewSiteConfigSchema`.

---

## 4. Executar Testes Automatizados

Para rodar a suíte completa de testes unitários e de integração com métricas de cobertura:

```bash
# Rodar todos os testes com cobertura
npm run test:coverage

# Ou rodar apenas os testes do Módulo 3
npx vitest run src/modules/site-engine
```
