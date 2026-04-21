import { useState } from 'react'
import { Card, CardContent } from '../components/ui/Card'
import { Treemap, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from 'recharts'
import { students } from '../data/students'
import { scoreToLevel } from '../lib/riskUtils'
import { useAppContext } from '../contexts/AppContext'
import { cn } from '../lib/utils'

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280]">{children}</p>
}

const COLORS = {
  high: '#ef4444', 
  medium: '#f59e0b', 
  low: '#3b82f6', 
  none: '#10b981'
}

function CustomizedContent(props: any) {
  const { depth, x, y, width, height, payload, name } = props
  const safeWidth = Math.max(0, width || 0);
  const safeHeight = Math.max(0, height || 0);

  if (safeWidth <= 0 || safeHeight <= 0) return null;

  if (depth === 1) {
    return (
      <g>
        <rect x={x} y={y} width={safeWidth} height={safeHeight} fill="rgba(243, 244, 246, 0.4)" stroke="#e5e7eb" strokeWidth={2} />
        {safeWidth > 60 && safeHeight > 30 && (
          <text x={x + 6} y={y + 18} fill="#4b5563" fontSize={11} fontWeight={700} style={{ pointerEvents: 'none', textTransform: 'uppercase' }}>
            {name ? String(name).substring(0, Math.max(0, Math.floor(safeWidth / 7))) : ''}
            {name && String(name).length > Math.floor(safeWidth / 7) ? '...' : ''}
          </text>
        )}
      </g>
    )
  }

  if (depth === 2 || depth === 3) {
    const risk = props.risk || payload?.risk || 'none'
    const color = COLORS[risk as keyof typeof COLORS] || '#ccc'
    const inset = 1
    return (
      <g>
        <rect
          x={x + inset} y={y + inset} width={Math.max(0, safeWidth - inset * 2)} height={Math.max(0, safeHeight - inset * 2)}
          style={{ fill: color, fillOpacity: 1, stroke: '#ffffff', strokeWidth: Math.min(safeWidth, safeHeight) > 10 ? 1 : 0, cursor: 'crosshair' }}
        />
      </g>
    )
  }
  return <rect x={x} y={y} width={safeWidth} height={safeHeight} fill="transparent" stroke="none" />;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    if (data.risk) {
      return (
        <div className="bg-white border border-[#e5e7eb] p-3 rounded-xl shadow-lg z-50 min-w-[200px]">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{data.course}</p>
          <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[data.risk as keyof typeof COLORS] }} />
                <p className="text-[13px] font-bold text-gray-900">{data.name}</p>
             </div>
             <p className="text-xs font-bold bg-gray-50 px-2 py-1 rounded-md text-gray-900 border border-gray-200">{data.size} {data.size === 1 ? 'aluno' : 'alunos'}</p>
          </div>
        </div>
      )
    }
  }
  return null
}

const mockPredictionData = [
  { month: 'Set', historico: 100, otimizado: 100 },
  { month: 'Out', historico: 98, otimizado: 99 },
  { month: 'Nov', historico: 95, otimizado: 98 },
  { month: 'Dez', historico: 92, otimizado: 97 },
  { month: 'Jan', historico: 88, otimizado: 96 },
  { month: 'Fev', historico: 85, otimizado: 94 },
  { month: 'Mar', historico: 80, otimizado: 92 },
  { month: 'Abr', historico: 78, otimizado: 91 },
  { month: 'Mai', historico: 75, otimizado: 90 },
  { month: 'Jun', historico: 71, otimizado: 88 },
]

