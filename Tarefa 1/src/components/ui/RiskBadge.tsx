import { cn } from '../../lib/utils'
import { riskConfig, scoreToLevel } from '../../lib/riskUtils'
import { useAppContext } from '../../contexts/AppContext'

export function RiskBadge({ score }: { score: number }) {
  const { settings } = useAppContext()
  const level = scoreToLevel(score, settings.riskThresholds)
  const config = riskConfig[level]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[8px] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        config.color,
        config.bg
      )}
    >
      {config.label}
    </span>
  )
}
