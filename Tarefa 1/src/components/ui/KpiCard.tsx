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
    <Card className={cn('group relative h-full overflow-hidden', className)}>
      <span className={cn('absolute inset-y-0 left-0 w-[2px] transition-[opacity,height] duration-200 group-hover:opacity-90', accentColor)} />

      <div className="flex h-full flex-col px-2.5 py-2.5 pl-[11px] min-[420px]:px-4 min-[420px]:py-3.5 min-[420px]:pl-[15px]">
        <div className="mb-1.5 flex items-start justify-between gap-3 min-[420px]:mb-2.5 min-[420px]:gap-4">
          <p className="text-[9px] font-medium leading-[1.25] text-[#4f4b46] transition-colors duration-200 group-hover:text-[#2b2926] min-[420px]:text-[12.5px]">
            {title}
          </p>
          {Icon ? (
            <div
              className={cn(
                'grid h-[22px] w-[22px] place-items-center rounded-[8px] transition-[background-color] duration-150 min-[420px]:h-[30px] min-[420px]:w-[30px]',
                iconBg
              )}
            >
              <Icon className={cn('h-[11px] w-[11px] min-[420px]:h-[15px] min-[420px]:w-[15px]', iconColor)} />
            </div>
          ) : null}
        </div>

        <div className="mt-auto">
          <p
            className="text-[18px] font-semibold leading-none tracking-tight text-[#232321] transition-colors duration-200 group-hover:text-[#171614] min-[420px]:text-[28px]"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formattedValue}
          </p>

          {subtitle ? (
            <p
              className={cn(
                'mt-1 text-[7px] font-medium leading-[1.3] min-[420px]:mt-2 min-[420px]:text-[11px] min-[420px]:leading-[1.35]',
                subtitleClassName
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
