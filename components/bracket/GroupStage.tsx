import GroupTable from './GroupTable'
import MatchSlot from './MatchSlot'
import type { MatchWithBet } from '@/types'

export default function GroupStage({ matches }: { matches: MatchWithBet[] }) {
  const groups: Record<string, MatchWithBet[]> = {}
  for (const m of matches) {
    const g = m.group_name ?? 'Unknown'
    if (!groups[g]) groups[g] = []
    groups[g].push(m)
  }

  if (Object.keys(groups).length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-4xl mb-3">📋</p>
        <p>Fixtures not loaded yet.</p>
        {/* Admin: trigger /api/admin/sync-fixtures to load matches */}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([group, gMatches]) => (
        <div key={group} className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--border-col)', background: 'var(--surface)' }}>
          <div className="px-3 py-2 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--border-col)' }}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Group {group}
            </h2>
          </div>
          <GroupTable matches={gMatches} />
          <div className="border-t" style={{ borderColor: 'var(--border-col)' }}>
            {gMatches.map((m) => (
              <MatchSlot key={m.id} match={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
