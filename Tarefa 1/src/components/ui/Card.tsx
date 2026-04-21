import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  spotlight?: boolean
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[8px] border border-[#e4ddd1] bg-white',
        className
      )}
    >
      <div className="h-full">{children}</div>
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('border-b border-[#eae3d8] px-4 py-3', className)}>{children}</div>
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('px-4 py-4', className)}>{children}</div>
}
