-- World Cup 2026 Betting App — initial schema

create table users (
  id           uuid primary key default gen_random_uuid(),
  username     text unique not null,
  phone_hash   text not null,
  display_name text not null,
  avatar_url   text,
  is_admin     boolean default false,
  created_at   timestamptz default now()
);

create table sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create table teams (
  id           uuid primary key default gen_random_uuid(),
  api_id       int unique,
  name         text not null,
  country_code text,
  logo_url     text,
  group_name   text
);

create table matches (
  id                uuid primary key default gen_random_uuid(),
  api_id            int unique,
  home_team_id      uuid references teams(id),
  away_team_id      uuid references teams(id),
  home_placeholder  text,
  away_placeholder  text,
  kickoff_time      timestamptz not null,
  betting_closes_at timestamptz not null,
  stage             text not null,
  group_name        text,
  match_day         int,
  status            text default 'scheduled',
  home_score        int,
  away_score        int,
  home_score_ht     int,
  away_score_ht     int,
  score_type        text,
  venue             text,
  round_label       text,
  updated_at        timestamptz default now()
);

create table bets (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references users(id) on delete cascade,
  match_id             uuid references matches(id) on delete cascade,
  predicted_home_score int not null,
  predicted_away_score int not null,
  placed_at            timestamptz default now(),
  timing_multiplier    numeric(5,2) not null,
  stage_multiplier     numeric(5,2) not null,
  combined_multiplier  numeric(5,2) not null,
  points_earned        int,
  is_correct_result    boolean,
  is_correct_score     boolean,
  unique(user_id, match_id)
);

-- Indexes
create index on sessions(token_hash);
create index on bets(user_id);
create index on bets(match_id);
create index on matches(status);
create index on matches(kickoff_time);

-- Leaderboard view
create or replace view leaderboard as
select
  u.id          as user_id,
  u.display_name,
  u.username,
  u.avatar_url,
  coalesce(sum(b.points_earned), 0)          as total_points,
  count(b.id) filter (where b.points_earned is not null) as bets_resolved,
  count(b.id) filter (where b.is_correct_result = true) as correct_results,
  count(b.id) filter (where b.is_correct_score = true)  as correct_scores,
  rank() over (order by coalesce(sum(b.points_earned), 0) desc) as rank
from users u
left join bets b on b.user_id = u.id
where u.is_admin = false
group by u.id, u.display_name, u.username, u.avatar_url;
