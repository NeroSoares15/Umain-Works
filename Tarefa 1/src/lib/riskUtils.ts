export type RiskLevel = 'none' | 'low' | 'medium' | 'high'

export function scoreToLevel(score: number, thresholds = { none: 20, low: 40, medium: 60 }): RiskLevel {
  if (score <= thresholds.none) return 'none'
  if (score <= thresholds.low) return 'low'
  if (score <= thresholds.medium) return 'medium'
  return 'high'
}

export const riskConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  none: { label: 'Sem Risco', color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/50' },
  low: { label: 'Risco Baixo', color: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-800/50' },
  medium: { label: 'Risco Médio', color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/50' },
  high: { label: 'Risco Alto', color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-800/50' },
}

export function scoreToBarColor(score: number, thresholds = { none: 20, low: 40, medium: 60 }): string {
  const level = scoreToLevel(score, thresholds)
  if (level === 'none') return 'bg-emerald-500'
  if (level === 'low') return 'bg-blue-500'
  if (level === 'medium') return 'bg-amber-500'
  return 'bg-red-500'
}
