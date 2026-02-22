export type RiskLevel = 'none' | 'low' | 'medium' | 'high'

export function scoreToLevel(score: number): RiskLevel {
  if (score <= 20) return 'none'
  if (score <= 40) return 'low'
  if (score <= 60) return 'medium'
  return 'high'
}

export const riskConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  none: { label: 'Sem Risco', color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/50' },
  low: { label: 'Risco Baixo', color: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-800/50' },
  medium: { label: 'Risco Médio', color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/50' },
  high: { label: 'Risco Alto', color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-800/50' },
}

export function scoreToBarColor(score: number): string {
  const level = scoreToLevel(score)
  if (level === 'none') return 'bg-emerald-500'
  if (level === 'low') return 'bg-blue-500'
  if (level === 'medium') return 'bg-amber-500'
  return 'bg-red-500'
}
