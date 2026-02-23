import { cn } from '../../lib/utils'
import type { MouseEvent } from 'react'
import { useRef } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  spotlight?: boolean
}

export function Card({ children, className, spotlight = true }: CardProps) {
  const divRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !spotlight) return
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    divRef.current.style.setProperty('--mouse-x', `${x}px`)
    divRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative rounded-3xl border border-umain-border bg-umain-surface/70 backdrop-blur-xl overflow-hidden',
        'shadow-xl transition-transform duration-500 ease-out',
        className
      )}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen"
          style={{
            background: `radial-gradient(500px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(234,88,12,0.12), transparent 40%)`
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('px-6 py-4 border-b border-umain-border', className)}>{children}</div>
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}
