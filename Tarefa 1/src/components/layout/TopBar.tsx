import { Menu, Building2, Download, RefreshCw } from 'lucide-react'
import { useAppContext } from '../../contexts/useAppContext'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { setIsOpen } = useAppContext()

  return (
    <header className="h-[72px] bg-umain-primary border-b border-umain-border px-4 md:px-8 flex items-center justify-between flex-shrink-0 z-20 relative">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 -ml-2 rounded-lg text-umain-text-muted hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Abrir navegação"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg border border-umain-border bg-umain-surface flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-umain-text-muted" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-umain-text tracking-tight truncate max-w-[170px] sm:max-w-none">
              {title}
            </h1>
            {subtitle && <p className="text-[10px] sm:text-xs text-umain-text-muted mt-0.5 truncate max-w-[200px] sm:max-w-none">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-umain-border text-sm font-medium text-umain-text-muted hover:text-white hover:bg-white/5 transition-colors">
          <Download className="w-4 h-4" />
          Exportar SIGQ
        </button>
        <button
          className="flex items-center justify-center gap-2 w-10 min-[420px]:w-auto px-0 min-[420px]:px-4 py-2 rounded-lg bg-umain-accent hover:bg-umain-accent/90 text-white text-sm font-medium transition-colors shadow-lg shadow-umain-accent/20"
          aria-label="Processar dados"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden min-[420px]:inline">Processar Dados</span>
        </button>
      </div>
    </header>
  )
}
