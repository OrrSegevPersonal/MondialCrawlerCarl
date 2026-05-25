import MatchSlot from './MatchSlot'
import { stageLabel } from '@/lib/utils'
import type { MatchWithBet, Stage } from '@/types'

const STAGE_ORDER: Stage[] = ['r32', 'r16', 'qf', 'sf', '3rd', 'final']

export default function KnockoutBracket({ matches }: { matches: MatchWithBet[] }) {
  const byStage: Record<string, MatchWithBet[]> = {}
  for (const m of matches) {
    if (!byStage[m.stage]) byStage[m.stage] = []
    byStage[m.stage].push(m)
  }

  const stages = STAGE_ORDER.filter((s) => byStage[s]?.length)

  if (stages.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-4xl mb-3">🏆</p>
        <p>Knockout fixtures not available yet.</p>
        <p className="text-xs mt-1">Bracket fills as group stage concludes.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {stages.map((stage) => (
        <section key={stage}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {stageLabel(stage)}
            </h2>
            <div className="flex-1 h-px" style={{ background: 'var(--border-col)' }} />
          </div>
          <div className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'var(--border-col)', background: 'var(--surface)' }}>
            {byStage[stage].map((m) => (
              <MatchSlot key={m.id} match={m} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
