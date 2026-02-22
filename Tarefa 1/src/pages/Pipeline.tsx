import { useState } from 'react'
import { CheckCircle2, RefreshCw, Database, Zap, BarChart3, Bell } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent } from '../components/ui/Card'
import { cn } from '../lib/utils'

const dataSources = [
  { id: 'erp', name: 'ERP Académico', description: 'Notas, inscrições, estatutos, via de acesso', lastSync: '15 Fev 2026 — 08:00', status: 'ok', records: '1.247 registos', viability: 'H' },
  { id: 'sas', name: 'Tesouraria / SAS', description: 'Propinas, bolsas, acordos de pagamento', lastSync: '15 Fev 2026 — 08:05', status: 'ok', records: '1.247 registos', viability: 'H' },
  { id: 'summaries', name: 'Plataforma de Sumários', description: 'Presenças e faltas em aulas', lastSync: '15 Fev 2026 — 08:10', status: 'ok', records: '18.432 registos', viability: 'H' },
  { id: 'moodle', name: 'Moodle / LMS', description: 'Acessos e downloads de materiais', lastSync: '15 Fev 2026 — 08:15', status: 'warning', records: '9.821 registos', viability: 'M' },
]

const bmadSteps = [
  { id: 'B', label: 'Business', description: 'Centralização de dados das fontes institucionais', icon: Database, color: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-800/50', accent: '#38bdf8' },
  { id: 'M', label: 'Model', description: 'Motor de regras determinístico — cálculo do score 0–100', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/50', accent: '#fbbf24' },
  { id: 'A', label: 'Analysis', description: 'Dashboards hierarquizados por perfil de acesso', icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-950/40', border: 'border-violet-800/50', accent: '#a78bfa' },
  { id: 'D', label: 'Decision', description: 'Alertas e plano de intervenção com validação humana', icon: Bell, color: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-800/50', accent: '#fb7185' },
]

export function Pipeline() {
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
          setTimeout(() => { setCalculating(false); setDone(true); setActiveStep(null) }, 800)
        }
      }, i * 900)
    })
  }

  return (
    <>
      <TopBar title="Pipeline de Dados" subtitle="Fluxo de ingestão e cálculo — BMAD Methodology" />
      <main className="flex-1 p-8 space-y-8 overflow-auto bg-umain-background">

        {/* BMAD steps */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-muted mb-3">Metodologia BMAD</p>
          <div className="grid grid-cols-4 gap-4">
            {bmadSteps.map((step, i) => {
              const Icon = step.icon
              const isActive = activeStep === i
              const isCompleted = done || (activeStep !== null && activeStep > i)
              return (
                <Card
                  key={step.id}
                  className={cn(
                    'transition-all duration-500 overflow-hidden border',
                    isActive ? 'border-umain-accent shadow-[0_8px_32px_rgba(196,87,43,0.2)] scale-[1.02]' : 'border-umain-border',
                    isCompleted && 'border-emerald-500/50',
                    !isActive && !isCompleted && 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', step.bg, step.border)}>
                        <Icon className={cn('w-5 h-5', step.color)} />
                      </div>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className={cn('text-5xl font-black leading-none mb-2 drop-shadow-sm', step.color)}>{step.id}</p>
                    <p className="text-sm font-bold text-umain-text tracking-tight">{step.label}</p>
                    <p className="text-xs text-umain-text-muted mt-1 leading-relaxed">{step.description}</p>
                    {isActive && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-umain-accent font-bold">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        A processar...
                      </div>
                    )}
                  </CardContent>
                  <div
                    className={cn('h-0.5 transition-all duration-500', isActive || isCompleted ? 'opacity-100' : 'opacity-0')}
                    style={{ backgroundColor: step.accent }}
                  />
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
                    'px-6 py-4 grid grid-cols-[16px_1fr_auto_auto] gap-6 items-center transition-colors duration-300',
                    activeStep === 0 && 'bg-sky-950/20'
                  )}
                >
                  <div className={cn('w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor]', source.status === 'ok' ? 'bg-emerald-400 text-emerald-400' : 'bg-amber-400 text-amber-400')} />
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
