# STATE

Inventory of this tree. It records files, scripts, and disagreements between them. It does not record test results or whether a command succeeds.

## Packages

- `para-notes-web/package.json`: name `para-notes-web`, version `0.1.0`, private. Dependencies include `next` `15.5.3`, `react` and `react-dom` `19.1.0`, `@supabase/ssr`, `@supabase/supabase-js`, `@tanstack/react-query`, Tiptap `3.4.2` packages, `yjs`, `zustand` `5.0.8`, `valtio`, `dexie`, `zod`, `tailwind-merge`, `lucide-react`, `@headlessui/react`. Dev dependencies include Tailwind CSS `4`, `@tailwindcss/postcss`, Jest `29`, Playwright, MSW, ESLint `9`, Prettier, TypeScript `5`.
- `para-notes-mobile/package.json`: name `para-notes-mobile`, version `1.0.0`, `"type": "module"`, `"main": "index.ts"`. Dependencies include `expo` `~54.0.1`, `react-native` `0.81.4`, `react` `19.1.0`, `@react-navigation/*` `7`, `@supabase/supabase-js`, `@tanstack/react-query`, `expo-secure-store`, `expo-sqlite`, `react-native-mmkv`, `zustand`, `valtio`, `zod`. Dev dependencies include `detox`, `jest-expo`, Jest `29`, TypeScript `~5.9.2`.
- `valtio` is listed in both packages. No file under either `src/` imports it.
- `@tanstack/react-query` is imported by `para-notes-mobile/App.tsx` and by test helpers. Web application source under `para-notes-web/src` does not import it. Web tests do.
- `src/constants/config.ts` in the web app sets `APP_CONFIG.version` to `'1.0.0'`. The web `package.json` version is `0.1.0`.
- No root `package.json`, `engines` field, `.nvmrc`, `LICENSE`, or `.github` workflow.

## Web routes and UI files

App Router files:

| File | URL path |
| --- | --- |
| `src/app/page.tsx` | `/` |
| `src/app/(auth)/login/page.tsx` | `/login` |
| `src/app/(auth)/signup/page.tsx` | `/signup` |
| `src/app/(auth)/forgot-password/page.tsx` | `/forgot-password` |
| `src/app/(auth)/reset-password/page.tsx` | `/reset-password` |
| `src/app/dashboard/notes/page.tsx` | `/dashboard/notes` |
| `src/app/dashboard/notes/new/page.tsx` | `/dashboard/notes/new` |
| `src/app/dashboard/projects/page.tsx` | `/dashboard/projects` |
| `src/app/dashboard/areas/page.tsx` | `/dashboard/areas` |
| `src/app/dashboard/resources/page.tsx` | `/dashboard/resources` |
| `src/app/dashboard/archive/page.tsx` | `/dashboard/archive` |
| `src/app/dashboard/settings/page.tsx` | `/dashboard/settings` |

There is no `src/app/dashboard/layout.tsx` and no `src/app/api/`.

`next.config.ts` and `vercel.json` redirect `/dashboard` to `/` with `permanent: true`. `vercel.json` also sets `functions` for `src/app/api/**/*.ts`.

`middleware.ts` protected prefixes are `/notes`, `/projects`, `/areas`, `/resources`, and `/archive`. `/login` and `/signup` redirect to `/` when `supabase.auth.getSession()` returns a session. Missing or `placeholder` Supabase env values skip that check.

`src/constants/routes.ts` exports `/notes`, `/projects`, `/areas`, `/resources`, `/archive`, `/settings`, `/settings/profile`, `/settings/preferences`, `/settings/security`, and API paths `/api/auth`, `/api/notes`, `/api/para`, `/api/sync`, `/api/webhooks`. Those page and API files are not in `src/app`.

`src/app/page.tsx` renders `SetupRequired` when the Supabase URL or anon key is missing or contains `placeholder`. Otherwise it renders `AppShell` and a home page.

These dashboard pages contain the comment `Mock data for now` and initialize React state from arrays in the file: `notes/page.tsx`, `projects/page.tsx`, `areas/page.tsx`, `resources/page.tsx`, `archive/page.tsx`.

`dashboard/notes/new/page.tsx` renders a `<textarea>` and the string `Rich text editor will be integrated here`. `src/components/features/editor/NoteEditor.tsx` uses Tiptap. Nothing under `src/app` imports `NoteEditor`.

