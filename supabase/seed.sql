-- ============================================================
-- MondialCrawlerCarl · Mock Seed
-- Scenario: post-group-stage, pre-R32 snapshot
-- 4 players, 2 groups fully played, 4 R32 fixtures scheduled
--
-- After running this, call:
--   GET /api/cron/resolve-bets?secret=<CRON_SECRET>
-- to let the app calculate points. Expected leaderboard:
--   🥇 Alice  — 15,000 pts  (1 exact + 3 correct results)
--   🥈 Dani   —  3,000 pts  (1 exact + 2 correct results)
--   🥉 Carl   —  1,800 pts  (1 exact)
--    4 Bob    —    900 pts  (2 exact + 3 correct results)
-- ============================================================


-- ─── USERS ────────────────────────────────────────────────────────────────────
-- Login: username + phone (e.g. alice / +1111111111)
insert into users (id, username, phone_hash, display_name, is_admin) values
  ('a0000000-0000-0000-0000-000000000001', 'alice',
   '$2b$10$zx3/C.EQhULLjRrK9kxmV.AEPvwR3pcZYki7xkakTvw/bRvHZ6s6.',
   'Alice', false),
  ('a0000000-0000-0000-0000-000000000002', 'bob',
   '$2b$10$4uaR1TvHYsO0fA9Hc1rmJOEARJiZ1knDe0rHaiDoYIzxH6CuarK8G',
   'Bob', false),
  ('a0000000-0000-0000-0000-000000000003', 'carl',
   '$2b$10$01JgbC8h78xfA7I/b5UBuuWN8EYWDHvR8M9hYf1C72iRUDHafdAMW',
   'Carl', false),
  ('a0000000-0000-0000-0000-000000000004', 'dani',
   '$2b$10$az.6OVmFZeeeGvKwjmn81OQJQS6LWzZE8wG16GVvthccDh70tPyty',
   'Dani', false)
on conflict (username) do nothing;


-- ─── TEAMS ────────────────────────────────────────────────────────────────────
insert into teams (id, name, country_code, group_name) values
  ('b0000000-0000-0000-0000-000000000001', 'Brazil',      'BR', 'A'),
  ('b0000000-0000-0000-0000-000000000002', 'Germany',     'DE', 'A'),
  ('b0000000-0000-0000-0000-000000000003', 'France',      'FR', 'A'),
  ('b0000000-0000-0000-0000-000000000004', 'Japan',       'JP', 'A'),
  ('b0000000-0000-0000-0000-000000000005', 'Spain',       'ES', 'B'),
  ('b0000000-0000-0000-0000-000000000006', 'England',     'GB', 'B'),
  ('b0000000-0000-0000-0000-000000000007', 'Netherlands', 'NL', 'B'),
  ('b0000000-0000-0000-0000-000000000008', 'USA',         'US', 'B')
on conflict (id) do nothing;


-- ─── GROUP STAGE MATCHES (all finished) ───────────────────────────────────────
-- Group A final standings: Brazil 1st 7pts, France 2nd 5pts, Germany 3rd 4pts, Japan 4th 0pts
-- Group B final standings: Spain 1st 7pts (GD+4), England 2nd 7pts (GD+3), Netherlands 3rd 3pts, USA 4th 0pts

insert into matches (id, home_team_id, away_team_id,
                     kickoff_time, betting_closes_at,
                     stage, group_name, match_day, status,
                     home_score, away_score, score_type, round_label) values

-- Group A · Matchday 1
('c0000000-0000-0000-0000-000000000001',
 'b0000000-0000-0000-0000-000000000001',  -- Brazil
 'b0000000-0000-0000-0000-000000000002',  -- Germany
 '2026-06-14 18:00:00+00', '2026-06-14 17:50:00+00',
 'group', 'A', 1, 'finished', 2, 1, 'FT', 'Group Stage - Matchday 1'),

('c0000000-0000-0000-0000-000000000002',
 'b0000000-0000-0000-0000-000000000003',  -- France
 'b0000000-0000-0000-0000-000000000004',  -- Japan
 '2026-06-14 21:00:00+00', '2026-06-14 20:50:00+00',
 'group', 'A', 1, 'finished', 3, 1, 'FT', 'Group Stage - Matchday 1'),

-- Group A · Matchday 2
('c0000000-0000-0000-0000-000000000003',
 'b0000000-0000-0000-0000-000000000001',  -- Brazil
 'b0000000-0000-0000-0000-000000000003',  -- France
 '2026-06-19 18:00:00+00', '2026-06-19 17:50:00+00',
 'group', 'A', 2, 'finished', 1, 1, 'FT', 'Group Stage - Matchday 2'),

