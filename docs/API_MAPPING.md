# Frontend → Backend API Mapping

This document is the output of analyzing every page, component, form, and
mock-data source in `frontend/src` before writing any backend code. It's the
source of truth for what Phase 2+ actually needs to build — no endpoint
should be created that isn't traced back to something on this list.

## Mock data inventory

All mock data currently lives in one place: `frontend/src/data/mock.ts`,
imported by:

| File | Imports |
|---|---|
| `pages/Dashboard.tsx` | `meetings`, `actionItems`, `currentUser` |
| `pages/Analytics.tsx` | `weeklyMeetingCounts`, `topicMentions` |
| `pages/MeetingDetails.tsx` | `meetings`, `transcript`, `attendees` |
| `pages/Profile.tsx` | `currentUser` |
| `components/layout/AppSidebar.tsx` | `currentUser` |
| `components/layout/AppTopbar.tsx` | `notifications` |

No fake testimonials, client logos, or invented company names exist anywhere
in the codebase (removed in an earlier pass) — the only fabricated content
left is the structured mock data above, which is what Phase 2+ replaces.

## Screen-by-screen breakdown

### `/` — Home (marketing/landing)
Static marketing content. **No backend needed** — everything here is
product copy, not user data.

### `/login` — Login
| Element | Current behavior | Needed API |
|---|---|---|
| Email + password form | Fake-validates non-empty, then `navigate("/dashboard")` | `POST /api/v1/auth/login` |
| "Forgot?" link | Dead link (`href="#"`) | `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password` |
| Google / Microsoft buttons | Navigate straight to `/dashboard` | OAuth — out of scope unless requested; noted but not planned by default |
| "Create Workspace" link | Routes to `/dashboard` | `POST /api/v1/auth/register` |
| Session persistence | None — refreshing loses "login" entirely | `POST /api/v1/auth/refresh`, `GET /api/v1/auth/me` |

### `/dashboard` — Dashboard
| Widget | Current source | Needed API |
|---|---|---|
| "Upcoming Syncs" stat | Derived from mock `meetings` | `GET /api/v1/meetings?status=upcoming` |
| "Pending Tasks" stat | Derived from mock `actionItems` | `GET /api/v1/tasks?status=pending` |
| "Productivity Score" stat | Hardcoded `94` | Computed server-side (deferred — needs a defined formula) |
| Quick Process (file drop) | Accepts a file, stores name in local state only | `POST /api/v1/files/upload` |
| Today's Schedule | Mock `meetings` list, "Join Now" goes nowhere real | `GET /api/v1/meetings?date=today`, `POST /api/v1/meetings/:id/join` |
| Time Allocation donut | Hardcoded percentages | `GET /api/v1/dashboard/time-allocation` (derived from Attendance + Meeting duration) |
| Task Board (kanban) | Local `useState`, resets on refresh | `GET /api/v1/tasks`, `PATCH /api/v1/tasks/:id` (stage change) |
| Mini Calendar | `busyDays` is a hardcoded array | `GET /api/v1/meetings?month=` |
| Recent Summaries | Two hardcoded cards | `GET /api/v1/meetings?status=completed&limit=2` |
| Notification bell | Mock `notifications` array, "mark all read" only updates local state | `GET /api/v1/notifications`, `PATCH /api/v1/notifications/read-all` |

### `/analytics` — Analytics
| Widget | Current source | Needed API |
|---|---|---|
| "Total Meetings Processed" / "Hours Saved" | Hardcoded numbers | `GET /api/v1/dashboard/summary` |
| Sentiment score | Hardcoded `8.4/10` | Deferred — needs a sentiment source (out of scope until AI summary pipeline exists) |
| Weekly bar chart | Mock `weeklyMeetingCounts` | `GET /api/v1/dashboard/weekly-meetings` |
| Topic mentions list | Mock `topicMentions` | Deferred — needs transcript keyword extraction |

### `/meeting` — Meeting Details
| Element | Current source | Needed API |
|---|---|---|
| Meeting header (title, time, attendees) | First item of mock `meetings` | `GET /api/v1/meetings/:id` |
| AI Summary panel | Static string | `GET /api/v1/meetings/:id` (summary field) — generation itself is a later AI-integration phase |
| Transcript list + search | Mock `transcript` array, client-side filter | `GET /api/v1/meetings/:id/transcript` |
| Action items checklist | Local `useState`, resets on refresh | `GET /api/v1/tasks?meetingId=`, `PATCH /api/v1/tasks/:id` |
| Copy summary button | Copies static text to clipboard | No API needed — purely client-side |
| Audio player scrubber | Decorative, not wired to real audio | `GET /api/v1/meetings/:id/recording` (needs file storage) |

### `/profile` — Profile
| Element | Current source | Needed API |
|---|---|---|
| Personal info form (name, email, job title) | Local `useState`, edit toggle, never persisted | `GET /api/v1/users/me`, `PATCH /api/v1/users/me` |
| Company info form | Local `useState`, never persisted | `PATCH /api/v1/users/me` (or a separate `Organization` concept — deferred, not in current schema) |
| Google/Outlook "Connected" toggles | Local `useState` only | Deferred — real OAuth integration is its own phase |

### `/settings` — Settings
| Element | Current source | Needed API |
|---|---|---|
| Notification preference toggles | Local `useState`, never persisted | Needs a `UserSettings` concept — **not yet in the Phase 1 schema**, to be added when this screen is implemented |
| Security tab (password change) | Not yet functional | `POST /api/v1/auth/change-password` |
| Billing tab | Static placeholder content | Out of scope — no payments requirement given |

## What Phase 1 does NOT build

Per the incremental-phases instruction, Phase 1 only ships the backend
**skeleton**: project structure, Express/TypeScript/Prisma/Postgres
configuration, and one real vertical slice (`GET /api/v1/health`) proving
the whole chain — HTTP → middleware → service → Prisma → Postgres — works.

No auth, meetings, tasks, or notifications endpoints exist yet. Those come
in later phases, in the order the frontend actually needs them:

1. **Auth** (register/login/refresh/me) — everything else depends on
   knowing who's asking.
2. **Users/Profile** — smallest, self-contained, unblocks `/profile`.
3. **Meetings + Participants + Attendance** — unblocks Dashboard's schedule
   widget and `/meeting`.
4. **Tasks** — unblocks the kanban board and action items.
5. **Notifications** — unblocks the topbar bell for real.
6. **Files** — unblocks Quick Process upload + recordings.

`Settings`'s notification-preferences UI will need a small schema addition
(a `UserSettings` table or JSON column) that isn't in the Phase 1 schema —
flagged here rather than guessed at now.
