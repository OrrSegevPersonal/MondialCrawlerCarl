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
  ('cc929431-e6e0-45e8-96d9-d9b3fcc4b0cd', 'alice',
   '$2b$10$zx3/C.EQhULLjRrK9kxmV.AEPvwR3pcZYki7xkakTvw/bRvHZ6s6.',
   'Alice', false),
  ('ad955b3c-faa2-4d3a-8a5d-f5d2302af609', 'bob',
   '$2b$10$4uaR1TvHYsO0fA9Hc1rmJOEARJiZ1knDe0rHaiDoYIzxH6CuarK8G',
   'Bob', false),
  ('aafd7f35-40a3-40e4-b1a1-c3e8550a76ed', 'carl',
   '$2b$10$01JgbC8h78xfA7I/b5UBuuWN8EYWDHvR8M9hYf1C72iRUDHafdAMW',
   'Carl', false),
  ('cec28009-831b-4896-a7ac-1390a1332fac', 'dani',
   '$2b$10$az.6OVmFZeeeGvKwjmn81OQJQS6LWzZE8wG16GVvthccDh70tPyty',
   'Dani', false)
on conflict (username) do nothing;


-- ─── TEAMS ────────────────────────────────────────────────────────────────────
insert into teams (id, name, country_code, group_name) values
  ('d30c7687-1851-4b87-a410-9e2c0294bfef', 'Brazil',      'BR', 'A'),
  ('bf9ffcb3-fcca-4c80-a1e1-4393c6d3ce00', 'Germany',     'DE', 'A'),
  ('63793f4e-3c03-4f8e-a8d9-06bfade7120b', 'France',      'FR', 'A'),
  ('9383f301-cbe3-47b2-b7fe-26388a2c74f5', 'Japan',       'JP', 'A'),
  ('ac178280-18a7-45d6-b5cd-cf05330c547f', 'Spain',       'ES', 'B'),
  ('f1ff9ded-1475-4b5e-93f0-0c5fdd428e47', 'England',     'GB', 'B'),
  ('5aa57eaa-8ac7-49c0-aceb-f1124d54d765', 'Netherlands', 'NL', 'B'),
  ('36f14e76-baf9-4956-bf4c-9d0510a451f0', 'USA',         'US', 'B')
on conflict (id) do nothing;


-- ─── GROUP STAGE MATCHES (all finished) ───────────────────────────────────────
-- Group A final standings: Brazil 1st 7pts, France 2nd 5pts, Germany 3rd 4pts, Japan 4th 0pts
-- Group B final standings: Spain 1st 7pts (GD+4), England 2nd 7pts (GD+3), Netherlands 3rd 3pts, USA 4th 0pts

insert into matches (id, home_team_id, away_team_id,
                     kickoff_time, betting_closes_at,
                     stage, group_name, match_day, status,
                     home_score, away_score, score_type, round_label) values

-- Group A · Matchday 1
('498c21da-3683-494b-9bf5-59cd79102e27',
 'd30c7687-1851-4b87-a410-9e2c0294bfef',  -- Brazil
 'bf9ffcb3-fcca-4c80-a1e1-4393c6d3ce00',  -- Germany
 '2026-06-14 18:00:00+00', '2026-06-14 17:50:00+00',
 'group', 'A', 1, 'finished', 2, 1, 'FT', 'Group Stage - Matchday 1'),

('a686554b-4aa4-4666-89a7-9dc6753bca6e',
 '63793f4e-3c03-4f8e-a8d9-06bfade7120b',  -- France
 '9383f301-cbe3-47b2-b7fe-26388a2c74f5',  -- Japan
 '2026-06-14 21:00:00+00', '2026-06-14 20:50:00+00',
 'group', 'A', 1, 'finished', 3, 1, 'FT', 'Group Stage - Matchday 1'),

-- Group A · Matchday 2
('6dc7cbea-c6ab-47e0-aac5-e0af29a4a7c0',
 'd30c7687-1851-4b87-a410-9e2c0294bfef',  -- Brazil
 '63793f4e-3c03-4f8e-a8d9-06bfade7120b',  -- France
 '2026-06-19 18:00:00+00', '2026-06-19 17:50:00+00',
 'group', 'A', 2, 'finished', 1, 1, 'FT', 'Group Stage - Matchday 2'),

