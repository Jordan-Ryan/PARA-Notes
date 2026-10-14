# para-notes-mobile

Expo application in this repo. `package.json` depends on `expo` `~54.0.1`, `react-native` `0.81.4`, and `react` `19.1.0`. `"main"` is `index.ts`, which calls `registerRootComponent` with `App.tsx`.

`app.json` name is `PARA Notes`, slug `para-notes-mobile`, version `1.0.0`, scheme `para-notes`, iOS bundle identifier and Android package `com.paranotes.mobile`.

## Setup

From this directory:

```bash
npm install
cp env.example .env
```

There is no `engines` field and no `.nvmrc`. `package.json` does not depend on `expo` or `eas-cli` as global packages. The `start`, `android`, `ios`, and `web` scripts call the local `expo` binary. The `build:*` and `submit:*` scripts call `eas`.

`src/constants/config.ts` reads:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_APP_ENV` (default `development`)
- `EXPO_PUBLIC_API_URL` (default `https://api.paranotes.com`)
- `EXPO_PUBLIC_SCHEME` (default `para-notes`)
- `EXPO_PUBLIC_ENCRYPTION_KEY` (default `''`)
- `EXPO_PUBLIC_SYNC_INTERVAL` (default `300000`)
- `EXPO_PUBLIC_OFFLINE_MODE` (default is off unless the value is the string `true`)

Those names match `env.example`. `src/lib/supabase/client.ts` passes `config.supabase.url` and `config.supabase.anonKey` to `createClient`.

Database SQL for this repo is under `../para-notes-web/supabase/`.

`app.json` `extra.eas.projectId` is `your-project-id-here`. There is no `ios/` directory and no `android/` directory.

## Run

```bash
npm start
```

That script is `expo start`.

```bash
npm run ios
npm run android
npm run web
```

Those are `expo start --ios`, `expo start --android`, and `expo start --web`.

## Scripts

| Script | Command |
| --- | --- |
| `start` | `expo start` |
| `android` | `expo start --android` |
| `ios` | `expo start --ios` |
| `web` | `expo start --web` |
| `test` | `jest --config jest.config.mobile.cjs` |
| `test:watch` | Jest watch with `jest.config.mobile.cjs` |
| `test:coverage` | Jest coverage with `jest.config.mobile.cjs` |
| `test:ci` | Jest CI coverage with `jest.config.mobile.cjs` |
| `test:unit` | Jest `--testPathPattern=unit` with `jest.config.mobile.cjs` |
| `test:integration` | `jest --testPathPattern=integration` |
| `test:component` | `jest --testPathPattern=component` |
| `test:e2e` | `detox test` |
| `test:e2e:build` | `detox build` |
| `test:security` | `jest --testPathPattern=security` |
| `test:all` | unit, then integration, then component |
| `lint` | `eslint . --ext .ts,.tsx` |
| `lint:fix` | `eslint . --ext .ts,.tsx --fix` |
| `type-check` | `tsc --noEmit` |
| `build:android` | `eas build --platform android` |
| `build:ios` | `eas build --platform ios` |
| `build:all` | `eas build --platform all` |
| `submit:android` | `eas submit --platform android` |
| `submit:ios` | `eas submit --platform ios` |

`test:integration`, `test:component`, and `test:security` do not pass `--config jest.config.mobile.cjs`. This package has no `tests/integration`, `tests/component`, or `tests/security` directory. `test:all` does not run `test:e2e`.

`jest.config.mobile.cjs` is the config used by `npm test`. `jest.config.js` and `jest.config.mobile.js` are also in this directory. `jest.config.mobile.cjs` does not set `coverageThreshold`.

`.detoxrc.js` sets the Jest config path to `e2e/jest.config.js` and binary paths under `ios/build` and `android/app/build`. The Jest file in the tree is `tests/e2e/jest.config.js`. Its `testMatch` is `<rootDir>/e2e/**/*.test.js` with `rootDir` `..`. The test files are `tests/e2e/auth.test.js` and `tests/e2e/notes.test.js`.

`eas.json` profiles are `development`, `preview`, and `production`. Android build type is `apk` for development and preview, and `aab` for production. `submit.production` is an empty object.

## Source layout

```
App.tsx
index.ts
app.json
eas.json
assets/                 icon, splash, adaptive icon, favicon
src/components/ui/      Button, Modal, FloatingActionButton
src/components/features editor, sync, guidance
src/screens/            auth, dashboard/HomeScreen, notes, para, settings, profile
src/navigation/         AppNavigator, AuthNavigator, MainNavigator
src/hooks/              useAuth, useGuidance, useSupabase
src/lib/guidance/
src/lib/sync/
src/lib/supabase/client.ts
src/lib/utils/validation.ts
src/stores/notesStore.ts
src/constants/          config.ts, para.ts, theme.ts
src/types/
tests/unit/
tests/e2e/
tests/simple.test.ts
```

`tsconfig.json` maps `@/*` to `./src/*` and also maps `@components`, `@screens`, `@hooks`, `@lib`, `@stores`, `@types`, `@constants`, and `@assets`.

Tabs registered in `src/navigation/MainNavigator.tsx` are Home, Projects, Areas, Resources, and Archive. The same stack registers NoteEditor, NoteSearch, Settings, and Profile.

`src/screens/notes/NoteEditorScreen.tsx` uses `TextInput`. `MobileNoteEditor.tsx` is not imported by that screen. Sync components under `src/components/features/sync/` import `@/stores/syncStore`. The only store file is `src/stores/notesStore.ts`.
