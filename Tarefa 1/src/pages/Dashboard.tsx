import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { ChartFrame } from '../components/ui/ChartFrame'
import { KpiCard } from '../components/ui/KpiCard'
import { RiskBadge } from '../components/ui/RiskBadge'
import { Activity, AlertTriangle, CheckCircle2, ChevronRight, EyeOff, FileText, Filter, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { students } from '../data/students'
import { alerts } from '../data/alerts'
import { cn } from '../lib/utils'
import {
  canViewRoiMetrics,
  canViewStudentProfiles,
} from '../lib/accessControl'
import {
  getAlertDisplayCourse,
  getAlertDisplayReason,
  getAlertDisplayTitle,
  getPrimaryRiskCause,
  getStudentDisplayCourse,
  getStudentDisplayName,
  getStudentDisplayNumber,
  getStudentRiskSnapshot,
  getVisibleLastIntervention,
} from '../lib/studentRisk'
import { useAppContext } from '../contexts/useAppContext'

const COURSES = [...new Set(students.map(s => s.course))]
const RISK_FILTERS = ['Todos', 'Risco Alto', 'Risco Médio', 'Risco Baixo', 'Sem Risco']
const PIE_COLORS: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6', none: '#10b981' }

const ROW_BORDER: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-blue-500',
  none: 'border-l-emerald-500',
}

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">{children}</p>
}

