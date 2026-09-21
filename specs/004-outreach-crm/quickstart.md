# Quickstart Guide: Módulo 4 — Outreach CRM & Portal Web

Guia rápido para testar, validar e operar o **Portal Web do Operador** e o motor de **Outreach CRM** da VitrineLocal.

---

## 1. Pré-requisitos & Banco de Dados

Certifique-se de que o SQLite e o Prisma Client estão sincronizados com os novos campos de CRM (`outreachCopy`, `contactedAt`):

```bash
# Sincronizar schema com SQLite
npx prisma db push

# Regenerar tipos do Prisma Client
npx prisma generate
```

---

## 2. Inicializar o Servidor

Inicie a aplicação unificada VitrineLocal:

```bash
npm run dev
```

O servidor estará ativo em `http://localhost:3001`.

---

## 3. Cenários de Validação Prática

### Cenário 1: Acessar o Portal Web Operacional

Abra qualquer navegador moderno em:

```text
http://localhost:3001/
# ou
http://localhost:3001/dashboard
```

- **Resultado Esperado**: O dashboard carrega em milissegundos com:
  1. Cards de KPIs (Total Minerados, Qualificados, Previews Prontos, Contatados, Convertidos).
  2. Formulário de busca do Radar Maps.
  3. Tabela de leads com filtros rápidos por nicho, score e status.
  4. Botão "Ver Site" para abrir a demonstração em nova aba (`/preview/:slug`).

---

### Cenário 2: Disparar Mineração pelo Portal Web

1. No formulário do Radar no Portal, preencha:
   - **Nicho**: `Dentista`
   - **Localização**: `Moema, São Paulo`
   - **Limite**: `5`
2. Clique em **"Iniciar Mineração"**.
3. O portal exibe o card com o `jobId` e spinner de progresso fazendo polling a cada 1.5s em `GET /api/radar/jobs/:jobId`.
4. Ao concluir, emite notificação de sucesso e atualiza a tabela automaticamente com os novos leads qualificados.

---

### Cenário 3: Gerar Abordagem com IA (Visual Pitch)

1. Na tabela de leads, localize um estabelecimento qualificado e clique em **"Gerar Pitch"** (ou via API):

```bash
curl -X POST http://localhost:3001/api/outreach/generate/{LEAD_ID}
```

- **Resultado Esperado**:
  - Resposta JSON com `messageText` estruturada (elogio à nota do Maps + alerta de site + link do preview + CTA).
  - URL formatada `whatsappDispatchLink` pronta para envio via WhatsApp Web (`https://wa.me/55...`).
  - No Portal, o modal exibe a mensagem em um `<textarea>` editável com botão de 1 clique "Copiar Mensagem".

---

### Cenário 4: Edição de Copy e Disparo no WhatsApp com Confirmação

1. No modal do Portal, ajuste uma palavra da mensagem.
2. Observe que o botão "Abrir WhatsApp Web" atualiza o link dinamicamente.
3. Clique em **"Abrir WhatsApp Web"**.
4. O navegador abre a conversa com o texto pré-preenchido e o portal exibe o diálogo:  
   _"Mensagem enviada com sucesso no WhatsApp?"_
5. Ao confirmar "Sim", o portal dispara `PATCH /api/outreach/leads/:id/status` salvando a copy final e alterando o status para `CONTACTED`.

Validando via `curl`:

```bash
curl -X PATCH http://localhost:3001/api/outreach/leads/{LEAD_ID}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "CONTACTED", "outreachCopy": "Copy final personalizada enviada"}'
```

- **Resultado Esperado**: HTTP `200 OK` com o lead atualizado e campo `contactedAt` preenchido.

---

### Cenário 5: Obter Estatísticas do Funil (API)

```bash
curl http://localhost:3001/api/portal/stats
```

- **Resultado Esperado**: JSON com a contagem exata de leads em cada estágio:
  `{ "totalMined": 25, "totalQualified": 18, "totalPreviewsReady": 12, "totalContacted": 8, "totalConverted": 3 }`.

---

## 4. Executar Testes Automatizados & Quality Gates

Valide a integridade do Módulo 4 e conformidade com a Constituição VitrineLocal:

```bash
# Executar testes unitários e de integração do Módulo 4
npx vitest run src/modules/outreach src/api/__tests__/outreach-routes.test.ts src/api/__tests__/portal-routes.test.ts

# Validar cobertura completa (> 85%)
npm run test:coverage

# Validar Typecheck estrito
npm run typecheck

# Validar Linter
npm run lint
```
