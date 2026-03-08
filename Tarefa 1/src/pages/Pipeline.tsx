import { useState } from 'react'
import { CheckCircle2, RefreshCw, Database, Zap, BarChart3, Bell } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent } from '../components/ui/Card'
import { Pipeline3D } from '../components/ui/Pipeline3D'
import { useAppContext } from '../contexts/AppContext'
import { cn } from '../lib/utils'

const dataSources = [
  { id: 'erp', name: 'ERP Académico', description: 'Notas, inscrições, estatutos, via de acesso', lastSync: '15 Fev 2026 — 08:00', status: 'ok', records: '1.247 registos', viability: 'H' },
  { id: 'sas', name: 'Tesouraria / SAS', description: 'Propinas, bolsas, acordos de pagamento', lastSync: '15 Fev 2026 — 08:05', status: 'ok', records: '1.247 registos', viability: 'H' },
  { id: 'summaries', name: 'Plataforma de Sumários', description: 'Presenças e faltas em aulas', lastSync: '15 Fev 2026 — 08:10', status: 'ok', records: '18.432 registos', viability: 'H' },
  { id: 'moodle', name: 'Moodle / LMS', description: 'Acessos e downloads de materiais', lastSync: '15 Fev 2026 — 08:15', status: 'warning', records: '9.821 registos', viability: 'M' },
]

