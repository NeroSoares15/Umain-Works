import { lazy, Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { AnimatePresence, motion } from 'framer-motion'
import { CommandBar } from '../ui/CommandBar'
import { canUseCommandBar } from '../../lib/accessControl'
import { useAppContext } from '../../contexts/useAppContext'

const WebGLBackground = lazy(async () => {
  const module = await import('./WebGLBackground')
  return { default: module.WebGLBackground }
})

export function Layout() {
  const location = useLocation()
  const { activeProfileId } = useAppContext()

  return (
    <div className="flex h-screen bg-umain-background overflow-hidden relative">
      <Suspense fallback={<div className="absolute inset-0 z-0 bg-umain-background pointer-events-none" />}>
        <WebGLBackground />
      </Suspense>

      <Sidebar />
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
      {canUseCommandBar(activeProfileId) && <CommandBar />}
    </div>
  )
}
