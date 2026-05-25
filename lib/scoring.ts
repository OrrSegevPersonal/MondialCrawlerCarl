import type { Stage, MultiplierBreakdown } from '@/types'

const TOURNAMENT_START = new Date('2026-06-11T00:00:00Z')

const STAGE_MULTIPLIERS: Record<Stage, number> = {
  group: 1.0,
  r32:   1.5,
  r16:   2.0,
  qf:    3.0,
  sf:    4.0,
  '3rd': 5.0,
  final: 5.0,
}

export function getTimingMultiplier(now: Date, kickoff: Date): number {
  if (now < TOURNAMENT_START) return 25

  const hoursUntil = (kickoff.getTime() - now.getTime()) / 3600000

  if (hoursUntil >= 7 * 24)  return 10
  if (hoursUntil >= 3 * 24)  return 6
  if (hoursUntil >= 1 * 24)  return 3
  if (hoursUntil >= 12)       return 2
  if (hoursUntil >= 10 / 60) return 1
  return 0 // betting closed
}

export function getTimingLabel(now: Date, kickoff: Date): string {
  if (now < TOURNAMENT_START) return 'Pre-tournament'
  const hoursUntil = (kickoff.getTime() - now.getTime()) / 3600000
  if (hoursUntil >= 7 * 24)  return '>7 days before'
  if (hoursUntil >= 3 * 24)  return '3–6 days before'
  if (hoursUntil >= 1 * 24)  return '1–2 days before'
  if (hoursUntil >= 12)       return '12–24h before'
  if (hoursUntil >= 10 / 60) return '<12h before'
  return 'Closed'
}

export function getMultiplierBreakdown(
  stage: Stage,
  kickoffTime: string,
  closesAt: string,
  now = new Date()
): MultiplierBreakdown {
  const kickoff = new Date(kickoffTime)
  const closes = new Date(closesAt)
  const isOpen = now < closes
  const timingMult = isOpen ? getTimingMultiplier(now, kickoff) : 0
  const stageMult = STAGE_MULTIPLIERS[stage]

  return {
    timing_multiplier: timingMult,
    stage_multiplier: stageMult,
    combined_multiplier: parseFloat((timingMult * stageMult).toFixed(2)),
    timing_label: getTimingLabel(now, kickoff),
    closes_at: closesAt,
    is_open: isOpen && timingMult > 0,
  }
}

export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
  combinedMultiplier: number
): { points: number; correctResult: boolean; correctScore: boolean } {
  const predictedResult = Math.sign(predictedHome - predictedAway)
  const actualResult = Math.sign(actualHome - actualAway)
  const correctResult = predictedResult === actualResult
  const correctScore = predictedHome === actualHome && predictedAway === actualAway

  if (correctScore) {
    return { points: Math.round(300 * combinedMultiplier), correctResult: true, correctScore: true }
  }
  if (correctResult) {
    return { points: Math.round(100 * combinedMultiplier), correctResult: true, correctScore: false }
  }
  return { points: 0, correctResult: false, correctScore: false }
}

export { STAGE_MULTIPLIERS }
