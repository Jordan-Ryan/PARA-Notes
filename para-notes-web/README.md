# para-notes-web

Next.js application in this repo. `package.json` depends on `next` `15.5.3`, `react` `19.1.0`, and `react-dom` `19.1.0`. Styling uses Tailwind CSS `4` (`postcss.config.mjs` loads `@tailwindcss/postcss`). Data access code uses `@supabase/supabase-js` and `@supabase/ssr`.

`src/constants/para.ts` defines the PARA categories Projects, Areas, Resources, and Archive.

## Setup

From this directory:

```bash
npm install
cp env.template .env.local
```

There is no `engines` field and no `.nvmrc`.

The home page and Supabase clients read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. If either is missing or contains `placeholder`, `src/app/page.tsx` renders `SetupRequired` and `middleware.ts` skips the session check.

`NEXT_PUBLIC_APP_URL` is optional in code. `src/constants/config.ts` and `src/app/layout.tsx` use `http://localhost:3000` when it is unset.

`env.template` also contains `SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY`, `NEXT_PUBLIC_ANALYTICS_ID`, `SENTRY_DSN`, and `NODE_ENV=production`. Integration tests read `SUPABASE_SERVICE_ROLE_KEY`. `ENCRYPTION_KEY`, `NEXT_PUBLIC_ANALYTICS_ID`, and `SENTRY_DSN` are not referenced by TypeScript in this package. `src/lib/editor/crypto.ts` takes a passphrase argument and does not read `ENCRYPTION_KEY`.

### Supabase CLI

`npm run supabase:*` calls the `supabase` binary. It is not a dependency in `package.json`.

`supabase/config.toml` sets API port `54321`, database port `54322`, Studio port `54323`, Inbucket port `54324`, Postgres major version `15`, and auth `site_url` `http://localhost:3000`. Storage `file_size_limit` in that file is `50MiB`. The attachments bucket insert in `supabase/migrations/20240102000002_storage_policies.sql` sets `file_size_limit` to `10485760`.

```bash
npm run supabase:start
npm run supabase:db:push
npm run supabase:gen:types
```

`supabase:gen:types` writes `src/types/database.ts`. `src/lib/supabase/types.ts` is a different file and is not the redirect target of that script.

`supabase/seed.sql` is in the tree. `config.toml` has no `[db.seed]` section. `npm run supabase:reset` runs `supabase db reset`.

Migration filenames and functions are listed in [../docs/STATE.md](../docs/STATE.md) and [supabase/README.md](supabase/README.md).

## Run

```bash
npm run dev
```

That script is `next dev --turbopack`. Playwright starts the same command and uses `http://localhost:3000`.

```bash
npm run build
npm run start
```

`vercel.json` sets `framework` to `nextjs`, `buildCommand` to `npm run build`, `installCommand` to `npm install`, `devCommand` to `npm run dev`, and `outputDirectory` to `.next`.

## Scripts

| Script | Command |
| --- | --- |
| `dev` | `next dev --turbopack` |
| `build` | `next build --turbopack` |
| `start` | `next start` |
| `lint` | `eslint . --ext .ts,.tsx,.js,.jsx` |
| `lint:fix` | `eslint . --ext .ts,.tsx,.js,.jsx --fix` |
| `format` | `prettier --write .` |
| `format:check` | `prettier --check .` |
| `type-check` | `tsc --noEmit` |
| `test` | `jest` |
| `test:watch` | `jest --watch` |
| `test:coverage` | `jest --coverage` |
| `test:ci` | `jest --ci --coverage --watchAll=false` |
| `test:unit` | `jest --testPathPattern=unit` |
| `test:integration` | `jest --testPathPattern=integration` |
| `test:component` | `jest --testPathPattern=component` |
| `test:e2e` | `playwright test` |
| `test:e2e:ui` | `playwright test --ui` |
| `test:e2e:headed` | `playwright test --headed` |
| `test:security` | `jest --testPathPattern=security` |
| `test:all` | unit, then integration, then component, then e2e |
| `supabase:start` | `supabase start` |
| `supabase:stop` | `supabase stop` |
| `supabase:reset` | `supabase db reset` |
| `supabase:status` | `supabase status` |
| `supabase:db:push` | `supabase db push` |
| `supabase:db:pull` | `supabase db pull` |
| `supabase:gen:types` | `supabase gen types typescript --local > src/types/database.ts` |

`jest.config.js` ignores `tests/e2e/` and `tests/security/`, so `npm test` does not run `tests/security/auth-bypass.test.ts`. `npm run test:all` does not call `test:security`. The same Jest config sets a global `coverageThreshold` of 80 for branches, functions, lines, and statements.

## Source layout

```
src/app/                  App Router pages, layout, globals.css, AuthProvider
src/components/ui/        button, sidebar, modal
src/components/layout/    AppShell, TopBar
src/components/features/  editor, sync, auth, guidance
src/hooks/                useAuth, useGuidance
src/lib/supabase/         browser client, server client, types.ts
src/lib/editor/           Tiptap extensions, markdown, crypto, storage, collab, search
src/lib/guidance/         classifier, rules, templates, reminders, analytics
src/lib/sync/             engine, Dexie db, queue and storage adapters
src/lib/utils/            cn, debounce, validation
src/stores/               zustand auth, notes, para, sync stores
src/types/
src/constants/            config, para, routes
middleware.ts
supabase/                 config.toml, migrations, seed.sql
tests/                    unit, component, integration, e2e, security
```

`tsconfig.json` maps `@/*` to `./src/*`.

## Routes in the App Router

Pages on disk use these paths: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/dashboard/notes`, `/dashboard/notes/new`, `/dashboard/projects`, `/dashboard/areas`, `/dashboard/resources`, `/dashboard/archive`, `/dashboard/settings`.

`next.config.ts` redirects `/dashboard` to `/` with `permanent: true`. `src/constants/routes.ts` and `middleware.ts` use `/notes`, `/projects`, `/areas`, `/resources`, and `/archive` instead of the `/dashboard/...` paths. There is no `src/app/api` directory. See [../docs/STATE.md](../docs/STATE.md).

`dashboard/notes/page.tsx`, `projects/page.tsx`, `areas/page.tsx`, `resources/page.tsx`, and `archive/page.tsx` each include the comment `Mock data for now`. `dashboard/notes/new/page.tsx` uses a textarea. `src/components/features/editor/NoteEditor.tsx` is the Tiptap component, and no page under `src/app` imports it.
