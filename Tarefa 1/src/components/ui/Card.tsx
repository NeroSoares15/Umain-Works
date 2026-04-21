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
        'rounded-[8px] border border-[#e4ddd1] bg-white shadow-[0_1px_0_rgba(61,47,36,0.03)]',
        'transition-[box-shadow,border-color] duration-150 ease-out',
        'hover:border-[#ddd3c4] hover:shadow-[0_8px_18px_rgba(55,43,33,0.04)]',
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
