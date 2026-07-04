# Backend Agent Prompt — RNTS-Template

> **Copy everything below the line into your backend agent.**

---

## YOUR MISSION

Build **RNTS-API**, a production NestJS REST backend for the React Native app **RNTS-Template** (`M-Albasti/RNTS-Template`, branch `develop`).

The mobile app is a **super-app template** with 15+ modules. Most UI is built; only a **subset** calls `API_BASE_URL` today. Your job is to implement the API contract so the app runs with `API_USE_MOCKS=false`.

**Authoritative spec:** read `RNTS-API-BACKEND-SPEC.md` in the repo root (1600+ lines, includes DB schema, security rules, CodeRabbit-reviewed auth model).

**Mobile audit:** read `docs/APP_AUDIT.md` for module status, bugs, and phase plan.

---

## MOBILE ENV (must match)

```env
APP_ENV=development
API_BASE_URL=http://localhost:3000/v1
MEDIA_API_BASE_URL=http://localhost:3000/v1
API_USE_MOCKS=false
```

Android emulator: `http://10.0.2.2:3000/v1`

**Auth header:** `Authorization: Bearer <token>` on all protected routes. Token stored in MMKV after login.

**Error envelope (mandatory everywhere):**

```json
{ "statusCode": 401, "message": "Human readable", "error": "Unauthorized" }
```

---

## TECH STACK (non-negotiable)

- NestJS 11+ · TypeScript strict · TypeORM · Passport JWT · bcrypt (cost 12)
- class-validator DTOs mirroring mobile types in `src/api/server/`
- Swagger at `/docs` · Global prefix `/v1` · port `3000`
- Multer uploads: field name **`file`** → response must include **`savedFileName`** (audio/video slices depend on this)
- Jest + Supertest, ≥80% service coverage

---

## PHASE 1 — IMPLEMENT FIRST (mobile already calls these)

These routes have **real axios clients + DTOs + mocks** in the app. Implement exactly as specified.

