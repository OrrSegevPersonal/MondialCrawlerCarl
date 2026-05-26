@AGENTS.md

# MondialCrawlerCarl — WC 2026 Betting App

Invite-only World Cup 2026 betting app for a friend group. Users predict match scores; points are awarded based on accuracy and a timing × stage multiplier system.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, TypeScript) — see `AGENTS.md` re: breaking changes |
| Styling | **Tailwind CSS v4** — configured via `app/globals.css` `@theme` block, no `tailwind.config.ts` |
| Database | **Supabase** (PostgreSQL + Realtime) |
| Auth | Custom JWT (cookie `session`) — no Supabase Auth |
| Match data | **API-Football v3** (RapidAPI) |
| Cron | Vercel Cron Jobs (`vercel.json`) |
| Deployment | Vercel |

---

## Key Conventions

### Next.js 16 specifics
- Route protection uses **`proxy.ts`** (not `middleware.ts` — that's deprecated). Export `proxy` not `middleware`.
- `cookies()` from `next/headers` is **async**: always `await cookies()`.
- Route handler dynamic params are a **Promise**: `const { id } = await params`.
- Use `Response.json(...)` not `NextResponse.json(...)` in route handlers.

### Auth
- Session stored in httpOnly cookie named `session` (signed JWT, 30-day expiry).
- Sessions table tracks token hashes for revocation.
- Users log in with **username + phone number** (phone is bcrypt-hashed in DB as `phone_hash`).
- Admin users created via `/admin/users`. No self-registration.
- `lib/auth.ts`: `getSession()`, `createSession()`, `deleteSession()`.

### Database
- All DB access via **service role client** (`lib/supabase/server.ts`) on the server side.
- Browser client (`lib/supabase/client.ts`) available for client components (Realtime only).
- Run `supabase/migrations/001_initial.sql` to set up schema + leaderboard view.
- `leaderboard` is a PostgreSQL **VIEW** — no manual updates needed, auto-reflects resolved bets.

### Scoring (`lib/scoring.ts`)
- **Stage multipliers**: group 1×, r32 1.5×, r16 2×, qf 3×, sf 4×, 3rd/final 5×.
- **Timing multipliers**: pre-tournament 25×, ≥7d 10×, 3–6d 6×, 1–2d 3×, 12–24h 2×, <12h 1×.
- **Points**: correct exact score = 300 × combined_mult; correct result only = 100 × combined_mult.
- Multiplier is **locked at bet placement time** and stored in `bets.combined_multiplier`.
- Betting closes 10 minutes before kickoff (`matches.betting_closes_at = kickoff - 10min`).

### Score semantics
- `matches.home_score` / `away_score` = **final result including penalty shootout**.
- `matches.score_type`: `FT` | `AET` | `PEN`.
- For PEN matches: store `score.penalty.home/away` from API-Football (the shootout score), not the regulation goals.

### Match data
- Seeded via admin: `POST /api/admin/sync-fixtures` (calls API-Football, requires `API_FOOTBALL_KEY`).
- Live sync via Vercel Cron: `GET /api/cron/sync-matches?secret=CRON_SECRET` every minute.
- Bet resolution via cron: `GET /api/cron/resolve-bets?secret=CRON_SECRET` every minute.
- API-Football WC 2026 league ID is `1` — confirm with `GET /leagues?name=World Cup&season=2026`.

---

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=                   # 32+ char random string
API_FOOTBALL_KEY=             # RapidAPI key for api-football.com
API_FOOTBALL_HOST=v3.football.api-sports.io
CRON_SECRET=                  # random string; set same in Vercel project settings
```

---

## Directory Structure

```
app/
  (app)/              # Protected app shell — session required
    bracket/          # Main view: group stage tabs + knockout bracket
      [matchId]/      # Bet placement page for a specific match
    leaderboard/      # Full leaderboard
    profile/          # Personal stats + bet history
  admin/              # Admin-only (is_admin=true)
    users/            # Create/manage users
  login/              # Login page (public)
  api/
    auth/             # login, logout
    bets/             # POST to place/update a bet
    bracket/          # GET all matches with user bets
    leaderboard/      # GET leaderboard view
    cron/             # sync-matches, resolve-bets (cron-secret protected)
    admin/            # sync-fixtures, matches PATCH, users CRUD

components/
  auth/               # LoginForm, LogoutButton
  bracket/            # BracketView, GroupStage, GroupTable, KnockoutBracket, MatchSlot
  bets/               # BetModal, MultiplierDisplay
  leaderboard/        # LeaderboardTable
  layout/             # BottomNav

lib/
  supabase/           # client.ts (browser), server.ts (service role)
  auth.ts             # JWT session helpers
  api-football.ts     # fetchAllFixtures, fetchLiveFixtures, parseFixture
  scoring.ts          # getMultiplierBreakdown, calculatePoints
  utils.ts            # formatKickoff, formatScore, stageLabel, resultColor

proxy.ts              # Route protection (Next.js 16 proxy, replaces middleware)
supabase/migrations/  # 001_initial.sql — full schema
vercel.json           # Cron job definitions
```

---

## Getting Started

1. **Set up Supabase** — create a project, run `supabase/migrations/001_initial.sql`.
2. **Copy env** — `cp .env.local.example .env.local` and fill in values.
3. **Install** — `npm install`.
4. **Dev server** — `npm run dev`.
5. **Seed fixtures** — log in as admin, go to `/admin`, click "Sync Fixtures".
6. **Add users** — go to `/admin/users`, create accounts for your friends.

---

## Common Tasks

| Task | Where |
|---|---|
| Add a user | `/admin/users` → Create User form |
| Override a match score | `/admin` → ScoreEditor inline |
| Trigger fixture sync | `/admin` → Sync Fixtures button |
| Manual cron trigger | `GET /api/cron/sync-matches?secret=CRON_SECRET` |
| Manual bet resolution | `GET /api/cron/resolve-bets?secret=CRON_SECRET` |
| Check leaderboard | `/leaderboard` |
