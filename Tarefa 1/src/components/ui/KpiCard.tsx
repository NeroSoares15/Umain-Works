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

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor = 'text-[#C15B38]', iconBg = 'bg-[#f4eee3]' }: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0)

  // Determine border color based on typical KPI intent in the mockup
  let leftBorderColor = "border-l-[#C15B38]" // Default Umain Orange
  if (subtitle?.includes('face à semana anterior')) {
    if (subtitle.includes('↑')) leftBorderColor = "border-l-[#10b981]" // Green
    if (subtitle.includes('↓')) leftBorderColor = "border-l-[#ef4444]" // Red
  } else if (title.includes('Sucesso') || title.includes('ROI')) {
      leftBorderColor = "border-l-[#C15B38]"
  }

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value)
      return
    }

    let startTimestamp: number | null = null
    const duration = 1500 // 1.5s

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)

      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayValue(Math.floor(easeProgress * value))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [value])

  return (
    <Card className={cn("h-full flex flex-col justify-center bg-white border border-[#e5e7eb] shadow-sm overflow-hidden", leftBorderColor, "border-l-[6px]")}>
      <div className="p-5 flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
           {/* Title Top Left */}
           <p className="text-[13px] font-semibold text-[#6b7280]">{title}</p>
           
           {/* Icon Top Right */}
          <div className={cn('w-8 h-8 rounded-md flex items-center justify-center shrink-0', iconBg)}>
            <Icon className={cn('w-4 h-4', iconColor)} />
          </div>
        </div>

        <div className="mt-auto">
          {/* Main Value */}
          <p
            className="text-[32px] font-bold text-[#111827] leading-none tracking-tight"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {typeof displayValue === 'number' ? displayValue.toLocaleString('pt-PT') : displayValue}
          </p>
          
          {/* Subtitle / Trend */}
          {subtitle && (
            <p className={cn("text-[11px] font-bold mt-2", subtitle.includes('↑') ? "text-[#10b981]" : subtitle.includes('↓') ? "text-[#ef4444]" : "text-[#6b7280]")}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
