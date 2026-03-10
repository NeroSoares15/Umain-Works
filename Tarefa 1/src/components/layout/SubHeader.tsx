import { ChevronLeft, ChevronRight, CircleDot, RefreshCw, Calendar } from 'lucide-react'

interface SubHeaderProps {
  title: string
}

export function SubHeader({ title }: SubHeaderProps) {
  return (
    <div className="h-[56px] bg-white border-b border-umain-border px-4 md:px-8 flex items-center justify-between flex-shrink-0 z-10 relative">
      
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold text-umain-text tracking-tight">{title}</h1>
        
        <div className="hidden md:flex items-center gap-3 text-xs font-semibold text-umain-text-muted bg-[#fdfdfd] border border-umain-border px-3 py-1.5 rounded-md hover:border-umain-accent/50 hover:bg-orange-50/50 cursor-pointer transition-colors group">
           <Calendar className="w-3.5 h-3.5 text-umain-accent" />
           <span className="group-hover:text-umain-accent transition-colors">6 Mar, 2026 - 13 Mar, 2026</span>
           <span className="text-[10px] opacity-70 ml-1">v</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-umain-accent">
           <button className="p-1 hover:bg-orange-50 rounded transition-colors"><ChevronLeft className="w-4 h-4" /></button>
           <button className="p-1 hover:bg-orange-50 rounded transition-colors"><ChevronLeft className="w-3 h-3 -rotate-45 opacity-0" /></button> {/* spacing */}
           <button className="p-1 hover:bg-orange-50 rounded transition-colors"><CircleDot className="w-3.5 h-3.5" /></button>
           <button className="p-1 hover:bg-orange-50 rounded transition-colors"><ChevronRight className="w-4 h-4" /></button>
           <button className="p-1 hover:bg-orange-50 rounded transition-colors"><ChevronRight className="w-4 h-4 opacity-0" /></button> {/* spacing */}
           <button className="p-1 hover:bg-orange-50 rounded transition-colors"><ChevronRight className="w-4 h-4 opacity-0" /></button> {/* spacing */}
           <button className="p-1 hover:bg-orange-50 rounded transition-colors"><ChevronRight className="w-4 h-4 opacity-0" /></button> {/* spacing */}
           <button className="hidden p-1 hover:bg-orange-50 rounded transition-colors"><ChevronRight className="w-3 h-3 -rotate-45" /></button> 
        </div>
      </div>

      <div className="flex items-center">
        <button className="flex items-center gap-2 px-4 py-2 rounded bg-[#C15B38] hover:bg-[#a34b2f] text-white text-xs font-bold transition-all shadow-sm active:scale-95">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh data
        </button>
      </div>
    </div>
  )
}
