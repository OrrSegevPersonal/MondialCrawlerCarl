import type { MultiplierBreakdown } from '@/types'
import { formatKickoff } from '@/lib/utils'

export default function MultiplierDisplay({ breakdown }: { breakdown: MultiplierBreakdown }) {
  const { timing_multiplier, stage_multiplier, combined_multiplier, timing_label, closes_at } = breakdown

  return (
    <div className="rounded-lg border p-3 text-xs"
      style={{ background: 'var(--surface-2)', borderColor: 'var(--border-col)' }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-400">Current Multiplier</span>
        <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{combined_multiplier}×</span>
      </div>
      <div className="flex flex-col gap-1 text-slate-500">
        <div className="flex justify-between">
          <span>Stage multiplier</span>
          <span className="text-white">{stage_multiplier}×</span>
        </div>
        <div className="flex justify-between">
          <span>Timing ({timing_label})</span>
          <span className="text-white">{timing_multiplier}×</span>
        </div>
        <div className="flex justify-between pt-1 mt-1 border-t" style={{ borderColor: 'var(--border-col)' }}>
          <span>Correct exact score worth</span>
          <span className="font-bold" style={{ color: 'var(--accent)' }}>
            {Math.round(300 * combined_multiplier)} pts
          </span>
        </div>
        <div className="flex justify-between">
          <span>Correct result worth</span>
          <span className="text-white">{Math.round(100 * combined_multiplier)} pts</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t text-slate-600 text-[10px]" style={{ borderColor: 'var(--border-col)' }}>
        Betting closes {formatKickoff(closes_at)} — multiplier locked on submission
      </div>
    </div>
  )
}
