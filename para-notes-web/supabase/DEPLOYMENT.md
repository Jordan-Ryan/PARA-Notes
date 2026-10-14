# Supabase commands

Scripts below are the ones in `para-notes-web/package.json`. Run them from `para-notes-web`. Each one calls the `supabase` CLI, which is not listed in `package.json`.

## Local

`supabase/config.toml` is the local project file (`project_id = "para-notes-web"`).

```bash
npm run supabase:start
npm run supabase:status
npm run supabase:db:push
npm run supabase:gen:types
```

Equivalents:

| npm script | CLI command |
| --- | --- |
| `supabase:start` | `supabase start` |
| `supabase:stop` | `supabase stop` |
| `supabase:status` | `supabase status` |
| `supabase:reset` | `supabase db reset` |
| `supabase:db:push` | `supabase db push` |
| `supabase:db:pull` | `supabase db pull` |
| `supabase:gen:types` | `supabase gen types typescript --local > src/types/database.ts` |

`supabase:gen:types` overwrites `src/types/database.ts`. It does not write `src/lib/supabase/types.ts`.

Migration files, in name order:

- `migrations/20240101000000_initial_schema.sql`
- `migrations/20240102000000_complete_para_schema.sql`
- `migrations/20240102000001_para_rpc_functions.sql`
- `migrations/20240102000002_storage_policies.sql`
- `migrations/20240102000003_performance_indexes.sql`

`20240102000000_complete_para_schema.sql` drops `users`, `notes`, and related tables created by the initial migration, then creates the folder schema. Both files define `search_notes` with different arguments. See [README.md](README.md).

`seed.sql` is in this directory. `config.toml` does not contain `[db.seed]`.

Local ports from `config.toml`: API `54321`, database `54322`, Studio `54323`, Inbucket `54324`. Auth `site_url` is `http://localhost:3000`.

The attachments bucket is inserted by `20240102000002_storage_policies.sql` (`file_size_limit` `10485760`). `config.toml` `[storage] file_size_limit` is `50MiB`.

## App environment

`para-notes-web/env.template` lists:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NODE_ENV=
ENCRYPTION_KEY=
NEXT_PUBLIC_ANALYTICS_ID=
SENTRY_DSN=
```

Code paths that read these names are in [../../docs/STATE.md](../../docs/STATE.md). Copy the template to `.env.local` in `para-notes-web` for the Next.js app. The mobile package uses `para-notes-mobile/env.example` and `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

`vercel.json` in `para-notes-web` sets the Next.js build, install, and dev commands. It does not contain Supabase values.

## Linking a remote project

`package.json` does not define a link or login script. The Supabase CLI accepts `supabase login` and `supabase link --project-ref <ref>` when you are using a hosted project. This repo does not store a project ref. `supabase/.temp/` is local CLI state and is not a remote id to copy into docs.

For a hosted project, type generation is a different CLI invocation from the npm script. The script always passes `--local` and always writes `src/types/database.ts`.
