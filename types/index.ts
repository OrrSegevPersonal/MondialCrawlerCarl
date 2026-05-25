export type Stage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | '3rd' | 'final'
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed'
export type ScoreType = 'FT' | 'AET' | 'PEN'

export interface User {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  is_admin: boolean
  created_at: string
}

export interface Team {
  id: string
  api_id: number | null
  name: string
  country_code: string | null
  logo_url: string | null
  group_name: string | null
}

export interface Match {
  id: string
  api_id: number | null
  home_team_id: string | null
  away_team_id: string | null
  home_placeholder: string | null
  away_placeholder: string | null
  kickoff_time: string
  betting_closes_at: string
  stage: Stage
  group_name: string | null
  match_day: number | null
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  home_score_ht: number | null
  away_score_ht: number | null
  score_type: ScoreType | null
  venue: string | null
  round_label: string | null
  updated_at: string
  home_team?: Team | null
  away_team?: Team | null
}

export interface Bet {
  id: string
  user_id: string
  match_id: string
  predicted_home_score: number
  predicted_away_score: number
  placed_at: string
  timing_multiplier: number
  stage_multiplier: number
  combined_multiplier: number
  points_earned: number | null
  is_correct_result: boolean | null
  is_correct_score: boolean | null
}

export interface LeaderboardEntry {
  user_id: string
  display_name: string
  username: string
  avatar_url: string | null
  total_points: number
  bets_resolved: number
  correct_results: number
  correct_scores: number
  rank: number
}

export interface MultiplierBreakdown {
  timing_multiplier: number
  stage_multiplier: number
  combined_multiplier: number
  timing_label: string
  closes_at: string
  is_open: boolean
}

export interface MatchWithBet extends Match {
  user_bet?: Bet | null
}

export interface SessionUser {
  id: string
  username: string
  display_name: string
  is_admin: boolean
}
