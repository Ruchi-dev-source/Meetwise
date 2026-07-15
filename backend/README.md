# MeetWise AI — Backend

Express + TypeScript + Prisma + PostgreSQL API for MeetWise AI — a multi-tenant SaaS platform. Every user belongs to exactly one organization; the first user to register for a new organization becomes its Admin.

## Tech Stack

Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · JWT (access + refresh) · bcryptjs · Zod · Helmet · CORS · Morgan · cookie-parser

## Project Structure

Feature-based: each module owns its full vertical slice (controller → service → repository), rather than grouping by technical layer across the whole app.

```
src/
├── modules/
│   ├── auth/            # Register, login, logout, refresh, me
│   │   ├── auth.controller.ts    # parse request, call service, shape response
│   │   ├── auth.service.ts       # orchestration: hashing, token issuance, session rules
│   │   ├── auth.repository.ts    # RefreshToken persistence — the only Prisma access for this module
│   │   ├── auth.routes.ts
│   │   ├── auth.validators.ts    # Zod schemas
│   │   └── auth.types.ts
│   ├── organization/     # No routes yet — consumed internally by auth on register
│   │   ├── organization.service.ts    # unique-slug generation
│   │   ├── organization.repository.ts
│   │   └── organization.types.ts
│   ├── users/            # No routes yet — consumed by auth.me and future user-management endpoints
│   │   ├── users.service.ts     # toSafeUser() strips the password hash before anything leaves the service layer
│   │   ├── users.repository.ts
│   │   └── users.types.ts
│   └── health/
│       ├── health.controller.ts
│       ├── health.service.ts
│       └── health.routes.ts
├── config/        # Zod-validated environment variables
├── lib/           # Cross-module infrastructure: Prisma client singleton, JWT signing, refresh-token
│                    hashing, httpOnly cookie helpers
├── middleware/    # authenticate (verifies Bearer JWT), requireRole, centralized error handler, 404
├── utils/         # ApiError, ApiResponse, asyncHandler, password hashing, slugify, duration parsing
├── types/         # Express Request augmentation (req.user)
├── routes/        # Top-level router — mounts each module's router under /api/v1
├── app.ts         # Express app: middleware + routes wiring, no server startup
└── server.ts      # Entry point: connects Prisma, starts HTTP server, graceful shutdown
```

## Getting Started

### 1. Start PostgreSQL

Easiest via Docker, from the repo root:

```bash
docker compose up -d postgres
```

Or point `DATABASE_URL` at any Postgres instance you already have running.

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in real values — at minimum, generate real secrets for the three JWT/cookie fields instead of using the placeholders:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run that three times for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `COOKIE_SECRET`.

### 3. Install dependencies and generate the Prisma client

```bash
npm install
npx prisma generate
```

### 4. Run migrations

```bash
npx prisma migrate dev --name add_organization_and_auth
```

This creates/updates all tables from `prisma/schema.prisma` in your Postgres database.

### 5. Start the dev server

```bash
npm run dev
```

## API Endpoints

All routes are mounted under `/api/v1`.

| Method | Path | Auth required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Creates a new organization + its first user (role `ADMIN`). Sets the refresh-token cookie, returns the user + an access token. |
| `POST` | `/auth/login` | No | Verifies credentials, replaces any existing session for that user, sets a new refresh-token cookie. |
| `POST` | `/auth/logout` | No | Deletes the refresh token matching the cookie and clears it. Safe to call with no active session. |
| `POST` | `/auth/refresh` | Refresh cookie | Rotates the refresh token (old one is deleted, a new one issued) and returns a new access token. |
| `GET` | `/auth/me` | Bearer access token | Returns the authenticated user (password excluded). |
| `GET` | `/health` | No | Verifies the API and its database connection are both up. |

### Response shape

Success: `{ "success": true, "message": string, "data": T }`
Error: `{ "success": false, "message": string, "errors"?: object }` (validation errors include field-level detail; stack traces are only included outside `production`)

## Authentication Flow & Token Lifecycle

- **Access token**: a short-lived JWT (`JWT_ACCESS_EXPIRES_IN`, default 15m), returned in the response body and sent by the client as `Authorization: Bearer <token>`. Carries `{ sub: userId, organizationId, role }` — enough for the `authenticate` middleware to populate `req.user` without a database round-trip on every request.
- **Refresh token**: a long-lived (`JWT_REFRESH_EXPIRES_IN`, default 30d), cryptographically random opaque string — **not** a JWT. It's set as an `httpOnly`, `sameSite=lax` cookie scoped to `/api/v1/auth`, so client-side JS never touches it and it's only ever sent to auth endpoints.
- **Why opaque instead of a signed JWT for the refresh token**: it's stored server-side (in the `refresh_tokens` table), which is what makes immediate revocation possible — logout actually deletes the session rather than waiting for a JWT to expire.
- **What's stored in the database is a SHA-256 hash of the refresh token, never the raw value** (`lib/refreshToken.ts`). If the database were ever compromised, the stored hashes are useless without the original token the client holds in its cookie.
- **Rotation**: every call to `/auth/refresh` deletes the token it was given and issues a brand new one. A refresh token can only be used once — replaying an old one (e.g. after it's been rotated, or after logout deleted it) fails with 401.
- **Login replaces the previous session**: on login, all existing refresh tokens for that user are deleted before a new one is issued, so logging in from a new place ends the old session (one active session per user, per the spec).

## Database Relationships

- **Organization** is the multi-tenant root. `Organization.slug` is unique and auto-generated from the org name at registration (`utils/slug.ts` handles collisions by appending `-2`, `-3`, ...).
- **User** belongs to exactly one **Organization** (`organizationId`, `onDelete: Restrict` — an organization can't be deleted while it still has users). `User.email` is globally unique across all organizations.
- **RefreshToken** belongs to exactly one **User** (`onDelete: Cascade` — deleting a user cleans up their sessions automatically).
- All model IDs are UUIDs (`@default(uuid())`), not auto-increment integers, so IDs are safe to expose in URLs/tokens without leaking sequence information.
- The pre-existing `Meeting`/`Task`/`Notification`/etc. tables from the Phase 1 schema are untouched by this module. They'll gain their own `organizationId` scoping when those features are actually built (see `../docs/API_MAPPING.md`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build (`dist/server.js`) |
| `npm run typecheck` | Type-check without emitting |
| `npm run prisma:generate` | Regenerate the Prisma client after schema changes |
| `npm run prisma:migrate` | Create + apply a new migration in development |
| `npm run prisma:deploy` | Apply existing migrations (production/CI) |
| `npm run prisma:studio` | Open Prisma Studio to browse data |

## Current Status

**Phase 1:** project skeleton, Express/TypeScript/Prisma/Postgres configuration, `GET /health`.

**Phase 2 (this commit):** full Authentication + Organization module — register, login, logout, refresh, me — with multi-tenant data modeling, JWT + rotating refresh tokens, role-based middleware, and centralized Zod validation.

**Not yet built:** meetings, tasks, attendance, notifications, and file endpoints — see [`../docs/API_MAPPING.md`](../docs/API_MAPPING.md) for the full plan and build order.
