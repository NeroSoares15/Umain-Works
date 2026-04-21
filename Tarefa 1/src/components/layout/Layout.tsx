import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { useAppMotion } from '../../lib/appMotion'
import { TopBar } from './TopBar'

export function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const { pageVariants } = useAppMotion()

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-[#fffdf6] text-[#2e2d2a]">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-[calc(100vh-52px)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${location.pathname}${location.search}`}
                variants={pageVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="h-full"
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
