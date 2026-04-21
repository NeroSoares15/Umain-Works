import { useEffect, useState } from 'react'
import type { ApexOptions } from 'apexcharts'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeEuro, LineChart as LineChartIcon, Pencil, Save, Table2, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ApexChart } from '../components/charts/ApexChart'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import {
  courseHeatmapMix,
  courseSelectionRows,
  retentionData,
  roiChartData,
  roiParameterRows,
} from '../data/referenceData'
import { useAppMotion } from '../lib/appMotion'
import { chartColors } from '../lib/chartColors'
import { cn } from '../lib/utils'

type AnalysisView = 'roi' | 'retention' | 'course'

type RoiEditingRowState = {
  type: string
  maxDelay: string
  severity: string
}

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
        'inline-flex items-center gap-1 rounded-[8px] border px-2 py-1 text-[8px] font-medium shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-[transform,background-color,border-color,color,box-shadow] duration-200 motion-safe:hover:-translate-y-[1px] sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[12px]',
        active
          ? 'border-[#e8c9b9] bg-[#fdf1ea] text-[#c1633d]'
          : 'border-[#e7e1d6] bg-white text-[#2d2b28] hover:border-[#d9cdbc] hover:bg-[#fffaf3] hover:text-[#201f1d]'
      )}
    >
      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      {label}
    </button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[12px] font-medium text-[#2d2b28] sm:text-[15px]">{children}</h2>
}

