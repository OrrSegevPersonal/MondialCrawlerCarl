type ClassValue = string | undefined | null | false | 0

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatKickoff(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

export function formatScore(home: number | null, away: number | null): string {
  if (home === null || away === null) return '– : –'
  return `${home} : ${away}`
}

export function isBettingOpen(closesAt: string): boolean {
  return new Date() < new Date(closesAt)
}

export function stageLabel(stage: string): string {
  const labels: Record<string, string> = {
    group: 'Group Stage',
    r32:   'Round of 32',
    r16:   'Round of 16',
    qf:    'Quarter-final',
    sf:    'Semi-final',
    '3rd': '3rd Place',
    final: 'Final',
  }
  return labels[stage] ?? stage
}

export function resultColor(bet: { is_correct_score?: boolean | null; is_correct_result?: boolean | null; points_earned?: number | null }): string {
  if (bet.points_earned === null) return 'text-slate-400'
  if (bet.is_correct_score) return 'text-emerald-400'
  if (bet.is_correct_result) return 'text-yellow-400'
  return 'text-red-400'
}
