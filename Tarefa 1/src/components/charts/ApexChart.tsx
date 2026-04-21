import type { ComponentProps } from 'react'
import ReactApexChart from 'react-apexcharts'
import { cn } from '../../lib/utils'

type ApexChartProps = ComponentProps<typeof ReactApexChart> & {
  className?: string
}

export function ApexChart({ className, ...props }: ApexChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ReactApexChart {...props} />
    </div>
  )
}
