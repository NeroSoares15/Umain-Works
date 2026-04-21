import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, ChevronDown } from 'lucide-react'
import { useAppContext, type ProfileId } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'

export function TopBar() {
  const { activeProfileId, setActiveProfileId } = useAppContext()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const profiles: Array<{ id: ProfileId; name: string; role: string; initials: string }> = [
    { id: 'diretor', name: 'Alvaro Santos', role: 'Diretor de Curso', initials: 'AS' },
    { id: 'sas', name: 'Maria Silva', role: 'Técnico SAS', initials: 'MS' },
    { id: 'obs', name: 'João Costa', role: 'Observatório', initials: 'JC' },
  ]
  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analysis', label: 'Análise por Curso' },
    { to: '/settings', label: 'Configurações' },
  ]
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-[#b85b36] bg-[#c5663b] text-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="flex h-[52px] items-stretch justify-between gap-4 px-4 md:px-5">
        <div className="flex min-w-0 items-stretch gap-5">
          <div className="flex items-center gap-1 self-stretch">
            <span className="text-[21px] font-black leading-none tracking-tight">UMAIN</span>
            <span className="pt-1 text-[10px] font-bold uppercase tracking-tight">WORKS</span>
          </div>

          <nav className="hidden items-stretch gap-2 md:flex">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 text-[12.5px] font-medium text-white/80 transition-colors',
                    'border-b-[3px] border-transparent hover:text-white',
                    isActive && 'border-white text-white'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen((previous) => !previous)}
              className="rounded-md p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((previous) => !previous)}
            className="flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-[12px] font-semibold"
          >
            <span className="grid h-6 w-6 place-items-center rounded-[3px] bg-white/15 text-[11px] font-bold">
              {activeProfile.initials}
            </span>
            <span className="hidden sm:inline">{activeProfile.name}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 text-white/80 transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 min-w-[220px] rounded-md border border-[#e3d7c8] bg-white py-1 text-[#2f2d29] shadow-lg">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    setActiveProfileId(profile.id)
                    setDropdownOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2 text-left transition-colors',
                    activeProfileId === profile.id ? 'bg-[#fbf2ec]' : 'hover:bg-[#faf7f0]'
                  )}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-[4px] bg-[#f1e0d4] text-[11px] font-bold text-[#9f552f]">
                    {profile.initials}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[12px] font-semibold">{profile.name}</span>
                    <span className="text-[11px] text-[#7b756e]">{profile.role}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#c5663b] px-4 py-2 md:hidden">
          <nav className="flex min-w-max items-center gap-4 overflow-x-auto">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-md px-2 py-1 text-[12px] font-medium text-white/75',
                    isActive && 'bg-white/10 text-white'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
