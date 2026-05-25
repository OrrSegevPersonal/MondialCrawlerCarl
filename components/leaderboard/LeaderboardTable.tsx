import type { LeaderboardEntry } from '@/types'

const medals = ['🥇', '🥈', '🥉']

export default function LeaderboardTable({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[]
  currentUserId: string
}) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-4xl mb-3">📊</p>
        <p>No bets resolved yet. Check back after the first games!</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--border-col)', background: 'var(--surface)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-500 uppercase tracking-wider border-b"
            style={{ borderColor: 'var(--border-col)' }}>
            <th className="text-left px-4 py-3">#</th>
            <th className="text-left px-2 py-3">Player</th>
            <th className="text-right px-2 py-3">Pts</th>
            <th className="text-right px-2 py-3 hidden sm:table-cell">🎯</th>
            <th className="text-right px-4 py-3 hidden sm:table-cell">✅</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => {
            const isMe = e.user_id === currentUserId
            return (
              <tr key={e.user_id}
                className="border-b last:border-b-0 transition-colors"
                style={{
                  borderColor: 'var(--border-col)',
                  background: isMe ? 'rgba(63,185,80,0.08)' : undefined,
                }}>
                <td className="px-4 py-3 text-center text-base">
                  {medals[i] ?? <span className="text-slate-500">{e.rank}</span>}
                </td>
                <td className="px-2 py-3">
                  <span className="font-medium text-white">{e.display_name}</span>
                  {isMe && <span className="text-xs text-slate-500 ml-1">(you)</span>}
                </td>
                <td className="px-2 py-3 text-right font-bold" style={{ color: 'var(--accent)' }}>
                  {e.total_points.toLocaleString()}
                </td>
                <td className="px-2 py-3 text-right text-slate-400 hidden sm:table-cell">
                  {e.correct_scores}
                </td>
                <td className="px-4 py-3 text-right text-slate-400 hidden sm:table-cell">
                  {e.correct_results}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="px-4 py-2 border-t text-xs text-slate-600"
        style={{ borderColor: 'var(--border-col)' }}>
        🎯 Exact scores · ✅ Correct results
      </div>
    </div>
  )
}
