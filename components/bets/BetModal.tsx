'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MultiplierDisplay from './MultiplierDisplay'
import { formatKickoff, stageLabel, resultColor } from '@/lib/utils'
import type { Match, Bet, MultiplierBreakdown } from '@/types'

interface Props {
  match: Match & { home_team?: { name: string; logo_url?: string } | null; away_team?: { name: string; logo_url?: string } | null }
  existingBet: Bet | null
  breakdown: MultiplierBreakdown
}

function ScoreStepper({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={disabled || value <= 0}
        className="w-9 h-9 rounded-lg text-xl font-bold flex items-center justify-center transition-opacity disabled:opacity-30"
        style={{ background: 'var(--surface-2)', color: 'var(--foreground)' }}>
        −
      </button>
      <span className="w-10 text-center text-2xl font-bold tabular-nums text-white">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(20, value + 1))} disabled={disabled}
        className="w-9 h-9 rounded-lg text-xl font-bold flex items-center justify-center transition-opacity disabled:opacity-30"
        style={{ background: 'var(--surface-2)', color: 'var(--foreground)' }}>
        +
      </button>
    </div>
  )
}

export default function BetModal({ match, existingBet, breakdown }: Props) {
  const router = useRouter()
  const [homeScore, setHomeScore] = useState(existingBet?.predicted_home_score ?? 1)
  const [awayScore, setAwayScore] = useState(existingBet?.predicted_away_score ?? 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const homeName = match.home_team?.name ?? match.home_placeholder ?? 'TBD'
  const awayName = match.away_team?.name ?? match.away_placeholder ?? 'TBD'
  const homeLogo = match.home_team?.logo_url
  const awayLogo = match.away_team?.logo_url
  const isOpen = breakdown.is_open
  const finished = match.status === 'finished'

  const predictedResult = homeScore > awayScore ? `${homeName} wins` : awayScore > homeScore ? `${awayName} wins` : 'Draw'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isOpen) return
    setError('')
    setLoading(true)

    const res = await fetch('/api/bets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match_id: match.id, predicted_home_score: homeScore, predicted_away_score: awayScore }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Failed to place bet')
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/bracket'), 800)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Match header */}
      <div className="rounded-xl border p-4 text-center"
        style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
        <div className="text-xs text-slate-500 mb-3" suppressHydrationWarning>
          {stageLabel(match.stage)} · {formatKickoff(match.kickoff_time)}
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1 flex-1">
            {homeLogo && <img src={homeLogo} alt={homeName} className="w-10 h-10 object-contain" />}
            <span className="text-sm font-bold text-white text-center leading-tight">{homeName}</span>
          </div>
          <div className="text-slate-500 font-bold text-lg">vs</div>
          <div className="flex flex-col items-center gap-1 flex-1">
            {awayLogo && <img src={awayLogo} alt={awayName} className="w-10 h-10 object-contain" />}
            <span className="text-sm font-bold text-white text-center leading-tight">{awayName}</span>
          </div>
        </div>

        {/* Actual score if finished */}
        {finished && match.home_score !== null && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-col)' }}>
            <div className="text-2xl font-bold tabular-nums text-white">
              {match.home_score} – {match.away_score}
              {match.score_type && match.score_type !== 'FT' && (
                <span className="text-sm text-slate-400 ml-2">{match.score_type}</span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Final Score</div>
          </div>
        )}
      </div>

      {/* Existing bet result */}
      {existingBet && finished && existingBet.points_earned !== null && (
        <div className={`rounded-xl border p-4 text-center ${resultColor(existingBet)}`}
          style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
          <div className="text-2xl font-bold">
            {existingBet.is_correct_score ? '🎯 Exact Score!' : existingBet.is_correct_result ? '✅ Correct Result' : '❌ Wrong'}
          </div>
          <div className="text-sm mt-1">
            Your bet: {existingBet.predicted_home_score}–{existingBet.predicted_away_score}
          </div>
          <div className="text-lg font-bold mt-1">
            +{existingBet.points_earned} pts
            <span className="text-xs text-slate-400 ml-2">({existingBet.combined_multiplier}× multiplier)</span>
          </div>
        </div>
      )}

      {/* Bet form */}
      <form onSubmit={handleSubmit}
        className="rounded-xl border p-4"
        style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
        <h3 className="text-sm font-semibold text-slate-400 mb-4 text-center">
          {finished ? 'Your prediction was:' : existingBet ? 'Update your prediction' : 'Enter your prediction'}
        </h3>

        <div className="flex items-center justify-center gap-6 mb-5">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 text-center">{homeName}</span>
            <ScoreStepper value={homeScore} onChange={setHomeScore} disabled={!isOpen || finished} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-slate-600 font-bold text-xl">–</span>
            {isOpen && !finished && (
              <div className="text-xs text-slate-500 mt-1 text-center max-w-20">{predictedResult}</div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 text-center">{awayName}</span>
            <ScoreStepper value={awayScore} onChange={setAwayScore} disabled={!isOpen || finished} />
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mb-4">
          Final score including extra time & penalties if applicable
        </div>

        {!finished && <MultiplierDisplay breakdown={breakdown} />}

        {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center mt-3">Bet placed! ✓</p>}

        {isOpen && !finished && (
          <button type="submit" disabled={loading}
            className="w-full mt-4 py-3 rounded-lg font-bold text-black transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)' }}>
            {loading ? 'Placing…' : existingBet ? 'Update Bet' : 'Place Bet'}
          </button>
        )}

        {!isOpen && !finished && (
          <div className="text-center text-sm text-slate-500 mt-2">Betting closed for this match</div>
        )}
      </form>
    </div>
  )
}
