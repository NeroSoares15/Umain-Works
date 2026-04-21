import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffdf6] text-[#2e2d2a]">
      <TopBar />
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-[calc(100vh-52px)]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
