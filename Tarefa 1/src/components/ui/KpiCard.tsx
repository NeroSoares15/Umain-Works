import { Card } from './Card'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
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
  iconColor = 'text-[#c1633d]',
  iconBg = 'bg-[#fbefe8]',
  accentColor = 'bg-[#c1633d]',
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
      <span className={cn('absolute inset-y-0 left-0 w-[2px]', accentColor)} />

      <div className="flex h-full flex-col px-4 py-3.5 pl-[15px]">
        <div className="mb-2.5 flex items-start justify-between gap-4">
          <p className="text-[12.5px] font-medium text-[#4f4b46]">{title}</p>
          {Icon ? (
            <div className={cn('grid h-[30px] w-[30px] place-items-center rounded-[8px]', iconBg)}>
              <Icon className={cn('h-[15px] w-[15px]', iconColor)} />
            </div>
          ) : null}
        </div>

        <div className="mt-auto">
          <p
            className="text-[28px] font-semibold leading-none tracking-tight text-[#232321]"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formattedValue}
          </p>

          {subtitle ? <p className={cn('mt-2 text-[11px] font-medium leading-[1.35]', subtitleClassName)}>{subtitle}</p> : null}
        </div>
      </div>
    </Card>
  )
}
