import Link from 'next/link'
import { formatKickoff, formatScore, isBettingOpen, resultColor } from '@/lib/utils'
import type { MatchWithBet } from '@/types'

export default function MatchSlot({ match }: { match: MatchWithBet }) {
  const homeName = match.home_team?.name ?? match.home_placeholder ?? 'TBD'
  const awayName = match.away_team?.name ?? match.away_placeholder ?? 'TBD'
  const homeLogo = match.home_team?.logo_url
  const awayLogo = match.away_team?.logo_url
  const open = isBettingOpen(match.betting_closes_at)
  const bet = match.user_bet
  const finished = match.status === 'finished'

  const betLabel = bet
    ? `${bet.predicted_home_score}–${bet.predicted_away_score} · ${bet.combined_multiplier}×`
    : open ? 'Tap to bet' : '—'

  const betColorClass = bet && finished ? resultColor(bet) : bet ? 'text-slate-300' : open ? 'text-green-500' : 'text-slate-600'

  return (
    <Link href={`/bracket/${match.id}`}
      className="flex items-center gap-2 px-3 py-2.5 border-b last:border-b-0 hover:bg-white/5 transition-colors"
      style={{ borderColor: 'var(--border-col)' }}>
      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {homeLogo && <img src={homeLogo} alt={homeName} className="w-4 h-4 object-contain shrink-0" />}
          <span className="text-sm text-white truncate font-medium">{homeName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {awayLogo && <img src={awayLogo} alt={awayName} className="w-4 h-4 object-contain shrink-0" />}
          <span className="text-sm text-white truncate font-medium">{awayName}</span>
        </div>
      </div>

      {/* Score / time */}
      <div className="text-center shrink-0 w-16">
        {finished ? (
          <div>
            <div className="text-base font-bold text-white tabular-nums">
              {formatScore(match.home_score, match.away_score)}
            </div>
            {match.score_type && match.score_type !== 'FT' && (
              <div className="text-[10px] text-slate-500">{match.score_type}</div>
            )}
          </div>
        ) : match.status === 'live' ? (
          <div>
            <div className="text-base font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
              {formatScore(match.home_score, match.away_score)}
            </div>
            <div className="text-[10px] text-green-500">LIVE</div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 leading-tight">
            {formatKickoff(match.kickoff_time)}
          </div>
        )}
      </div>

      {/* Bet status */}
      <div className={`text-xs shrink-0 text-right w-24 ${betColorClass}`}>
        {betLabel}
        {bet && finished && bet.points_earned !== null && (
          <div className={`font-bold text-xs ${resultColor(bet)}`}>
            +{bet.points_earned} pts
          </div>
        )}
      </div>
    </Link>
  )
}
