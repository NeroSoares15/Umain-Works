import { scoreToBarColor } from '../../lib/riskUtils'
import { cn } from '../../lib/utils'
import { useAppContext } from '../../contexts/AppContext'

export function ScoreBar({ score }: { score: number }) {
  const { settings } = useAppContext()
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-umain-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', scoreToBarColor(score, settings.riskThresholds))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className="text-xs font-bold text-umain-text-muted w-7 text-right"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {score}
      </span>
    </div>
  )
}