('da3a80ad-1dc4-4f8c-b85a-a8c845f78aac',
 'bf9ffcb3-fcca-4c80-a1e1-4393c6d3ce00',  -- Germany
 '9383f301-cbe3-47b2-b7fe-26388a2c74f5',  -- Japan
 '2026-06-19 21:00:00+00', '2026-06-19 20:50:00+00',
 'group', 'A', 2, 'finished', 2, 0, 'FT', 'Group Stage - Matchday 2'),

-- Group A · Matchday 3 (simultaneous kickoffs)
('b46aaea1-a51b-436d-b34e-cd694baa22b9',
 'bf9ffcb3-fcca-4c80-a1e1-4393c6d3ce00',  -- Germany
 '63793f4e-3c03-4f8e-a8d9-06bfade7120b',  -- France
 '2026-06-24 20:00:00+00', '2026-06-24 19:50:00+00',
 'group', 'A', 3, 'finished', 1, 1, 'FT', 'Group Stage - Matchday 3'),

('52c8aca7-c675-4c60-bafa-cd4cbd452770',
 'd30c7687-1851-4b87-a410-9e2c0294bfef',  -- Brazil
 '9383f301-cbe3-47b2-b7fe-26388a2c74f5',  -- Japan
 '2026-06-24 20:00:00+00', '2026-06-24 19:50:00+00',
 'group', 'A', 3, 'finished', 3, 0, 'FT', 'Group Stage - Matchday 3'),

-- Group B · Matchday 1
('a1b9552b-02e0-4d54-8b95-fe30b5c708fa',
 'ac178280-18a7-45d6-b5cd-cf05330c547f',  -- Spain
 'f1ff9ded-1475-4b5e-93f0-0c5fdd428e47',  -- England
 '2026-06-15 18:00:00+00', '2026-06-15 17:50:00+00',
 'group', 'B', 1, 'finished', 0, 0, 'FT', 'Group Stage - Matchday 1'),

('5c780447-b3df-483c-b933-c7b9c0e0bec2',
 '5aa57eaa-8ac7-49c0-aceb-f1124d54d765',  -- Netherlands
 '36f14e76-baf9-4956-bf4c-9d0510a451f0',  -- USA
 '2026-06-15 21:00:00+00', '2026-06-15 20:50:00+00',
 'group', 'B', 1, 'finished', 2, 1, 'FT', 'Group Stage - Matchday 1'),

-- Group B · Matchday 2
('131449ab-aea9-4fbe-94c5-98b2b1de3cf1',
 'f1ff9ded-1475-4b5e-93f0-0c5fdd428e47',  -- England
 '5aa57eaa-8ac7-49c0-aceb-f1124d54d765',  -- Netherlands
 '2026-06-20 18:00:00+00', '2026-06-20 17:50:00+00',
 'group', 'B', 2, 'finished', 2, 1, 'FT', 'Group Stage - Matchday 2'),

('e73477d0-b2ef-4d33-ace6-8d668205cfb3',
 'ac178280-18a7-45d6-b5cd-cf05330c547f',  -- Spain
 '36f14e76-baf9-4956-bf4c-9d0510a451f0',  -- USA
 '2026-06-20 21:00:00+00', '2026-06-20 20:50:00+00',
 'group', 'B', 2, 'finished', 3, 0, 'FT', 'Group Stage - Matchday 2'),

-- Group B · Matchday 3 (simultaneous kickoffs)
('9c52ad54-d8a6-4cb8-b5da-ad11bcab1e10',
 'ac178280-18a7-45d6-b5cd-cf05330c547f',  -- Spain
 '5aa57eaa-8ac7-49c0-aceb-f1124d54d765',  -- Netherlands
 '2026-06-25 20:00:00+00', '2026-06-25 19:50:00+00',
 'group', 'B', 3, 'finished', 1, 0, 'FT', 'Group Stage - Matchday 3'),

