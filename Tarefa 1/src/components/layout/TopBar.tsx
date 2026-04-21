import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, ChevronDown } from 'lucide-react'
import { useAppContext, type ProfileId } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'
import logoUrl from '../../assets/logo.png'

export function TopBar() {
  const { activeProfileId, setActiveProfileId } = useAppContext()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-[#b65d37] bg-[#c1633d] text-white">
      <div className="flex h-[52px] items-stretch justify-between gap-4 px-5">
        <div className="flex min-w-0 items-stretch gap-6">
          <div className="flex items-center self-stretch">
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
                    'flex items-center border-b-[3px] border-transparent px-4 text-[12.5px] font-medium text-white/80 transition-colors hover:text-white',
                    isActive && 'border-[#f5d7cb] text-white'
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
              className="rounded-[8px] p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((previous) => !previous)}
            className="flex items-center gap-2 text-[12px] font-semibold text-white"
          >
            <span className="grid h-5 w-5 place-items-center rounded-[8px] bg-white/20 text-[10px] font-bold">
              {activeProfile.initials}
            </span>
            <span className="hidden sm:inline">{activeProfile.name}</span>
            <ChevronDown className={cn('h-3 w-3 text-white/80 transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 min-w-[220px] rounded-[8px] border border-[#e3d7c8] bg-white py-1 text-[#2f2d29] shadow-lg">
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
                  <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#f1e0d4] text-[11px] font-bold text-[#9f552f]">
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
        <div className="border-t border-white/10 bg-[#c1633d] px-4 py-2 md:hidden">
          <nav className="flex min-w-max items-center gap-4 overflow-x-auto">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-[8px] px-2 py-1 text-[12px] font-medium text-white/75',
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