export function Analysis() {
  const { settings } = useAppContext()
  const [activeTab, setActiveTab] = useState<'por-curso' | 'roi' | 'retencao'>('por-curso')

  const [successRate, setSuccessRate] = useState(40)
  const [tuition, setTuition] = useState({
    ctesp: 697, licenciatura: 697, mestrado: 1250, internacional: 3500
  })

  // Treemap logic
  const courseData = students.reduce((acc, student) => {
    const course = student.course
    const level = scoreToLevel(student.riskScore, settings.riskThresholds)
    if (!acc[course]) acc[course] = { name: course, counts: { high: 0, medium: 0, low: 0, none: 0 } }
    acc[course].counts[level] += 1
    return acc
  }, {} as Record<string, any>)

  const chartDataTreemap = [{
    name: 'Escola',
    children: Object.values(courseData).map((course: any) => ({
      name: course.name,
      children: [
        ...(course.counts.high > 0 ? [{ name: 'Risco Alto', size: course.counts.high, risk: 'high', course: course.name }] : []),
        ...(course.counts.medium > 0 ? [{ name: 'Risco Médio', size: course.counts.medium, risk: 'medium', course: course.name }] : []),
        ...(course.counts.low > 0 ? [{ name: 'Risco Baixo', size: course.counts.low, risk: 'low', course: course.name }] : []),
        ...(course.counts.none > 0 ? [{ name: 'Sem Risco', size: course.counts.none, risk: 'none', course: course.name }] : [])
      ]
    }))
  }]

  // ROI logic
  const riskCounts = { ctesp: 45, licenciatura: 120, mestrado: 35, internacional: 25 }
  const chartDataRoi = [
    { name: 'CTeSP', emRisco: riskCounts.ctesp * tuition.ctesp, retido: Math.round(riskCounts.ctesp * tuition.ctesp * (successRate / 100)) },
    { name: 'Licenciatura', emRisco: riskCounts.licenciatura * tuition.licenciatura, retido: Math.round(riskCounts.licenciatura * tuition.licenciatura * (successRate / 100)) },
    { name: 'Mestrado', emRisco: riskCounts.mestrado * tuition.mestrado, retido: Math.round(riskCounts.mestrado * tuition.mestrado * (successRate / 100)) },
    { name: 'Internacional', emRisco: riskCounts.internacional * tuition.internacional, retido: Math.round(riskCounts.internacional * tuition.internacional * (successRate / 100)) }
  ]

  const tabs = [
    { id: 'por-curso', label: 'Análise por Curso' },
    { id: 'roi', label: 'Gestão de ROI' },
    { id: 'retencao', label: 'Predição de Retenção' }
  ]

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#f9fafb]">
      {/* SubHeader with Tabs */}
      <div className="bg-white border-b border-[#e5e7eb] px-6 md:px-8 overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 max-w-[1920px] mx-auto min-w-max py-3">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                activeTab === t.id ? "bg-[#C15B38] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 md:p-8 lg:p-10 w-full max-w-[1920px] mx-auto flex flex-col gap-6">
        
        {activeTab === 'por-curso' && (
          <div className="flex flex-col gap-3">
            <Label>Heatmap de Risco (Visão Micro)</Label>
            <Card className="flex-1 flex flex-col p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex flex-wrap items-center gap-4 mb-4 mt-2 pl-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Legenda:</span>
                {Object.entries({ high: 'Risco Alto', medium: 'Risco Médio', low: 'Risco Baixo', none: 'Sem Risco' }).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: COLORS[key as keyof typeof COLORS] }} />
                        <span className="text-xs font-semibold text-gray-700">{label}</span>
                    </div>
                ))}
              </div>
              <div className="w-full h-[550px] min-h-[550px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={chartDataTreemap}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    content={<CustomizedContent />}
                    animationDuration={800}
                  >
                    <Tooltip content={<CustomTooltip />} />
                  </Treemap>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-3">
              <Label>Calculadora de Parâmetros</Label>
              <Card className="flex-1 h-full shadow-sm border-gray-200 bg-white">
                <CardContent className="p-6 space-y-6 flex flex-col h-full">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-bold text-gray-700">Eficácia da Intervenção (%)</label>
                      <span className="text-lg font-black text-[#C15B38]">{successRate}%</span>
                    </div>
                    <input
                      type="range" min="10" max="90" value={successRate}
                      onChange={(e) => setSuccessRate(parseInt(e.target.value))}
                      className="w-full accent-[#C15B38] cursor-pointer"
                    />
                  </div>
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Propinas Anuais (€) por Grau</label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(tuition).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{key}</span>
                          <input 
                            type="number" value={val} 
                            onChange={e => setTuition(p => ({ ...p, [key]: parseInt(e.target.value) || 0 }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#C15B38]" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-3">
              <Label>Retenção vs Risco Bruto (Euros)</Label>
              <Card className="flex-1 h-full bg-white border-gray-200 shadow-sm p-6">
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataRoi} margin={{ top: 20, right: 0, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f9fafb' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} iconType="plainline" />
                      <Bar dataKey="emRisco" name="Receita em Risco" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar dataKey="retido" name="Receita Preservada" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'retencao' && (
          <div className="flex flex-col gap-3">
            <Label>Curva de Abandono (Histórico vs. Otimizado)</Label>
            <Card className="flex-1 p-6 bg-white border-gray-200 shadow-sm">
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPredictionData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOtimizado" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHistorico" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[60, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} iconType="plainline" />
                    <Area type="monotone" dataKey="otimizado" name="Taxa Retenção Otimizada" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOtimizado)" />
                    <Area type="monotone" dataKey="historico" name="Taxa Retenção Histórica" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorHistorico)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

      </main>
    </div>
  )
}
