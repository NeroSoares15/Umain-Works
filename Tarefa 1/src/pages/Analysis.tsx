import { useState } from 'react'
import {
  BadgeEuro,
  LineChart as LineChartIcon,
  Pencil,
  Table2,
  TrendingUp,
  Wallet,
  ShieldCheck,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { cn } from '../lib/utils'
import { courseHeatmapMix, courseSelectionRows, retentionData, roiChartData, roiParameterRows } from '../data/referenceData'

type AnalysisView = 'roi' | 'retention' | 'course'

function AnalysisToggle({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'border-[#f1d7c6] bg-[#fdf1ea] text-[#c5663b]'
          : 'border-[#e7e1d6] bg-white text-[#2d2b28]'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[16px] font-semibold text-[#2d2b28]">{children}</h2>
}

export function Analysis() {
  const [searchParams, setSearchParams] = useSearchParams()
  const viewParam = searchParams.get('view')
  const activeView: AnalysisView =
    viewParam === 'retention' || viewParam === 'course' || viewParam === 'roi' ? viewParam : 'roi'
  const [selectedCourse, setSelectedCourse] = useState('Gestão de Empresas')

  const heatmapMix = courseHeatmapMix[selectedCourse]
  const topRowTotal = heatmapMix.high + heatmapMix.medium
  const bottomRowTotal = heatmapMix.none + heatmapMix.low
  const topRowHeight = 72
  const bottomRowHeight = 28
  const highWidth = `${(heatmapMix.high / topRowTotal) * 100}%`
  const mediumWidth = `${(heatmapMix.medium / topRowTotal) * 100}%`
  const noneWidth = `${(heatmapMix.none / bottomRowTotal) * 100}%`
  const lowWidth = `${(heatmapMix.low / bottomRowTotal) * 100}%`

  function handleViewChange(view: AnalysisView) {
    if (view === 'roi') {
      setSearchParams({})
      return
    }

    setSearchParams({ view })
  }

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <h1 className="text-[16px] font-semibold text-[#2e2d2a]">Visualização</h1>
            <div className="flex flex-wrap items-center gap-2">
              <AnalysisToggle label="Gestão de ROI" icon={BadgeEuro} active={activeView === 'roi'} onClick={() => handleViewChange('roi')} />
              <AnalysisToggle label="Retenção" icon={LineChartIcon} active={activeView === 'retention'} onClick={() => handleViewChange('retention')} />
              <AnalysisToggle label="Por Curso" icon={Table2} active={activeView === 'course'} onClick={() => handleViewChange('course')} />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-4 px-4 py-4">
        {activeView === 'roi' && (
          <>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <KpiCard
                title="Receita em Risco (Anual)"
                value="€246,255"
                subtitle="Acumulado - Propinas de Alunos em Risco Alto"
                subtitleTone="neutral"
                icon={Wallet}
                iconBg="bg-[#fbefe8]"
                iconColor="text-[#c5663b]"
              />
              <KpiCard
                title="Receita Recuperável (Est.)"
                value="€98,502"
                subtitle="Com taxa de eficácia de 40% na intervenção"
                subtitleTone="neutral"
                icon={ShieldCheck}
                iconBg="bg-[#fbefe8]"
                iconColor="text-[#c5663b]"
              />
              <KpiCard
                title="Multiplicador RiskRadar"
                value="6.6x"
                subtitle="ROI estimado sobre o custo do software"
                subtitleTone="neutral"
                icon={TrendingUp}
                iconBg="bg-[#fbefe8]"
                iconColor="text-[#c5663b]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[430px_minmax(0,1fr)]">
              <Card className="overflow-hidden">
                <div className="px-4 py-4">
                  <SectionTitle>Parâmetros</SectionTitle>
                </div>

                <div className="px-4 pb-4">
                  <table className="w-full border-collapse text-left text-[12px]">
                    <thead>
                      <tr className="bg-[#ececec] text-[#2f2d2a]">
                        <th className="px-3 py-3 font-semibold">Tipo de Estud...</th>
                        <th className="px-3 py-3 font-semibold">Max. Meses e...</th>
                        <th className="px-3 py-3 font-semibold">Gravidade</th>
                        <th className="px-3 py-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roiParameterRows.map((row) => (
                        <tr key={row.type} className="border-b border-[#eee7db] text-[#3c3935]">
                          <td className="px-3 py-3">{row.type}</td>
                          <td className="px-3 py-3">{row.maxDelay}</td>
                          <td className="px-3 py-3">{row.severity}</td>
                          <td className="px-3 py-3 text-center text-[#c5663b]">
                            <Pencil className="mx-auto h-3.5 w-3.5" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="overflow-hidden">
                <div className="px-4 py-4">
                  <SectionTitle>Retenção vs Risco Bruto (EUROS)</SectionTitle>
                </div>

                <div className="h-[610px] px-2 pb-4 md:px-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roiChartData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#4d4a45', fontSize: 13 }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: '12px', color: '#5c5852', paddingTop: '20px' }}
                        formatter={(value) => <span className="text-[#6a655e]">{value}</span>}
                      />
                      <Bar dataKey="recovered" name="Receita Preservada" fill="#2f9d49" radius={[4, 4, 0, 0]} barSize={66} />
                      <Bar dataKey="risk" name="Receita em Risco" fill="#f12727" radius={[4, 4, 0, 0]} barSize={66} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </>
        )}

        {activeView === 'retention' && (
          <>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <KpiCard
                title="Previsão de Retenção (Sem Intervenção)"
                value="71%"
                subtitle="Baseado no histórico dos últimos 5 anos"
                subtitleTone="neutral"
                icon={LineChartIcon}
                iconBg="bg-[#fbefe8]"
                iconColor="text-[#c5663b]"
              />
              <KpiCard
                title="Previsão de Retenção (Optimizada)"
                value="88%"
                subtitle="Com intervenção guiada por Risk Radar"
                subtitleTone="neutral"
                icon={TrendingUp}
                iconBg="bg-[#fbefe8]"
                iconColor="text-[#c5663b]"
              />
            </div>

            <Card className="overflow-hidden">
              <div className="px-4 py-4">
                <SectionTitle>Curva de Abandono (Histórico VS. Optimizado com RiskRadar)</SectionTitle>
              </div>

              <div className="h-[560px] px-2 pb-4 md:px-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData} margin={{ top: 15, right: 50, left: 0, bottom: 35 }}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8f8a83', fontSize: 14 }}
                      angle={-55}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8f8a83', fontSize: 12 }}
                      tickFormatter={() => '%'}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: '12px', color: '#5c5852', paddingTop: '8px' }}
                    />
                    <Line type="monotone" dataKey="historical" name="Taxa de Retenção Histórica" stroke="#e3312d" strokeWidth={4} dot={false}>
                      <LabelList dataKey="historicalLabel" position="right" fill="#e3312d" fontSize={14} />
                    </Line>
                    <Line type="monotone" dataKey="optimized" name="Taxa de Retenção Optimizada" stroke="#2f9d49" strokeWidth={4} dot={false}>
                      <LabelList dataKey="optimizedLabel" position="right" fill="#2f9d49" fontSize={14} />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}

        {activeView === 'course' && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[375px_minmax(0,1fr)]">
            <Card className="overflow-hidden">
              <div className="border-b border-[#ede5d7] bg-[#fffef9] px-4 py-4">
                <SectionTitle>Heatmap de Risco</SectionTitle>
              </div>

              <div className="px-4 py-4">
                <div className="mb-4 text-[14px] font-medium text-[#2d2b28]">Seleção de Cursos</div>

                <table className="w-full border-collapse text-left text-[12px]">
                  <thead>
                    <tr className="bg-[#ececec] text-[#2f2d2a]">
                      <th className="w-[58px] px-4 py-3 font-semibold">Ações</th>
                      <th className="px-3 py-3 font-semibold">Curso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseSelectionRows.map((course) => {
                      const checked = course === selectedCourse
                      return (
                        <tr key={course} className="border-b border-[#eee7db] text-[#47433f]">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => setSelectedCourse(course)}
                              className="h-4 w-4 accent-[#c5663b]"
                            />
                          </td>
                          <td className="px-3 py-3">{course}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="overflow-hidden p-2">
              <div className="flex flex-wrap items-center gap-8 px-2 py-2 text-[12px] font-medium text-[#2f2d2a]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#df2222]" />
                  Risco Alto
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#d8a127]" />
                  Risco Médio
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#bf623b]" />
                  Risco Baixo
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#2f9d49]" />
                  Sem Risco
                </span>
              </div>

              <div className="mt-2 h-[690px] overflow-hidden rounded-[6px] border border-[#efe8db] bg-white p-[3px]">
                <div className="flex h-full flex-col gap-[3px] bg-white">
                  <div className="flex gap-[3px]" style={{ height: `${topRowHeight}%` }}>
                    <div style={{ width: highWidth }} className="bg-[#df2222]" />
                    <div style={{ width: mediumWidth }} className="bg-[#d8a127]" />
                  </div>
                  <div className="flex gap-[3px]" style={{ height: `${bottomRowHeight}%` }}>
                    <div style={{ width: noneWidth }} className="bg-[#2f9d49]" />
                    <div style={{ width: lowWidth }} className="bg-[#bf623b]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
