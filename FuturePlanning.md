# RNTS-Template — Future Planning & Roadmap

This document is your step-by-step guide for evolving **RNTS-Template** from a Firebase + mock-API starter into a production-ready app with Supabase, modern tooling, and maintainable architecture.

> **Last reviewed:** June 2026 · **React Native:** 0.85 · **React:** 19

---

## Table of Contents

1. [What Was Improved (This Pass)](#what-was-improved-this-pass)
2. [Architecture Overview](#architecture-overview)
3. [Known Weak Points (Prioritized)](#known-weak-points-prioritized)
4. [Phase 1 — Foundation (Week 1–2)](#phase-1--foundation-week-12)
5. [Phase 2 — Supabase Integration (Week 3–5)](#phase-2--supabase-integration-week-35)
6. [Phase 3 — Backend & Real APIs (Week 6–8)](#phase-3--backend--real-apis-week-68)
7. [Phase 4 — Quality, Testing & CI (Week 9–10)](#phase-4--quality-testing--ci-week-910)
8. [Phase 5 — Advanced Features (Ongoing)](#phase-5--advanced-features-ongoing)
9. [Deprecated Packages & Migrations](#deprecated-packages--migrations)
10. [Quick-Start Checklist](#quick-start-checklist)
11. [Useful Links](#useful-links)

---

## What Was Improved (This Pass)

These changes were applied **without removing features**. Each includes inline comments in code explaining the new logic.

| Area | Change | Why |
|------|--------|-----|
| **Redux Persist** | `blackList` → `blacklist` | redux-persist v6 only reads `blacklist`; the old key was ignored |
| **Zod v4** | `formatZodError()` using `error.issues` | Zod 4 removed `error.errors`; login/register alerts were broken |
| **Navigation** | Stable auth screens in `MainNavigator` | Swapping screen `name` dynamically breaks React Navigation state |
| **Error Boundary** | Sentry `captureException` + redesigned fallback UI | Matches README promise; better UX on crashes |
| **Sentry** | DSN from `.env`, lower prod sample rates | Secrets out of source; quota control |
| **moment.js** | Replaced with `date-fns` / `uniqueFileName()` | moment is in maintenance mode; date-fns already in project |
| **Logging** | `@utils/logger` (dev-only debug) | Removes production console noise |
| **i18n** | `debug: __DEV__` | Stops translation debug spam in release builds |
| **Auth services** | `await` on Firebase login calls | Proper async error propagation |

---

## Architecture Overview

```
App.tsx
  └── Redux Provider + PersistGate
        └── NavigationContainer (theme, i18n, deep links, Sentry)
              └── MainNavigator (auth gate)
                    ├── AuthStack (mock + Firebase auth flows)
                    └── DrawerRoot → TabNavigator → feature stacks
                          ├── AudioNavigator
                          └── VideoNavigator
```

**State:** Redux Toolkit slices (`auth`, `appSettings`, `audio`, `video`) persisted via MMKV.

**UI:** Atomic design — `atoms` → `molecules` → `organisms` → `templates` → `screens`.

**Auth:** Service layer in `src/services/authServices/` + Firebase services in `src/services/firebaseServices/`.

---

## Known Weak Points (Prioritized)

### High priority

1. **`props: any` on screens/navigators** — Replace with `AppStackNavigationProp<'ScreenName'>` and `AppRouteProp<'ScreenName'>` from `@Types/appNavigation`.
2. **Hardcoded API URLs** in `audiosSlice` / `videosSlice` — Move to `@env` + axios instance.
3. **No centralized API client** — Create `src/api/client.ts` with interceptors, base URL, auth headers.
4. **Sentry DSN fallback in code** — Remove fallback once `.env` is set in all environments.
5. **`react-native-vector-icons`** — Package deprecated; migrate to per-family packages.

### Medium priority

6. **Duplicate date libs** — Remove `moment` from `package.json` after confirming no imports remain.
7. **Register service shows two alerts** — Validation success + register result; consolidate UX.
8. **Firebase + mock auth coexist** — Document which path is primary for your product.
9. **Stream Chat** — Present in deps but not wired in navigation; integrate or remove.
10. **OP SQLite** — In deps but unused; plan offline cache or remove.

### Low priority

11. **Color palette size** — Consider semantic tokens (`textPrimary`, `surface`, `danger`).
12. **Test coverage** — Only default `App.test.tsx` exists.
13. **README vs reality** — README mentions `src/translations/` but project uses `src/translation/`.

---

## Phase 1 — Foundation (Week 1–2)

**Goal:** Stable config, typed navigation, clean env setup.

### Steps

1. **Environment** — Copy `.env.example` → `.env`; add `SENTRY_DSN`, later `API_BASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
2. **Typed screen props** — Create helpers in `src/types/navigationProps.ts`; replace `(props: any)` screen by screen
3. **API client** — `src/api/client.ts` with `API_BASE_URL` from `@env`
4. **Remove moment** — `bun remove moment`
5. **Logger adoption** — Replace `console.log` in services with `@utils/logger`

---

## Phase 2 — Supabase Integration (Week 3–5)

**Goal:** Add Supabase alongside (or instead of) Firebase.

### Steps

1. Create project at [Supabase Dashboard](https://supabase.com/dashboard)
2. Follow [React Native quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)
3. Install: `bun add @supabase/supabase-js react-native-url-polyfill`
4. Add `src/config/supabaseClient.ts` (use MMKV for session storage — see inline example in repo comments)
5. Choose auth strategy: Firebase-only + Supabase DB, or full Supabase Auth
6. Define tables + RLS: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
7. Replace Render upload URLs with [Supabase Storage](https://supabase.com/docs/guides/storage)

---

## Phase 3 — Backend & Real APIs (Week 6–8)

1. Gate mock API with `APP_ENV=development`
2. Optional: [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
3. Auth token interceptors on axios client
4. Point upload thunks to real storage/API

---

## Phase 4 — Quality, Testing & CI (Week 9–10)

1. Unit tests for validators and utils
2. Component tests with `@testing-library/react-native`
3. E2E with [Maestro](https://maestro.mobile.dev/) or [Detox](https://wix.github.io/Detox/)
4. GitHub Actions: lint, test, typecheck
5. [Sentry source maps](https://docs.sentry.io/platforms/react-native/sourcemaps/)

---

## Phase 5 — Advanced Features (Ongoing)

| Feature | Package | Docs |
|---------|---------|------|
| Real-time chat | `stream-chat-react-native` | [Stream RN SDK](https://getstream.io/chat/docs/sdk/react-native/) |
| Offline DB | `@op-engineering/op-sqlite` | [OP SQLite](https://op-engineering.github.io/op-sqlite/) |
| Push | `@react-native-firebase/messaging` | [FCM RN](https://rnfirebase.io/messaging/usage) |
| Analytics | PostHog / Firebase Analytics | [PostHog RN](https://posthog.com/docs/libraries/react-native) |

---

## Deprecated Packages & Migrations

| Package | Status | Action |
|---------|--------|--------|
| `moment` | Maintenance mode | Replaced in code — run `bun remove moment` |
| `react-native-vector-icons` | Deprecated monolith | Migrate to `@react-native-vector-icons/*` packages |
| redux-persist `blackList` | Wrong key | Fixed to `blacklist` |
| Zod `error.errors` | Removed in v4 | Use `formatZodError()` |
| `@types/react-redux` | Redundant with RTK 2 | Optional cleanup |

---

## Quick-Start Checklist

- [ ] Copy `.env.example` → `.env`
- [ ] `bun install` && `cd ios && pod install`
- [ ] `bun run lint`
- [ ] `bun remove moment`
- [ ] Type one screen (replace `props: any`)
- [ ] Create Supabase project; add keys to `.env`
- [ ] Read [Supabase RN Auth](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)

---

## Useful Links

### Core

- [React Native](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation 7](https://reactnavigation.org/docs/getting-started)
- [Zod v4](https://zod.dev/)

### Auth & Backend

- [Firebase Auth RN](https://rnfirebase.io/auth/usage)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase + React Native](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)

### Observability

- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)
- [i18next](https://www.i18next.com/)

### Media

- [Vision Camera](https://react-native-vision-camera.com/docs/guides)
- [FlashList](https://shopify.github.io/flash-list/)

---

Follow the phases in order: **foundation → Supabase → real APIs → tests**. Each step should keep the app runnable.
