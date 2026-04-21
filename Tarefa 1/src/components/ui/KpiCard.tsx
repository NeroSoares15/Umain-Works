import { Card } from './Card'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  className?: string
  iconColor?: string
  iconBg?: string
  accentColor?: string
  subtitleTone?: 'neutral' | 'positive' | 'negative'
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
  iconColor = 'text-[#c5663b]',
  iconBg = 'bg-[#fbefe8]',
  accentColor = 'bg-[#c5663b]',
  subtitleTone = 'neutral',
}: KpiCardProps) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('pt-PT') : value
  const subtitleClassName =
    subtitleTone === 'positive'
      ? 'text-[#2ea44f]'
      : subtitleTone === 'negative'
        ? 'text-[#db3d31]'
        : 'text-[#4d4a46]'

  return (
    <Card className={cn('relative h-full overflow-hidden', className)}>
      <span className={cn('absolute inset-y-0 left-0 w-[3px]', accentColor)} />

      <div className="flex h-full flex-col p-4 pl-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <p className="text-[12.5px] font-medium text-[#4f4b46]">{title}</p>
          <div className={cn('grid h-8 w-8 place-items-center rounded-sm', iconBg)}>
            <Icon className={cn('h-4 w-4', iconColor)} />
          </div>
        </div>

        <div className="mt-auto">
          <p
            className="text-[40px] font-semibold leading-none tracking-tight text-[#232321]"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formattedValue}
          </p>

          {subtitle ? <p className={cn('mt-3 text-[11px] font-medium', subtitleClassName)}>{subtitle}</p> : null}
        </div>
      </div>
    </Card>
  )
}
