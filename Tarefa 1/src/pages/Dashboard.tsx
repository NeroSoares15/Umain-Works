import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { RiskBadge } from '../components/ui/RiskBadge'
import { Activity, AlertTriangle, CheckCircle2, ChevronRight, FileText, Download } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { students } from '../data/students'
import { alerts } from '../data/alerts'
import { scoreToLevel } from '../lib/riskUtils'
import { cn } from '../lib/utils'
import { useAppContext } from '../contexts/AppContext'

const obfuscateName = (name: string, isObs: boolean) => {
  if (!isObs) return name;
  return name.split(' ').map((n) => n[0] + '***').join(' ')
}

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

export function Dashboard() {
  const navigate = useNavigate()
  const [courseFilter, setCourseFilter] = useState('Todos')
  const [riskFilter, setRiskFilter] = useState('Todos')
  const { activeProfileId, settings } = useAppContext()
  const isObs = activeProfileId === 'obs'

  const filtered = students.filter(s => {
    const courseOk = courseFilter === 'Todos' || s.course === courseFilter
    const level = scoreToLevel(s.riskScore, settings.riskThresholds)
    const riskOk = riskFilter === 'Todos' ||
      (riskFilter === 'Risco Alto' && level === 'high') ||
      (riskFilter === 'Risco Médio' && level === 'medium') ||
      (riskFilter === 'Risco Baixo' && level === 'low') ||
      (riskFilter === 'Sem Risco' && level === 'none')
    return courseOk && riskOk
  })

  const highCount = students.filter(s => scoreToLevel(s.riskScore, settings.riskThresholds) === 'high').length
  const mediumCount = students.filter(s => scoreToLevel(s.riskScore, settings.riskThresholds) === 'medium').length
  const interventionsThisMonth = students.flatMap(s => s.interventions).filter(i => i.date.startsWith('2026-02')).length

  const safeCount = students.length - highCount
  const retentionRate = Math.round((safeCount / students.length) * 100)
  
  const roiEstimado = students.reduce((acc, curr) => {
    if (curr.interventions.length > 0 && curr.indicators.financial.monthlyFee) {
      return acc + (curr.indicators.financial.monthlyFee * 10)
    }
    return acc
  }, 0)

  const pieData = [
    { name: 'Risco Alto', value: highCount, color: PIE_COLORS.high },
    { name: 'Risco Médio', value: mediumCount, color: PIE_COLORS.medium },
    { name: 'Risco Baixo', value: students.filter(s => scoreToLevel(s.riskScore, settings.riskThresholds) === 'low').length, color: PIE_COLORS.low },
    { name: 'Sem Risco', value: students.filter(s => scoreToLevel(s.riskScore, settings.riskThresholds) === 'none').length, color: PIE_COLORS.none },
  ]

  const recentAlerts = alerts.filter(a => a.status === 'pending').slice(0, 4)

  return (
    <>
      <main className="flex-1 px-4 pb-4 md:px-6 md:pb-6 lg:px-10 lg:pb-10 pt-4 overflow-auto relative z-10 w-full max-w-[1920px] mx-auto">

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-min animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">

          {/* Top Row KPIs */}
          <div className="col-span-1 md:col-span-1">
            <KpiCard title="Taxa de Retenção Atual" value={`${retentionRate}%`} subtitle={`${students.length} alunos monitorizados`} icon={Activity} iconColor="text-umain-accent" iconBg="bg-transparent" />
          </div>
          <div className="col-span-1 md:col-span-1">
            <KpiCard title="Alunos em Risco Alto" value={highCount} subtitle="Score > 80" icon={AlertTriangle} iconColor="text-red-500" iconBg="bg-transparent" />
          </div>
          <div className="col-span-1 md:col-span-1">
            <KpiCard title="Intervenções com Sucesso" value={interventionsThisMonth} subtitle="Este semestre" icon={CheckCircle2} iconColor="text-emerald-500" iconBg="bg-transparent" />
          </div>
          <div className="col-span-1 md:col-span-1">
            <KpiCard title="ROI Estimado" value={`${roiEstimado} €`} subtitle="Propinas retidas (Sucesso)" icon={FileText} iconColor="text-white" iconBg="bg-transparent" />
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-6">

            {/* Table Section */}
            <div className="mt-4 md:mt-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <Card className="overflow-hidden bg-white border-[#e5e7eb] shadow-sm">
                <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e7eb]">
                  <Label>Tabela de Risco dos Alunos</Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 bg-[#f4eee3] px-3 py-1.5 rounded-lg border border-[#e5e7eb]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                      <span className="text-xs font-bold text-[#111827] tracking-widest uppercase">Anonimizado</span>
                    </div>
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
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-umain-text rounded-lg hover:bg-umain-text/90 transition-colors shadow-sm md:ml-2">
                       <Download className="w-3.5 h-3.5" />
                       Relatório Completo
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <div className="min-w-[1000px] px-6 py-4 grid grid-cols-[80px_1.5fr_1.5fr_60px_100px_1.5fr_1.5fr_100px_40px] gap-4 border-b border-umain-border bg-white">
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
                  <div className="divide-y divide-[#e5e7eb]">
                    {filtered.sort((a, b) => b.riskScore - a.riskScore).slice(0, 10).map((student, i) => {
                      const level = scoreToLevel(student.riskScore, settings.riskThresholds)
                      return (
                        <div
                          key={student.id}
                          className={cn(
                            'px-6 py-4 grid grid-cols-[80px_1.5fr_1.5fr_60px_100px_1.5fr_1.5fr_100px_40px] gap-4 items-center group/row',
                            'border-l-2 hover:bg-[#f9fafb] bg-white transition-all duration-300 cursor-pointer',
                            'animate-in fade-in slide-in-from-bottom-2 fill-mode-both',
                            ROW_BORDER[level]
                          )}
                          style={{ animationDelay: `${i * 50}ms` }}
                          onClick={() => navigate(`/students/${student.id}`)}
                        >
                          <span className="text-xs font-mono text-[#6b7280]">{isObs ? '***' : student.number}</span>
                          <span className="text-sm font-semibold text-[#111827] group-hover/row:text-[#c15b38] truncate transition-colors">{isObs ? obfuscateName(student.name, isObs) : student.name}</span>
                          <span className="text-xs text-[#6b7280] truncate mt-0.5">{student.course}</span>
                          <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wide">LIC.</span>
                          <RiskBadge score={student.riskScore} />
                          <span className="text-xs text-umain-text-muted truncate">
                           {student.indicators.academic.negativeGrades > 0 ? 'Baixo Desempenho' : 'Faltas / Motivacional'}
                          </span>
                          <span className="text-xs text-umain-text-muted truncate">
                           {student.interventions.length > 0 ? student.interventions[student.interventions.length - 1].type : 'Sem intervenções'}
                          </span>
                          <span className="flex justify-start">
                           {student.interventions.length > 0 ? (
                             <span className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[9px] uppercase font-bold tracking-widest whitespace-nowrap">Em Progresso</span>
                           ) : (
                             <span className="px-2 py-1 bg-umain-muted/20 text-umain-text-muted border border-umain-border/50 rounded text-[9px] uppercase font-bold tracking-widest whitespace-nowrap">Pendente</span>
                           )}
                          </span>
                          <ChevronRight className="w-5 h-5 text-umain-border group-hover/row:text-umain-accent transition-colors translate-x-0 group-hover/row:translate-x-1" />
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Pagination Footer */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#e5e7eb] bg-umain-surface">
                   <p className="text-xs text-umain-text-muted">A mostrar <span className="font-bold text-umain-text">1-10</span> de <span className="font-bold text-umain-text">{filtered.length}</span> alunos</p>
                   <div className="flex items-center gap-2">
                     <button className="px-3 py-1.5 border border-umain-border rounded-lg text-xs font-semibold text-umain-text bg-white hover:bg-umain-background transition-colors disabled:opacity-50" disabled>Anterior</button>
                     <button className="px-3 py-1.5 border border-umain-border rounded-lg text-xs font-semibold text-umain-text bg-white hover:bg-umain-background transition-colors hover:border-umain-accent/40">Próxima</button>
                   </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column (Side Panel) */}
          <div className="col-span-1 flex flex-col gap-6">
            <Card className="flex-1 bg-white border-[#e5e7eb] shadow-sm flex flex-col p-6 items-center justify-center">
              <div className="w-full flex justify-between items-center mb-6">
                <Label>Distribuição de Risco</Label>
              </div>
              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#111827', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-[#6b7280] font-medium truncate">{d.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Label>Alertas Pendentes</Label>
              <div className="space-y-3">
                {recentAlerts.map(alert => {
                   const student = students.find(s => s.id === alert.studentId)
                   if (!student) return null
                   return (
                     <div key={alert.id} className="p-4 bg-white border border-[#e5e7eb] shadow-sm rounded-xl hover:border-[#c15b38] transition-colors cursor-pointer" onClick={() => navigate(`/students/${student.id}`)}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-sm text-[#111827]">{isObs ? obfuscateName(student.name, isObs) : student.name}</p>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-[#ef4444] px-2 py-0.5 rounded border border-[#ef4444]/20 bg-[#ef4444]/10">Risco Alto</span>
                        </div>
                        <p className="text-xs text-[#6b7280] font-medium line-clamp-2">{alert.reason}</p>
                        <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest mt-2">{student.course}</p>
                     </div>
                   )
                })}
              </div>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
