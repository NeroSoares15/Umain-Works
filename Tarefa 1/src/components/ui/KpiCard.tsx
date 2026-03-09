import { Card } from './Card'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor = 'text-umain-accent', iconBg = 'bg-umain-accent/10' }: KpiCardProps) {
  const [displayNumber, setDisplayNumber] = useState(typeof value === 'number' ? 0 : null)

  useEffect(() => {
    if (typeof value !== 'number') {
      return
    }

    let startTimestamp: number | null = null
    let frameId = 0
    const duration = 1500

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)

      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayNumber(Math.floor(easeProgress * value))

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step)
      }
    }

    frameId = window.requestAnimationFrame(step)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [value])

  return (
    <Card className="h-full flex flex-col justify-center">
      <div className="p-6 flex flex-col gap-5 h-full relative z-10">
        <div className="flex items-start justify-between">
          <div className={cn('w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border border-umain-border/50 shadow-inner', iconBg)}>
            <Icon className={cn('w-6 h-6', iconColor)} />
          </div>
        </div>

        <div className="mt-auto">
          <p
            className="text-[3rem] font-black text-white leading-none tracking-tight drop-shadow-sm transition-all"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {typeof value === 'number' ? (displayNumber ?? value).toLocaleString('pt-PT') : value}
          </p>
          <p className="text-sm font-bold text-umain-text mt-3">{title}</p>
          {subtitle && <p className="text-[11px] font-bold tracking-wide uppercase text-umain-muted/80 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}
