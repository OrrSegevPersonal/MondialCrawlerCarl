import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { fetchLiveFixtures, fetchAllFixtures, parseFixture } from '@/lib/api-football'

function verifyCron(req: NextRequest): boolean {
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  return secret === process.env.CRON_SECRET
}

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const db = createServiceClient()

  // Check if any match is live or starting soon (within 2h) to decide fetch strategy
  const { data: upcoming } = await db
    .from('matches')
    .select('id')
    .in('status', ['live', 'scheduled'])
    .lt('kickoff_time', new Date(Date.now() + 2 * 3600000).toISOString())
    .limit(1)

  const fixtures = upcoming?.length
    ? await fetchLiveFixtures()
    : await fetchAllFixtures()

  let updated = 0
  for (const f of fixtures ?? []) {
    const parsed = parseFixture(f)
    const { error } = await db
      .from('matches')
      .update({
        status:       parsed.status,
        home_score:   parsed.home_score,
        away_score:   parsed.away_score,
        home_score_ht: parsed.home_score_ht,
        away_score_ht: parsed.away_score_ht,
        score_type:   parsed.score_type,
        updated_at:   new Date().toISOString(),
      })
      .eq('api_id', parsed.api_id)
    if (!error) updated++
  }

  return Response.json({ ok: true, updated })
}