function OverviewChip({
  label,
  note,
  value,
}: {
  label: string
  note: string
  value: string | number
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 backdrop-blur-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-umain-text-muted">{label}</p>
      <p className="mt-2 text-lg font-black leading-tight text-white">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-umain-text-muted/80">{note}</p>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const [courseFilter, setCourseFilter] = useState('Todos')
  const [riskFilter, setRiskFilter] = useState('Todos')
  const { activeProfileId, settings } = useAppContext()
  const canOpenProfiles = canViewStudentProfiles(activeProfileId)
  const canSeeRoi = canViewRoiMetrics(activeProfileId)

  const studentRows = students.map((student) => ({
    snapshot: getStudentRiskSnapshot(student, settings),
    student,
  }))

  const filtered = studentRows.filter(({ student, snapshot }) => {
    const courseOk = courseFilter === 'Todos' || student.course === courseFilter
    const level = snapshot.level
    const riskOk = riskFilter === 'Todos' ||
      (riskFilter === 'Risco Alto' && level === 'high') ||
      (riskFilter === 'Risco Médio' && level === 'medium') ||
      (riskFilter === 'Risco Baixo' && level === 'low') ||
      (riskFilter === 'Sem Risco' && level === 'none')
    return courseOk && riskOk
  })

  const highCount = studentRows.filter(({ snapshot }) => snapshot.level === 'high').length
  const mediumCount = studentRows.filter(({ snapshot }) => snapshot.level === 'medium').length
  const lowCount = studentRows.filter(({ snapshot }) => snapshot.level === 'low').length
  const noRiskCount = studentRows.filter(({ snapshot }) => snapshot.level === 'none').length
  const interventionsThisMonth = students.flatMap(s => s.interventions).filter(i => i.date.startsWith('2026-02')).length

  const safeCount = students.length - highCount
  const retentionRate = Math.round((safeCount / students.length) * 100)
  
  const roiEstimado = studentRows.reduce((acc, { student }) => {
    if (student.interventions.length > 0 && student.indicators.financial.monthlyFee) {
      return acc + (student.indicators.financial.monthlyFee * 10)
    }
    return acc
  }, 0)

  const pieData = [
    { name: 'Risco Alto', value: highCount, color: PIE_COLORS.high },
    { name: 'Risco Médio', value: mediumCount, color: PIE_COLORS.medium },
    { name: 'Risco Baixo', value: lowCount, color: PIE_COLORS.low },
    { name: 'Sem Risco', value: noRiskCount, color: PIE_COLORS.none },
  ]

  const recentAlerts = alerts.filter(a => a.status === 'pending').slice(0, 4)
  const sortedFiltered = [...filtered].sort((left, right) => right.snapshot.score - left.snapshot.score)
  const watchlistCount = highCount + mediumCount
  const activeFilters = [
    courseFilter !== 'Todos' ? courseFilter : null,
    riskFilter !== 'Todos' ? riskFilter : null,
  ].filter((value): value is string => Boolean(value))

  const leadingCause = Object.entries(
    sortedFiltered.reduce<Record<string, number>>((accumulator, { student }) => {
      const cause = getPrimaryRiskCause(student, settings, activeProfileId)
      accumulator[cause] = (accumulator[cause] ?? 0) + 1
      return accumulator
    }, {}),
  ).sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'Sem sinais dominantes'

  const coursePressure = COURSES.map((course) => ({
    course,
    priority: studentRows.filter(({ student, snapshot }) =>
      student.course === course && (snapshot.level === 'high' || snapshot.level === 'medium'),
    ).length,
  })).sort((left, right) => right.priority - left.priority)

  const mostExposedCourse = coursePressure[0]
  const summaryTone = canOpenProfiles
    ? 'from-orange-500/18 via-orange-500/6 to-transparent'
    : 'from-sky-500/18 via-emerald-500/8 to-transparent'
  const summaryBorder = canOpenProfiles ? 'border-orange-500/20' : 'border-emerald-500/20'
  const modeLabel = canOpenProfiles ? 'Cockpit Operacional' : 'Vista Protegida'
  const headline = canOpenProfiles
    ? `${highCount} casos críticos pedem seguimento nas próximas 72 horas`
    : `${watchlistCount} perfis agregados concentram a maior pressão de risco`
  const summaryText = canOpenProfiles
    ? 'Cruza alertas, curso sob pressão e histórico recente para decidir onde a equipa deve intervir primeiro.'
    : 'A análise preserva identidade e detalhes sensíveis, mas mantém sinal suficiente para comparar carga de risco entre cursos e períodos.'
  const nextAction = canOpenProfiles
    ? 'Priorizar contacto com risco alto e validar escalonamento dos casos médios mais recentes.'
    : 'Usar a distribuição agregada para identificar concentração de risco antes de envolver equipas operacionais.'
  const heroStats = [
    {
      label: 'Alertas pendentes',
      note: `${recentAlerts.length} itens na fila imediata`,
      value: recentAlerts.length,
    },
    {
      label: 'Curso sob maior pressão',
      note: `${mostExposedCourse?.priority ?? 0} perfis prioritários`,
      value: mostExposedCourse?.course ?? 'Sem dados',
    },
    {
      label: 'Sinal dominante',
      note: activeFilters.length ? 'Reflete os filtros atuais' : 'Padrão mais recorrente no radar',
      value: leadingCause,
    },
  ]

  return (
    <>
      <TopBar title="Dashboard Operacional" subtitle="IPTomar — 2025/2026" />
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-auto relative z-10 w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 auto-rows-min animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
          <div className="xl:col-span-8 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
            <Card className={cn('overflow-hidden border bg-umain-surface/80 backdrop-blur-2xl', summaryBorder)}>
              <div className={cn('absolute inset-0 bg-gradient-to-br', summaryTone)} />
              <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)] opacity-70" />
              <div className="relative z-10 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]',
                    canOpenProfiles
                      ? 'border-orange-400/25 bg-orange-400/10 text-orange-300'
                      : 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
                  )}>
                    <Sparkles className="w-3 h-3" />
                    {modeLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-umain-text-muted">
                    <ShieldCheck className="w-3 h-3" />
                    {canOpenProfiles ? 'Acesso nominal ativo' : 'Redação sensível ativa'}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-umain-text-muted">
                    <Filter className="w-3 h-3" />
                    {activeFilters.length ? `${activeFilters.length} filtros aplicados` : 'Sem filtros ativos'}
                  </span>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-umain-text-muted">Radar do semestre</p>
                    <h2 className="mt-3 max-w-3xl text-3xl md:text-4xl font-black leading-tight text-white">
                      {headline}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-umain-text-muted/90">
                      {summaryText}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {heroStats.map((item) => (
                        <OverviewChip key={item.label} label={item.label} value={item.value} note={item.note} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">
                        <Target className="h-5 w-5 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-umain-text-muted">Próxima melhor ação</p>
                        <p className="mt-1 text-lg font-bold leading-snug text-white">{nextAction}</p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-umain-text-muted">Janela de prioridade</p>
                        <p className="mt-1 font-semibold text-white">{watchlistCount} perfis em risco médio/alto</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-umain-text-muted">Filtro em destaque</p>
                        <p className="mt-1 font-semibold text-white">{activeFilters.join(' · ') || 'Cobertura global da coorte'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
            <Card className="h-full border-umain-border/50 bg-umain-surface/80 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label>Distribuição de Risco</Label>
                    <p className="mt-2 text-sm leading-relaxed text-umain-text-muted">
                      Equilíbrio atual entre perfis críticos, monitorização ativa e coorte estabilizada.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                    <p className="text-2xl font-black text-white">{students.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-umain-text-muted">monitorizados</p>
                  </div>
                </div>

                <div className="relative mt-6">
                  <ChartFrame className="relative h-56">
                    {({ height, width }) => (
                      <PieChart width={width} height={height}>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={92} paddingAngle={5} dataKey="value" stroke="none">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(2, 8, 23, 0.8)', borderColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', backdropFilter: 'blur(16px)', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }} />
                      </PieChart>
                    )}
                  </ChartFrame>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full border border-white/10 bg-black/35 px-5 py-4 text-center backdrop-blur">
                      <p className="text-3xl font-black text-white">{watchlistCount}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-umain-text-muted">em observação</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {pieData.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-semibold text-white">{item.name}</span>
                      </div>
                      <p className="mt-2 text-xl font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-3">
            <KpiCard title="Taxa de Retenção Atual" value={`${retentionRate}%`} subtitle={`${students.length} alunos monitorizados`} icon={Activity} iconColor="text-umain-accent" iconBg="bg-transparent" />
          </div>
          <div className="xl:col-span-3">
            <KpiCard title="Alunos em Risco Alto" value={highCount} subtitle="Score > 80" icon={AlertTriangle} iconColor="text-red-500" iconBg="bg-transparent" />
          </div>
          <div className="xl:col-span-3">
            <KpiCard title="Intervenções com Sucesso" value={interventionsThisMonth} subtitle="Este semestre" icon={CheckCircle2} iconColor="text-emerald-500" iconBg="bg-transparent" />
          </div>
          <div className="xl:col-span-3">
            {canSeeRoi ? (
              <KpiCard title="ROI Estimado" value={`${roiEstimado} €`} subtitle="Propinas retidas (Sucesso)" icon={FileText} iconColor="text-white" iconBg="bg-transparent" />
            ) : (
              <KpiCard title="Perfis Protegidos" value={students.length} subtitle="Vista anonimizada do observatório" icon={EyeOff} iconColor="text-umain-text" iconBg="bg-transparent" />
            )}
          </div>

          <div className="xl:col-span-8 mt-1 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            <Card className="overflow-hidden border-umain-border/50 bg-umain-surface/80 backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
              <div className="relative z-10">
                <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-umain-border/50">
                  <div>
                    <Label>Tabela de Risco dos Alunos</Label>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em]">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-umain-text-muted">
                        {sortedFiltered.length} perfis visíveis
                      </span>
                      {!canOpenProfiles && (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                          Vista agregada
                        </span>
                      )}
                      {activeFilters.map((filter) => (
                        <span key={filter} className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-orange-300">
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                      className="text-xs border border-umain-border rounded-lg px-3 py-1.5 bg-umain-surface text-umain-text focus:outline-none focus:ring-2 focus:ring-umain-accent/40 cursor-pointer h-fit"
                    >
                      <option value="Todos">Todos</option>
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value)}
                      className="text-xs border border-umain-border rounded-lg px-3 py-1.5 bg-umain-surface text-umain-text focus:outline-none focus:ring-2 focus:ring-umain-accent/40 cursor-pointer h-fit"
                    >
                      {RISK_FILTERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <div className="min-w-[1000px] px-6 py-4 grid grid-cols-[80px_1.5fr_1.5fr_60px_100px_1.5fr_1.5fr_100px_40px] gap-4 border-b border-umain-border/50 bg-transparent">
                    <Label>N. Aluno</Label>
                    <Label>Aluno</Label>
                    <Label>Curso</Label>
                    <Label>Grau</Label>
                    <Label>Score</Label>
                    <Label>Causa</Label>
                    <Label>Últ. Intervenção</Label>
                    <Label>Status</Label>
                    <span />
                  </div>
                  <div className="divide-y divide-umain-border/30">
                    {sortedFiltered.slice(0, 10).map(({ student, snapshot }, i) => {
                      return (
                        <div
                          key={student.id}
                          className={cn(
                            'px-6 py-4 grid grid-cols-[80px_1.5fr_1.5fr_60px_100px_1.5fr_1.5fr_100px_40px] gap-4 items-center group/row',
                            'border-l-2 transition-all duration-300',
                            canOpenProfiles ? 'hover:bg-umain-muted/10 cursor-pointer' : 'cursor-default',
                            'animate-in fade-in slide-in-from-bottom-2 fill-mode-both',
                            ROW_BORDER[snapshot.level]
                          )}
                          style={{ animationDelay: `${i * 50}ms` }}
                          onClick={() => {
                            if (canOpenProfiles) {
                              navigate(`/students/${student.id}`)
                            }
                          }}
                        >
                          <span className="text-xs font-mono text-umain-text-muted">{getStudentDisplayNumber(student, activeProfileId)}</span>
                          <span className="text-sm font-semibold text-umain-text group-hover/row:text-white truncate transition-colors">
                            {getStudentDisplayName(student, activeProfileId, i)}
                          </span>
                          <span className="text-xs text-umain-text-muted truncate mt-0.5">{getStudentDisplayCourse(student, activeProfileId)}</span>
                          <span className="text-[10px] uppercase font-bold text-umain-text-muted tracking-wide">LIC.</span>
                          <RiskBadge score={snapshot.score} />
                          <span className="text-xs text-umain-text-muted truncate">
                           {getPrimaryRiskCause(student, settings, activeProfileId)}
                          </span>
                          <span className="text-xs text-umain-text-muted truncate">
                           {getVisibleLastIntervention(student, activeProfileId)}
                          </span>
                          <span className="flex justify-start">
                            {student.interventions.length > 0 ? (
                             <span className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[9px] uppercase font-bold tracking-widest whitespace-nowrap">
                               {canOpenProfiles ? 'Em Progresso' : 'Monitorizado'}
                             </span>
                           ) : (
                             <span className="px-2 py-1 bg-umain-muted/20 text-umain-text-muted border border-umain-border/50 rounded text-[9px] uppercase font-bold tracking-widest whitespace-nowrap">Pendente</span>
                           )}
                          </span>
                          <ChevronRight className={cn('w-5 h-5 text-umain-border transition-colors translate-x-0', canOpenProfiles && 'group-hover/row:text-umain-accent group-hover/row:translate-x-1')} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <Card className="border-umain-border/50 bg-umain-surface/80 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Label>Alertas Pendentes</Label>
                    <p className="mt-2 text-sm leading-relaxed text-umain-text-muted">
                      Sinais que ainda pedem validação ou acompanhamento antes do próximo ciclo de processamento.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-center">
                    <p className="text-2xl font-black text-white">{recentAlerts.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-300">ativos</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                {recentAlerts.map((alert, index) => {
                  const student = students.find(s => s.id === alert.studentId)
                  if (!student) return null
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        'group relative overflow-hidden rounded-2xl border border-umain-border/50 bg-black/20 p-4 transition-all duration-300',
                        canOpenProfiles ? 'cursor-pointer hover:border-red-500/50 hover:bg-black/30' : 'cursor-default',
                      )}
                      onClick={() => {
                        if (canOpenProfiles) {
                          navigate(`/students/${student.id}`)
                        }
                      }}
                    >
                      <div className={cn(
                        'absolute inset-y-0 left-0 w-1',
                        alert.level === 'high' ? 'bg-red-500' : 'bg-amber-500',
                      )} />
                      <div className="pl-3">
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-semibold text-sm text-white leading-snug">
                            {getAlertDisplayTitle(alert, students, activeProfileId, index)}
                          </p>
                          <span className={cn(
                            'text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border whitespace-nowrap',
                            alert.level === 'high'
                              ? 'text-red-500 border-red-500/20 bg-red-500/10'
                              : 'text-amber-500 border-amber-500/20 bg-amber-500/10',
                          )}>
                            {alert.level === 'high' ? 'Risco Alto' : 'Risco Médio'}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-umain-text-muted line-clamp-3">
                          {getAlertDisplayReason(alert, activeProfileId)}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-umain-text-muted/60">
                            {getAlertDisplayCourse(alert, students, activeProfileId)}
                          </p>
                          <ChevronRight className="h-4 w-4 text-umain-text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