### 1. Auth (`src/api/clients/authClient.ts`, `src/api/server/auth.dto.ts`)

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/login` | `{email, password}` | `{id, name, email, token}` |
| POST | `/register` | `{email, password, name?}` | same as login, HTTP 201 |

Demo user (seed): `mahmoud@gmail.com` / `Password@123`

**Also implement (mobile gaps, high priority):**
- `POST /logout`
- `GET /auth/me` or `GET /users/me`
- `POST /auth/forgot-password`, `POST /auth/reset-password`
- `POST /auth/otp/send`, `POST /auth/otp/verify`, `POST /auth/otp/resend`

Mobile OTP/forgot/reset screens exist but are **stub UI** — backend unlocks E2E.

### 2. Dashboard (`src/api/clients/dashboardClient.ts`)

| Method | Path | Response |
|---|---|---|
| GET | `/dashboard/stats` | `{postsCount, openTodos, unreadChats, walletBalance, gameCoins}` |

Must be **live DB aggregates** for the authenticated user (Home screen, `useDashboardQuery`).

### 3. Feed (`src/api/clients/feedClient.ts`, `src/api/server/feed.dto.ts`)

| Method | Path | Notes |
|---|---|---|
| GET | `/feed?sort=recent\|popular` | `{items[], sort}` |

**Phase 1b (fixes mobile bug #1 — posts disappear on refetch):**
- `POST /feed/posts` — create post
- `POST /feed/posts/:id/like`
- `POST /feed/posts/:id/comments`
- `POST /feed/posts/:id/poll/vote`
- `GET /feed/saved`

### 4. Delivery (`src/api/clients/deliveryClient.ts`, `src/api/server/delivery.dto.ts`)

**All mutating routes: JWT + owner/driver authorization.**

| Method | Path | Body / notes |
|---|---|---|
| GET | `/delivery/addresses` | Seed addresses for demo |
| GET | `/delivery/orders` | List user orders (**mobile gap** — slice not persisted) |
| POST | `/delivery/orders` | `{pickupId, dropoffId, packageType, notes?, price, etaMinutes}` |
| GET | `/delivery/orders/:id/tracking` | Tracking DTO (see spec) |
| POST | `/delivery/orders/:id/driver-location` | `{latitude, longitude, recordedAt?}` |
| PATCH | `/delivery/orders/:id/status` | `{status, label}` |
| POST | `/delivery/orders/:id/accept` | Driver accepts |
| POST | `/delivery/orders/:id/cancel` | Owner/driver cancel |

**Tracking response shape** (used by all delivery endpoints):

```json
{
  "orderId": "uuid",
  "status": "in_transit",
  "etaMinutes": 18,
  "timeline": [{"id": "1", "status": "pending", "label": "Order placed", "timestamp": "ISO"}],
  "driver": {"id": "d1", "name": "...", "phone": "...", "rating": 4.9, "vehicle": "...", "latitude": 30.0, "longitude": 31.2, "locationUpdatedAt": "ISO"},
  "updatedAt": "ISO"
}
```

Statuses: `pending | accepted | picked_up | in_transit | delivered | cancelled`

### 5. Media (`mediaClient` — separate base URL, can be same server)

| Method | Path | Auth | Response |
|---|---|---|---|
| POST | `/upload` | **JWT required** | `{savedFileName, url, mimeType, size}` multipart field `file` |
| GET | `/files/:fileName` | Public read | Stream bytes |

---

## PHASE 2 — MODULES WITH UI BUT NO API CLIENT YET

Implement per `RNTS-API-BACKEND-SPEC.md` sections 8–12. Mobile uses **local Redux mocks** today.

| Module | Screens | Suggested routes |
|---|---|---|
| **Marketplace** | 15+ screens (hub, cart, checkout, merchant) | categories, products, cart, orders, merchant CRUD — see spec §8 |
| **Wallet** | 9 screens | balance, transactions, transfer, top-up, bills, cards, budget |
| **Chat** | 7 screens | threads, messages, contacts, unread-count, **stream-token** (JWT-gated) |
| **Todos** | 3 screens + SQLite | CRUD + sync (`GET/POST/PATCH/DELETE /todos`) |
| **Games** | Hub, spinner, shop, leaderboard | profile, shop, leaderboard, achievements, history |
| **Gallery** | 8 screens | albums, images, favorites (optional) |

---

## PHASE 3 — OPTIONAL PROXY

Islamic + Word Puzzle modules call **third-party APIs directly** from the phone. Backend proxy is optional (caching, rate limits):

- alquran.cloud, hadislam.org, hisnmuslim.com, aladhan.com
- islamicquiz.i8x.net, riddles-api-eight.vercel.app

---

## DATABASE & SECURITY (from spec — already reviewed)

- `user_settings.user_id` → **UNIQUE**
- `otp_tokens.code_hash`, `password_reset_tokens.token_hash` → **hash at rest**, never plaintext
- Wallet, chat, todos mutations → **JWT scoped to current user**
- `@Public()` only on: health, login, register, forgot-password, OTP send/verify, public feed read, file download

Seed script must create demo user + sample feed/delivery/marketplace data.

---

## MOBILE FILE → ROUTE MAP (for contract tests)

| Mobile file | Endpoints |
|---|---|
| `src/api/clients/authClient.ts` | `/login`, `/register` |
| `src/api/clients/dashboardClient.ts` | `/dashboard/stats` |
| `src/api/clients/feedClient.ts` | `/feed` |
| `src/api/clients/deliveryClient.ts` | `/delivery/orders/*` |
| `src/api/mocks/*.ts` | Reference mock shapes — **must match exactly** |
| `src/redux/slices/*` | State shapes for Phase 2 modules |

---

## ACCEPTANCE CRITERIA

1. `curl http://localhost:3000/v1/health` → 200
2. Login with demo user returns JWT; `GET /dashboard/stats` with Bearer returns live counts
3. `POST /delivery/orders` + tracking flow works end-to-end
4. `POST /upload` with multipart `file` returns `savedFileName`; mobile audio/video upload succeeds
5. Setting mobile `.env` to `API_USE_MOCKS=false` + your `API_BASE_URL` — Home, Feed (read), Delivery (create/track) work without mock adapter
6. Swagger `/docs` documents every endpoint
7. E2E tests cover auth, dashboard, feed read, delivery lifecycle, upload

---

## DELIVERABLES

```
rnts-backend/
├── src/          # NestJS modules per domain
├── test/         # e2e
├── .env.example
├── README.md     # setup + mobile connection steps
└── docker-compose.yml  # Postgres + API (optional)
```

**Do not** change mobile code unless you find a DTO mismatch — report mismatches in README.

---

## REFERENCE DOCUMENTS IN REPO

1. `RNTS-API-BACKEND-SPEC.md` — full OpenAPI-style contract, schema, env vars
2. `docs/APP_AUDIT.md` — what's built vs stub vs wired
3. `src/api/server/*.dto.ts` — TypeScript DTOs to mirror
4. `src/api/mocks/*.ts` — mock response shapes
5. `.env.example` — mobile env var names

Start by scaffolding NestJS, implementing Phase 1 routes, seeding demo data, then run the acceptance checklist.