('c0000000-0000-0000-0000-000000000004',
 'b0000000-0000-0000-0000-000000000002',  -- Germany
 'b0000000-0000-0000-0000-000000000004',  -- Japan
 '2026-06-19 21:00:00+00', '2026-06-19 20:50:00+00',
 'group', 'A', 2, 'finished', 2, 0, 'FT', 'Group Stage - Matchday 2'),

-- Group A · Matchday 3 (simultaneous kickoffs)
('c0000000-0000-0000-0000-000000000005',
 'b0000000-0000-0000-0000-000000000002',  -- Germany
 'b0000000-0000-0000-0000-000000000003',  -- France
 '2026-06-24 20:00:00+00', '2026-06-24 19:50:00+00',
 'group', 'A', 3, 'finished', 1, 1, 'FT', 'Group Stage - Matchday 3'),

('c0000000-0000-0000-0000-000000000006',
 'b0000000-0000-0000-0000-000000000001',  -- Brazil
 'b0000000-0000-0000-0000-000000000004',  -- Japan
 '2026-06-24 20:00:00+00', '2026-06-24 19:50:00+00',
 'group', 'A', 3, 'finished', 3, 0, 'FT', 'Group Stage - Matchday 3'),

-- Group B · Matchday 1
('c0000000-0000-0000-0000-000000000007',
 'b0000000-0000-0000-0000-000000000005',  -- Spain
 'b0000000-0000-0000-0000-000000000006',  -- England
 '2026-06-15 18:00:00+00', '2026-06-15 17:50:00+00',
 'group', 'B', 1, 'finished', 0, 0, 'FT', 'Group Stage - Matchday 1'),

('c0000000-0000-0000-0000-000000000008',
 'b0000000-0000-0000-0000-000000000007',  -- Netherlands
 'b0000000-0000-0000-0000-000000000008',  -- USA
 '2026-06-15 21:00:00+00', '2026-06-15 20:50:00+00',
 'group', 'B', 1, 'finished', 2, 1, 'FT', 'Group Stage - Matchday 1'),

-- Group B · Matchday 2
('c0000000-0000-0000-0000-000000000009',
 'b0000000-0000-0000-0000-000000000006',  -- England
 'b0000000-0000-0000-0000-000000000007',  -- Netherlands
 '2026-06-20 18:00:00+00', '2026-06-20 17:50:00+00',
 'group', 'B', 2, 'finished', 2, 1, 'FT', 'Group Stage - Matchday 2'),

('c0000000-0000-0000-0000-000000000010',
 'b0000000-0000-0000-0000-000000000005',  -- Spain
 'b0000000-0000-0000-0000-000000000008',  -- USA
 '2026-06-20 21:00:00+00', '2026-06-20 20:50:00+00',
 'group', 'B', 2, 'finished', 3, 0, 'FT', 'Group Stage - Matchday 2'),

-- Group B · Matchday 3 (simultaneous kickoffs)
('c0000000-0000-0000-0000-000000000011',
 'b0000000-0000-0000-0000-000000000005',  -- Spain
 'b0000000-0000-0000-0000-000000000007',  -- Netherlands
 '2026-06-25 20:00:00+00', '2026-06-25 19:50:00+00',
 'group', 'B', 3, 'finished', 1, 0, 'FT', 'Group Stage - Matchday 3'),

('c0000000-0000-0000-0000-000000000012',
 'b0000000-0000-0000-0000-000000000006',  -- England
 'b0000000-0000-0000-0000-000000000008',  -- USA
 '2026-06-25 20:00:00+00', '2026-06-25 19:50:00+00',
 'group', 'B', 3, 'finished', 2, 0, 'FT', 'Group Stage - Matchday 3')

on conflict (id) do nothing;


-- ─── R32 FIXTURES (scheduled, betting open) ───────────────────────────────────
insert into matches (id, home_team_id, away_team_id, home_placeholder, away_placeholder,
                     kickoff_time, betting_closes_at, stage, status, round_label) values

-- Known matchups from Groups A & B
('c0000000-0000-0000-0000-000000000013',
 'b0000000-0000-0000-0000-000000000001',  -- Brazil (Group A winner)
 'b0000000-0000-0000-0000-000000000006',  -- England (Group B runner-up)
 null, null,
 '2026-07-01 18:00:00+00', '2026-07-01 17:50:00+00',
 'r32', 'scheduled', 'Round of 32'),

('c0000000-0000-0000-0000-000000000014',
 'b0000000-0000-0000-0000-000000000005',  -- Spain (Group B winner)
 'b0000000-0000-0000-0000-000000000003',  -- France (Group A runner-up)
 null, null,
 '2026-07-01 21:00:00+00', '2026-07-01 20:50:00+00',
 'r32', 'scheduled', 'Round of 32'),

