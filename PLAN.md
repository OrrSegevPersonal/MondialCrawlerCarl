# MondialCrawlerCarl — Work Plan

## Status: In Progress
Last updated: 2026-05-30

---

## Done ✅

### Core app
- [x] Next.js 16 scaffold (App Router, TypeScript, Tailwind v4)
- [x] Supabase schema (`supabase/migrations/001_initial.sql`) — users, sessions, teams, matches, bets, leaderboard view
- [x] Custom JWT auth (username + phone bcrypt hash, httpOnly cookie, 30-day sessions)
- [x] Route protection via `proxy.ts` (Next.js 16 pattern)
- [x] Admin panel — user creation, fixture sync button, score editor
- [x] Bracket view — group stage tabs + knockout bracket, `GroupTable` standings
- [x] Bet placement — score steppers, live multiplier breakdown, `BetModal`
- [x] Leaderboard page
- [x] Profile page — personal bet history
- [x] Bottom nav (mobile)
- [x] Scoring engine (`lib/scoring.ts`) — timing × stage multipliers, locked at placement
- [x] Cron routes — `sync-matches`, `resolve-bets`
- [x] `lib/api-football.ts` — parser written for API-Football v3 response shape

### Fixes shipped
- [x] Zod v4 breaking change — `z.string().uuid()` rejected non-RFC-4122 UUIDs → relaxed to `z.string()`
- [x] `z.number().int()` → `z.number()` (Zod v4 removed `.int()` from ZodNumber)
- [x] Bet chip on match slot now shows predicted winner name (not just score)

### Mock data & testing
- [x] `supabase/seed.sql` — post-group-stage snapshot, 4 players (alice/bob/carl/dani)
- [x] Leaderboard validated: Alice 15k → Dani 3k → Carl 1.8k → Bob 900 ✓
- [x] Bet placement end-to-end tested ✓

---

## In Progress 🔄

### Football API integration
- [ ] **Switch data source** from `v3.football.api-sports.io` to `free-api-live-football-data.p.rapidapi.com`
  - API key: `114d42b5b1msh361dbc4348311a6p1e638bjsn8c66acc51d96`
  - Blocker: need to see response JSON shape from RapidAPI playground to adapt `parseFixture()` and `fetchAllFixtures()`
  - Action: user to paste a sample fixture response from RapidAPI test console

---

## Up Next 📋

- [ ] Verify WC 2026 league/competition ID in the new API
- [ ] Update `lib/api-football.ts` — new host, new response parser
- [ ] Test `POST /api/admin/sync-fixtures` with real API key → confirm matches upsert correctly
- [ ] Test live cron (`sync-matches`) against a live or recent match
- [ ] Confirm `match_day` parsing works for group stage rounds
- [ ] Deploy to Vercel — set env vars, confirm cron jobs register
- [ ] Merge PR #6

---

## Open Questions

- What is the WC 2026 competition/league ID in the new API?
- Does the new API support live fixture polling (needed for cron)?
- Free tier request limits — enough for every-minute cron during matches?

---

## Credentials & Config (dev only)

| Thing | Value |
|---|---|
| Mock users | alice/+1111111111, bob/+2222222222, carl/+3333333333, dani/+4444444444 |
| RapidAPI key | `114d42b5b1msh361dbc4348311a6p1e638bjsn8c66acc51d96` |
| New API host | `free-api-live-football-data.p.rapidapi.com` |
| PR | [#6 on GitHub](https://github.com/OrrSegevPersonal/MondialCrawlerCarl/pull/6) |
| Dev branch | `claude/claude-md-docs-51NBm` |
