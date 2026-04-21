import { useReducedMotion, type Variants } from 'framer-motion'

type StaggerOptions = {
  staggerChildren?: number
  delayChildren?: number
}

type RevealOptions = {
  distance?: number
  delay?: number
  duration?: number
}

const ENTER_EASE = [0.22, 1, 0.36, 1] as const
const EXIT_EASE = [0.4, 0, 1, 1] as const

export function useAppMotion() {
  const reduceMotion = useReducedMotion()

  function createPageVariants(): Variants {
    if (reduceMotion) {
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.14 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    }

    return {
      hidden: { opacity: 0, y: 8 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: ENTER_EASE },
      },
      exit: {
        opacity: 0,
        y: -4,
        transition: { duration: 0.12, ease: EXIT_EASE },
      },
    }
  }

  function createStaggerVariants(options: StaggerOptions = {}): Variants {
    const { staggerChildren = 0.05, delayChildren = 0 } = options

    return {
      hidden: {},
      show: {
        transition: {
          delayChildren,
          staggerChildren: reduceMotion ? Math.min(staggerChildren, 0.015) : staggerChildren,
        },
      },
    }
  }

  function createRevealVariants(options: RevealOptions = {}): Variants {
    const { distance = 8, delay = 0, duration = 0.18 } = options

    if (reduceMotion) {
      return {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            delay,
            duration: Math.min(duration, 0.14),
          },
        },
      }
    }

    return {
      hidden: { opacity: 0, y: distance },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          delay,
          duration,
          ease: ENTER_EASE,
        },
      },
    }
  }

  function createChartAnimation(speed = 760, gradualDelay = 90) {
    if (reduceMotion) {
      return { enabled: false }
    }

    const resolvedSpeed = Math.max(260, Math.min(speed, 420))
    const resolvedDelay = Math.max(6, Math.min(gradualDelay, 14))

    return {
      enabled: true,
      speed: resolvedSpeed,
      easing: 'easeout' as const,
      animateGradually: {
        enabled: true,
        delay: resolvedDelay,
      },
      dynamicAnimation: {
        enabled: true,
        speed: Math.max(140, Math.round(resolvedSpeed * 0.34)),
      },
    }
  }

  return {
    reduceMotion,
    pageVariants: createPageVariants(),
    createStaggerVariants,
    createRevealVariants,
    createChartAnimation,
  }
}
