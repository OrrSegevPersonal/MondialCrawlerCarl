import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { resultColor, stageLabel, formatKickoff, formatScore } from '@/lib/utils'
import LogoutButton from '@/components/auth/LogoutButton'

export const revalidate = 60

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) return null

  const db = createServiceClient()

  const [{ data: bets }, { data: lb }] = await Promise.all([
    db.from('bets').select(`
      *,
      match:matches!bets_match_id_fkey(
        stage, kickoff_time, home_score, away_score, score_type,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name),
        home_placeholder, away_placeholder
      )
    `).eq('user_id', session.id).order('placed_at', { ascending: false }),
    db.from('leaderboard').select('rank, total_points, correct_scores, correct_results, bets_resolved')
      .eq('user_id', session.id).maybeSingle(),
  ])

  const stats = lb ?? { rank: '–', total_points: 0, correct_scores: 0, correct_results: 0, bets_resolved: 0 }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">{session.display_name}</h1>
          <p className="text-slate-500 text-sm">@{session.username}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Rank', value: `#${stats.rank}` },
          { label: 'Points', value: stats.total_points.toLocaleString() },
          { label: 'Exact', value: stats.correct_scores },
          { label: 'Correct', value: stats.correct_results },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-3 text-center"
            style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
            <div className="text-lg font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bet history */}
      <h2 className="text-sm font-semibold text-slate-400 mb-3">Your Bets ({bets?.length ?? 0})</h2>
      <div className="rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--border-col)', background: 'var(--surface)' }}>
        {!bets?.length ? (
          <div className="text-center py-8 text-slate-500 text-sm">No bets yet. Head to the bracket!</div>
        ) : (
          bets.map((bet) => {
            const m = bet.match as Record<string, unknown>
            const homeName = (m?.home_team as { name: string } | null)?.name ?? (m?.home_placeholder as string) ?? 'TBD'
            const awayName = (m?.away_team as { name: string } | null)?.name ?? (m?.away_placeholder as string) ?? 'TBD'
            const finished = bet.points_earned !== null

            return (
              <div key={bet.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0"
                style={{ borderColor: 'var(--border-col)' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500" suppressHydrationWarning>{stageLabel((m?.stage as string) ?? '')} · {formatKickoff((m?.kickoff_time as string) ?? '')}</div>
                  <div className="text-sm text-white font-medium truncate">{homeName} vs {awayName}</div>
                  {finished && (
                    <div className="text-xs text-slate-500">
                      Result: {formatScore(m?.home_score as number | null, m?.away_score as number | null)}
                      {(m?.score_type as string) && (m?.score_type as string) !== 'FT' && ` (${m?.score_type})`}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-white tabular-nums">
                    {bet.predicted_home_score}–{bet.predicted_away_score}
                  </div>
                  <div className="text-xs text-slate-500">{bet.combined_multiplier}×</div>
                  {finished && (
                    <div className={`text-xs font-bold ${resultColor(bet)}`}>
                      {bet.points_earned! > 0 ? `+${bet.points_earned}` : '0'} pts
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
