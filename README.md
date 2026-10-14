# PARA Notes

Two apps live in this repository. There is no root `package.json`, so install and run each package from its own directory.

| Path | Package name | Versions in `package.json` |
| --- | --- | --- |
| `para-notes-web` | `para-notes-web` `0.1.0` | `next` `15.5.3`, `react` `19.1.0` |
| `para-notes-mobile` | `para-notes-mobile` `1.0.0` | `expo` `~54.0.1`, `react-native` `0.81.4`, `react` `19.1.0` |

Supabase SQL, `config.toml`, and `seed.sql` are under `para-notes-web/supabase/`. The mobile app reads a Supabase URL and anon key from `EXPO_PUBLIC_*` variables in `para-notes-mobile/src/constants/config.ts`.

[docs/STATE.md](docs/STATE.md) lists the tree, scripts, routes, and places where files disagree. [AGENTS.md](AGENTS.md) is for work in this repo.

Neither package declares an `engines` field. There is no `.nvmrc` and no `LICENSE` file.

## Web

From `para-notes-web`:

```bash
npm install
cp env.template .env.local
```

`src/app/page.tsx`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, and `middleware.ts` read:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If either value is missing or contains the string `placeholder`, the home page renders `SetupRequired` and middleware skips the session check.

`NEXT_PUBLIC_APP_URL` is read in `src/constants/config.ts` and `src/app/layout.tsx`. When it is unset, those files use `http://localhost:3000`.

`env.template` also lists `SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY`, `NEXT_PUBLIC_ANALYTICS_ID`, `SENTRY_DSN`, and `NODE_ENV`. The integration tests in `tests/integration/supabase/` read `SUPABASE_SERVICE_ROLE_KEY`. The names `ENCRYPTION_KEY`, `NEXT_PUBLIC_ANALYTICS_ID`, and `SENTRY_DSN` do not appear in this package's TypeScript.

The `supabase:*` scripts call the `supabase` CLI. That CLI is not listed in `package.json`.

Ports and database version are in `para-notes-web/supabase/config.toml`: API `54321`, database `54322`, Studio `54323`, Inbucket `54324`, `[db] major_version = 15`, `[auth] site_url = "http://localhost:3000"`.

```bash
npm run supabase:start
npm run supabase:db:push
npm run supabase:gen:types
npm run dev
```

`npm run dev` is `next dev --turbopack`. Playwright's `webServer.url` is `http://localhost:3000`. `npm run supabase:gen:types` writes `src/types/database.ts`.

Other scripts are in [para-notes-web/README.md](para-notes-web/README.md).

## Mobile

From `para-notes-mobile`:

```bash
npm install
cp env.example .env
npm start
```

`npm start` is `expo start`. `src/constants/config.ts` reads every variable named in `env.example`.

`npm run ios`, `npm run android`, and `npm run web` are `expo start` with the matching flag. `build:*` and `submit:*` call `eas`. `app.json` sets `extra.eas.projectId` to `your-project-id-here`. There is no `ios/` or `android/` directory in the tree.

Other scripts are in [para-notes-mobile/README.md](para-notes-mobile/README.md).