export function Analysis() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCourse, setSelectedCourse] = useState('Gestão de Empresas')
  const [roiRows, setRoiRows] = useState(roiParameterRows)
  const [editingRoiRow, setEditingRoiRow] = useState<RoiEditingRowState | null>(null)
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false
  )
  const [isCompactViewport, setIsCompactViewport] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1279px)').matches : false
  )
  const { createChartAnimation, createRevealVariants, createStaggerVariants } = useAppMotion()

  const viewParam = searchParams.get('view')
  const activeView: AnalysisView =
    viewParam === 'retention' || viewParam === 'course' || viewParam === 'roi' ? viewParam : 'roi'

  const heatmapMix = courseHeatmapMix[selectedCourse]
  const roiChartHeight = isMobileViewport ? 320 : isCompactViewport ? 420 : 600
  const retentionChartHeight = isMobileViewport ? 330 : isCompactViewport ? 430 : 560
  const courseTreemapHeight = isMobileViewport ? 320 : isCompactViewport ? 430 : 692
  const roiCategories = isCompactViewport
    ? ['CTeSP', 'Licenciat\nura', 'Mestrado', 'Internacio\nnal']
    : roiChartData.map((item) => item.name)

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 640px)')
    const compactMediaQuery = window.matchMedia('(max-width: 1279px)')

    const syncViewport = () => {
      setIsMobileViewport(mobileMediaQuery.matches)
      setIsCompactViewport(compactMediaQuery.matches)
    }

    syncViewport()
    mobileMediaQuery.addEventListener('change', syncViewport)
    compactMediaQuery.addEventListener('change', syncViewport)

    return () => {
      mobileMediaQuery.removeEventListener('change', syncViewport)
      compactMediaQuery.removeEventListener('change', syncViewport)
    }
  }, [])

  const roiBarChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      animations: createChartAnimation(820, 75),
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    colors: [chartColors.green, chartColors.red],
    plotOptions: {
      bar: {
        borderRadius: isMobileViewport ? 6 : 8,
        borderRadiusApplication: 'end',
        columnWidth: isCompactViewport ? '48%' : '52%',
      },
    },
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: isMobileViewport ? '9px' : '12px',
      labels: { colors: chartColors.legend },
      markers: {
        size: isMobileViewport ? 6 : 10,
      },
      itemMargin: {
        horizontal: isMobileViewport ? 6 : 14,
      },
    },
    grid: { show: false },
    xaxis: {
      categories: roiCategories,
      labels: {
        style: {
          colors: roiCategories.map(() => '#4d4a45'),
          fontSize: isMobileViewport ? '10px' : isCompactViewport ? '12px' : '13px',
          fontWeight: 400,
        },
        trim: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
    },
    tooltip: { enabled: false },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
  }

  const retentionLineChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: createChartAnimation(760, 65),
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    colors: [chartColors.red, chartColors.green],
    stroke: {
      curve: 'straight',
      width: isMobileViewport ? 3 : 4,
    },
    markers: {
      size: 0,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: isMobileViewport ? '9px' : '12px',
      labels: { colors: chartColors.legend },
      markers: {
        size: isMobileViewport ? 6 : 10,
      },
      itemMargin: {
        horizontal: isMobileViewport ? 6 : 14,
      },
    },
    tooltip: { enabled: false },
    xaxis: {
      categories: retentionData.map((item) => item.month),
      labels: {
        rotate: -55,
        style: {
          colors: retentionData.map(() => chartColors.textMuted),
          fontSize: isMobileViewport ? '10px' : isCompactViewport ? '12px' : '14px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: () => '%',
        style: {
          colors: [chartColors.textMuted],
          fontSize: isMobileViewport ? '10px' : '12px',
        },
      },
    },
    annotations: {
      points: [
        {
          x: 'Mai',
          y: 26,
          marker: {
            size: 0,
          },
          label: {
            text: '115.3',
            borderWidth: 0,
            offsetX: isMobileViewport ? 12 : 26,
            style: {
              background: 'transparent',
              color: chartColors.red,
              fontSize: isMobileViewport ? '11px' : '14px',
              fontWeight: '400',
            },
          },
        },
        {
          x: 'Mai',
          y: 0,
          marker: {
            size: 0,
          },
          label: {
            text: '123.2',
            borderWidth: 0,
            offsetX: isMobileViewport ? 12 : 26,
            style: {
              background: 'transparent',
              color: chartColors.green,
              fontSize: isMobileViewport ? '11px' : '14px',
              fontWeight: '400',
            },
          },
        },
      ],
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
  }

  const courseTreemapOptions: ApexOptions = {
    chart: {
      type: 'treemap',
      toolbar: { show: false },
      parentHeightOffset: 0,
      animations: createChartAnimation(720, 70),
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    legend: { show: false },
    dataLabels: {
      enabled: false,
    },
    tooltip: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: [chartColors.white],
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
  }

  function handleViewChange(view: AnalysisView) {
    setEditingRoiRow(null)

    if (view === 'roi') {
      setSearchParams({})
      return
    }

    setSearchParams({ view })
  }

  function startRoiRowEdit(row: (typeof roiRows)[number]) {
    setEditingRoiRow({
      type: row.type,
      maxDelay: row.maxDelay,
      severity: row.severity,
    })
  }

  function cancelRoiRowEdit() {
    setEditingRoiRow(null)
  }

  function saveRoiRowEdit() {
    if (!editingRoiRow) return

    setRoiRows((previousRows) =>
      previousRows.map((row) =>
        row.type === editingRoiRow.type
          ? {
              ...row,
              maxDelay: editingRoiRow.maxDelay.trim() || row.maxDelay,
              severity: editingRoiRow.severity.trim() || row.severity,
            }
          : row
      )
    )

    setEditingRoiRow(null)
  }

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-2 py-2 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <h1 className="text-[15px] font-semibold text-[#2e2d2a] sm:text-[17px]">Visualização</h1>
          <div className="flex flex-nowrap items-center gap-1 overflow-x-auto pb-0.5 sm:gap-2 md:flex-wrap md:overflow-visible md:pb-0">
              <AnalysisToggle label="Gestão de ROI" icon={BadgeEuro} active={activeView === 'roi'} onClick={() => handleViewChange('roi')} />
              <AnalysisToggle label="Retenção" icon={LineChartIcon} active={activeView === 'retention'} onClick={() => handleViewChange('retention')} />
              <AnalysisToggle label="Por Curso" icon={Table2} active={activeView === 'course'} onClick={() => handleViewChange('course')} />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-2 px-2 py-2 sm:gap-4 sm:px-5 sm:py-4">
        <AnimatePresence mode="wait">
          {activeView === 'roi' ? (
            <motion.div
              key="roi"
              className="space-y-2 sm:space-y-4"
              variants={createRevealVariants({ distance: 12, duration: 0.24 })}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <motion.div
                className="grid grid-cols-1 gap-2 sm:gap-4 xl:grid-cols-3"
                variants={createStaggerVariants({ staggerChildren: 0.08 })}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <KpiCard
                    title="Receita em Risco (Anual)"
                    value="€246,255"
                    subtitle="Acumulado - Propinas de Alunos em Risco Alto"
                    subtitleTone="neutral"
                  />
                </motion.div>
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <KpiCard
                    title="Receita Recuperável (Est.)"
                    value="€98,502"
                    subtitle="Com taxa de eficácia de 40% na intervenção"
                    subtitleTone="neutral"
                  />
                </motion.div>
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <KpiCard
                    title="Multiplicador RiskRadar"
                    value="6.6x"
                    subtitle="ROI estimado sobre o custo do software"
                    subtitleTone="neutral"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 gap-2 sm:gap-4 xl:grid-cols-[430px_minmax(0,1fr)]"
                variants={createStaggerVariants({ staggerChildren: 0.08 })}
                initial="hidden"
                animate="show"
              >
                <motion.div className="order-2 xl:order-1" variants={createRevealVariants({ distance: 12 })}>
                  <Card className="overflow-hidden">
                    <div className="px-3 py-3 sm:px-4 sm:py-4">
                      <SectionTitle>Parâmetros</SectionTitle>
                    </div>

                    <div className="overflow-x-auto px-3 pb-3 sm:px-4 sm:pb-4">
                      <table className="w-full min-w-[280px] border-collapse text-left text-[10px] sm:text-[12px]">
                        <thead>
                          <tr className="bg-[#ececec] text-[#2f2d2a]">
                            <th className="px-2 py-2 font-semibold sm:px-3 sm:py-3">Tipo de Estud...</th>
                            <th className="px-2 py-2 font-semibold sm:px-3 sm:py-3">Max. Meses e...</th>
                            <th className="px-2 py-2 font-semibold sm:px-3 sm:py-3">Gravidade</th>
                            <th className="px-2 py-2 text-center font-semibold sm:px-3 sm:py-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roiRows.map((row) => {
                            const isEditing = editingRoiRow?.type === row.type

                            return (
                              <tr
                                key={row.type}
                                className={cn(
                                  'border-b border-[#eee7db] text-[#3c3935] transition-colors duration-200 last:border-b-0',
                                  isEditing && 'bg-[#fef7f2]'
                                )}
                              >
                                <td className="px-2 py-2 sm:px-3 sm:py-3">{row.type}</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editingRoiRow.maxDelay}
                                      onChange={(event) =>
                                        setEditingRoiRow((previous) =>
                                          previous ? { ...previous, maxDelay: event.target.value } : previous
                                        )
                                      }
                                      placeholder={row.maxDelay}
                                      className="h-7 w-full rounded-[8px] border border-[#d88960] bg-white px-2 text-[10px] transition-[border-color,box-shadow] duration-200 focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] sm:h-8 sm:px-3 sm:text-[12px]"
                                    />
                                  ) : (
                                    row.maxDelay
                                  )}
                                </td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editingRoiRow.severity}
                                      onChange={(event) =>
                                        setEditingRoiRow((previous) =>
                                          previous ? { ...previous, severity: event.target.value } : previous
                                        )
                                      }
                                      placeholder={row.severity}
                                      className="h-7 w-full rounded-[8px] border border-[#d88960] bg-white px-2 text-[10px] transition-[border-color,box-shadow] duration-200 focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] sm:h-8 sm:px-3 sm:text-[12px]"
                                    />
                                  ) : (
                                    row.severity
                                  )}
                                </td>
                                <td className="px-2 py-2 text-center text-[#c1633d] sm:px-3 sm:py-3">
                                  {isEditing ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={saveRoiRowEdit}
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px] sm:h-6 sm:w-6"
                                        aria-label={`Guardar ${row.type}`}
                                      >
                                        <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      </button>
                                      <button
                                        onClick={cancelRoiRowEdit}
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px] sm:h-6 sm:w-6"
                                        aria-label={`Cancelar edição de ${row.type}`}
                                      >
                                        <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => startRoiRowEdit(row)}
                                      className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px] sm:h-6 sm:w-6"
                                      aria-label={`Editar ${row.type}`}
                                    >
                                      <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>

                <motion.div className="order-1 xl:order-2" variants={createRevealVariants({ distance: 12 })}>
                  <Card className="overflow-hidden">
                    <div className="px-3 py-3 sm:px-4 sm:py-4">
                      <SectionTitle>Retenção vs Risco Bruto (EUROS)</SectionTitle>
                    </div>

                    <div className="px-2 pb-3 sm:px-4 sm:pb-4">
                      <ApexChart
                        type="bar"
                        height={roiChartHeight}
                        series={[
                          { name: 'Receita Preservada', data: roiChartData.map((item) => item.recovered) },
                          { name: 'Receita em Risco', data: roiChartData.map((item) => item.risk) },
                        ]}
                        options={roiBarChartOptions}
                      />
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : null}

          {activeView === 'retention' ? (
            <motion.div
              key="retention"
              className="space-y-2 sm:space-y-4"
              variants={createRevealVariants({ distance: 12, duration: 0.24 })}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <motion.div
                className="grid grid-cols-1 gap-2 sm:gap-4 xl:grid-cols-2"
                variants={createStaggerVariants({ staggerChildren: 0.08 })}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <KpiCard
                    title="Previsão de Retenção (Sem Intervenção)"
                    value="71%"
                    subtitle="Baseado no histórico dos últimos 5 anos"
                    subtitleTone="neutral"
                  />
                </motion.div>
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <KpiCard
                    title="Previsão de Retenção (Optimizada)"
                    value="88%"
                    subtitle="Com intervenção guiada por Risk Radar"
                    subtitleTone="neutral"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={createRevealVariants({ distance: 12 })} initial="hidden" animate="show">
                <Card className="overflow-hidden">
                  <div className="px-3 py-3 sm:px-4 sm:py-4">
                    <SectionTitle>Curva de Abandono (Histórico VS. Optimizado com RiskRadar)</SectionTitle>
                  </div>

                  <div className="px-2 pb-3 sm:px-4 sm:pb-4">
                    <ApexChart
                      type="line"
                      height={retentionChartHeight}
                      series={[
                        { name: 'Taxa de Retenção Histórica', data: retentionData.map((item) => item.historical) },
                        { name: 'Taxa de Retenção Optimizada', data: retentionData.map((item) => item.optimized) },
                      ]}
                      options={retentionLineChartOptions}
                    />
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ) : null}

          {activeView === 'course' ? (
            <motion.div
              key="course"
              className="space-y-2 sm:space-y-3"
              variants={createRevealVariants({ distance: 12, duration: 0.24 })}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <SectionTitle>Heatmap de Risco</SectionTitle>

              <motion.div
                className="grid grid-cols-1 gap-2 sm:gap-4 xl:grid-cols-[375px_minmax(0,1fr)]"
                variants={createStaggerVariants({ staggerChildren: 0.08 })}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <Card className="overflow-hidden">
                    <div className="px-3 py-3 sm:px-4 sm:py-4">
                      <div className="mb-3 text-[11px] font-medium text-[#2d2b28] sm:mb-4 sm:text-[14px]">Seleção de Cursos</div>

                      <table className="w-full border-collapse text-left text-[10px] sm:text-[12px]">
                        <thead>
                          <tr className="bg-[#ececec] text-[#2f2d2a]">
                            <th className="w-[44px] px-3 py-2 font-semibold sm:w-[58px] sm:px-4 sm:py-3">Ações</th>
                            <th className="px-2 py-2 font-semibold sm:px-3 sm:py-3">Curso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseSelectionRows.map((course) => {
                            const checked = course === selectedCourse
                            return (
                              <tr key={course} className="border-b border-[#eee7db] text-[#47433f] transition-colors duration-200 hover:bg-[#fff9f2]">
                                <td className="px-3 py-2 sm:px-4 sm:py-3">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => setSelectedCourse(course)}
                                    className="h-3.5 w-3.5 accent-[#c1633d] sm:h-4 sm:w-4"
                                  />
                                </td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3">{course}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <Card className="overflow-hidden">
                    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto px-3 py-3 text-[8px] font-medium text-[#2f2d2a] sm:flex-wrap sm:gap-6 sm:overflow-visible sm:px-4 sm:py-4 sm:text-[12px]">
                      <span className="inline-flex items-center gap-1 sm:gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e72a2a] sm:h-4 sm:w-4" />
                        Risco Alto
                      </span>
                      <span className="inline-flex items-center gap-1 sm:gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e7a92a] sm:h-4 sm:w-4" />
                        Risco Médio
                      </span>
                      <span className="inline-flex items-center gap-1 sm:gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#c1633d] sm:h-4 sm:w-4" />
                        Risco Baixo
                      </span>
                      <span className="inline-flex items-center gap-1 sm:gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#2a9f4b] sm:h-4 sm:w-4" />
                        Sem Risco
                      </span>
                    </div>

                    <motion.div
                      key={selectedCourse}
                      variants={createRevealVariants({ distance: 8, duration: 0.2 })}
                      initial="hidden"
                      animate="show"
                      className="overflow-hidden px-[2px] pb-[2px]"
                      style={{ height: `${courseTreemapHeight + 2}px` }}
                    >
                      <ApexChart
                        type="treemap"
                        height={courseTreemapHeight}
                        series={[
                          {
                            data: [
                              { x: 'Risco Alto', y: heatmapMix.high, fillColor: chartColors.red },
                              { x: 'Risco Médio', y: heatmapMix.medium, fillColor: chartColors.yellow },
                              { x: 'Risco Baixo', y: heatmapMix.low, fillColor: chartColors.main },
                              { x: 'Sem Risco', y: heatmapMix.none, fillColor: chartColors.green },
                            ],
                          },
                        ]}
                        options={courseTreemapOptions}
                      />
                    </motion.div>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  )
}
