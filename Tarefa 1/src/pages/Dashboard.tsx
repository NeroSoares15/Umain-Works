import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, AlertTriangle, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react'
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

  const recentAlerts = alerts.filter(a => a.status === 'pending').slice(0, 3)

  return (
    <>
      <TopBar title="Dashboard Operacional" subtitle="Universidade X — 2025/2026" />
      <main className="flex-1 p-8 space-y-8 overflow-auto bg-umain-background">

        <div className="grid grid-cols-4 gap-4">
          <KpiCard title="Estudantes Monitorizados" value={students.length} icon={Users} />
          <KpiCard title="Risco Alto" value={highCount} subtitle="Intervenção prioritária" icon={AlertTriangle} iconColor="text-red-400" iconBg="bg-red-500/10" />
          <KpiCard title="Risco Médio" value={mediumCount} subtitle="Acompanhamento ativo" icon={AlertCircle} iconColor="text-amber-400" iconBg="bg-amber-500/10" />
          <KpiCard title="Intervenções em Fev" value={interventionsThisMonth} subtitle="Este mês" icon={CheckCircle2} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Estudantes em Monitorização</Label>
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
              </div>
            </div>
            <Card>
              <div className="px-6 py-3 grid grid-cols-[1fr_144px_110px_40px] gap-4 border-b border-umain-border">
                <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted">Estudante</p>
                <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted">Score</p>
                <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-umain-text-muted">Nível</p>
                <span />
              </div>
              <div className="divide-y divide-umain-border">
                {filtered.sort((a, b) => b.riskScore - a.riskScore).map(student => {
                  const level = scoreToLevel(student.riskScore)
                  return (
                    <div
                      key={student.id}
                      className={cn(
                        'px-6 py-3.5 grid grid-cols-[1fr_144px_110px_40px] gap-4 items-center',
                        'border-l-2 hover:bg-umain-muted/50 transition-colors cursor-pointer',
                        ROW_BORDER[level]
                      )}
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-umain-muted flex items-center justify-center shrink-0 border border-umain-border">
                          <span className="text-umain-text-muted text-xs font-bold">
                            {student.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-umain-text truncate">{student.name}</p>
                          <p className="text-xs text-umain-text-muted truncate">{student.course} · {student.year}º Ano</p>
                        </div>
                      </div>
                      <ScoreBar score={student.riskScore} />
                      <RiskBadge score={student.riskScore} />
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/students/${student.id}`) }}
                        className="p-2 rounded-lg hover:bg-umain-accent/10 transition-colors text-umain-accent ml-auto"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Distribuição de Risco</Label>
              <Card>
                <CardContent className="pt-4 pb-2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} estudantes`]} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc' }} />
                      <Legend iconSize={6} iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Label>Alertas Pendentes</Label>
              <Card>
                <div className="divide-y divide-umain-border">
                  {recentAlerts.map(alert => (
                    <div key={alert.id} className="px-5 py-4 hover:bg-umain-muted/30 transition-colors cursor-pointer anim-fade-in">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-sm font-semibold text-umain-text leading-snug">{alert.studentName}</p>
                        <RiskBadge score={alert.level === 'high' ? 80 : 50} />
                      </div>
                      <p className="text-xs text-umain-text-muted line-clamp-2 leading-relaxed">{alert.reason}</p>
                      <p className="text-[10px] text-umain-text-muted/60 mt-1.5 font-bold tracking-widest uppercase">{alert.course}</p>
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
