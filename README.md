# MeetWise AI

A production-grade rebuild of MeetWise AI — an AI meeting intelligence platform — as a React 19 + TypeScript single-page application.

This replaces the original static, multi-file HTML mockup with a proper component-driven SPA: shared design system, client-side routing, real interactive state (task toggling, transcript search, editable profile/settings forms), and route-level code splitting.

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
│   ├── ui/          # Design-system primitives (Button, GlassCard, Badge, Avatar, Toggle, Reveal, ...)
│   ├── layout/       # Route shells: MarketingLayout, AuthLayout, AppShell + sidebar
│   ├── marketing/    # Landing-page-only building blocks (navbar, footer, feature cards, backdrop)
│   └── dashboard/    # Workspace-only widgets (StatCard, DonutChart, BarChart)
├── pages/            # One component per route
├── data/mock.ts      # Sample workspace data (meetings, tasks, transcript, analytics)
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

This is a static-output Vite SPA. `vercel.json` rewrites all paths to `index.html` so client-side routes resolve correctly on direct load/refresh. Push to a Git repo and import it in Vercel, or run:

```bash
npm i -g vercel
vercel --prod
```

No environment variables or backend are required — this build ships with realistic mock data in `src/data/mock.ts`; swap that module for real API calls when wiring up a backend.
