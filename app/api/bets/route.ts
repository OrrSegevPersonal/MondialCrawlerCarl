import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { getMultiplierBreakdown } from '@/lib/scoring'
import type { Stage } from '@/types'

const schema = z.object({
  match_id: z.string().min(1),
  predicted_home_score: z.number().min(0).max(20),
  predicted_away_score: z.number().min(0).max(20),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { match_id, predicted_home_score, predicted_away_score } = parsed.data
  const db = createServiceClient()

  const { data: match } = await db
    .from('matches')
    .select('id, stage, kickoff_time, betting_closes_at, status')
    .eq('id', match_id)
    .maybeSingle()

  if (!match) return Response.json({ error: 'Match not found' }, { status: 404 })
  if (match.status === 'finished') return Response.json({ error: 'Match already finished' }, { status: 400 })

  const breakdown = getMultiplierBreakdown(match.stage as Stage, match.kickoff_time, match.betting_closes_at)
  if (!breakdown.is_open) {
    return Response.json({ error: 'Betting is closed for this match' }, { status: 400 })
  }

  const { data: existing } = await db
    .from('bets')
    .select('id')
    .eq('user_id', session.id)
    .eq('match_id', match_id)
    .maybeSingle()

  const betData = {
    user_id: session.id,
    match_id,
    predicted_home_score,
    predicted_away_score,
    placed_at: new Date().toISOString(),
    timing_multiplier: breakdown.timing_multiplier,
    stage_multiplier: breakdown.stage_multiplier,
    combined_multiplier: breakdown.combined_multiplier,
  }

  if (existing) {
    const { data, error } = await db
      .from('bets')
      .update(betData)
      .eq('id', existing.id)
      .select()
      .single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ bet: data })
  }

  const { data, error } = await db
    .from('bets')
    .insert(betData)
    .select()
    .single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ bet: data }, { status: 201 })
}