const bmadSteps = [
  { id: 'B', label: 'Business', description: 'Centralização de dados das fontes institucionais', icon: Database, color: 'text-orange-300', bg: 'bg-orange-950/40', border: 'border-orange-800/50', accent: '#fdba74' },
  { id: 'M', label: 'Model', description: 'Motor de regras determinístico — cálculo do score 0–100', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-950/40', border: 'border-orange-700/50', accent: '#f97316' },
  { id: 'A', label: 'Analysis', description: 'Dashboards hierarquizados por perfil de acesso', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-950/40', border: 'border-orange-600/50', accent: '#c2410c' },
  { id: 'D', label: 'Decision', description: 'Alertas e plano de intervenção com validação humana', icon: Bell, color: 'text-orange-700', bg: 'bg-orange-950/40', border: 'border-orange-500/50', accent: '#7c2d12' },
]

export function Pipeline() {
  const { settings } = useAppContext()
  const [calculating, setCalculating] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  function simulate() {
    if (calculating) return
    setCalculating(true)
    setDone(false)
    const steps = [0, 1, 2, 3]
    steps.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(step)
        if (i === steps.length - 1) {
          setTimeout(() => { setCalculating(false); setDone(true); setActiveStep(null) }, 1000)
        }
      }, i * 1000)
    })
  }

  return (
    <>
      <TopBar title="Pipeline de Dados" subtitle="Fluxo de ingestão e cálculo — IPTomar Core" />
      <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8 overflow-auto">

        {settings.enableEffects && <Pipeline3D calculating={calculating} activeStep={activeStep} />}

        {/* BMAD steps */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-muted mb-3">Motor de Ingestão de Dados</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {bmadSteps.map((step, i) => {
              const Icon = step.icon
              const isActive = activeStep === i
              const isCompleted = done || (activeStep !== null && activeStep > i)
              return (
                <Card
                  key={step.id}
                  className={cn(
                    'transition-all duration-500 overflow-hidden border relative flex flex-col',
                    isActive ? 'border-umain-accent shadow-[0_8px_32px_rgba(234,88,12,0.25)] scale-[1.04] z-10 bg-umain-surface' : 'border-umain-border',
                    isCompleted && 'border-emerald-500/50 bg-emerald-950/20',
                    !isActive && !isCompleted && 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-[1.01]'
                  )}
                >
                  <CardContent className="p-6 pb-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500',
                        step.bg, step.border,
                        isActive && 'shadow-[0_0_20px_currentColor]'
                      )} style={{ color: isActive ? step.accent : undefined }}>
                        <Icon className={cn('w-6 h-6', isActive ? 'animate-pulse' : step.color)} />
                      </div>
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in zoom-in fade-in" />}
                    </div>
                    <p className={cn('text-5xl font-black leading-none mb-2 drop-shadow-sm transition-colors duration-500', isActive || isCompleted ? step.color : 'text-umain-muted/50')}>{step.id}</p>
                    <p className={cn("text-sm font-bold tracking-tight transition-colors duration-500", isActive || isCompleted ? 'text-umain-text' : 'text-umain-text-muted')}>{step.label}</p>
                    <p className="text-xs text-umain-text-muted mt-1 leading-relaxed flex-1">{step.description}</p>

                    <div className={cn(
                      'flex items-center gap-2 text-xs font-bold transition-all duration-500',
                      isActive ? 'opacity-100 text-umain-accent mt-4 h-4' : 'opacity-0 h-0 mt-0 overflow-hidden'
                    )}>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      A processar...
                    </div>
                  </CardContent>

                  {/* Progress Bar absolute at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-umain-border shadow-inner">
                    <div
                      className={cn(
                        'h-full transition-[width] relative',
                        isActive ? 'w-full duration-1000 ease-linear' : isCompleted ? 'w-full duration-0' : 'w-0 duration-0'
                      )}
                      style={{ backgroundColor: step.accent }}
                    >
                      {isActive && <div className="absolute inset-0 bg-white/30 animate-pulse" />}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Data sources */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">Fontes de Dados</p>
            <button
              onClick={simulate}
              disabled={calculating}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                calculating
                  ? 'bg-umain-surface text-umain-text-muted cursor-not-allowed border border-umain-border'
                  : 'bg-umain-accent text-white hover:bg-umain-accent/90 shadow-[0_0_16px_rgba(196,87,43,0.4)] active:scale-[0.98]'
              )}
            >
              <RefreshCw className={cn('w-4 h-4', calculating && 'animate-spin')} />
              {calculating ? 'A calcular...' : 'Simular Cálculo'}
            </button>
          </div>

          <Card>
            <div className="px-6 py-3 border-b border-umain-border grid grid-cols-[16px_1fr_auto_auto] gap-6 items-center">
              <span />
              <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted">Fonte</p>
              <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted text-right">Registos</p>
              <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted text-right">Última Sync</p>
            </div>
            <div className="divide-y divide-umain-border">
              {dataSources.map((source) => (
                <div
                  key={source.id}
                  className={cn(
                    'px-6 py-4 grid grid-cols-[16px_1fr_auto_auto] gap-6 items-center transition-all duration-500 border-l-2',
                    calculating && 'bg-umain-surface/50 border-transparent opacity-50',
                    activeStep === 0 && 'bg-sky-950/20 border-sky-500/50 shadow-[inset_0_0_20px_rgba(14,165,233,0.1)] opacity-100',
                    !calculating && 'border-transparent'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor] transition-all duration-500',
                    source.status === 'ok' ? 'bg-emerald-400 text-emerald-400' : 'bg-amber-400 text-amber-400',
                    activeStep === 0 && 'animate-pulse scale-150 shadow-[0_0_12px_currentColor]'
                  )} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-umain-text">{source.name}</p>
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-md font-bold tracking-wide border',
                        source.viability === 'H' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50' : 'bg-amber-950/40 text-amber-400 border-amber-800/50'
                      )}>
                        {source.viability === 'H' ? 'ALTA' : 'MÉDIA'}
                      </span>
                    </div>
                    <p className="text-xs text-umain-text-muted mt-0.5">{source.description}</p>
                  </div>
                  <p className="text-sm font-semibold text-umain-text text-right whitespace-nowrap">{source.records}</p>
                  <p className="text-xs text-umain-text-muted text-right whitespace-nowrap">{source.lastSync}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {done && (
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 anim-fade-in shadow-[0_0_24px_rgba(16,185,129,0.1)]">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/40 flex items-center justify-center shrink-0 border border-emerald-800/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">Cálculo concluído com sucesso</p>
              <p className="text-xs text-emerald-500/80 mt-0.5">1.247 estudantes processados · 8 alertas gerados · 15 Fev 2026 — 09:30</p>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
