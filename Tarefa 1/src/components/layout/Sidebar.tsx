import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  BarChart2,
  TrendingDown,
  Settings as SettingsIcon,
  DollarSign,
  Command,
  Shield,
  Heart,
  X,
  Code,
  PlaySquare,
  Check,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import {
  canAccessRoute,
  PROFILE_OPTIONS,
  ROUTE_ACCESS,
  type AppRouteKey,
  type ProfileId,
} from '../../lib/accessControl'
import { useAppContext } from '../../contexts/useAppContext'

interface NavItem {
  icon: LucideIcon
  label: string
  routeKey: Exclude<AppRouteKey, 'studentProfile'>
}

const navItems: NavItem[] = [
  { routeKey: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Escola' },
  { routeKey: 'analysis', icon: BarChart2, label: 'Análise por Curso' },
  { routeKey: 'prediction', icon: TrendingDown, label: 'Predição' },
  { routeKey: 'settings', icon: SettingsIcon, label: 'Config. Gatilhos' },
  { routeKey: 'roi', icon: DollarSign, label: 'Gestão de ROI' },
  { routeKey: 'pipeline', icon: PlaySquare, label: 'Motor BMAD (Core)' },
]

const profileIcons: Record<ProfileId, LucideIcon> = {
  diretor: Shield,
  sas: Heart,
  obs: BarChart2,
}

export function Sidebar() {
  const { isOpen, setIsOpen, activeProfileId, setActiveProfileId, settings, updateSettings } = useAppContext()
  const [showEgg, setShowEgg] = useState(false)
  const [, setEggCount] = useState(0)

  const handleLogoClick = () => {
    // If already unlocked, do nothing
    if (settings.bmadUnlocked) return

    setEggCount((prev: number) => {
      const next = prev + 1
      if (next === 5) {
        setShowEgg(true)
        updateSettings({ bmadUnlocked: true })
        setTimeout(() => {
          setShowEgg(false)
        }, 4000)
      }
      return next
    })
  }

  // Close sidebar when navigating on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  // Filter navigation items based on current role
  const filteredNavItems = navItems.filter((item) =>
    canAccessRoute(activeProfileId, item.routeKey, { bmadUnlocked: settings.bmadUnlocked }),
  )

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-umain-primary flex flex-col border-r border-umain-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 h-screen",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="px-6 py-5 border-b border-umain-border flex items-center justify-between relative">
          <div onClick={handleLogoClick} className="cursor-pointer select-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-umain-accent shadow-[0_0_8px_rgba(234,88,12,0.8)]" />
              <h1 className="text-lg font-black text-white tracking-tight leading-none">IP<span className="text-umain-accent">Tomar</span></h1>
            </div>
            <p className="text-white/40 text-[9px] font-bold tracking-widest uppercase mt-1.5 flex items-center gap-1.5">
              RiskRadar <span className="text-umain-accent/40">×</span> Squad 1
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 -mr-2 text-umain-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Easter Egg Toast */}
          <div className={cn(
            "absolute top-full left-4 right-4 mt-2 p-3 rounded-xl bg-orange-950 border border-orange-500/50 shadow-2xl flex items-start gap-3 transition-all duration-500 z-50",
            showEgg ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          )}>
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
              <Code className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-400">BMAD Core Unlocked</p>
              <p className="text-[10px] text-orange-200/70 mt-0.5 leading-tight">Business. Model. Analysis. Decision. The true engine is awake.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-20 custom-scrollbar">
          <div className="mb-6 px-3">
            <p className="px-3 text-[9px] font-bold tracking-widest text-umain-text-muted mb-2 uppercase">Modo de Visualização</p>
            <div className="space-y-0.5">
              {PROFILE_OPTIONS.map((profile) => {
                const Icon = profileIcons[profile.id]
                const isActive = activeProfileId === profile.id
                return (
                  <button
                    key={profile.id}
                    onClick={() => setActiveProfileId(profile.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                      isActive ? 'bg-umain-accent/10 border border-umain-accent/20 text-white' : 'text-umain-text-muted hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-umain-accent" : "text-umain-text-muted")} />
                    <span className={isActive ? 'font-medium' : ''}>{profile.name}</span>
                  </button>
                )
              })}
            </div>
            <p className="px-3 pt-3 text-[10px] leading-relaxed text-umain-text-muted/70">
              Perfis são simulados localmente para fins de demonstração.
            </p>
          </div>

          <div className="px-3">
            <p className="px-3 text-[9px] font-bold tracking-widest text-umain-text-muted mb-2 uppercase">Navegação</p>
            <nav className="space-y-0.5">
              {filteredNavItems.map(({ routeKey, icon: Icon, label }) => {
                const route = ROUTE_ACCESS[routeKey]
                const isPipelineLink = routeKey === 'pipeline'

                return (
                  <NavLink
                    key={routeKey}
                    to={route.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                        isPipelineLink && 'mt-4 border border-orange-500/20 bg-orange-500/5',
                        isActive
                          ? isPipelineLink
                            ? 'bg-orange-500/20 text-orange-400 font-medium border-orange-500/50'
                            : 'bg-umain-muted/30 text-white font-medium border border-umain-border/50'
                          : isPipelineLink
                            ? 'text-orange-400/70 hover:text-orange-400 hover:bg-orange-500/10'
                            : 'text-umain-text-muted hover:text-white hover:bg-white/5',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            'w-4 h-4',
                            isPipelineLink
                              ? isActive
                                ? 'text-orange-400'
                                : 'text-orange-400/70'
                              : isActive
                                ? 'text-umain-accent'
                                : 'text-umain-text-muted',
                          )}
                        />
                        {label}
                      </>
                    )}
                  </NavLink>
                )
              })}

            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-umain-border bg-umain-primary/50 relative">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Command className="w-4 h-4 text-umain-accent animate-pulse" />
            <div>
              <p className="text-xs font-medium text-white">watsonx.ai ativo</p>
              <p className="text-[10px] text-umain-text-muted">Risk Engine a processar</p>
            </div>
          </div>
          
          <div className="px-1">
            <p className="text-[9px] font-bold tracking-widest text-umain-text-muted mb-2 uppercase">Sincronização</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <Check className="w-3 h-3" />
                  <span>Moodle</span>
                </div>
                <span className="text-umain-text-muted">Há 5 min</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <Check className="w-3 h-3" />
                  <span>Sistema Académico</span>
                </div>
                <span className="text-umain-text-muted">Há 12 min</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <Check className="w-3 h-3" />
                  <span>Tesouraria</span>
                </div>
                <span className="text-umain-text-muted">Há 15 min</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
