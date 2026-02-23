import { NavLink } from 'react-router-dom'
import { LayoutDashboard, GitBranch } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pipeline', icon: GitBranch, label: 'Pipeline de Dados' },
]

export function Sidebar() {
  return (
    <aside className="w-60 h-screen sticky top-0 bg-umain-primary flex flex-col border-r border-umain-border">
      <div className="px-6 py-5 border-b border-umain-border">
        <div>
          <p className="text-white font-black text-base tracking-tight leading-none">
            UMAIN<span className="font-light text-xs ml-1 tracking-widest text-white/50">WORKS</span>
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-umain-accent" />
            <p className="text-white/40 text-xs tracking-wide">RiskRadar · Lumina Suite</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-umain-accent/20 text-umain-accent font-medium'
                : 'text-umain-text-muted hover:text-white hover:bg-white/5'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-umain-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-umain-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">AF</span>
          </div>
          <div>
            <p className="text-white text-xs font-medium">Prof. António Ferreira</p>
            <p className="text-white/40 text-xs">Diretor de Curso</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
