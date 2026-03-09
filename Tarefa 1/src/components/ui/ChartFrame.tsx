import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

interface ChartSize {
  height: number
  width: number
}

interface ChartFrameProps {
  children: (size: ChartSize) => ReactNode
  className?: string
}

export function ChartFrame({ children, className }: ChartFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<ChartSize>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) {
      return
    }

    const updateSize = (nextWidth: number, nextHeight: number) => {
      const width = Math.max(0, Math.round(nextWidth))
      const height = Math.max(0, Math.round(nextHeight))

      setSize((current) => {
        if (current.width === width && current.height === height) {
          return current
        }

        return { width, height }
      })
    }

    const initialRect = element.getBoundingClientRect()
    updateSize(initialRect.width, initialRect.height)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      updateSize(entry.contentRect.width, entry.contentRect.height)
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      {size.width > 0 && size.height > 0 ? children(size) : null}
    </div>
  )
}
