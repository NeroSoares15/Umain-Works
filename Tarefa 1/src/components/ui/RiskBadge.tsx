import { cn } from '../../lib/utils'
import { riskConfig, scoreToLevel } from '../../lib/riskUtils'
import { useAppContext } from '../../contexts/useAppContext'

export function RiskBadge({ score }: { score: number }) {
  const { settings } = useAppContext()
  const level = scoreToLevel(score, settings.riskThresholds)
  const config = riskConfig[level]
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase border whitespace-nowrap',
      config.color, config.bg, config.border
    )}>
      {config.label}
    </span>
  )
}
