import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()

  const [{ data: matches }, { data: bets }] = await Promise.all([
    db.from('matches').select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*)
    `).order('kickoff_time'),
    db.from('bets').select('*').eq('user_id', session.id),
  ])

  const betsByMatch: Record<string, object> = {}
  for (const bet of bets ?? []) {
    betsByMatch[(bet as Record<string, string>).match_id] = bet
  }

  const matchesWithBets = (matches ?? []).map((m) => ({
    ...m,
    user_bet: betsByMatch[m.id] ?? null,
  }))

  return Response.json({ matches: matchesWithBets })
}
