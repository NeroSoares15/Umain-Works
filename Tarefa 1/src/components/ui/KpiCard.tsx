import { Card } from './Card'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor = 'text-umain-accent', iconBg = 'bg-umain-accent/10' }: KpiCardProps) {
  return (
    <Card>
      <div className="p-6 flex flex-col gap-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div>
          <p
            className="text-[2.75rem] font-black text-umain-text leading-none tracking-tight"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {value}
          </p>
          <p className="text-sm font-semibold text-umain-text mt-2">{title}</p>
          {subtitle && <p className="text-xs text-umain-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}
