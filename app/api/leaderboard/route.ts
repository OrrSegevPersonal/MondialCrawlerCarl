import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data, error } = await db
    .from('leaderboard')
    .select('*')
    .order('rank')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ leaderboard: data })
}
