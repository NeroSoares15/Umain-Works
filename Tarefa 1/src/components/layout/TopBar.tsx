import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BarChart3, ChevronDown, LayoutDashboard, Settings } from 'lucide-react'
import { useAppContext } from '../../contexts/AppContext'
import type { ProfileId } from '../../lib/access'
import { useAppMotion } from '../../lib/appMotion'
import { cn } from '../../lib/utils'
import logoUrl from '../../assets/logo.png'
import smallLogoUrl from '../../assets/Logo Small.png'

export function TopBar() {
  const location = useLocation()
  const { activeProfileId, setActiveProfileId } = useAppContext()
  const { reduceMotion } = useAppMotion()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const profiles: Array<{ id: ProfileId; name: string; role: string; initials: string }> = [
    { id: 'diretor', name: 'Álvaro Santos', role: 'Diretor de Curso', initials: 'AS' },
    { id: 'sas', name: 'Maria Silva', role: 'Técnico SAS', initials: 'MS' },
    { id: 'obs', name: 'João Costa', role: 'Observatório', initials: 'JC' },
  ]
  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analysis', label: 'Análise por Curso' },
    { to: '/settings', label: 'Configurações' },
  ]
  const mobileNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analysis', label: 'Análise por Curso', icon: BarChart3 },
    { to: '/settings', label: 'Configurações', icon: Settings },
  ]
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
        setMobileNavOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  return (
    <header ref={headerRef} className="sticky top-0 z-20 border-b border-[#b65d37] bg-[#c1633d] text-white">
      <div className="flex h-[38px] items-stretch justify-between gap-2 px-2.5 min-[520px]:h-[44px] min-[520px]:px-3 sm:h-[52px] sm:gap-4 sm:px-5">
        <div className="flex min-w-0 items-stretch gap-2.5 min-[520px]:gap-3.5 sm:gap-6">
          <button
            type="button"
            aria-label={mobileNavOpen ? 'Fechar navegação' : 'Abrir navegação'}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((previous) => !previous)}
            className={cn(
              'flex items-center self-stretch rounded-[8px] px-1.5 transition-[background-color,transform] duration-150 hover:bg-white/10 sm:hidden',
              mobileNavOpen && 'bg-white/12'
            )}
          >
            <span
              aria-hidden="true"
              className="block h-[18px] w-[13px] bg-white min-[520px]:h-[20px] min-[520px]:w-[15px]"
              style={{
                WebkitMaskImage: `url(${smallLogoUrl})`,
                maskImage: `url(${smallLogoUrl})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
          </button>

          <div className="hidden items-center self-stretch sm:flex">
            <span
              aria-label="UMAIN Works"
              className="block h-[22px] w-[118px] bg-white"
              style={{
                WebkitMaskImage: `url(${logoUrl})`,
                maskImage: `url(${logoUrl})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'left center',
                maskPosition: 'left center',
              }}
            />
          </div>

          <nav className="hidden items-stretch md:flex">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center border-b-[3px] border-transparent px-4 text-[12.5px] font-medium text-white/80 transition-[color,border-color,background-color] duration-150 hover:text-white',
                    isActive && 'border-[#f5d7cb] text-white'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="relative flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((previous) => !previous)}
            className="flex items-center gap-1 rounded-[6px] px-1 py-0.5 text-[10px] font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-white/8 min-[520px]:gap-1.5 min-[520px]:rounded-[8px] min-[520px]:px-1.5 min-[520px]:text-[11px] sm:gap-1.5 sm:px-1.5 sm:py-1 sm:text-[11px] motion-safe:hover:-translate-y-[1px]"
          >
            <span className="grid h-5 w-5 place-items-center rounded-[4px] bg-white/20 text-[8px] font-bold transition-colors duration-150 min-[520px]:h-6 min-[520px]:w-6 min-[520px]:rounded-[6px] min-[520px]:text-[9px] sm:h-5 sm:w-5 sm:rounded-[8px] sm:text-[10px]">
              {activeProfile.initials}
            </span>
            <span className="hidden min-[520px]:inline sm:inline sm:text-[11px]">{activeProfile.name}</span>
            <ChevronDown className={cn('hidden h-3 w-3 text-white/80 transition-transform sm:block', dropdownOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {dropdownOpen ? (
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0.12 : 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-full z-30 mt-2 min-w-[220px] rounded-[8px] border border-[#e3d7c8] bg-white py-1 text-[#2f2d29] shadow-lg"
              >
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      setActiveProfileId(profile.id)
                      setDropdownOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2 text-left transition-[background-color] duration-150',
                      activeProfileId === profile.id ? 'bg-[#fbf2ec]' : 'hover:bg-[#faf7f0]'
                    )}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#f1e0d4] text-[11px] font-bold text-[#9f552f]">
                      {profile.initials}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[12px] font-semibold">{profile.name}</span>
                      <span className="text-[11px] text-[#7b756e]">{profile.role}</span>
                    </span>
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full z-30 border-t border-white/10 bg-[#b75c37] px-2.5 py-2.5 shadow-[0_12px_24px_rgba(64,35,21,0.18)] sm:hidden"
          >
            <nav className="flex flex-col gap-2">
              {mobileNavItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-[8px] border px-3 py-2 text-[12px] font-medium transition-[background-color,border-color,color] duration-150',
                      isActive
                        ? 'border-[#f4d8cb] bg-white/12 text-white'
                        : 'border-white/10 bg-white/5 text-white/88 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