('59483003-888c-4e8d-9392-96a7e208be29',
 'f1ff9ded-1475-4b5e-93f0-0c5fdd428e47',  -- England
 '36f14e76-baf9-4956-bf4c-9d0510a451f0',  -- USA
 '2026-06-25 20:00:00+00', '2026-06-25 19:50:00+00',
 'group', 'B', 3, 'finished', 2, 0, 'FT', 'Group Stage - Matchday 3')

on conflict (id) do nothing;


-- ─── R32 FIXTURES (scheduled, betting open) ───────────────────────────────────
insert into matches (id, home_team_id, away_team_id, home_placeholder, away_placeholder,
                     kickoff_time, betting_closes_at, stage, status, round_label) values

('fb4607fd-e4a6-4ea5-bc19-9fa17bf08a69',
 'd30c7687-1851-4b87-a410-9e2c0294bfef',  -- Brazil (Group A winner)
 'f1ff9ded-1475-4b5e-93f0-0c5fdd428e47',  -- England (Group B runner-up)
 null, null,
 '2026-07-01 18:00:00+00', '2026-07-01 17:50:00+00',
 'r32', 'scheduled', 'Round of 32'),

('d76d52b9-215c-4b97-9b84-991928501eec',
 'ac178280-18a7-45d6-b5cd-cf05330c547f',  -- Spain (Group B winner)
 '63793f4e-3c03-4f8e-a8d9-06bfade7120b',  -- France (Group A runner-up)
 null, null,
 '2026-07-01 21:00:00+00', '2026-07-01 20:50:00+00',
 'r32', 'scheduled', 'Round of 32'),

('b8cbbf58-e701-4595-856e-ba00c34f65f2',
 'bf9ffcb3-fcca-4c80-a1e1-4393c6d3ce00',  -- Germany (best 3rd)
 '5aa57eaa-8ac7-49c0-aceb-f1124d54d765',  -- Netherlands (best 3rd)
 null, null,
 '2026-07-02 18:00:00+00', '2026-07-02 17:50:00+00',
 'r32', 'scheduled', 'Round of 32'),

