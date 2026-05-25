import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { getMultiplierBreakdown } from '@/lib/scoring'
import BetModal from '@/components/bets/BetModal'
import type { Stage } from '@/types'

export default async function BetPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params
  const session = await getSession()
  if (!session) redirect('/login')

  const db = createServiceClient()
  const { data: match } = await db
    .from('matches')
    .select(`*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)`)
    .eq('id', matchId)
    .maybeSingle()

  if (!match) notFound()

  const { data: bet } = await db
    .from('bets')
    .select('*')
    .eq('user_id', session.id)
    .eq('match_id', matchId)
    .maybeSingle()

  const breakdown = getMultiplierBreakdown(match.stage as Stage, match.kickoff_time, match.betting_closes_at)

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <BetModal match={match} existingBet={bet} breakdown={breakdown} />
    </div>
  )
}
