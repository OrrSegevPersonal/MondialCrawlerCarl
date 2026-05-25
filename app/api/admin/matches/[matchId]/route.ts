import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  home_score: z.number().int().min(0).optional(),
  away_score: z.number().int().min(0).optional(),
  score_type: z.enum(['FT', 'AET', 'PEN']).optional(),
  status: z.enum(['scheduled', 'live', 'finished', 'postponed']).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await getSession()
  if (!session?.is_admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { matchId } = await params
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

  const db = createServiceClient()
  const { data, error } = await db
    .from('matches')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', matchId)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ match: data })
}
