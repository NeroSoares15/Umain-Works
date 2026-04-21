import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { RiskBadge } from '../components/ui/RiskBadge'
import { Activity, AlertTriangle, CheckCircle2, ChevronRight, FileText, Download, Search } from 'lucide-react'
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
const STATUS_FILTERS = ['Todos', 'Pendente', 'Em Progresso']
const PIE_COLORS: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6', none: '#10b981' }

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500">{children}</p>
}

export function Dashboard() {
  const navigate = useNavigate()
  const [courseFilter, setCourseFilter] = useState('Todos')
  const [riskFilter, setRiskFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
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
    
    const status = s.interventions.length > 0 ? 'Em Progresso' : 'Pendente'
    const statusOk = statusFilter === 'Todos' || status === statusFilter

    const searchOk = searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.number.includes(searchTerm)

    return courseOk && riskOk && statusOk && searchOk
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
    <div className="flex-1 flex flex-col h-full bg-[#f9fafb]">
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-10 lg:py-8 w-full max-w-[1920px] mx-auto">

        {/* Top Row KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
          <KpiCard title="Taxa de Retenção Atual" value={`${retentionRate}%`} subtitle={`${students.length} alunos monitorizados`} icon={Activity} iconColor="text-[#C15B38]" iconBg="bg-[#f4eee3]" />
          <KpiCard title="Alunos em Risco Alto" value={highCount} subtitle="Score > 80" icon={AlertTriangle} iconColor="text-red-500" iconBg="bg-red-50" />
          <KpiCard title="Intervenções Sucesso" value={interventionsThisMonth} subtitle="Este semestre" icon={CheckCircle2} iconColor="text-emerald-500" iconBg="bg-emerald-50" />
          <KpiCard title="ROI Estimado" value={`${roiEstimado} €`} subtitle="Propinas retidas" icon={FileText} iconColor="text-blue-500" iconBg="bg-blue-50" />
        </div>

        {/* Layout Grid: Table (Left) + Sidebar (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-6 items-start">
          
          {/* Main Table Column */}
          <div className="flex flex-col gap-4 min-w-0">
            <Card className="overflow-hidden bg-white border-[#e5e7eb] shadow-sm flex flex-col">
              <div className="p-4 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white">
                <Label>Lista de Estudantes</Label>
                
                <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-auto">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Pesquisar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg pl-9 pr-3 py-2 sm:py-1.5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C15B38]/40 w-full sm:w-48"
                    />
                  </div>

                  <select 
                    value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C15B38]/40 cursor-pointer h-fit font-semibold"
                  >
                    <option value="Todos">Todos os Cursos</option>
                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  
                  <select
                    value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C15B38]/40 cursor-pointer h-fit font-semibold"
                  >
                    {RISK_FILTERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <select
                    value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C15B38]/40 cursor-pointer h-fit font-semibold"
                  >
                    {STATUS_FILTERS.map(c => <option key={c} value={c}>Status: {c}</option>)}
                  </select>

                  <button className="flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 text-xs font-bold text-white bg-[#C15B38] rounded-lg hover:bg-[#a34b2f] transition-colors shadow-sm w-full sm:w-auto mt-2 sm:mt-0">
                     <Download className="w-3.5 h-3.5" />
                     Exportar
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200 text-[11px] uppercase tracking-wider font-bold text-gray-600 whitespace-nowrap">
                      <th className="py-3 px-4 min-w-[80px]">N. Aluno</th>
                      <th className="py-3 px-4 min-w-[200px]">Nome do Aluno</th>
                      <th className="py-3 px-4 min-w-[150px]">Curso</th>
                      <th className="py-3 px-4 min-w-[100px]">Score</th>
                      <th className="py-3 px-4 min-w-[150px]">Causa Principal</th>
                      <th className="py-3 px-4 min-w-[120px]">Status</th>
                      <th className="py-3 px-4 min-w-[40px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.sort((a, b) => b.riskScore - a.riskScore).slice(0, 15).map((student) => {
                      const level = scoreToLevel(student.riskScore, settings.riskThresholds)
                      const isHigh = level === 'high'
                      const isMedium = level === 'medium'
                      const status = student.interventions.length > 0 ? 'Em Progresso' : 'Pendente'

                      return (
                        <tr
                          key={student.id}
                          onClick={() => navigate(`/students/${student.id}`)}
                          className={cn(
                            "group hover:bg-gray-50 transition-colors cursor-pointer border-l-[3px]",
                            isHigh ? "border-l-red-500" : isMedium ? "border-l-amber-500" : level === 'low' ? "border-l-blue-500" : "border-l-emerald-500"
                          )}
                        >
                          <td className="py-3 px-4 text-xs font-mono text-gray-500">{isObs ? '***' : student.number}</td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-900 group-hover:text-[#C15B38] transition-colors">{isObs ? obfuscateName(student.name, isObs) : student.name}</td>
                          <td className="py-3 px-4 text-xs font-medium text-gray-500 truncate max-w-[150px]">{student.course}</td>
                          <td className="py-3 px-4">
                            <RiskBadge score={student.riskScore} />
                          </td>
                          <td className="py-3 px-4 text-xs font-medium text-gray-600 truncate max-w-[150px]">
                             {student.indicators.academic.negativeGrades > 0 ? 'Baixo Desempenho' : 'Faltas / Motivacional'}
                          </td>
                          <td className="py-3 px-4">
                            {status === 'Em Progresso' ? (
                              <span className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">Em Progresso</span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">Pendente</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C15B38] transition-colors inline-block" />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100 bg-white">
                 <p className="text-xs font-medium text-gray-500">A mostrar <span className="font-bold text-gray-900">{Math.min(filtered.length, 15)}</span> de <span className="font-bold text-gray-900">{filtered.length}</span> alunos</p>
                 <div className="flex items-center gap-2">
                   <button className="px-3 py-1.5 border border-gray-200 rounded-md text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>Anterior</button>
                   <button className="px-3 py-1.5 border border-gray-200 rounded-md text-xs font-bold text-gray-900 hover:bg-gray-50 transition-colors hover:border-[#C15B38]/40">Próxima</button>
                 </div>
              </div>
            </Card>
          </div>

          {/* Right Column (Sticky Side Panel) */}
          <div className="xl:sticky xl:top-6 flex flex-col gap-6 max-h-[calc(100vh-40px)] overflow-y-auto custom-scrollbar pb-6 xl:pb-0">
            <Card className="bg-white border-[#e5e7eb] shadow-sm flex flex-col p-6">
              <div className="w-full flex justify-between items-center mb-6">
                <Label>Distribuição de Risco</Label>
              </div>
              <div className="h-[250px] w-full relative min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#111827', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-gray-600 font-bold truncate">{d.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Label>Alertas Críticos Recentes</Label>
              <div className="space-y-3">
                {recentAlerts.map(alert => {
                   const student = students.find(s => s.id === alert.studentId)
                   if (!student) return null
                   return (
                     <div key={alert.id} className="p-4 bg-white border border-[#e5e7eb] shadow-sm rounded-xl hover:border-[#C15B38] transition-colors cursor-pointer" onClick={() => navigate(`/students/${student.id}`)}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-[13px] text-gray-900 truncate mr-2">{isObs ? obfuscateName(student.name, isObs) : student.name}</p>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-red-600 px-2 py-0.5 rounded border border-red-200 bg-red-50 flex-shrink-0">Risco Alto</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">{alert.reason}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{student.course}</p>
                     </div>
                   )
                })}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
