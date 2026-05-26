import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import BracketView from '@/components/bracket/BracketView'
import type { MatchWithBet, Bet } from '@/types'

export const revalidate = 60

export default async function BracketPage() {
  const session = await getSession()
  const db = createServiceClient()

  const [{ data: matches }, { data: bets }] = await Promise.all([
    db.from('matches').select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*)
    `).order('kickoff_time'),
    session ? db.from('bets').select('*').eq('user_id', session!.id) : Promise.resolve({ data: [] }),
  ])

  const betsByMatch: Record<string, Bet> = {}
  for (const bet of (bets ?? []) as Bet[]) {
    betsByMatch[bet.match_id] = bet
  }

  const matchesWithBets: MatchWithBet[] = (matches ?? []).map((m) => ({
    ...m,
    user_bet: betsByMatch[m.id] ?? null,
  }))

  return <BracketView matches={matchesWithBets} />
}
