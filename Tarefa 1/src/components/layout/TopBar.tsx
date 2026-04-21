import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, ChevronDown } from 'lucide-react'
import { useAppContext } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'

type RoutePermission = 'all' | ('diretor' | 'sas' | 'obs')[]

interface NavItem {
  to: string
  label: string
  roles: RoutePermission
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', roles: 'all' },
  { to: '/analysis', label: 'Análise por Curso', roles: 'all' },
  { to: '/settings', label: 'Configurações', roles: 'all' },
]

export function TopBar() {
  const { activeProfileId, setActiveProfileId } = useAppContext()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mock data for profiles matching the Context shape
  const profiles = [
    { id: 'diretor', name: 'Alvaro Santos', role: 'Diretor de Curso' },
    { id: 'sas', name: 'Maria Silva', role: 'Técnico SAS' },
    { id: 'obs', name: 'João Costa', role: 'Observatório' }
  ] as const
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
  }, [dropdownRef])

  // Filter navigation items based on current role
  const filteredNavItems = navItems.filter(item => 
    item.roles === 'all' || item.roles.includes(activeProfileId)
  )

  return (
    <header className="h-[60px] bg-[#C15B38] border-b border-[#a34b2f] px-4 md:px-8 flex items-center justify-between flex-shrink-0 z-20 relative">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could stay or be removed if horizontal scrolling is implemented */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 -ml-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mr-8">
           <span className="text-white font-bold text-xl tracking-tight leading-none">UMAIN</span>
           <span className="text-white font-semibold text-sm pt-1">WORKS</span>
        </div>
        
        {/* Desktop Top Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {filteredNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cn(
                'px-4 py-2 text-sm transition-colors border-b-2',
                isActive
                  ? 'text-white font-semibold border-white'
                  : 'text-white/70 hover:text-white font-medium border-transparent'
              )}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <div 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md cursor-pointer transition-colors border border-white/10"
        >
          <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            {activeProfile.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
          </div>
          <span className="text-white text-sm font-semibold">{activeProfile.name}</span>
          <ChevronDown className={cn("w-4 h-4 text-white/70 transition-transform", dropdownOpen && "rotate-180")} />
        </div>

        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#e5e7eb] py-1 z-50">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProfileId(p.id as any);
                  setDropdownOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm hover:bg-[#f9fafb] transition-colors flex flex-col",
                  activeProfileId === p.id ? "bg-[#f4eee3] text-[#c15b38] font-semibold" : "text-[#111827]"
                )}
              >
                <span>{p.name}</span>
                <span className={cn("text-xs", activeProfileId === p.id ? "text-[#c15b38]/70" : "text-[#6b7280]")}>{p.role}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-white border-b border-[#e5e7eb] shadow-lg lg:hidden flex flex-col p-4 gap-2 z-40">
          {filteredNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                'px-4 py-3 rounded-lg text-sm font-bold transition-colors',
                isActive
                  ? 'bg-[#f4eee3] text-[#C15B38]'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
