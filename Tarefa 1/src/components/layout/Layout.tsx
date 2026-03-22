import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { CommandBar } from '../ui/CommandBar'
import { AppProvider } from '../../contexts/AppContext'

export function Layout() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen bg-umain-background overflow-hidden relative">
        <TopBar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 relative">
          <div className="flex-1 relative z-10 w-full">
            <Outlet />
          </div>
        </div>
        <CommandBar />
      </div>
    </AppProvider>
  )
}
