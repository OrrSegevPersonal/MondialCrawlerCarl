import type { MatchWithBet, Team } from '@/types'

interface Standing {
  team: Team
  p: number; w: number; d: number; l: number
  gf: number; ga: number; pts: number
}

export default function GroupTable({ matches }: { matches: MatchWithBet[] }) {
  const standings: Record<string, Standing> = {}

  function ensure(team: Team) {
    if (!standings[team.id]) {
      standings[team.id] = { team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
    }
  }

  for (const m of matches) {
    if (m.status !== 'finished' || m.home_score === null || m.away_score === null) continue
    if (!m.home_team || !m.away_team) continue

    ensure(m.home_team)
    ensure(m.away_team)

    const h = standings[m.home_team.id]
    const a = standings[m.away_team.id]

    h.p++; a.p++
    h.gf += m.home_score; h.ga += m.away_score
    a.gf += m.away_score; a.ga += m.home_score

    if (m.home_score > m.away_score) { h.w++; h.pts += 3; a.l++ }
    else if (m.home_score < m.away_score) { a.w++; a.pts += 3; h.l++ }
    else { h.d++; a.d++; h.pts++; a.pts++ }
  }

  // Add teams that haven't played yet
  for (const m of matches) {
    if (m.home_team) ensure(m.home_team)
    if (m.away_team) ensure(m.away_team)
  }

  const sorted = Object.values(standings).sort((a, b) =>
    b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
  )

  if (sorted.length === 0) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500 uppercase tracking-wider">
            <th className="text-left px-3 py-1.5">Team</th>
            <th className="px-1 py-1.5">P</th>
            <th className="px-1 py-1.5">W</th>
            <th className="px-1 py-1.5">D</th>
            <th className="px-1 py-1.5">L</th>
            <th className="px-1 py-1.5">GD</th>
            <th className="px-1 py-1.5 font-bold text-white">Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr key={s.team.id}
              className="border-t"
              style={{ borderColor: 'var(--border-col)', background: i < 2 ? 'rgba(63,185,80,0.05)' : undefined }}>
              <td className="px-3 py-1.5 flex items-center gap-1.5">
                {s.team.logo_url && (
                  <img src={s.team.logo_url} alt={s.team.name} className="w-4 h-4 object-contain" />
                )}
                <span className="text-white truncate max-w-[90px]">{s.team.name}</span>
              </td>
              <td className="text-center text-slate-400 px-1 py-1.5">{s.p}</td>
              <td className="text-center text-slate-400 px-1 py-1.5">{s.w}</td>
              <td className="text-center text-slate-400 px-1 py-1.5">{s.d}</td>
              <td className="text-center text-slate-400 px-1 py-1.5">{s.l}</td>
              <td className="text-center text-slate-400 px-1 py-1.5">{s.gf - s.ga > 0 ? '+' : ''}{s.gf - s.ga}</td>
              <td className="text-center font-bold text-white px-1 py-1.5">{s.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
