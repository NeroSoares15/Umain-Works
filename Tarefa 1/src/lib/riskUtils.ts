export type RiskLevel = 'none' | 'low' | 'medium' | 'high'

export function scoreToLevel(score: number, thresholds = { none: 20, low: 40, medium: 60 }): RiskLevel {
  if (score <= thresholds.none) return 'none'
  if (score <= thresholds.low) return 'low'
  if (score <= thresholds.medium) return 'medium'
  return 'high'
}

export const riskConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  none: { label: 'Sem Risco', color: 'text-[#2c7b42]', bg: 'bg-[#e8f6eb]', border: 'border-[#cae7d1]' },
  low: { label: 'Risco Baixo', color: 'text-[#8d5f39]', bg: 'bg-[#f7ece1]', border: 'border-[#ebdac7]' },
  medium: { label: 'Risco Medio', color: 'text-[#8f6b1f]', bg: 'bg-[#fbf1d4]', border: 'border-[#eedcaf]' },
  high: { label: 'Risco Alto', color: 'text-[#a34a44]', bg: 'bg-[#fde7e5]', border: 'border-[#f2d2cf]' },
}

export function scoreToBarColor(score: number, thresholds = { none: 20, low: 40, medium: 60 }): string {
  const level = scoreToLevel(score, thresholds)
  if (level === 'none') return 'bg-[#2f9d49]'
  if (level === 'low') return 'bg-[#bf623b]'
  if (level === 'medium') return 'bg-[#d8a127]'
  return 'bg-[#e02b2b]'
}
