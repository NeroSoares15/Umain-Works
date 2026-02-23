import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, AlertTriangle, AlertCircle, CheckCircle2, ArrowUpRight, Download } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { RiskBadge } from '../components/ui/RiskBadge'
import { ScoreBar } from '../components/ui/ScoreBar'
import { students } from '../data/students'
import { alerts } from '../data/alerts'
import { scoreToLevel } from '../lib/riskUtils'
import { cn } from '../lib/utils'

const COURSES = ['Todos', 'Engenharia Informática', 'Gestão de Empresas', 'Enfermagem', 'Design de Comunicação', 'Contabilidade e Fiscalidade']
const RISK_FILTERS = ['Todos', 'Risco Alto', 'Risco Médio', 'Risco Baixo', 'Sem Risco']
const PIE_COLORS: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6', none: '#10b981' }

const ROW_BORDER: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-blue-500',
  none: 'border-l-transparent',
}

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">{children}</p>
}

export function Dashboard() {
  const navigate = useNavigate()
  const [courseFilter, setCourseFilter] = useState('Todos')
  const [riskFilter, setRiskFilter] = useState('Todos')

  const filtered = students.filter(s => {
    const courseOk = courseFilter === 'Todos' || s.course === courseFilter
    const level = scoreToLevel(s.riskScore)
    const riskOk = riskFilter === 'Todos' ||
      (riskFilter === 'Risco Alto' && level === 'high') ||
      (riskFilter === 'Risco Médio' && level === 'medium') ||
      (riskFilter === 'Risco Baixo' && level === 'low') ||
      (riskFilter === 'Sem Risco' && level === 'none')
    return courseOk && riskOk
  })

  const highCount = students.filter(s => scoreToLevel(s.riskScore) === 'high').length
  const mediumCount = students.filter(s => scoreToLevel(s.riskScore) === 'medium').length
  const interventionsThisMonth = students.flatMap(s => s.interventions).filter(i => i.date.startsWith('2026-02')).length

  const pieData = [
    { name: 'Risco Alto', value: highCount, color: PIE_COLORS.high },
    { name: 'Risco Médio', value: mediumCount, color: PIE_COLORS.medium },
    { name: 'Risco Baixo', value: students.filter(s => scoreToLevel(s.riskScore) === 'low').length, color: PIE_COLORS.low },
    { name: 'Sem Risco', value: students.filter(s => scoreToLevel(s.riskScore) === 'none').length, color: PIE_COLORS.none },
  ]

  const recentAlerts = alerts.filter(a => a.status === 'pending').slice(0, 4)

  return (
    <>
      <TopBar title="Dashboard Operacional" subtitle="Universidade X — 2025/2026" />
      <main className="flex-1 p-6 md:p-10 overflow-auto relative z-10 w-full max-w-[1920px] mx-auto">

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">

          {/* Top Row KPIs */}
          <div className="col-span-1 md:col-span-1">
            <KpiCard title="Estudantes Monitorizados" value={students.length} icon={Users} />
          </div>
          <div className="col-span-1 md:col-span-1">
            <KpiCard title="Risco Alto" value={highCount} subtitle="Intervenção prioritária" icon={AlertTriangle} iconColor="text-red-400" iconBg="bg-red-500/10" />
          </div>
          <div className="col-span-1 md:col-span-1">
            <KpiCard title="Risco Médio" value={mediumCount} subtitle="Acompanhamento ativo" icon={AlertCircle} iconColor="text-amber-400" iconBg="bg-amber-500/10" />
          </div>
          <div className="col-span-1 md:col-span-1">
            <KpiCard title="Intervenções em Fev" value={interventionsThisMonth} subtitle="Este mês" icon={CheckCircle2} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" />
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Label>Monitorização Holística</Label>
              <div className="flex gap-2">
                <select
                  value={courseFilter}
                  onChange={e => setCourseFilter(e.target.value)}
                  className="text-xs border border-umain-border rounded-xl px-3 py-2 bg-umain-surface text-umain-text focus:outline-none focus:ring-2 focus:ring-umain-accent/40 cursor-pointer"
                >
                  {COURSES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select
                  value={riskFilter}
                  onChange={e => setRiskFilter(e.target.value)}
                  className="text-xs border border-umain-border rounded-xl px-3 py-2 bg-umain-surface text-umain-text focus:outline-none focus:ring-2 focus:ring-umain-accent/40 cursor-pointer"
                >
                  {RISK_FILTERS.map(r => <option key={r}>{r}</option>)}
                </select>
                <div className="w-px h-8 bg-umain-border mx-1 hidden sm:block" />
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-umain-surface border border-umain-border text-umain-text hover:bg-umain-muted/20 transition-colors">
                  <Download className="w-3.5 h-3.5 text-umain-text-muted" />
                  Exportar
                </button>
              </div>
            </div>
            <Card className="flex-1">
              <div className="px-6 py-4 grid grid-cols-[1fr_144px_110px_40px] gap-4 border-b border-umain-border/50 bg-umain-surface/50 backdrop-blur-md">
                <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted">Estudante</p>
                <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted">Score</p>
                <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted">Nível</p>
                <span />
              </div>
              <div className="divide-y divide-umain-border/30">
                {filtered.sort((a, b) => b.riskScore - a.riskScore).map((student, i) => {
                  const level = scoreToLevel(student.riskScore)
                  return (
                    <div
                      key={student.id}
                      className={cn(
                        'px-6 py-4 grid grid-cols-[1fr_144px_110px_40px] gap-4 items-center group/row',
                        'border-l-2 hover:bg-umain-muted/10 transition-all duration-300 cursor-pointer',
                        ROW_BORDER[level]
                      )}
                      style={{ animationDelay: `${i * 50}ms` }}
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-umain-surface flex items-center justify-center shrink-0 border border-umain-border shadow-sm group-hover/row:border-umain-accent/50 transition-colors">
                          <span className="text-umain-text-muted text-xs font-bold group-hover/row:text-umain-accent transition-colors">
                            {student.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-umain-text truncate group-hover/row:text-white transition-colors">{student.name}</p>
                          <p className="text-xs text-umain-text-muted truncate mt-0.5">{student.course} · {student.year}º Ano</p>
                        </div>
                      </div>
                      <ScoreBar score={student.riskScore} />
                      <RiskBadge score={student.riskScore} />
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/students/${student.id}`) }}
                        className="p-2 rounded-xl hover:bg-umain-accent text-umain-accent hover:text-white transition-all ml-auto opacity-0 group-hover/row:opacity-100 -translate-x-2 group-hover/row:translate-x-0"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right Column (Side Panel) */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
            <div className="flex flex-col gap-3 h-full">
              <Label>Distribuição de Risco</Label>
              <Card className="flex-1 flex flex-col justify-center">
                <CardContent className="pt-6 pb-2">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none" cornerRadius={4}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} className="drop-shadow-lg hover:opacity-80 transition-opacity outline-none" style={{ outline: 'none' }} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} estudantes`]} contentStyle={{ backgroundColor: '#020817', borderColor: '#1e293b', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', padding: '12px' }} itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }} />
                      <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: '20px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Alertas Pendentes</Label>
              <Card>
                <div className="divide-y divide-umain-border/30">
                  {recentAlerts.map(alert => (
                    <div key={alert.id} className="px-6 py-5 hover:bg-umain-muted/10 transition-colors cursor-pointer group/alert">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-bold text-umain-text leading-snug group-hover/alert:text-white transition-colors">{alert.studentName}</p>
                        <RiskBadge score={alert.level === 'high' ? 80 : 50} />
                      </div>
                      <p className="text-xs text-umain-text-muted line-clamp-2 leading-relaxed">{alert.reason}</p>
                      <p className="text-[10px] text-umain-text-muted/50 mt-2 font-bold tracking-widest uppercase">{alert.course}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
