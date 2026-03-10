import { Outlet, useLocation } from 'react-router-dom'
import { TopBar } from './TopBar'
import { CommandBar } from '../ui/CommandBar'
import { SubHeader } from './SubHeader'
import { AppProvider } from '../../contexts/AppContext'

export function Layout() {
  const location = useLocation()
  return (
    <AppProvider>
      <div className="flex flex-col h-screen bg-umain-background overflow-hidden relative">
        <TopBar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 relative">
          <div className="flex-1 flex flex-col min-h-full bg-umain-background">
            <SubHeader title={location.pathname === '/dashboard' || location.pathname === '/' ? 'Dashboard Escola' : 
                        location.pathname === '/analysis' ? 'Análise por Curso' : 
                        location.pathname === '/prediction' ? 'Predição' : 
                        location.pathname === '/settings' ? 'Config. Gatilhos' : 
                        location.pathname === '/roi' ? 'Gestão de ROI' : 'Visão Geral'} />
            <div className="flex-1 relative z-10 w-full">
              <Outlet />
            </div>
          </div>
        </div>
        <CommandBar />
      </div>
    </AppProvider>
  )
}
