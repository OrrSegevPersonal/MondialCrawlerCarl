'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatKickoff, stageLabel } from '@/lib/utils'

interface Match {
  id: string
  stage: string
  kickoff_time: string
  status: string
  home_score: number | null
  away_score: number | null
  score_type: string | null
  home_team?: { name: string } | null
  away_team?: { name: string } | null
  home_placeholder?: string | null
  away_placeholder?: string | null
}

function ScoreEditor({ match }: { match: Match }) {
  const router = useRouter()
  const [h, setH] = useState(match.home_score ?? 0)
  const [a, setA] = useState(match.away_score ?? 0)
  const [type, setType] = useState<'FT' | 'AET' | 'PEN'>(match.score_type as 'FT' | 'AET' | 'PEN' ?? 'FT')
  const [status, setStatus] = useState(match.status)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/matches/${match.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_score: h, away_score: a, score_type: type, status }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select value={status} onChange={(e) => setStatus(e.target.value)}
        className="text-xs rounded px-2 py-1 border text-white"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)' }}>
        <option value="scheduled">Scheduled</option>
        <option value="live">Live</option>
        <option value="finished">Finished</option>
        <option value="postponed">Postponed</option>
      </select>
      <input type="number" min={0} max={20} value={h} onChange={(e) => setH(+e.target.value)}
        className="w-12 text-xs rounded px-2 py-1 text-center border text-white"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)' }} />
      <span className="text-slate-500">–</span>
      <input type="number" min={0} max={20} value={a} onChange={(e) => setA(+e.target.value)}
        className="w-12 text-xs rounded px-2 py-1 text-center border text-white"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)' }} />
      <select value={type} onChange={(e) => setType(e.target.value as 'FT' | 'AET' | 'PEN')}
        className="text-xs rounded px-2 py-1 border text-white"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)' }}>
        <option value="FT">FT</option>
        <option value="AET">AET</option>
        <option value="PEN">PEN</option>
      </select>
      <button onClick={save} disabled={saving}
        className="text-xs px-2 py-1 rounded font-semibold text-black disabled:opacity-50"
        style={{ background: 'var(--accent)' }}>
        {saving ? '…' : 'Save'}
      </button>
    </div>
  )
}

export default function AdminMatchList({ matches }: { matches: Match[] }) {
  if (!matches.length) {
    return <p className="text-slate-500 text-sm text-center py-8">No matches. Click Sync Fixtures to load.</p>
  }

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--border-col)', background: 'var(--surface)' }}>
      {matches.map((m) => {
        const homeName = m.home_team?.name ?? m.home_placeholder ?? 'TBD'
        const awayName = m.away_team?.name ?? m.away_placeholder ?? 'TBD'
        return (
          <div key={m.id} className="border-b last:border-b-0 px-4 py-3"
            style={{ borderColor: 'var(--border-col)' }}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="min-w-0">
                <div className="text-xs text-slate-500">{stageLabel(m.stage)} · {formatKickoff(m.kickoff_time)}</div>
                <div className="text-sm text-white font-medium">{homeName} vs {awayName}</div>
              </div>
              <ScoreEditor match={m} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