`src/app/(auth)/login/page.tsx` calls `useAuth().login` and does not import `OAuthButtons`. `src/app/(auth)/signup/page.tsx` renders `OAuthButtons` and calls `useAuth().signup`. `OAuthButtons` calls `signInWithOAuth` for `github`, `google`, and `apple`. In `supabase/config.toml`, `[auth.external.github]`, `[auth.external.google]`, and `[auth.external.apple]` set `enabled = false`.

`src/app/layout.tsx` loads `Geist` and `Geist_Mono` from `next/font/google` and applies their `variable` class names on `<body>`. `tailwind.config.ts` sets `fontFamily.sans` to `var(--font-sans)` and `fontFamily.mono` to `var(--font-mono)`. `globals.css` does not mention those custom properties.

PARA color tokens in `tailwind.config.ts` (`para-projects` `500` `#3b82f6`, `para-areas` `500` `#22c55e`, `para-resources` `500` `#eab308`, `para-archive` `500` `#64748b`) match the names in `src/constants/para.ts`.

Web stores: `src/stores/authStore.ts`, `notesStore.ts`, `paraStore.ts`, `syncStore.ts` (`zustand`). `AuthProvider` and `useAuth` use `authStore`. Sync feature components use `syncStore`.

`src/lib/editor/crypto.ts` exports passphrase AES-GCM helpers using `crypto.subtle`. It does not read `ENCRYPTION_KEY`.

## Mobile files

- Entry: `index.ts` registers `App.tsx`.
- `App.tsx` wraps `AppNavigator` and `SyncStatus` in `QueryClientProvider` and `SafeAreaProvider`.
- `AppNavigator` shows `LoadingScreen`, then `AuthNavigator` or `MainNavigator` from `useAuth().user`.
- Tabs in `MainNavigator`: `Home`, `Projects`, `Areas`, `Resources`, `Archive`.
- Stack screens in the same file include `NoteEditor`, `NoteSearch`, `Settings`, and `Profile`.
- `src/screens/notes/NoteEditorScreen.tsx` uses `TextInput` for title and content. `src/components/features/editor/MobileNoteEditor.tsx` is a separate component. `NoteEditorScreen` does not import it.
- `src/stores/` contains `notesStore.ts` only. `OfflineQueue.tsx`, `ConflictResolver.tsx`, and `SyncStatus.tsx` import `@/stores/syncStore`.
- `src/lib/` contains `guidance/`, `sync/`, `supabase/client.ts`, and `utils/validation.ts`. There is no `src/lib/crypto`, `src/lib/para`, or `src/lib/storage` directory.
- Assets referenced by `app.json` are under `para-notes-mobile/assets/` (`icon.png`, `splash-icon.png`, `adaptive-icon.png`, `favicon.png`).
- `app.json`: name `PARA Notes`, slug `para-notes-mobile`, version `1.0.0`, scheme `para-notes`, iOS bundle id and Android package `com.paranotes.mobile`, `newArchEnabled: true`, `extra.eas.projectId` `your-project-id-here`.
- `eas.json` profiles: `development` (`developmentClient: true`, Android `apk`), `preview` (Android `apk`), `production` (Android `aab`). `submit.production` is `{}`. CLI version field is `>= 5.9.0`.
- `src/constants/theme.ts` sets `colors.primary` to `#0F172A`.
- `src/constants/config.ts` defaults `api.baseUrl` to `https://api.paranotes.com` and linking prefixes to `para-notes://`, `https://paranotes.com`, and `https://app.paranotes.com`.

## Environment variables read by code

Web:

| Name | Read by |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `middleware.ts`, `src/app/page.tsx`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, Jest setup, integration tests |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `middleware.ts`, `src/app/page.tsx`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, Jest setup |
| `NEXT_PUBLIC_APP_URL` | `src/constants/config.ts`, `src/app/layout.tsx` |
| `SUPABASE_SERVICE_ROLE_KEY` | `tests/integration/supabase/rls.test.ts`, `tests/integration/supabase/rpc.test.ts` |
| `NODE_ENV` | `src/lib/guidance/paraClassifier.ts` compares it to `'test'` |

Mobile (`src/constants/config.ts`): `EXPO_PUBLIC_APP_ENV`, `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_SCHEME`, `EXPO_PUBLIC_ENCRYPTION_KEY`, `EXPO_PUBLIC_SYNC_INTERVAL`, `EXPO_PUBLIC_OFFLINE_MODE`.

