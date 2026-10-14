# AGENTS.md

Notes for changes in this repository. Descriptions below match the files on `main`. They are not a status report.

## Layout

- `para-notes-web` and `para-notes-mobile` are separate npm packages. There is no root workspace and no root `package.json`.
- Web App Router pages are in `para-notes-web/src/app`. Shared UI and libraries are under `para-notes-web/src/components`, `src/lib`, `src/hooks`, `src/stores`, `src/types`, and `src/constants`.
- The mobile entry is `para-notes-mobile/index.ts`, which registers `App.tsx`. Screens are under `src/screens`, navigation under `src/navigation`.
- Database files are only under `para-notes-web/supabase/`.
- There is no `.github` workflow directory.

## Commands

Run them inside the package directory.

Web (`para-notes-web/package.json`):

- `npm run dev` — `next dev --turbopack`
- `npm run build` — `next build --turbopack`
- `npm run start` — `next start`
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npm run type-check` — `tsc --noEmit`
- `npm test` — Jest. `testPathIgnorePatterns` skips `tests/e2e/` and `tests/security/`.
- `npm run test:unit`, `test:integration`, `test:component`, `test:security` — Jest path filters
- `npm run test:e2e` — Playwright (`playwright.config.ts`, `baseURL` `http://localhost:3000`)
- `npm run test:all` — unit, then integration, then component, then e2e. It does not run `test:security`.
- `npm run supabase:start|stop|reset|status`
- `npm run supabase:db:push` / `supabase:db:pull`
- `npm run supabase:gen:types` — writes `src/types/database.ts`

Mobile (`para-notes-mobile/package.json`):

- `npm start` — `expo start`
- `npm test`, `test:watch`, `test:coverage`, `test:ci`, `test:unit` — Jest with `--config jest.config.mobile.cjs`
- `npm run test:integration`, `test:component`, and `test:security` — Jest without that `--config` flag
- `npm run test:e2e` — `detox test`. `npm run test:e2e:build` — `detox build`
- `npm run test:all` — unit, integration, and component. It does not run Detox.
- `npm run lint` / `type-check`
- `build:android`, `build:ios`, `build:all`, `submit:android`, `submit:ios` — EAS

The Supabase CLI is invoked by the web scripts and is not an npm dependency.

## Paths that do not match

Check these before copying a route or import from an older note:

- App pages for notes, projects, areas, resources, archive, and settings are under `src/app/dashboard/`. `src/constants/routes.ts` uses `/notes`, `/projects`, and similar paths, and lists `/api/*` routes. There is no `src/app/api` directory.
- `next.config.ts` and `vercel.json` permanently redirect `/dashboard` to `/`.
- `middleware.ts` treats `/notes`, `/projects`, `/areas`, `/resources`, and `/archive` as protected, and `/login` and `/signup` as auth routes.
- `npm run supabase:gen:types` writes `src/types/database.ts`. `src/lib/supabase/types.ts` is a separate file.
- Mobile sync components import `@/stores/syncStore`. `para-notes-mobile/src/stores/` contains `notesStore.ts` only.
- `.detoxrc.js` sets the Jest config to `e2e/jest.config.js`. The config file in the tree is `tests/e2e/jest.config.js`.

## Editing

- Web and mobile TypeScript configs set `strict`.
- Web path alias is `@/*` to `./src/*`. Mobile also defines `@components/*`, `@screens/*`, `@hooks/*`, `@lib/*`, `@stores/*`, `@types/*`, `@constants/*`, and `@assets/*`.
- Do not add a root lockfile or change either package's dependencies from a docs-only change.
- `.cursor/rules/project.mdc` still names Next.js 14, React 18, and libsodium. Package versions are in each `package.json`.
