# CRM SONNE — Convites do Evento Presencial (versão Lovable)

CRM simplificado para o Max (SONNE) organizar leads e conduzir a venda do ingresso
do **Curso Estratégia dos 3 Pilares** (12-13/11/2026, R$ 7.000, 24 vagas, Câmara
Sueca — SP).

> **Esta é a versão Vite + React**, na stack nativa do **Lovable** (para continuar
> editando o app dentro do Lovable). Existe também uma versão Next.js equivalente
> em `../crm-sonne` (mantida como backup / deploy Vercel).

## Stack

- **Vite + React 18 + TypeScript**
- **React Router** (rotas `/login`, `/kanban`, `/dashboard`, protegidas)
- **Tailwind CSS v3** — identidade visual da SONNE (navy `#011E41` + dourado `#B1915D`, Playfair Display + Inter)
- `@hello-pangea/dnd` — drag-and-drop do Kanban
- `xlsx` — importação das planilhas (.xlsx / .csv)
- `lucide-react` — ícones

## Funil (o que torna este CRM diferente)

O eixo é o **convite**, não o lead genérico. Colunas do Kanban:

`Aguardando Convite → Recebeu Convite → Respondeu — Não → Respondeu — Sim → Não Respondeu → Em Negociação → Comprou`

Duas listas separadas, cada uma com seu Kanban (alternador no topo): **Clientes**
(base já atendida) e **Prospects** (rede fria / indicações). Duas telas: **Kanban**
e **Dashboard**. WhatsApp Web via botão `wa.me` no card.

## Login

Dois usuários (auth client-side desta fase, sessão em localStorage):

- **Max Bavaresco** — `maximiliano.bavaresco@sonne.global`
- **João Guilherme** — `joao.guilherme@imperosolutions.com.br`

## Rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:3002

## Fase atual

Frontend funcional, **sem backend**. Dados (leads e sessão) vivem em `localStorage`
do navegador. Migração para Supabase fica para a fase 2.

## Levar para o Lovable

1. Suba este repositório para o GitHub.
2. No Lovable: **New Project → Import from GitHub** e aponte para este repo.
   Como já está em Vite + React + Tailwind, o editor do Lovable trabalha nativamente.

## Estrutura

```
src/
  main.tsx            # entrypoint
  App.tsx             # rotas + providers
  index.css           # Tailwind + base
  pages/              # LoginPage, KanbanPage, DashboardPage
  components/
    layout/AppShell   # chrome + proteção de rota
    kanban/           # Board, Coluna, Card, Drawer
    ImportModal.tsx   # leitura de xlsx/csv
    icons.tsx         # WhatsApp
  lib/                # types, etapas, evento, utils, mock-data, store, auth
```
