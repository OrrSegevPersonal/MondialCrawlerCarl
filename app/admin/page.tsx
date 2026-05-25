import { createServiceClient } from '@/lib/supabase/server'
import AdminMatchList from './AdminMatchList'
import SyncButton from './SyncButton'

export default async function AdminPage() {
  const db = createServiceClient()
  const { data: matches } = await db
    .from('matches')
    .select(`*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name)`)
    .order('kickoff_time')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-white">Match Management</h1>
        <SyncButton />
      </div>
      <AdminMatchList matches={matches ?? []} />
    </div>
  )
}
