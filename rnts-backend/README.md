# RNTS Backend

NestJS REST API for the **RNTS-Template** React Native application. Covers authentication, media uploads, social feed, dashboard stats, delivery tracking, and user profiles — aligned with the app's `master`, `develop`, and feature-branch API contracts.

## Tech stack

- **NestJS 11** + TypeScript
- **TypeORM** + SQLite (dev) — swap to PostgreSQL in production
- **JWT** authentication (Passport)
- **Swagger** at `/docs`
- **Multer** file uploads

## Quick start

```bash
cp .env.example .env
npm install
npm run start:dev
```

Server runs at `http://localhost:3000/v1` (matches the RN app's `API_BASE_URL` default).

- Health: `GET /v1/health`
- Swagger: `http://localhost:3000/docs`

## Demo credentials

| Email | Password |
|-------|----------|
| `mahmoud@gmail.com` | `Password@123` |
| `albasti@gmail.com` | `Password@1234` |

## Connect the React Native app

In your RN project `.env`:

```env
API_BASE_URL=http://localhost:3000/v1
MEDIA_API_BASE_URL=http://localhost:3000/v1
API_USE_MOCKS=false
```

For Android emulator use `http://10.0.2.2:3000/v1`. Run `npm run adb` in the RN project to reverse port 3000.

## API overview

### Auth (public)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/login` | Email/password login → JWT |
| POST | `/v1/register` | Register new user |
| POST | `/v1/auth/forgot-password` | Request reset token |
| POST | `/v1/auth/reset-password` | Reset with token |
| POST | `/v1/auth/otp/send` | Send phone OTP |
| POST | `/v1/auth/otp/verify` | Verify OTP & login |
| POST | `/v1/auth/otp/resend` | Resend OTP |

### Users (Bearer JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/api/users/:userId` | Get user (authSlice path) |
| GET | `/v1/users/:id/profile` | User profile |
| PATCH | `/v1/users/:id/settings` | Update lang / notifications |

### Media

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/v1/upload` | Optional | Multipart upload (`file` field) — drop-in for existing RN slices |
| GET | `/v1/files/:fileName` | Public | Serve uploaded file |
| GET/POST | `/v1/audios` | JWT | List / create audio metadata |
| GET/POST | `/v1/videos` | JWT | List / create video metadata |

Upload response shape (compatible with RN Redux slices):

```json
{ "savedFileName": "uuid.m4a", "url": "...", "mimeType": "...", "size": 12345 }
```

### Feed & dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/feed?sort=recent\|popular` | Social feed |
| GET | `/v1/dashboard/stats` | Dashboard counters |

### Delivery

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/delivery/orders` | Create order |
| GET | `/v1/delivery/orders/:id/tracking` | Track order |
| POST | `/v1/delivery/orders/:id/accept` | Driver accepts |
| POST | `/v1/delivery/orders/:id/cancel` | Cancel order |
| PATCH | `/v1/delivery/orders/:id/status` | Update status |
| POST | `/v1/delivery/orders/:id/driver-location` | Update GPS |

## Environment variables

See `.env.example`. Key settings:

- `PORT` — default `3000`
- `API_PREFIX` — default `v1`
- `JWT_SECRET` — **change in production**
- `DATABASE_PATH` — SQLite file path
- `UPLOAD_DIR` — uploaded files directory

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start:prod` | Run compiled app |
| `npm test` | Unit tests |

## Architecture

```
src/
├── auth/          JWT login, register, OTP, password reset
├── users/         Profiles & settings
├── media/         File upload + audio/video metadata
├── feed/          Social posts
├── dashboard/     Stats
├── delivery/      Order tracking
└── database/      Seed data on startup
```

## Islamic content (Quran, Hadith, Prayer, Adhkar)

The RN **islamic-module** branch calls public third-party APIs directly (`api.alquran.cloud`, `hadislam.org`, etc.). This backend does not proxy them — add an `islamic` module later if you need caching or rate-limiting.

## Production notes

1. Set `NODE_ENV=production` and use PostgreSQL instead of SQLite.
2. Use a strong `JWT_SECRET` and object storage (S3/GCS) for uploads.
3. Wire Firebase Admin SDK in `auth` module to verify Firebase ID tokens if keeping Firebase as IdP.
