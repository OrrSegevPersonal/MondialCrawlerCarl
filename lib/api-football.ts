const BASE_URL = 'https://v3.football.api-sports.io'
const LEAGUE_ID = 1   // FIFA World Cup — confirm with GET /leagues?name=World Cup&season=2026
const SEASON = 2026

function headers() {
  return {
    'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
    'x-rapidapi-host': process.env.API_FOOTBALL_HOST ?? 'v3.football.api-sports.io',
  }
}

async function apiFetch(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: headers() })
  if (!res.ok) throw new Error(`API-Football error: ${res.status} ${path}`)
  const json = await res.json()
  return json.response
}

export async function fetchAllFixtures() {
  return apiFetch(`/fixtures?league=${LEAGUE_ID}&season=${SEASON}`)
}

export async function fetchLiveFixtures() {
  return apiFetch(`/fixtures?live=${LEAGUE_ID}`)
}

export async function fetchFixtureById(id: number) {
  const res = await apiFetch(`/fixtures?id=${id}`)
  return res[0] ?? null
}

export function parseFixture(f: Record<string, unknown>) {
  const fixture = f.fixture as Record<string, unknown>
  const league  = f.league  as Record<string, unknown>
  const teams   = f.teams   as Record<string, Record<string, unknown>>
  const goals   = f.goals   as Record<string, number | null>
  const score   = f.score   as Record<string, Record<string, number | null>>
  const status  = fixture.status as Record<string, string>

  const round = (league.round as string) ?? ''
  const stage = parseStage(round)
  const kickoff = new Date((fixture.timestamp as number) * 1000)
  const closesAt = new Date(kickoff.getTime() - 10 * 60 * 1000)

  const statusShort = status.short as string
  const isPen = statusShort === 'PEN'
  const isAet = statusShort === 'AET'
  const isFt  = statusShort === 'FT'

  let homeScore: number | null = null
  let awayScore: number | null = null
  let scoreType: string | null = null

  if (isPen) {
    homeScore = score.penalty?.home ?? null
    awayScore = score.penalty?.away ?? null
    scoreType = 'PEN'
  } else if (isAet) {
    homeScore = goals.home
    awayScore = goals.away
    scoreType = 'AET'
  } else if (isFt) {
    homeScore = goals.home
    awayScore = goals.away
    scoreType = 'FT'
  }

  const matchStatus =
    isFt || isAet || isPen ? 'finished'
    : ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'].includes(statusShort) ? 'live'
    : statusShort === 'PST' ? 'postponed'
    : 'scheduled'

  return {
    api_id:           fixture.id as number,
    home_team_api_id: (teams.home?.id as number) ?? null,
    away_team_api_id: (teams.away?.id as number) ?? null,
    home_team_name:   (teams.home?.name as string) ?? null,
    away_team_name:   (teams.away?.name as string) ?? null,
    home_team_logo:   (teams.home?.logo as string) ?? null,
    away_team_logo:   (teams.away?.logo as string) ?? null,
    kickoff_time:     kickoff.toISOString(),
    betting_closes_at: closesAt.toISOString(),
    stage,
    group_name:       round.includes('Group') ? round.split(' ').pop() ?? null : null,
    round_label:      round,
    status:           matchStatus,
    home_score:       homeScore,
    away_score:       awayScore,
    home_score_ht:    score.halftime?.home ?? null,
    away_score_ht:    score.halftime?.away ?? null,
    score_type:       scoreType,
    venue:            (fixture.venue as Record<string, string>)?.name ?? null,
  }
}

function parseStage(round: string): string {
  if (round.includes('Group'))           return 'group'
  if (round.includes('Round of 32'))     return 'r32'
  if (round.includes('Round of 16'))     return 'r16'
  if (round.includes('Quarter'))         return 'qf'
  if (round.includes('Semi'))            return 'sf'
  if (round.includes('3rd'))             return '3rd'
  if (round.includes('Final'))           return 'final'
  return 'group'
}
