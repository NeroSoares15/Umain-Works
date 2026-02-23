import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { AnimatePresence, motion } from 'framer-motion'
import { CommandBar } from '../ui/CommandBar'
import { WebGLBackground } from './WebGLBackground'

export function Layout() {
  const location = useLocation()
  return (
    <div className="flex h-screen bg-umain-background overflow-hidden relative">
      <WebGLBackground />

      <div className="z-10 h-screen sticky top-0"><Sidebar /></div>
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <CommandBar />
    </div>
  )
}
