import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variant === 'default' && 'bg-umain-primary/10 text-umain-primary',
      variant === 'outline' && 'border border-umain-muted/30 text-umain-muted',
      className
    )}>
      {children}
    </span>
  )
}
