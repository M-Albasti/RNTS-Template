# RNTS-API — Full Backend Agent Specification

> **How to use:** Copy this entire file and paste it as the prompt for your backend agent, or upload this file directly.

---

## MISSION

Build a **production-grade REST API** named **`RNTS-API`** for the React Native mobile app **RNTS-Template** (`https://github.com/M-Albasti/RNTS-Template`).

The mobile app spans these branches — your API must satisfy **all** of them:

| Branch | What it needs |
|--------|----------------|
| `master` | Auth (email/password), media upload/files, user profile |
| `develop` | Auth, feed, dashboard, delivery, media (via `apiClient` + `mediaClient`) |
| `cursor/services-hub-6224` | Everything in develop + **marketplace** (Talabat-style) |
| `cursor/islamic-module-6224` | Everything in develop + Islamic screens (Quran/Hadith/Prayer/Adhkar call **external APIs directly** — proxy is optional) |

**Base URL prefix:** `/v1`  
**Default port:** `3000`  

**Mobile `.env` configuration:**

```env
API_BASE_URL=http://localhost:3000/v1
MEDIA_API_BASE_URL=http://localhost:3000/v1
API_USE_MOCKS=false
```

For Android emulator use: `http://10.0.2.2:3000/v1`

---

## TECH STACK (MANDATORY)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **NestJS 11+** + TypeScript strict mode | Matches RN TypeScript stack; modular auth/media/feed |
| ORM | **TypeORM** | SQLite dev, PostgreSQL prod |
| Auth | **Passport JWT** + **bcrypt** (cost 12) | Mobile stores Bearer token in MMKV |
| Validation | **class-validator** + **class-transformer** | Mirror mobile Zod rules |
| Docs | **Swagger/OpenAPI** at `/docs` | Auto-generated from DTOs |
| Uploads | **Multer** (memory → disk/S3) | RN sends `multipart/form-data` field `file` |
| Testing | **Jest** unit + **Supertest** e2e | Min 80% coverage on services |
| Logging | **Pino** or Nest Logger + structured JSON in prod | |
| Cache (optional) | **Redis** for feed/dashboard/islamic proxy | Performance |

---

## ARCHITECTURE RULES

```
src/
├── main.ts                    # bootstrap, CORS, global prefix v1, ValidationPipe, Swagger
├── app.module.ts
├── common/
│   ├── decorators/            # @Public(), @CurrentUser()
│   ├── guards/                # JwtAuthGuard (global, skip @Public)
│   ├── filters/               # GlobalExceptionFilter → consistent error JSON
│   ├── interceptors/          # Logging, transform, timeout
│   └── dto/                   # PaginationDto, ApiErrorDto
├── config/                    # configuration.ts + .env validation (Joi/Zod)
├── auth/
├── users/
├── media/
├── feed/
├── dashboard/
├── delivery/
├── marketplace/
├── wallet/
├── todos/
├── chat/
├── games/
└── database/                  # migrations, seed.service.ts
```

**Principles:**

