import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'

export const revalidate = 30

export default async function LeaderboardPage() {
  const session = await getSession()
  const db = createServiceClient()
  const { data } = await db.from('leaderboard').select('*').order('rank')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-lg font-bold text-white mb-4">🏅 Leaderboard</h1>
      <LeaderboardTable entries={data ?? []} currentUserId={session?.id ?? ''} />
    </div>
  )
}
