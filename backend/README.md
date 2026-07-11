# MeetWise AI — Backend

Express + TypeScript + Prisma + PostgreSQL API for MeetWise AI.

## Tech Stack

Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · JWT · bcryptjs · Zod · Helmet · CORS · Morgan · cookie-parser

## Project Structure

```
src/
├── config/       # Environment validation (Zod) + Prisma client singleton
├── controllers/  # Request handlers — parse input, call a service, send a response
├── middleware/    # Centralized error handler, 404 handler (auth/role middleware lands here in Phase 2)
├── models/       # Re-exports Prisma's generated types from one stable path
├── routes/       # Express routers, one file per resource, mounted in routes/index.ts
├── services/     # Business logic / Prisma queries — controllers stay thin
├── utils/        # ApiError, ApiResponse, asyncHandler
├── types/        # Ambient type declarations (Express Request augmentation)
├── app.ts        # Express app: middleware + routes wiring, no server startup
└── server.ts     # Entry point: connects Prisma, starts HTTP server, graceful shutdown
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
npx prisma migrate dev --name init
```

This creates all tables from `prisma/schema.prisma` in your Postgres database.

### 5. Start the dev server

```bash
npm run dev
```

Visit `http://localhost:4000/api/v1/health` — you should see:

```json
{
  "success": true,
  "message": "MeetWise API is healthy",
  "data": {
    "uptimeSeconds": 2,
    "timestamp": "...",
    "database": { "connected": true, "latencyMs": 1 }
  }
}
```

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

## Database Schema

See `prisma/schema.prisma`. Current models: `User`, `RefreshToken`, `Meeting`, `Participant`, `Attendance`, `Task`, `Notification`, `ActivityLog`, `MeetingFile`.

## API Conventions

- All routes are mounted under `/api/v1`.
- Success responses: `{ success: true, message, data }`.
- Error responses: `{ success: false, message, errors? }` (validation errors include field-level detail; stack traces only appear outside production).
- Input validation happens with Zod before a controller touches a request body.
- Async route handlers are wrapped in `asyncHandler` so thrown/rejected errors reach the centralized error handler instead of crashing the process.

## Current Status

**Phase 1 (this commit):** project skeleton, Express/TypeScript/Prisma/Postgres configuration, one real endpoint (`GET /api/v1/health`) proving the full request → service → Prisma → Postgres chain works end to end.

No auth, meetings, tasks, or notification endpoints exist yet — see [`../docs/API_MAPPING.md`](../docs/API_MAPPING.md) for the full plan and build order.
