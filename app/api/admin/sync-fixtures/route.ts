import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { fetchAllFixtures, parseFixture } from '@/lib/api-football'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.is_admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const db = createServiceClient()
  const fixtures = await fetchAllFixtures()
  let upserted = 0

  for (const f of fixtures ?? []) {
    const p = parseFixture(f)

    // Upsert home team
    let homeTeamId: string | null = null
    if (p.home_team_api_id) {
      const { data: ht } = await db
        .from('teams')
        .upsert({ api_id: p.home_team_api_id, name: p.home_team_name, logo_url: p.home_team_logo }, { onConflict: 'api_id' })
        .select('id')
        .single()
      homeTeamId = ht?.id ?? null
    }

    // Upsert away team
    let awayTeamId: string | null = null
    if (p.away_team_api_id) {
      const { data: at } = await db
        .from('teams')
        .upsert({ api_id: p.away_team_api_id, name: p.away_team_name, logo_url: p.away_team_logo }, { onConflict: 'api_id' })
        .select('id')
        .single()
      awayTeamId = at?.id ?? null
    }

    await db.from('matches').upsert({
      api_id:            p.api_id,
      home_team_id:      homeTeamId,
      away_team_id:      awayTeamId,
      home_placeholder:  homeTeamId ? null : p.home_team_name,
      away_placeholder:  awayTeamId ? null : p.away_team_name,
      kickoff_time:      p.kickoff_time,
      betting_closes_at: p.betting_closes_at,
      stage:             p.stage,
      group_name:        p.group_name,
      round_label:       p.round_label,
      status:            p.status,
      home_score:        p.home_score,
      away_score:        p.away_score,
      home_score_ht:     p.home_score_ht,
      away_score_ht:     p.away_score_ht,
      score_type:        p.score_type,
      venue:             p.venue,
      updated_at:        new Date().toISOString(),
    }, { onConflict: 'api_id' })

    upserted++
  }

  return Response.json({ ok: true, upserted })
}
