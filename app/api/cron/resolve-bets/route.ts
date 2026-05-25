import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { calculatePoints } from '@/lib/scoring'

function verifyCron(req: NextRequest): boolean {
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  return secret === process.env.CRON_SECRET
}

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const db = createServiceClient()

  // Fetch newly finished matches that still have unresolved bets
  const { data: matches } = await db
    .from('matches')
    .select('id, home_score, away_score')
    .eq('status', 'finished')
    .not('home_score', 'is', null)

  if (!matches?.length) return Response.json({ ok: true, resolved: 0 })

  let resolved = 0
  for (const match of matches) {
    const { data: bets } = await db
      .from('bets')
      .select('id, predicted_home_score, predicted_away_score, combined_multiplier')
      .eq('match_id', match.id)
      .is('points_earned', null)

    if (!bets?.length) continue

    for (const bet of bets) {
      const { points, correctResult, correctScore } = calculatePoints(
        bet.predicted_home_score,
        bet.predicted_away_score,
        match.home_score!,
        match.away_score!,
        Number(bet.combined_multiplier)
      )
      await db.from('bets').update({
        points_earned:     points,
        is_correct_result: correctResult,
        is_correct_score:  correctScore,
      }).eq('id', bet.id)
      resolved++
    }
  }

  return Response.json({ ok: true, resolved })
}
