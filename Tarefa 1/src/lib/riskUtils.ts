export type RiskLevel = 'none' | 'low' | 'medium' | 'high'

export function scoreToLevel(score: number, thresholds = { none: 20, low: 40, medium: 60 }): RiskLevel {
  if (score <= thresholds.none) return 'none'
  if (score <= thresholds.low) return 'low'
  if (score <= thresholds.medium) return 'medium'
  return 'high'
}

export const riskConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  none: { label: 'Sem Risco', color: 'text-[#2a8844]', bg: 'bg-[#e8f6eb]', border: 'border-[#cae7d1]' },
  low: { label: 'Risco Baixo', color: 'text-[#8f4d32]', bg: 'bg-[#fbefe8]', border: 'border-[#edd3c7]' },
  medium: { label: 'Risco Médio', color: 'text-[#966b16]', bg: 'bg-[#fbf1d4]', border: 'border-[#eedcaf]' },
  high: { label: 'Risco Alto', color: 'text-[#ae3c3c]', bg: 'bg-[#fde7e5]', border: 'border-[#f2d2cf]' },
}

export function scoreToBarColor(score: number, thresholds = { none: 20, low: 40, medium: 60 }): string {
  const level = scoreToLevel(score, thresholds)
  if (level === 'none') return 'bg-[#2a9f4b]'
  if (level === 'low') return 'bg-[#c1633d]'
  if (level === 'medium') return 'bg-[#e7a92a]'
  return 'bg-[#e72a2a]'
}
