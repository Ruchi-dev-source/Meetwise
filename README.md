# MeetWise AI

An AI meeting intelligence platform — meeting summaries, attendance tracking, task assignment, and analytics for teams. Monorepo with a React frontend and an Express/Prisma/PostgreSQL backend.

```
MeetWise/
├── frontend/    # React 19 + TypeScript + Vite SPA — see frontend/README.md
├── backend/     # Express + TypeScript + Prisma + PostgreSQL API — see backend/README.md
├── docs/
│   └── API_MAPPING.md   # Every frontend screen mapped to the API it needs
├── docker-compose.yml    # Postgres + backend for local development
└── README.md    # you are here
```

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env      # then fill in real secrets, see backend/README.md
docker compose up -d postgres   # from repo root, or point DATABASE_URL at your own Postgres
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev                # http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

Full setup details, scripts, and troubleshooting live in each package's own README.

## Project Status

This project is being built in phases — see [`docs/API_MAPPING.md`](docs/API_MAPPING.md) for the complete frontend-to-API mapping and the planned build order.

**Phase 1 (current):** Backend project skeleton — Express, TypeScript, Prisma, and PostgreSQL configured and verified end-to-end via a real health-check endpoint. The frontend is untouched functionally; it was only relocated into `frontend/` as part of this restructuring, and still runs entirely on mock data pending later phases.

**Not yet built:** authentication, meetings, tasks, attendance, notifications, and file upload endpoints. The frontend still uses mock data in `frontend/src/data/mock.ts` until those land.

## Tech Stack

| | |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Framer Motion |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcryptjs, Zod |
| **Infra** | Docker Compose (Postgres + backend), Vercel (frontend hosting) |
