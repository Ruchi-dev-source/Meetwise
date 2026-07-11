# MeetWise AI — Frontend

A production-grade React 19 + TypeScript single-page application for MeetWise AI, an AI meeting intelligence platform.

Component-driven SPA: shared design system, client-side routing, real interactive state (task toggling, transcript search, editable profile/settings forms), and route-level code splitting.

This package used to be the whole repo. It's now `frontend/` inside a monorepo that also has a `backend/` API — see the [root README](../README.md) for how the two fit together.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router 7 |
| Motion | Framer Motion (scroll reveals, respects `prefers-reduced-motion`) |
| Icons | lucide-react |

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check with `tsc -b`, then produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

## Project Structure

```
src/
├── components/
│   ├── ui/          # Design-system primitives (Button, GlassCard, Avatar, Toggle, Reveal, ...)
│   ├── layout/       # Route shells: MarketingLayout, AuthLayout, AppShell + sidebar
│   ├── marketing/    # Landing-page-only building blocks (navbar, footer, feature cards, backdrop)
│   └── dashboard/    # Workspace-only widgets (StatCard, DonutChart, BarChart, TaskBoard, MiniCalendar)
├── pages/            # One component per route
├── data/mock.ts      # Sample workspace data — being replaced by real API calls, see docs/API_MAPPING.md
├── lib/              # Shared types + utilities
└── hooks/            # Shared hooks (scroll-to-top on navigation)
```

## Routes

| Path | Page |
|---|---|
| `/` | Landing page |
| `/login` | Sign in |
| `/dashboard` | Workspace home |
| `/analytics` | Analytics suite |
| `/meeting` | Meeting transcript, AI summary, action items |
| `/profile` | Personal profile & calendar integrations |
| `/settings` | Workspace, AI, notification, security, billing settings |

## Deployment

This is a static-output Vite SPA. `vercel.json` rewrites all paths to `index.html` so client-side routes resolve correctly on direct load/refresh. In Vercel, set the project's root directory to `frontend/`.

```bash
npm i -g vercel
vercel --prod
```

Currently ships with mock data in `src/data/mock.ts`. See [`docs/API_MAPPING.md`](../docs/API_MAPPING.md) at the repo root for the plan to replace it with real calls to `backend/`.