('438b4571-3feb-49e7-a07a-b7df04f4b155',
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
-- Brazil 2-1 Germany   · predict 2-1 → EXACT          → 300×25 = 7,500
('cc929431-e6e0-45e8-96d9-d9b3fcc4b0cd', '498c21da-3683-494b-9bf5-59cd79102e27',
 2, 1, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),
-- France 3-1 Japan     · predict 2-1 → correct result  → 100×25 = 2,500
('cc929431-e6e0-45e8-96d9-d9b3fcc4b0cd', 'a686554b-4aa4-4666-89a7-9dc6753bca6e',
 2, 1, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),
-- Spain 0-0 England    · predict 0-1 → wrong (drew)    →           0
('cc929431-e6e0-45e8-96d9-d9b3fcc4b0cd', 'a1b9552b-02e0-4d54-8b95-fe30b5c708fa',
 0, 1, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),
-- Spain 3-0 USA        · predict 2-0 → correct result  → 100×25 = 2,500
('cc929431-e6e0-45e8-96d9-d9b3fcc4b0cd', 'e73477d0-b2ef-4d33-ace6-8d668205cfb3',
 2, 0, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),
-- Brazil 3-0 Japan     · predict 2-0 → correct result  → 100×25 = 2,500
('cc929431-e6e0-45e8-96d9-d9b3fcc4b0cd', '52c8aca7-c675-4c60-bafa-cd4cbd452770',
 2, 0, '2026-05-15 10:00:00+00', 25, 1.00, 25.00),

-- ── BOB · timing=1 (all last-minute, placed <12h before kickoff) ──────────────
-- Brazil 2-1 Germany      · predict 1-0 → correct result → 100×1 =  100
('ad955b3c-faa2-4d3a-8a5d-f5d2302af609', '498c21da-3683-494b-9bf5-59cd79102e27',
 1, 0, '2026-06-14 16:00:00+00', 1, 1.00, 1.00),
-- Germany 2-0 Japan       · predict 2-1 → correct result → 100×1 =  100
('ad955b3c-faa2-4d3a-8a5d-f5d2302af609', 'da3a80ad-1dc4-4f8c-b85a-a8c845f78aac',
 2, 1, '2026-06-19 19:00:00+00', 1, 1.00, 1.00),
-- England 2-1 Netherlands · predict 1-0 → correct result → 100×1 =  100
('ad955b3c-faa2-4d3a-8a5d-f5d2302af609', '131449ab-aea9-4fbe-94c5-98b2b1de3cf1',
 1, 0, '2026-06-20 16:00:00+00', 1, 1.00, 1.00),
-- Spain 3-0 USA           · predict 3-0 → EXACT          → 300×1 =  300
('ad955b3c-faa2-4d3a-8a5d-f5d2302af609', 'e73477d0-b2ef-4d33-ace6-8d668205cfb3',
 3, 0, '2026-06-20 19:00:00+00', 1, 1.00, 1.00),
-- England 2-0 USA         · predict 2-0 → EXACT          → 300×1 =  300
('ad955b3c-faa2-4d3a-8a5d-f5d2302af609', '59483003-888c-4e8d-9392-96a7e208be29',
 2, 0, '2026-06-25 18:00:00+00', 1, 1.00, 1.00),

-- ── CARL · mixed timing ───────────────────────────────────────────────────────
-- Brazil 2-1 Germany · predict 0-2 (Germany) timing=25 → wrong →     0
('aafd7f35-40a3-40e4-b1a1-c3e8550a76ed', '498c21da-3683-494b-9bf5-59cd79102e27',
 0, 2, '2026-05-10 10:00:00+00', 25, 1.00, 25.00),
-- France 3-1 Japan · predict 1-2 (Japan) timing=25 → wrong →         0
('aafd7f35-40a3-40e4-b1a1-c3e8550a76ed', 'a686554b-4aa4-4666-89a7-9dc6753bca6e',
 1, 2, '2026-05-10 10:00:00+00', 25, 1.00, 25.00),
-- England 2-1 Netherlands · predict 1-2 (NL) timing=1 → wrong →      0
('aafd7f35-40a3-40e4-b1a1-c3e8550a76ed', '131449ab-aea9-4fbe-94c5-98b2b1de3cf1',
 1, 2, '2026-06-20 16:00:00+00', 1, 1.00, 1.00),
-- Germany 1-1 France · predict 1-1 timing=6 → EXACT → 300×6 = 1,800
('aafd7f35-40a3-40e4-b1a1-c3e8550a76ed', 'b46aaea1-a51b-436d-b34e-cd694baa22b9',
 1, 1, '2026-06-20 10:00:00+00', 6, 1.00, 6.00),

-- ── DANI · timing=6 (placed ~4 days before each match) ────────────────────────
-- Brazil 2-1 Germany     · predict 2-0 → correct result → 100×6 =   600
('cec28009-831b-4896-a7ac-1390a1332fac', '498c21da-3683-494b-9bf5-59cd79102e27',
 2, 0, '2026-06-10 10:00:00+00', 6, 1.00, 6.00),
-- France 3-1 Japan       · predict 2-0 → correct result → 100×6 =   600
('cec28009-831b-4896-a7ac-1390a1332fac', 'a686554b-4aa4-4666-89a7-9dc6753bca6e',
 2, 0, '2026-06-10 10:00:00+00', 6, 1.00, 6.00),
-- England 2-0 USA        · predict 2-0 → EXACT          → 300×6 = 1,800
('cec28009-831b-4896-a7ac-1390a1332fac', '59483003-888c-4e8d-9392-96a7e208be29',
 2, 0, '2026-06-21 10:00:00+00', 6, 1.00, 6.00),
-- England 2-1 Netherlands · predict 1-1 → wrong          →           0
('cec28009-831b-4896-a7ac-1390a1332fac', '131449ab-aea9-4fbe-94c5-98b2b1de3cf1',
 1, 1, '2026-06-16 10:00:00+00', 6, 1.00, 6.00)

on conflict (user_id, match_id) do nothing;