`config.toml` refers to `env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)`, `env(SUPABASE_AUTH_CAPTCHA_SECRET)`, and `env(SUPABASE_AUTH_EXTERNAL_*_SECRET)` for providers that are `enabled = false`.

## Supabase

`config.toml` `project_id` is `para-notes-web`. Storage `file_size_limit` in that file is `50MiB`. `[db.seed]` is not set in `config.toml`. `supabase/seed.sql` is present.

Migrations, in filename order:

1. `20240101000000_initial_schema.sql` — extensions `pgcrypto`; enums; tables `users`, `para_items`, `notes`; RLS policies; functions `get_user_para_items(user_uuid, item_category)` and `search_notes(user_uuid, search_query)`.
2. `20240102000000_complete_para_schema.sql` — extension `ltree`; drops `attachments`, `guidance_events`, `templates`, `reviews`, `notes`, `folders`, `profiles`, and `users`; recreates `users` (primary key references `auth.users`), `profiles`, `folders`, `notes`, `attachments`, `guidance_events`, `templates`, `reviews`; RLS policies.
3. `20240102000001_para_rpc_functions.sql` — `create_initial_para_root`, `para_suggest(note_title, note_preview)`, `move_note_to_para`, `complete_project`, `search_notes(search_query, para_category_filter, folder_id_filter, limit_count)`, `get_folder_hierarchy`, `get_folder_notes_count`. `para_suggest` matches keywords in the title and preview text.
4. `20240102000002_storage_policies.sql` — inserts storage bucket `attachments` with `file_size_limit` `10485760`; policies on `storage.objects`; functions `cleanup_orphaned_attachments`, `get_attachment_url`, `validate_file_upload`.
5. `20240102000003_performance_indexes.sql` — extension `pg_trgm`; indexes; functions `get_table_stats`, `analyze_query_performance`, `get_slow_queries`, `maintenance_vacuum`.

`search_notes` is created in both migration 1 and migration 3 with different argument lists. These migrations were not applied while writing this file.

`npm run supabase:gen:types` runs `supabase gen types typescript --local > src/types/database.ts`.

## Tests present

Web:

- `tests/unit/lib/utils/validation.test.ts`
- `tests/unit/lib/editor/crypto.test.ts`
- `tests/unit/lib/guidance/paraClassifier.test.ts`
- `tests/unit/hooks/useAuth.test.tsx`
- `tests/unit/stores/notesStore.test.ts`
- `tests/component/features/notes/NoteEditor.test.tsx`
- `tests/integration/supabase/rls.test.ts`
- `tests/integration/supabase/rpc.test.ts`
- `tests/e2e/auth.spec.ts`
- `tests/e2e/notes.spec.ts`
- `tests/e2e/global-setup.ts`
- `tests/e2e/global-teardown.ts`
- `tests/security/auth-bypass.test.ts`

`para-notes-web/jest.config.js` sets `coverageThreshold.global` branches, functions, lines, and statements to `80`, and ignores `tests/e2e/` and `tests/security/`. `playwright.config.ts` projects are Desktop Chrome, Desktop Firefox, Desktop Safari, Pixel 5, and iPhone 12. `webServer.command` is `npm run dev`.

Mobile:

- `tests/simple.test.ts`
- `tests/unit/lib/paraClassifier.test.ts`
- `tests/unit/lib/validation.test.ts`
- `tests/unit/stores/notesStore.test.ts`
- `tests/e2e/auth.test.js`
- `tests/e2e/notes.test.js`
- `tests/e2e/setup.ts`
- `tests/e2e/jest.config.js`

`jest.config.mobile.cjs` has no `coverageThreshold`. `npm test` uses that file. `jest.config.js` and `jest.config.mobile.js` are also in the package. `.detoxrc.js` points at `e2e/jest.config.js` and at `ios/` and `android/` build outputs. Those native directories are not in the tree. `tests/e2e/jest.config.js` sets `rootDir` to `..` and `testMatch` to `<rootDir>/e2e/**/*.test.js`.

No `tests/integration/sync`, `tests/integration/storage`, `tests/component/flows`, `tests/component/error-boundaries`, `tests/component/accessibility`, `tests/e2e/workflows`, `tests/security/rls-violations.test.ts`, `tests/security/xss-injection.test.ts`, or `tests/security/encryption.test.ts` file is in the tree.
