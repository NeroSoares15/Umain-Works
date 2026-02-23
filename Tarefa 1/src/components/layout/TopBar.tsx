import { Bell, Search } from 'lucide-react'
import { alerts } from '../../data/alerts'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const pendingCount = alerts.filter(a => a.status === 'pending').length

  return (
    <header className="h-[72px] bg-umain-primary border-b border-umain-border px-8 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-xl font-black text-umain-text tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-umain-text-muted font-medium mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-umain-text-muted group-focus-within:text-umain-accent transition-colors" />
          <input
            type="text"
            placeholder="Pesquisar estudante por nome ou número..."
            className="w-full bg-umain-background/50 border border-umain-border rounded-xl pl-10 pr-4 py-2 text-sm text-umain-text placeholder:text-umain-text-muted/50 focus:outline-none focus:ring-2 focus:ring-umain-accent/40 focus:bg-umain-surface transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[10px] font-bold tracking-widest uppercase text-umain-text-muted">Última Sync</p>
          <p className="text-xs font-semibold text-umain-text">15 Fev 2026 — 09:30</p>
        </div>
        <button className="relative p-2.5 rounded-xl hover:bg-umain-muted transition-colors">
          <Bell className="w-4 h-4 text-umain-text-muted" />
          {pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] rounded-full bg-umain-accent text-white text-[9px] flex items-center justify-center font-bold px-1 leading-none">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
