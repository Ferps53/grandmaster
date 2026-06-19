# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

Bun workspaces with two packages: `api/` (backend) and `mobile/` (Expo app). Root `package.json` defines cross-workspace scripts via `bun --filter`.

## Commands

Run from repo root unless noted:

- `bun install` — install all workspaces.
- `bun run dev:api` — start API in watch mode (`bun --watch src/index.ts`).
- `bun run dev:mobile` — start Expo dev server.
- `bun run migrate` — apply pending SQL migrations against `DATABASE_URL`.
- `bun run lint:mobile` — `expo lint` (eslint).
- `bun run format` — `biome format --write` over mobile.

Per-package:
- API: `cd api && bun run dev` / `bun run start` / `bun run lint` (biome) / `bun run format`.
- Mobile: `cd mobile && bun run start` (or `android` / `ios` / `web`).

Local DB: `cd api && docker compose up postgres -d` brings up Postgres 16 on `5432` with user/pass/db all `grandmaster`. The `migrate` and `api` compose services build from `api/Dockerfile`.

Connection string default: `postgresql://grandmaster:grandmaster@postgres:5432/grandmaster` (override via `DATABASE_URL`). JWT secret via `JWT_SECRET` (default `"secret"` in dev — do not ship). API CORS origins via `CORS_ORIGIN` (comma-separated). Mobile reads `EXPO_PUBLIC_API_URL` (fallback `http://192.168.18.15:3000/api`).

No test runner is configured. Don't invent one.

## Architecture

### Backend (`api/`)

- Express on Bun runtime. Entry `api/src/index.ts` mounts `/api/auth` and `/api/licoes`, plus `/health`. Register new feature routers here.
- **Package-by-feature** under `api/src/features/<feature>/` with files `<feature>.controller.ts`, `<feature>.routes.ts`, `<feature>.db.ts`. Auth feature is the reference implementation; lessons is the second.
- **No ORM**. Postgres accessed via Bun's built-in `sql` template (`import { sql } from "bun"`). Connection is implicit — `sql` reads `DATABASE_URL`. `shared/db.ts:conectar()` just pings `SELECT 1` at boot.
- **Migrations** are plain SQL files in `api/migrations/NNN_name.sql`, run in alphabetical order by `api/migrate.ts`. The runner tracks applied files in `_migrations` and wraps each file in a `sql.begin` transaction. Always create new migrations with a new numeric prefix; never edit applied ones. Use `IF NOT EXISTS` / `IF EXISTS` guards.
- **Auth**: stateless JWT (`jsonwebtoken`, 30d expiry). Middleware `shared/middleware/auth.ts:verificarToken` attaches `req.usuario = { id, email, nome }`. Protect routes by mounting this middleware on the router.
- **Validation**: none. Controllers do manual field checks. Error responses follow `{ mensagem: string, campo?: string }`; success returns the resource directly.
- **Naming convention**: Portuguese (`usuarios`, `licoes`, `passos_licao`, `nome`, `senha`, `criado_em`). Match this in new code and SQL.

### Mobile (`mobile/`)

- Expo SDK 54 + React Native 0.81 + React 19. Entry is `expo-router/entry`.
- **Expo Router** with file-based routing. `app/_layout.tsx` wraps the stack in `ProveedorAutenticacao`. Tab navigator lives in `app/(tabs)/_layout.tsx`. Dynamic routes like `app/licao/[id].tsx`.
- **State**: React Context only (`src/contextos/AutenticacaoContext.tsx`) + local `useState`. **No** zustand/jotai/react-query/tanstack-query — do not add one without discussion.
- **API client**: singleton class in `src/servicos/api.ts` exposing `servicoAPI.login/cadastro/listarLicoes/buscarLicao/concluirLicao/verificarToken`. Fetch-based, Bearer token from `AsyncStorage` (`usuario_auth` key). Add new endpoints as methods on this class.
- **Chess**: `chess.js` for logic + `react-native-chessboard` for UI. Board exposes a ref with `resetBoard`, `resetAllHighlightedSquares`, `highlight`, `move`. Reference usage in `app/licao/[id].tsx`.
- **Styling**: `StyleSheet.create` everywhere. No NativeWind / styled-components. Color palette and spacing in `src/constantes/tema.ts` — use these tokens instead of hex literals.
- **Icons**: `@expo/vector-icons` (MaterialCommunityIcons in practice).
- **i18n**: none. All UI copy is hardcoded Portuguese — keep it that way unless asked.
- **Feature components** live under `src/componentes/<feature>/` (e.g. `aprender/`, `analise/`). TypeScript models in `src/model/`.
- `patch-package` runs on `postinstall` — patches live in `mobile/patches/`. If a dep behaves oddly, check there first.

### Domain shape

`usuarios` (id UUID, nome, email, senha, criado_em). Lessons system in migration 002: `licoes` → `passos_licao` (with FEN + `movimento_from/to` + optional computer reply) → `destaques_passo` (square highlights). Per-user completion tracked in `progresso_licoes` (unique on `usuario_id, licao_id`). The seed (`003_seed-licoes.sql`) populates real lesson content.

Both packages use **Biome** for formatting; mobile additionally uses `expo lint` (ESLint). Husky is configured at root (`prepare: husky`) — respect hooks.
