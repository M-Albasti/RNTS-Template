# RNTS-Template — Application Audit (July 2026)

Post-merge audit of `develop` after PRs #5–#14. Use with `docs/BACKEND_AGENT_PROMPT.md` for backend alignment.

## Architecture snapshot

| Layer | Stack |
|---|---|
| Mobile | React Native 0.85, React 19, TypeScript |
| State | Redux Toolkit + redux-persist (MMKV + SQLite for todos) |
| Server state | TanStack React Query v5 |
| HTTP | Axios (`apiClient`, `mediaClient`) + axios-mock-adapter |
| Auth | Mock API **or** Firebase (email, phone OTP, Google, Apple, Facebook) |
| i18n | i18next (en/ar) |
| Monitoring | Sentry, Firebase Crashlytics/Analytics |

## Navigation & modules

**Tabs:** Home · Services Hub · Profile

**Drawer stacks:** Audio, Video, Posts, Todos, Chat, Game, Wallet, Gallery, Design System, Camera, Delivery, Marketplace, Word Puzzle, Islamic

**Screen count:** 80+ screens across auth, social, commerce, media, games, Islamic.

## API wiring status

### Wired to `API_BASE_URL` (mockable)

| Priority | Routes | Client | Screens |
|---|---|---|---|
| P0 | `POST /login`, `POST /register` | `authClient` | Login, Register |
| P0 | `GET /dashboard/stats` | `dashboardClient` | Home |
| P1 | `GET /feed?sort=` | `feedClient` | Feed |
| P1 | Delivery (7 routes) | `deliveryClient` | New delivery, tracking, driver, live map |

DTOs: `src/api/server/*.dto.ts` · Mocks: `src/api/mocks/`

### Always external (not your backend)

| Service | Used by |
|---|---|
| `MEDIA_API_BASE_URL` — upload/files | Audio/video record & playback |
| alquran.cloud, hadislam.org, hisnmuslim.com, aladhan.com | Islamic module |
| islamicquiz.i8x.net, riddles-api-eight.vercel.app | Word puzzle |

### Local-only (no API client yet)

| Module | State | Gap |
|---|---|---|
| Chat | Redux seed | Stream Chat dep unused; needs threads/messages API or Stream tokens |
| Wallet | Redux seed | Full UI; no HTTP layer |
| Marketplace | `marketplaceMockData` | Full Talabat-style UX; no HTTP layer |
| Game | Redux local | Coins, shop, leaderboard — local only |
| Gallery | Picsum URLs | No upload/sync API |
| Todos | SQLite | No sync API |
| Auth recovery | UI stubs | OTP/forgot/reset are alerts only — no HTTP |

## Bugs & gaps (mobile-side)

| # | Issue | Impact |
|---|---|---|
| 1 | **Posts sync conflict** — local `addPost` overwritten on feed refetch | User-created posts disappear |
| 2 | **Delivery slice not persisted** — blacklisted in redux-persist | Orders reset on cold start |
| 3 | **Dashboard vs module state** — Home uses API stats; wallet/game/todos use local Redux | Numbers can disagree |
| 4 | **No 401/refresh handling** — token stored but no interceptor logout | Stale sessions |
| 5 | **Mock OTP/forgot/reset** — UI only | Cannot test password recovery E2E |
| 6 | **`useLoginMutation` unused** — screens use `loginService` directly | Duplicate patterns |
| 7 | **Google Maps** — placeholder key until `.env` set | Delivery map hidden |
| 8 | **Adhkar helpers** — morning/evening both use category `27` | Wrong category possible |
| 9 | **Redux action `useHint` renamed → `spendHint`** | Fixed in PR (hooks lint) |

## CI/CD (added)

| Job | Command | Gate |
|---|---|---|
| Validate i18n | `npm run validate:i18n` | Required |
| Typecheck | `npm run typecheck` | Required |
| Lint | `npm run lint` | Required (unused-vars = warn) |
| Test | `npm test -- --ci --forceExit` | Required |
| Bundle | `npm run bundle:android` | Required |
| Android APK | `./gradlew assembleDebug` | Required on CI (placeholder `google-services.json`) |

Local: `npm run ci` · Workflow: `.github/workflows/ci.yml`

## Production readiness checklist

- [ ] Set `API_USE_MOCKS=false` and implement P0/P1 backend routes
- [ ] Add feed write APIs (create post, like, comment, poll)
- [ ] Persist delivery slice or load orders from `GET /delivery/orders`
- [ ] Implement auth recovery + `GET /me` + token refresh
- [ ] Wire wallet, marketplace, chat, todos (Phase 2)
- [ ] Add real `google-services.json` / `GoogleService-Info.plist`
- [ ] Set `GOOGLE_MAPS_API_KEY` in `.env`
- [ ] Reduce ESLint unused-var warnings (116 warnings)