('c0000000-0000-0000-0000-000000000015',
 'b0000000-0000-0000-0000-000000000002',  -- Germany (Group A 3rd, qualified as best 3rd)
 'b0000000-0000-0000-0000-000000000007',  -- Netherlands (Group B 3rd, qualified as best 3rd)
 null, null,
 '2026-07-02 18:00:00+00', '2026-07-02 17:50:00+00',
 'r32', 'scheduled', 'Round of 32'),

-- TBD matchup from groups not yet seeded
('c0000000-0000-0000-0000-000000000016',
 null, null,
 'Winner Group C', 'Runner-up Group D',
 '2026-07-02 21:00:00+00', '2026-07-02 20:50:00+00',
 'r32', 'scheduled', 'Round of 32')

on conflict (id) do nothing;


-- ─── BETS (unresolved — points_earned stays NULL) ────────────────────────────
-- After inserting, call GET /api/cron/resolve-bets?secret=CRON_SECRET
-- to have the app compute points_earned / is_correct_result / is_correct_score.

insert into bets (user_id, match_id,
                  predicted_home_score, predicted_away_score,
                  placed_at,
                  timing_multiplier, stage_multiplier, combined_multiplier) values

-- ── ALICE · timing=25 (all placed pre-tournament, May 15) ─────────────────────
-- m01 Brazil 2-1 Germany   · predict 2-1 → EXACT        → 300×25 = 7,500
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
 2, 1, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),
-- m02 France 3-1 Japan     · predict 2-1 → correct result → 100×25 = 2,500
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002',
 2, 1, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),
-- m07 Spain 0-0 England    · predict 0-1 → wrong (drew)   →       0
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007',
 0, 1, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),
-- m10 Spain 3-0 USA        · predict 2-0 → correct result → 100×25 = 2,500
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000010',
 2, 0, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),
-- m06 Brazil 3-0 Japan     · predict 2-0 → correct result → 100×25 = 2,500
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006',
 2, 0, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),

-- ── BOB · timing=1 (all last-minute, <12h before kickoff) ─────────────────────
-- m01 Brazil 2-1 Germany     · predict 1-0 → correct result → 100×1 = 100
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001',
 1, 0, '2026-06-14 16:00:00+00', 1, 1.00, 1.00),
-- m04 Germany 2-0 Japan      · predict 2-1 → correct result → 100×1 = 100
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004',
 2, 1, '2026-06-19 19:00:00+00', 1, 1.00, 1.00),
-- m09 England 2-1 Netherlands · predict 1-0 → correct result → 100×1 = 100
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000009',
 1, 0, '2026-06-20 16:00:00+00', 1, 1.00, 1.00),
-- m10 Spain 3-0 USA           · predict 3-0 → EXACT            → 300×1 = 300
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000010',
 3, 0, '2026-06-20 19:00:00+00', 1, 1.00, 1.00),
-- m12 England 2-0 USA         · predict 2-0 → EXACT            → 300×1 = 300
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000012',
 2, 0, '2026-06-25 18:00:00+00', 1, 1.00, 1.00),

-- ── CARL · mixed timing ───────────────────────────────────────────────────────
-- m01 Brazil 2-1 Germany    · predict 0-2 (Germany wins) timing=25 → wrong     →     0
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001',
 0, 2, '2026-05-10 10:00:00+00', 25, 1.00, 25.00),
-- m02 France 3-1 Japan      · predict 1-2 (Japan wins)  timing=25 → wrong     →     0
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002',
 1, 2, '2026-05-10 10:00:00+00', 25, 1.00, 25.00),
-- m09 England 2-1 Netherlands · predict 1-2 (NL wins)   timing=1  → wrong     →     0
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000009',
 1, 2, '2026-06-20 16:00:00+00', 1, 1.00, 1.00),
-- m05 Germany 1-1 France    · predict 1-1               timing=6  → EXACT     → 300×6 = 1,800
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000005',
 1, 1, '2026-06-20 10:00:00+00', 6, 1.00, 6.00),

-- ── DANI · timing=6 (all placed ~4 days before kickoff) ───────────────────────
-- m01 Brazil 2-1 Germany     · predict 2-0 → correct result → 100×6 =   600
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001',
 2, 0, '2026-06-10 10:00:00+00', 6, 1.00, 6.00),
-- m02 France 3-1 Japan       · predict 2-0 → correct result → 100×6 =   600
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002',
 2, 0, '2026-06-10 10:00:00+00', 6, 1.00, 6.00),
-- m12 England 2-0 USA        · predict 2-0 → EXACT          → 300×6 = 1,800
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000012',
 2, 0, '2026-06-21 10:00:00+00', 6, 1.00, 6.00),
-- m09 England 2-1 Netherlands · predict 1-1 → wrong (drew)  →           0
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000009',
 1, 1, '2026-06-16 10:00:00+00', 6, 1.00, 6.00)

on conflict (user_id, match_id) do nothing;