- One module per domain (controller → service → repository/entity)
- DTOs for every request/response — never expose entities directly
- Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`
- Global JWT guard; mark public routes with `@Public()`
- Consistent error shape: `{ "statusCode": number, "message": string | string[], "error"?: string }`
- Use `@HttpCode(201)` for create endpoints
- Idempotent seeds on startup (skip if data exists)
- PostgreSQL-ready migrations (no `synchronize: true` in production)

---

## AUTHENTICATION

### JWT

- Header: `Authorization: Bearer <token>`
- Payload: `{ sub: userId, email: string }`
- Expiry: 7 days (configurable via `JWT_EXPIRES_IN`)
- Secret: `JWT_SECRET` env var (min 32 chars in prod)

### Password rules (match mobile Zod validation)

- Min 6 characters
- At least 1 uppercase, 1 lowercase, 1 special char from `[!@#$%^&*(),.?":{}|<>]`
- No spaces
- Must not contain email or phone substring

### Demo seed users

| Email | Password | Name |
|-------|----------|------|
| `mahmoud@gmail.com` | `Password@123` | Mahmoud Albasti |
| `albasti@gmail.com` | `Password@1234` | Albasti Mahmoud |

### Optional future: Firebase hybrid

- Accept Firebase ID token → verify with Firebase Admin SDK → upsert user → issue app JWT
- Not required for v1 but leave `firebaseUid` column on users table

---

## COMPLETE API REFERENCE

All paths are relative to `/v1`.

---

### 1. HEALTH

#### `GET /health` — Public

**Response 200:**

```json
{
  "status": "ok",
  "timestamp": "2026-07-01T00:00:00.000Z",
  "service": "rnts-api"
}
```

---

### 2. AUTH

#### `POST /login` — Public

**Request:**

```json
{
  "email": "mahmoud@gmail.com",
  "password": "Password@123"
}
```

**Response 200:**

```json
{
  "id": 1,
  "name": "Mahmoud Albasti",
  "email": "mahmoud@gmail.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 401:**

```json
{ "statusCode": 401, "message": "Invalid email or password", "error": "Unauthorized" }
```

---

#### `POST /register` — Public → HTTP 201

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password@123",
  "name": "John Doe"
}
```

**Response 201:** Same shape as login response.

**Response 409:**

```json
{ "statusCode": 409, "message": "Email already registered", "error": "Conflict" }
```

---

#### `GET /auth/me` — JWT required

**Response 200:** User profile (see Users section below).

---

#### `POST /auth/forgot-password` — Public

**Request:**

```json
{ "email": "user@example.com" }
```

**Response 200:**

```json
{ "message": "If the email exists, a reset link has been sent" }
```

*(In development: log reset token to console.)*

---

#### `POST /auth/reset-password` — Public

**Request:**

```json
{
  "token": "hex-reset-token",
  "password": "NewPassword@123"
}
```

**Response 200:**

```json
{ "message": "Password reset successfully" }
```

---

#### `POST /auth/otp/send` — Public

**Request:**

```json
{ "phone": "+1234567890" }
```

**Response 200:**

```json
{ "message": "OTP sent successfully" }
```

*(In development: log 6-digit OTP code to console.)*

---

#### `POST /auth/otp/verify` — Public

**Request:**

```json
{
  "phone": "+1234567890",
  "code": "123456"
}
```

**Response 200:** Login response shape (creates user if phone is new).

---

#### `POST /auth/otp/resend` — Public

**Request:**

```json
{ "phone": "+1234567890" }
```

**Response 200:**

```json
{ "message": "OTP sent successfully" }
```

---

### 3. USERS — JWT required

#### `GET /api/users/:userId`

Used by mobile `authSlice` commented thunk path. Returns user profile.

#### `GET /users/:id/profile`

Returns user profile.

#### `PATCH /users/:id/settings`

**Request:**

```json
{
  "lang": "en",
  "notificationsEnabled": true
}
```

**Response 200:** Full profile with settings.

**Profile response shape:**

```json
{
  "id": 1,
  "email": "mahmoud@gmail.com",
  "phone": null,
  "name": "Mahmoud Albasti",
  "photoURL": null,
  "emailVerified": true,
  "phoneVerified": false,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "settings": {
    "lang": "en",
    "notificationsEnabled": true
  }
}
```

---

### 4. MEDIA

Upload metadata endpoints require JWT. Upload itself requires JWT (or pre-signed upload URLs in production).

#### `POST /upload` — JWT required (or pre-signed upload URL)

**Request:** `multipart/form-data`, field name must be **`file`**

**Response 200:**

```json
{
  "savedFileName": "a1b2c3d4-uuid.m4a",
  "url": "http://localhost:3000/v1/files/a1b2c3d4-uuid.m4a",
  "mimeType": "audio/mp4",
  "size": 123456
}
```

> **Critical:** Mobile Redux slices (`audiosSlice`, `videosSlice`) expect the key **`savedFileName`**.

---

#### `GET /files/:fileName` — Public

Stream file bytes.

**Headers:** `Cache-Control: public, max-age=86400`

---

#### `GET /audios` — JWT

**Response 200:** Array of:

```json
{
  "id": "uuid",
  "title": "audio-title",
  "artist": "Artist Name",
  "album": "Album Name",
  "artwork": "https://picsum.photos/200/300",
  "url": "http://localhost:3000/v1/files/uuid.m4a",
  "duration": 120
}
```

---

#### `POST /audios` — JWT → HTTP 201

**Request:**

```json
{
  "savedFileName": "uuid.m4a",
  "title": "My Recording",
  "artist": "Me",
  "album": "Demo Album",
  "artwork": "https://picsum.photos/200",
  "duration": 90
}
```

---

#### `GET /videos` — JWT

**Response 200:** Array of:

```json
{
  "title": "video-name",
  "description": "description",
  "subtitle": "subtitle",
  "thumb": "https://picsum.photos/150",
  "sources": ["http://localhost:3000/v1/files/uuid.mp4"]
}
```

---

#### `POST /videos` — JWT → HTTP 201

**Request:**

```json
{
  "savedFileName": "uuid.mp4",
  "title": "My Video",
  "description": "Video description",
  "subtitle": "Subtitle text",
  "thumb": "https://picsum.photos/150",
  "sources": ["http://localhost:3000/v1/files/uuid.mp4"]
}
```

---

### 5. FEED — Public

#### `GET /feed?sort=recent|popular`

**Query params:**

| Param | Values | Default |
|-------|--------|---------|
| `sort` | `recent`, `popular` | `recent` |

**Response 200:**

```json
{
  "sort": "recent",
  "items": [
    {
      "id": "uuid",
      "author": "Mahmoud",
      "avatar": "https://i.pravatar.cc/100?u=1",
      "content": "Welcome to RNTS! #welcome #rnts",
      "mediaType": "text",
      "mediaUrl": null,
      "likes": 12,
      "likedByMe": false,
      "myReaction": null,
      "shares": 0,
      "comments": [
        {
          "id": "c1",
          "author": "Ali",
          "text": "Beautiful!",
          "createdAt": "2026-06-01T00:00:00.000Z"
        }
      ],
      "hashtags": ["welcome", "rnts"],
      "poll": null,
      "createdAt": "2026-06-01T00:00:00.000Z"
    }
  ]
}
```

**Type definitions:**

- `mediaType`: `"text" | "image" | "video" | "audio" | "poll"`
- `myReaction`: `"like" | "love" | "wow" | "sad" | null`
- `poll`: `{ "options": [{ "id": "o1", "text": "Option A", "votes": 14 }], "votedOptionId": "o1" }`

**Future v2 (not wired in mobile yet):**

- `POST /feed/posts`
- `POST /feed/posts/:id/like`
- `POST /feed/posts/:id/comments`

---

### 6. DASHBOARD — Public

#### `GET /dashboard/stats`

**Response 200:**

```json
{
  "postsCount": 4,
  "openTodos": 1,
  "unreadChats": 3,
  "walletBalance": 2480.5,
  "gameCoins": 450
}
```

> **Must be computed live** from database counts — NOT hardcoded static values.

---

### 7. DELIVERY — Mixed (read-only public; mutations JWT + owner/driver authorization)

**Status enum:** `pending | accepted | picked_up | in_transit | delivered | cancelled`  
**Package types:** `document | food | parcel | fragile`

---

#### `GET /delivery/addresses`

**Response 200:**

```json
[
  {
    "id": "addr-1",
    "label": "Home",
    "addressLine": "123 Main St, Cairo",
    "coordinate": { "latitude": 30.0444, "longitude": 31.2357 }
  },
  {
    "id": "addr-2",
    "label": "Office",
    "addressLine": "456 Nile Rd, Giza",
    "coordinate": { "latitude": 30.0131, "longitude": 31.2089 }
  },
  {
    "id": "addr-3",
    "label": "Mall",
    "addressLine": "789 Shopping Ave, Cairo",
    "coordinate": { "latitude": 30.0626, "longitude": 31.2497 }
  }
]
```

---

#### `GET /delivery/orders`

**Response 200:** Array of tracking response objects (see below).

---

#### `POST /delivery/orders` — JWT required — HTTP 201

**Request:**

```json
{
  "pickupId": "addr-1",
  "dropoffId": "addr-2",
  "packageType": "parcel",
  "notes": "Handle with care",
  "price": 45,
  "etaMinutes": 20
}
```

**Response 201:** Tracking response object.

**Response 400:**

```json
{ "statusCode": 400, "message": "Invalid pickup or dropoff", "error": "Bad Request" }
```

---

#### `GET /delivery/orders/:orderId/tracking`

**Response 200:** Tracking response object.

**Response 404:**

```json
{ "statusCode": 404, "message": "Order not found", "error": "Not Found" }
```

---

#### `POST /delivery/orders/:orderId/driver-location` — JWT required (driver)

**Request:**

```json
{
  "latitude": 30.05,
  "longitude": 31.24,
  "recordedAt": "2026-06-01T00:00:00.000Z"
}
```

**Response 200:**

```json
{
  "orderId": "del-uuid",
  "recordedAt": "2026-06-01T00:00:00.000Z"
}
```

---

#### `PATCH /delivery/orders/:orderId/status` — JWT required (owner or driver)

**Request:**

```json
{
  "status": "in_transit",
  "label": "On the way"
}
```

**Response 200:** Tracking response object.

---

#### `POST /delivery/orders/:orderId/accept` — JWT required (driver)

Driver accepts a pending order. Assigns driver and updates timeline.

**Response 200:** Tracking response object.

**Response 409:**

```json
{ "statusCode": 409, "message": "Order is not available", "error": "Conflict" }
```

---

#### `POST /delivery/orders/:orderId/cancel` — JWT required (owner or driver)

**Response 200:** Tracking response object.

**Response 409:**

```json
{ "statusCode": 409, "message": "Order cannot be cancelled", "error": "Conflict" }
```

---

**Tracking response shape (used by all delivery endpoints above):**

```json
{
  "orderId": "del-uuid",
  "status": "in_transit",
  "etaMinutes": 18,
  "timeline": [
    {
      "id": "evt-1",
      "status": "pending",
      "label": "Order placed",
      "timestamp": "2026-06-01T00:00:00.000Z"
    },
    {
      "id": "evt-2",
      "status": "accepted",
      "label": "Driver accepted",
      "timestamp": "2026-06-01T00:05:00.000Z"
    }
  ],
  "driver": {
    "id": "driver-1",
    "name": "Ahmed Hassan",
    "phone": "+201234567890",
    "rating": 4.8,
    "vehicle": "Motorcycle - ABC 123",
    "latitude": 30.05,
    "longitude": 31.24,
    "locationUpdatedAt": "2026-06-01T00:00:00.000Z"
  },
  "updatedAt": "2026-06-01T00:00:00.000Z"
}
```

---

### 8. MARKETPLACE (services-hub branch) — Public

Talabat-style marketplace module.

---

#### `GET /marketplace/categories`

**Response 200:**

```json
[
  { "id": "food", "nameKey": "marketplace.categories.food", "icon": "🍔", "color": "#F97316" },
  { "id": "grocery", "nameKey": "marketplace.categories.grocery", "icon": "🛒", "color": "#22C55E" },
  { "id": "pharmacy", "nameKey": "marketplace.categories.pharmacy", "icon": "💊", "color": "#3B82F6" },
  { "id": "electronics", "nameKey": "marketplace.categories.electronics", "icon": "📱", "color": "#8B5CF6" },
  { "id": "fashion", "nameKey": "marketplace.categories.fashion", "icon": "👕", "color": "#EC4899" },
  { "id": "home", "nameKey": "marketplace.categories.home", "icon": "🏠", "color": "#14B8A6" },
  { "id": "beauty", "nameKey": "marketplace.categories.beauty", "icon": "💄", "color": "#F472B6" },
  { "id": "pets", "nameKey": "marketplace.categories.pets", "icon": "🐾", "color": "#A16207" }
]
```

---

#### `GET /marketplace/products?categoryId=food&search=shawarma`

**Response 200:** Array of product objects (see below).

---

#### `GET /marketplace/products/:id`

**Response 200:** Single product object.

**Response 404:**

```json
{ "statusCode": 404, "message": "Product not found", "error": "Not Found" }
```

---

#### `GET /marketplace/stores/:merchantId`

Default merchant ID: `store-you`

**Response 200:**

```json
{
  "id": "store-you",
  "name": "RNTS Demo Store",
  "description": "Your Talabat-style merchant storefront.",
  "isOpen": true,
  "rating": 4.8,
  "reviewCount": 124,
  "revenue": 2840.5,
  "fulfilledOrders": 86,
  "products": []
}
```

---

#### `GET /marketplace/promotions`

**Response 200:**

```json
[
  {
    "id": "promo-1",
    "title": "20% off shawarma",
    "description": "Weekday lunch special",
    "type": "percentage",
    "value": 20,
    "productIds": ["mprod-1"],
    "minOrderAmount": 15,
    "isActive": true,
    "startsAt": "2026-01-01T00:00:00.000Z",
    "endsAt": "2026-12-31T23:59:59.000Z"
  }
]
```

---

#### `GET /marketplace/reviews`

**Response 200:**

```json
[
  {
    "id": "rev-1",
    "customerName": "Sara K.",
    "rating": 5,
    "comment": "Fast delivery and hot food!",
    "orderId": "mord-1",
    "productTitle": "Chicken Shawarma Wrap",
    "createdAt": "2026-06-20T12:00:00.000Z",
    "merchantReply": "Thank you Sara!",
    "isRead": true
  }
]
```

---

#### `GET /marketplace/orders`

**Response 200:** Array of order objects (see below).

---

#### `POST /marketplace/orders` — JWT required — HTTP 201

**Request:**

```json
{
  "items": [
    { "productId": "mprod-1", "quantity": 2 }
  ],
  "addressLine": "123 Main St, Cairo",
  "paymentMethod": "wallet"
}
```

**Response 201:**

```json
{
  "id": "uuid",
  "items": [
    {
      "productId": "mprod-1",
      "title": "Chicken Shawarma Wrap",
      "quantity": 2,
      "unitPrice": 22,
      "merchantId": "store-you"
    }
  ],
  "subtotal": 44,
  "deliveryFee": 8,
  "total": 52,
  "status": "placed",
  "addressLine": "123 Main St, Cairo",
  "paymentMethod": "wallet",
  "createdAt": "2026-06-01T00:00:00.000Z"
}
```

---

#### `PATCH /marketplace/orders/:id/status` — JWT required (owner or merchant)

**Request:**

```json
{ "status": "confirmed" }
```

**Statuses:** `placed | confirmed | preparing | out_for_delivery | delivered | cancelled`

---

**Product object shape:**

```json
{
  "id": "mprod-1",
  "categoryId": "food",
  "title": "Chicken Shawarma Wrap",
  "description": "Garlic sauce, pickles, fries — bestseller.",
  "price": 22,
  "currency": "AED",
  "imageEmoji": "🌯",
  "sellerName": "RNTS Demo Store",
  "rating": 4.9,
  "reviewCount": 48,
  "stock": 4,
  "isEnabled": true,
  "merchantId": "store-you",
  "isOwnListing": true
}
```

---

### 9. WALLET — JWT required (scoped to current user)

#### `GET /wallet`

**Response 200:**

```json
{
  "balance": 2480.5,
  "cardLast4": "4291"
}
```

---

#### `GET /wallet/balance`

**Response 200:**

```json
{ "balance": 2480.5 }
```

---

#### `GET /wallet/cards`

**Response 200:**

```json
[
  { "id": "1", "label": "Primary Visa", "last4": "4291", "brand": "Visa", "isDefault": true },
  { "id": "2", "label": "Backup Mastercard", "last4": "8834", "brand": "Mastercard", "isDefault": false }
]
```

---

#### `GET /wallet/transactions`

**Response 200:**

```json
[
  {
    "id": "1",
    "title": "Salary",
    "amount": 3200,
    "type": "credit",
    "date": "2026-06-01",
    "category": "Income",
    "note": "Monthly payroll deposit"
  },
  {
    "id": "2",
    "title": "Coffee Shop",
    "amount": 12.5,
    "type": "debit",
    "date": "2026-06-03",
    "category": "Food",
    "note": "Morning latte"
  }
]
```

---

#### `GET /wallet/bills`

**Response 200:**

```json
[
  {
    "id": "1",
    "payee": "DEWA Utilities",
    "amount": 180,
    "dueDate": "2026-07-05",
    "recurring": true,
    "paid": false
  }
]
```

---

#### `GET /wallet/savings-goals`

**Response 200:**

```json
[
  { "id": "1", "title": "Emergency Fund", "target": 5000, "saved": 1200 }
]
```

---

#### `GET /wallet/budget`

**Response 200:**

```json
[
  { "id": "1", "name": "Food", "limit": 400, "spent": 210 },
  { "id": "2", "name": "Transport", "limit": 200, "spent": 85 }
]
```

---

### 10. TODOS — JWT required (scoped to current user)

#### `GET /todos?filter=all|active|done|high`

**Response 200:**

```json
[
  {
    "id": "uuid",
    "title": "Wire API to backend",
    "done": false,
    "priority": "high",
    "category": "Dev",
    "dueDate": "2026-07-15",
    "note": "Set API_USE_MOCKS=false",
    "createdAt": "2026-06-01T00:00:00.000Z"
  }
]
```

---

#### `POST /todos` — JWT required — HTTP 201

**Request:**

```json
{
  "title": "Wire API to backend",
  "priority": "high",
  "category": "Dev",
  "dueDate": "2026-07-15",
  "note": "Set API_USE_MOCKS=false"
}
```

---

#### `PATCH /todos/:id` — JWT required

**Request:** Any subset of `{ title, done, priority, category, dueDate, note }`

---

#### `DELETE /todos/:id` — JWT required

**Response 200:**

```json
{ "message": "Todo deleted" }
```

---

### 11. CHAT — JWT required (scoped to current user; stub for Stream Chat integration)

#### `GET /chat/threads`

**Response 200:**

```json
[
  {
    "id": "thread-1",
    "name": "Team RNTS",
    "avatar": "https://i.pravatar.cc/100?u=10",
    "lastMessage": "Ship the wallet module next?",
    "unread": 2,
    "online": true,
    "muted": false,
    "pinned": true
  }
]
```

---

#### `GET /chat/threads/:id`

**Response 200:** Thread object including `messages` array:

```json
{
  "id": "thread-1",
  "name": "Team RNTS",
  "avatar": "https://i.pravatar.cc/100?u=10",
  "lastMessage": "Ship the wallet module next?",
  "unread": 2,
  "online": true,
  "muted": false,
  "pinned": true,
  "messages": [
    {
      "id": "m1",
      "text": "Welcome to RNTS chat!",
      "senderId": "u2",
      "createdAt": "2026-06-28T10:00:00.000Z",
      "read": true
    }
  ]
}
```

---

#### `GET /chat/contacts`

**Response 200:**

```json
[
  { "id": "u2", "name": "Sara", "avatar": "https://i.pravatar.cc/100?u=2", "online": true },
  { "id": "u3", "name": "Ali", "avatar": "https://i.pravatar.cc/100?u=3", "online": false }
]
```

---

#### `GET /chat/unread-count`

**Response 200:**

```json
{ "unreadChats": 3 }
```

---

#### `GET /chat/stream-token` — JWT required

Stub for future Stream Chat SDK integration. Mint tokens only after JWT validation.

**Response 200:**

```json
{
  "token": "stream-demo-token-demo-user",
  "apiKey": "demo-stream-key",
  "userId": "demo-user"
}
```

---

### 12. GAMES — Public

#### `GET /games/profile`

**Response 200:**

```json
{
  "coins": 450,
  "level": 7,
  "streak": 3
}
```

---

#### `GET /games/shop`

**Response 200:**

```json
[
  { "id": "1", "title": "Coin Pack S", "cost": 100, "description": "100 bonus coins" },
  { "id": "2", "title": "Coin Pack M", "cost": 250, "description": "300 bonus coins" },
  { "id": "3", "title": "Premium Avatar", "cost": 500, "description": "Unlock avatar frame" }
]
```

---

#### `GET /games/leaderboard`

**Response 200:**

```json
[
  { "id": "1", "name": "Mahmoud", "coins": 1250, "rank": 1 },
  { "id": "2", "name": "Sara", "coins": 980, "rank": 2 },
  { "id": "3", "name": "Ali", "coins": 760, "rank": 3 }
]
```

---

#### `GET /games/achievements`

**Response 200:**

```json
[
  {
    "id": "1",
    "title": "First Win",
    "description": "Complete your first puzzle",
    "unlocked": true,
    "icon": "🏆"
  },
  {
    "id": "2",
    "title": "Streak Master",
    "description": "Play 7 days in a row",
    "unlocked": false,
    "icon": "🔥"
  }
]
```

---

#### `GET /games/history`

**Response 200:**

```json
[
  {
    "id": "1",
    "reward": "Daily bonus",
    "coinsDelta": 50,
    "createdAt": "2026-06-29T08:00:00.000Z"
  }
]
```

---

### 13. ISLAMIC PROXY (OPTIONAL — v2)

The `islamic-module` branch calls these third-party APIs **directly from the mobile app**.  
Add a proxy under `/v1/islamic/...` only if you want caching, rate-limiting, or a unified API key.

| Service | Upstream base URL | Key routes |
|---------|-------------------|------------|
| Quran | `https://api.alquran.cloud/v1` | `GET /surah`, `/surah/:n/:edition`, `/juz/:n/:edition`, `/search/:q/all/:edition`, `/ayah/random/:editions` |
| Hadith | `https://hadislam.org` | `GET /editions/`, `/editions/:slug/books`, `/editions/:slug/hadiths`, `/hadiths/search`, `/hadiths/random` |
| Prayer | `https://api.aladhan.com/v1` | `GET /timings?latitude=&longitude=`, `/timingsByCity?city=&country=` |
| Adhkar | `https://www.hisnmuslim.com/api` | `GET /ar/husn_ar.json`, `/en/husn_en.json`, `/:lang/:categoryId.json` |

---

## DATABASE SCHEMA (PostgreSQL)

```sql
-- Users & auth
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE,
  phone VARCHAR UNIQUE,
  name VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL,
  photo_url VARCHAR,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  firebase_uid VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  lang VARCHAR(2) DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE otp_tokens (
  id SERIAL PRIMARY KEY,
  phone VARCHAR NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_file_name VARCHAR NOT NULL,
  original_name VARCHAR NOT NULL,
  mime_type VARCHAR NOT NULL,
  size INT NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  artist VARCHAR NOT NULL,
  album VARCHAR NOT NULL,
  artwork VARCHAR NOT NULL,
  url VARCHAR NOT NULL,
  duration REAL,
  saved_file_name VARCHAR NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description VARCHAR DEFAULT '',
  subtitle VARCHAR DEFAULT '',
  thumb VARCHAR NOT NULL,
  sources JSONB NOT NULL,
  saved_file_name VARCHAR NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feed
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author VARCHAR NOT NULL,
  avatar VARCHAR NOT NULL,
  content TEXT NOT NULL,
  media_type VARCHAR DEFAULT 'text',
  media_url VARCHAR,
  likes INT DEFAULT 0,
  comments JSONB DEFAULT '[]',
  hashtags JSONB DEFAULT '[]',
  poll JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery
CREATE TABLE delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR DEFAULT 'pending',
  pickup_id VARCHAR NOT NULL,
  dropoff_id VARCHAR NOT NULL,
  package_type VARCHAR NOT NULL,
  notes VARCHAR,
  price REAL NOT NULL,
  eta_minutes INT NOT NULL,
  timeline JSONB NOT NULL,
  driver JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace
CREATE TABLE marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  items JSONB NOT NULL,
  subtotal REAL NOT NULL,
  delivery_fee REAL NOT NULL,
  total REAL NOT NULL,
  status VARCHAR DEFAULT 'placed',
  address_line VARCHAR NOT NULL,
  payment_method VARCHAR DEFAULT 'wallet',
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  customer_rating REAL,
  customer_review VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Todos
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  priority VARCHAR DEFAULT 'medium',
  category VARCHAR DEFAULT 'General',
  due_date VARCHAR,
  note VARCHAR,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_delivery_orders_status ON delivery_orders(status);
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_marketplace_orders_user_id ON marketplace_orders(user_id);
```

---

## ENVIRONMENT VARIABLES

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/rnts_api   # production
DATABASE_PATH=./data/rnts.sqlite                                # development (SQLite)

# JWT
JWT_SECRET=change-me-use-min-32-chars-random-string-in-production
JWT_EXPIRES_IN=7d

# File uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=100
# AWS_S3_BUCKET=rnts-api-uploads          # production: use S3
# AWS_REGION=us-east-1

# OTP / Email (production)
OTP_EXPIRES_MINUTES=10
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=

# CORS
CORS_ORIGINS=*

# Optional integrations
STREAM_CHAT_API_KEY=
FIREBASE_PROJECT_ID=
REDIS_URL=redis://localhost:6379
```

---

## SECURITY CHECKLIST

- [ ] bcrypt cost factor 12; never log passwords or JWT tokens
- [ ] Rate limit auth routes: 5 requests/minute/IP (`@nestjs/throttler`)
- [ ] Helmet middleware for secure HTTP headers
- [ ] Validate file MIME types and enforce max upload size
- [ ] Store uploads with UUID filenames (never use original filename on disk)
- [ ] JWT secret from environment only; rotate in production
- [ ] Restrict CORS to known origins in production
- [ ] Parameterized queries only (TypeORM — no raw SQL injection)
- [ ] Users can only update their own settings (`currentUser.id === :id`)
- [ ] OTP codes expire after 10 minutes
- [ ] Password reset tokens are single-use

---

## PERFORMANCE CHECKLIST

- [ ] Pagination on all list endpoints: `?page=1&limit=20` → `{ items, total, page, limit, totalPages }`
- [ ] Database indexes on all foreign keys and frequently filtered columns
- [ ] Response compression (gzip/brotli)
- [ ] File uploads to S3 + CloudFront CDN in production
- [ ] Redis cache for `GET /feed` and `GET /dashboard/stats` (TTL 30 seconds)
- [ ] PostgreSQL connection pooling (PgBouncer or TypeORM pool)
- [ ] Avoid N+1 queries — use eager loading or query builder joins
- [ ] Health check endpoint for load balancer readiness probes
- [ ] Request timeout interceptor (30 seconds max)

---

## TESTING REQUIREMENTS

```
test/
├── auth.e2e-spec.ts           # login, register, me, invalid credentials, OTP
├── feed.e2e-spec.ts           # sort=recent and sort=popular
├── delivery.e2e-spec.ts       # full order lifecycle
├── media.e2e-spec.ts          # upload + download roundtrip
├── marketplace.e2e-spec.ts    # browse + checkout
├── todos.e2e-spec.ts          # CRUD
└── unit/
    ├── auth.service.spec.ts
    ├── delivery.service.spec.ts
    └── marketplace.service.spec.ts
```

**Minimum test coverage:**

- All auth flows (login success, login fail, register, duplicate email)
- Delivery full lifecycle (create → accept → in_transit → delivered)
- File upload returns `savedFileName` key
- Marketplace checkout calculates correct totals
- Dashboard stats reflect seeded data counts

**Run:** `npm run build && npm test && npm run test:e2e`

---

## DELIVERABLES

1. **GitHub repository:** `M-Albasti/RNTS-API`
2. **README.md** — setup instructions, env vars, demo credentials, full endpoint list
3. **Swagger UI** at `http://localhost:3000/docs` with Bearer auth button
4. **Docker Compose** — app + PostgreSQL + Redis (optional)
5. **`.env.example`** — all variables documented
6. **Seed service** — demo users, feed posts, delivery order, todos on first boot
7. **GitHub Actions CI** — lint, build, test on every push
8. **Multi-stage Dockerfile** for production deployment

---

## ACCEPTANCE CRITERIA

The backend is **complete** when all of the following are true:

1. ✅ All endpoints in this document respond with the exact JSON shapes specified
2. ✅ Mobile app works with `API_USE_MOCKS=false` pointing to this API
3. ✅ `POST /upload` returns `{ savedFileName, url, mimeType, size }` — RN Redux slices compatible
4. ✅ `POST /login` returns `{ id, name, email, token }`
5. ✅ `POST /register` returns HTTP 201
6. ✅ Dashboard stats are live-computed from database, not hardcoded
7. ✅ Swagger documents every route with request/response schemas
8. ✅ `npm run build && npm test` pass with zero errors
9. ✅ README allows a new developer to run locally in under 5 minutes
10. ✅ Demo login `mahmoud@gmail.com` / `Password@123` works out of the box

---

## MOBILE CLIENT REFERENCE FILES

Use these files in `RNTS-Template` to verify API contract compatibility:

```
src/api/clients/authClient.ts           → POST /login, POST /register
src/api/clients/feedClient.ts           → GET /feed?sort=
src/api/clients/dashboardClient.ts      → GET /dashboard/stats
src/api/clients/deliveryClient.ts       → all /delivery/orders/* routes
src/config/network/mediaClient.ts       → POST /upload, GET /files/:name
src/config/network/client.ts            → apiClient base URL + Bearer JWT
src/redux/slices/audiosSlice.tsx          → upload + files (master + develop)
src/redux/slices/videosSlice.tsx          → upload + files (master + develop)
src/api/server/auth.dto.ts              → LoginRequestDto, LoginResponseDto
src/api/server/feed.dto.ts              → FeedResponseDto, PostItemDto
src/api/server/dashboard.dto.ts         → DashboardStatsDto
src/api/server/delivery.dto.ts          → OrderTrackingResponseDto
src/constants/marketplaceMockData.ts      → marketplace seed data reference
src/constants/deliveryMockData.ts         → delivery addresses seed reference
src/types/walletTypes.tsx               → wallet response shapes
src/types/todoTypes.tsx                 → todo response shapes
src/types/chatTypes.tsx                 → chat response shapes
src/types/gameTypes.tsx                 → games response shapes
src/utils/loginValidation.tsx           → password validation rules (Zod)
```

---

## QUICK ENDPOINT SUMMARY

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | Public | Health check |
| POST | `/login` | Public | Email/password login |
| POST | `/register` | Public | Register → 201 |
| GET | `/auth/me` | JWT | Current user profile |
| POST | `/auth/forgot-password` | Public | Request reset |
| POST | `/auth/reset-password` | Public | Reset with token |
| POST | `/auth/otp/send` | Public | Send phone OTP |
| POST | `/auth/otp/verify` | Public | Verify OTP + login |
| POST | `/auth/otp/resend` | Public | Resend OTP |
| GET | `/api/users/:userId` | JWT | Get user by ID |
| GET | `/users/:id/profile` | JWT | User profile |
| PATCH | `/users/:id/settings` | JWT | Update settings |
| POST | `/upload` | Public | Multipart file upload |
| GET | `/files/:fileName` | Public | Download file |
| GET | `/audios` | JWT | List audios |
| POST | `/audios` | JWT | Create audio metadata |
| GET | `/videos` | JWT | List videos |
| POST | `/videos` | JWT | Create video metadata |
| GET | `/feed` | Public | Social feed |
| GET | `/dashboard/stats` | Public | Dashboard counters |
| GET | `/delivery/addresses` | Public | Address list |
| GET | `/delivery/orders` | Public | Order list |
| POST | `/delivery/orders` | Public | Create order → 201 |
| GET | `/delivery/orders/:id/tracking` | Public | Track order |
| POST | `/delivery/orders/:id/driver-location` | Public | Update GPS |
| PATCH | `/delivery/orders/:id/status` | Public | Update status |
| POST | `/delivery/orders/:id/accept` | Public | Driver accept |
| POST | `/delivery/orders/:id/cancel` | Public | Cancel order |
| GET | `/marketplace/categories` | Public | Categories |
| GET | `/marketplace/products` | Public | Product list |
| GET | `/marketplace/products/:id` | Public | Product detail |
| GET | `/marketplace/stores/:merchantId` | Public | Merchant store |
| GET | `/marketplace/promotions` | Public | Promotions |
| GET | `/marketplace/reviews` | Public | Reviews |
| GET | `/marketplace/orders` | Public | Order history |
| POST | `/marketplace/orders` | Public | Checkout → 201 |
| PATCH | `/marketplace/orders/:id/status` | Public | Update status |
| GET | `/wallet` | Public | Wallet summary |
| GET | `/wallet/balance` | Public | Balance only |
| GET | `/wallet/cards` | Public | Saved cards |
| GET | `/wallet/transactions` | Public | Transactions |
| GET | `/wallet/bills` | Public | Bill pay items |
| GET | `/wallet/savings-goals` | Public | Savings goals |
| GET | `/wallet/budget` | Public | Budget categories |
| GET | `/todos` | Public | List todos |
| POST | `/todos` | Public | Create todo → 201 |
| PATCH | `/todos/:id` | Public | Update todo |
| DELETE | `/todos/:id` | Public | Delete todo |
| GET | `/chat/threads` | Public | Chat threads |
| GET | `/chat/threads/:id` | Public | Thread + messages |
| GET | `/chat/contacts` | Public | Contacts |
| GET | `/chat/unread-count` | Public | Unread count |
| GET | `/chat/stream-token` | Public | Stream Chat token stub |
| GET | `/games/profile` | Public | Game profile/coins |
| GET | `/games/shop` | Public | Shop items |
| GET | `/games/leaderboard` | Public | Leaderboard |
| GET | `/games/achievements` | Public | Achievements |
| GET | `/games/history` | Public | Reward history |

---

*End of specification. Build the complete RNTS-API backend following this document exactly.*
