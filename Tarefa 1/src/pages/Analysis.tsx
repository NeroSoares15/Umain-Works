import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { ApexOptions } from 'apexcharts'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeEuro, LineChart as LineChartIcon, Pencil, Save, Table2, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ApexChart } from '../components/charts/ApexChart'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { useAppContext } from '../contexts/AppContext'
import { canEditSettings } from '../lib/access'
import { useAppMotion } from '../lib/appMotion'
import { chartColors } from '../lib/chartColors'
import { formatAnnualCurrency } from '../lib/riskEngine'
import { cn } from '../lib/utils'

type AnalysisView = 'roi' | 'retention' | 'course'

type RoiEditingRowState = {
  rowId: string
  maxValue: string
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
        'inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-[12px] font-medium shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-[transform,background-color,border-color,color,box-shadow] duration-200 motion-safe:hover:-translate-y-[1px] sm:w-auto sm:px-3.5 sm:py-[6px] sm:text-[12px] lg:px-3.5 lg:py-1.5 lg:text-[12px]',
        active
          ? 'border-[#e8c9b9] bg-[#fdf1ea] text-[#c1633d]'
          : 'border-[#e7e1d6] bg-white text-[#2d2b28] hover:border-[#d9cdbc] hover:bg-[#fffaf3] hover:text-[#201f1d]'
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 sm:h-3.5 sm:w-3.5" />
      <span className="truncate">{label}</span>
    </button>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[13px] font-medium text-[#2d2b28] sm:text-[13px]">{children}</h2>
}

export function Analysis() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { activeProfileId, derivedData, settingsSections, applySettingsTableEdit } = useAppContext()
  const [selectedCourses, setSelectedCourses] = useState<string[]>(() =>
    derivedData.analysis.course.courses.length > 0 ? derivedData.analysis.course.courses : []
  )
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

  const canEdit = canEditSettings(activeProfileId)
  const roiSection = settingsSections.find((section) => section.id === 'risk-multipliers')
  const roiChartHeight = isMobileViewport ? 320 : isCompactViewport ? 420 : 600
  const retentionChartHeight = isMobileViewport ? 330 : isCompactViewport ? 430 : 560
  const courseTreemapHeight = isMobileViewport ? 320 : isCompactViewport ? 430 : 692
  const roiCategories = isCompactViewport
    ? derivedData.analysis.roi.chartData.map((item) => item.name.replace('Licenciatura', 'Licenciat\nura').replace('Internacional', 'Internacio\nnal'))
    : derivedData.analysis.roi.chartData.map((item) => item.name)

  useEffect(() => {
    setSelectedCourses((previous) => {
      const availableCourses = derivedData.analysis.course.courses
      const nextSelection = previous.filter((course) => availableCourses.includes(course))

      if (nextSelection.length > 0) {
        return nextSelection
      }

      return availableCourses
    })
  }, [derivedData.analysis.course.courses])

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

  const selectedCourseMix = selectedCourses.reduce(
    (accumulator, course) => {
      const mix = derivedData.analysis.course.mixes[course]

      if (!mix) return accumulator

      accumulator.none += mix.none
      accumulator.low += mix.low
      accumulator.medium += mix.medium
      accumulator.high += mix.high
      return accumulator
    },
    { none: 0, low: 0, medium: 0, high: 0 }
  )

  const totalSelectedCourseStudents =
    selectedCourseMix.none + selectedCourseMix.low + selectedCourseMix.medium + selectedCourseMix.high

  const courseTreemapEntries = [
    {
      x: 'Risco Alto',
      y: selectedCourseMix.high,
      fillColor: chartColors.red,
      percentLabel: `${Math.round((selectedCourseMix.high / Math.max(totalSelectedCourseStudents, 1)) * 100)}%`,
    },
    {
      x: 'Risco Médio',
      y: selectedCourseMix.medium,
      fillColor: chartColors.yellow,
      percentLabel: `${Math.round((selectedCourseMix.medium / Math.max(totalSelectedCourseStudents, 1)) * 100)}%`,
    },
    {
      x: 'Risco Baixo',
      y: selectedCourseMix.low,
      fillColor: chartColors.main,
      percentLabel: `${Math.round((selectedCourseMix.low / Math.max(totalSelectedCourseStudents, 1)) * 100)}%`,
    },
    {
      x: 'Sem Risco',
      y: selectedCourseMix.none,
      fillColor: chartColors.green,
      percentLabel: `${Math.round((selectedCourseMix.none / Math.max(totalSelectedCourseStudents, 1)) * 100)}%`,
    },
  ].filter((entry) => entry.y > 0)

  const allCoursesSelected =
    derivedData.analysis.course.courses.length > 0 && selectedCourses.length === derivedData.analysis.course.courses.length

  const courseTreemapKey = [...selectedCourses].sort((left, right) => left.localeCompare(right, 'pt-PT')).join('|') || 'none'

  const roiBarChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      animations: createChartAnimation(380, 12),
      fontFamily: 'Manrope',
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
    tooltip: {
      y: {
        formatter: (value) => formatAnnualCurrency(Number(value)),
      },
    },
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
      animations: createChartAnimation(360, 12),
      fontFamily: 'Manrope',
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
    tooltip: {
      y: {
        formatter: (value) => `${Math.round(Number(value))}%`,
      },
    },
    xaxis: {
      categories: derivedData.analysis.retention.chartData.map((item) => item.month),
      labels: {
        rotate: -55,
        style: {
          colors: derivedData.analysis.retention.chartData.map(() => chartColors.textMuted),
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
        formatter: (value) => `${Math.round(value)}%`,
        style: {
          colors: [chartColors.textMuted],
          fontSize: isMobileViewport ? '10px' : '12px',
        },
      },
    },
    annotations: {
      points: [
        {
          x: 'Jun',
          y: derivedData.analysis.retention.withoutIntervention,
          marker: { size: 0 },
          label: {
            text: `${derivedData.analysis.retention.withoutIntervention}%`,
            borderWidth: 0,
            offsetX: isMobileViewport ? 14 : 22,
            style: {
              background: 'transparent',
              color: chartColors.red,
              fontSize: isMobileViewport ? '11px' : '14px',
              fontWeight: '500',
            },
          },
        },
        {
          x: 'Jun',
          y: derivedData.analysis.retention.optimized,
          marker: { size: 0 },
          label: {
            text: `${derivedData.analysis.retention.optimized}%`,
            borderWidth: 0,
            offsetX: isMobileViewport ? 14 : 22,
            style: {
              background: 'transparent',
              color: chartColors.green,
              fontSize: isMobileViewport ? '11px' : '14px',
              fontWeight: '500',
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
      sparkline: { enabled: true },
      toolbar: { show: false },
      parentHeightOffset: 0,
      offsetY: -10,
      animations: createChartAnimation(340, 10),
      fontFamily: 'Manrope',
    },
    legend: { show: false },
    dataLabels: {
      enabled: true,
      formatter: (_, opts: any) => {
        const item = opts?.w?.config?.series?.[opts?.seriesIndex]?.data?.[opts?.dataPointIndex]
        if (!item) return ''
        return item.percentLabel ? `${item.x}\n${item.percentLabel}` : `${item.x}`
      },
      style: {
        fontSize: isMobileViewport ? '10px' : '12px',
        fontWeight: '600',
        colors: ['#ffffff'],
      },
      offsetY: -2,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} alunos`,
      },
    },
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
        top: -8,
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

  function startRoiRowEdit(row: { id: string; maxValue: string; severity?: string }) {
    if (!canEdit) return

    setEditingRoiRow({
      rowId: row.id,
      maxValue: row.maxValue,
      severity: row.severity ?? '',
    })
  }

  function cancelRoiRowEdit() {
    setEditingRoiRow(null)
  }

  function saveRoiRowEdit() {
    if (!editingRoiRow) return

    applySettingsTableEdit('risk-multipliers', editingRoiRow.rowId, {
      maxValue: editingRoiRow.maxValue,
      severity: editingRoiRow.severity,
    })

    setEditingRoiRow(null)
  }

  function toggleCourseSelection(course: string) {
    setSelectedCourses((previous) =>
      previous.includes(course) ? previous.filter((entry) => entry !== course) : [...previous, course]
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-2 py-2 sm:px-5 sm:py-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2.5">
          <h1 className="text-[14px] font-semibold text-[#2e2d2a] sm:text-[14px]">Visualização</h1>
          <div className="grid w-full grid-cols-3 gap-1 pb-0.5 sm:flex sm:w-auto sm:flex-nowrap sm:items-center sm:gap-1.5 sm:overflow-x-auto md:flex-wrap md:overflow-visible md:pb-0">
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
                    value={formatAnnualCurrency(derivedData.analysis.roi.revenueAtRisk)}
                    subtitle="Acumulado - Propinas de Alunos em Risco"
                    subtitleTone="neutral"
                  />
                </motion.div>
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <KpiCard
                    title="Receita Recuperável (Est.)"
                    value={formatAnnualCurrency(derivedData.analysis.roi.recoverableEstimate)}
                    subtitle="Estimativa dinâmica com base nas regras atuais"
                    subtitleTone="neutral"
                  />
                </motion.div>
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <KpiCard
                    title="Multiplicador RiskRadar"
                    value={`${derivedData.analysis.roi.multiplier.toFixed(1)}x`}
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
                      <table className="w-full min-w-[280px] border-collapse text-left text-[11px] sm:text-[12px]">
                        <thead>
                          <tr className="bg-[#ececec] text-[#2f2d2a]">
                            <th className="px-2 py-2 font-semibold sm:px-3 sm:py-3">Tipo de Estud.</th>
                            <th className="px-2 py-2 font-semibold sm:px-3 sm:py-3">Max. Meses</th>
                            <th className="px-2 py-2 font-semibold sm:px-3 sm:py-3">Gravidade</th>
                            <th className="px-2 py-2 text-center font-semibold sm:px-3 sm:py-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roiSection?.rows.map((row) => {
                            const isEditing = editingRoiRow?.rowId === row.id
                            return (
                              <tr
                                key={row.id}
                                className={cn(
                                  'border-b border-[#eee7db] text-[#3c3935] transition-colors duration-200 last:border-b-0',
                                  isEditing && 'bg-[#fef7f2]'
                                )}
                              >
                                <td className="px-2 py-2 sm:px-3 sm:py-3">{row.label}</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editingRoiRow.maxValue}
                                      onChange={(event) =>
                                        setEditingRoiRow((previous) =>
                                          previous ? { ...previous, maxValue: event.target.value } : previous
                                        )
                                      }
                                      placeholder={row.maxValue}
                                      className="h-7 w-full rounded-[8px] border border-[#d88960] bg-white px-2 text-[11px] transition-[border-color,box-shadow] duration-200 focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] sm:h-8 sm:px-3 sm:text-[12px]"
                                    />
                                  ) : (
                                    row.maxValue
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
                                      placeholder={row.severity ?? ''}
                                      className="h-7 w-full rounded-[8px] border border-[#d88960] bg-white px-2 text-[11px] transition-[border-color,box-shadow] duration-200 focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] sm:h-8 sm:px-3 sm:text-[12px]"
                                    />
                                  ) : (
                                    row.severity
                                  )}
                                </td>
                                <td className="px-2 py-2 text-center text-[#c1633d] sm:px-3 sm:py-3">
                                  {canEdit ? (
                                    isEditing ? (
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          onClick={saveRoiRowEdit}
                                          className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px] sm:h-6 sm:w-6"
                                          aria-label={`Guardar ${row.label}`}
                                        >
                                          <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        </button>
                                        <button
                                          onClick={cancelRoiRowEdit}
                                          className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px] sm:h-6 sm:w-6"
                                          aria-label={`Cancelar edição de ${row.label}`}
                                        >
                                          <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => startRoiRowEdit(row)}
                                        className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px] sm:h-6 sm:w-6"
                                        aria-label={`Editar ${row.label}`}
                                      >
                                        <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      </button>
                                    )
                                  ) : (
                                    <button
                                      type="button"
                                      disabled
                                      className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] text-[#b9b2aa] opacity-70 sm:h-6 sm:w-6"
                                      aria-label={`Sem permissão para editar ${row.label}`}
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
                          { name: 'Receita Preservada', data: derivedData.analysis.roi.chartData.map((item) => item.preserved) },
                          { name: 'Receita em Risco', data: derivedData.analysis.roi.chartData.map((item) => item.risk) },
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
                    value={`${derivedData.analysis.retention.withoutIntervention}%`}
                    subtitle="Recalculado com base no mix de risco atual"
                    subtitleTone="neutral"
                  />
                </motion.div>
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <KpiCard
                    title="Previsão de Retenção (Optimizada)"
                    value={`${derivedData.analysis.retention.optimized}%`}
                    subtitle="Com intervenção guiada pelas regras do RiskRadar"
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
                        { name: 'Taxa de Retenção Histórica', data: derivedData.analysis.retention.chartData.map((item) => item.historical) },
                        { name: 'Taxa de Retenção Optimizada', data: derivedData.analysis.retention.chartData.map((item) => item.optimized) },
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
                <motion.div className="order-2 sm:order-1" variants={createRevealVariants({ distance: 10 })}>
                  <Card className="overflow-hidden">
                    <div className="px-3 py-3 sm:px-4 sm:py-3.5">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="text-[13px] font-medium text-[#2d2b28] sm:text-[13px]">Seleção de Cursos</div>
                          <div className="mt-1 text-[11px] text-[#7f7a73] sm:text-[11px]">
                            {selectedCourses.length} curso{selectedCourses.length === 1 ? '' : 's'} selecionado{selectedCourses.length === 1 ? '' : 's'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCourses(derivedData.analysis.course.courses)}
                            disabled={allCoursesSelected}
                            className="rounded-[8px] border border-[#e6ddcf] bg-white px-3 py-1.5 text-[12px] font-medium text-[#5f5952] transition-colors duration-150 hover:bg-[#fffaf3] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-[12px]"
                          >
                            Selecionar todos
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedCourses([])}
                            disabled={selectedCourses.length === 0}
                            className="rounded-[8px] border border-[#e6ddcf] bg-white px-3 py-1.5 text-[12px] font-medium text-[#5f5952] transition-colors duration-150 hover:bg-[#fffaf3] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-[12px]"
                          >
                            Limpar
                          </button>
                        </div>
                      </div>

                      <table className="w-full border-collapse text-left text-[11px] sm:text-[12px]">
                        <thead>
                          <tr className="bg-[#ececec] text-[#2f2d2a]">
                            <th className="w-[44px] px-3 py-2 font-semibold sm:w-[58px] sm:px-4 sm:py-3">Ações</th>
                            <th className="px-2 py-2 font-semibold sm:px-3 sm:py-3">Curso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {derivedData.analysis.course.courses.map((course) => {
                            const checked = selectedCourses.includes(course)
                            const mix = derivedData.analysis.course.mixes[course]
                            return (
                              <tr key={course} className="border-b border-[#eee7db] text-[#47433f] transition-colors duration-200 hover:bg-[#fff9f2]">
                                <td className="px-3 py-2 sm:px-4 sm:py-3">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleCourseSelection(course)}
                                    className="h-3.5 w-3.5 accent-[#c1633d] sm:h-4 sm:w-4"
                                  />
                                </td>
                                <td className="px-2 py-2 sm:px-3 sm:py-3">
                                  <div>{course}</div>
                                  <div className="mt-1 text-[11px] text-[#8a857d] sm:text-[11px]">
                                    {mix.high + mix.medium} em risco
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>

                <motion.div className="order-1 sm:order-2" variants={createRevealVariants({ distance: 10 })}>
                  <Card className="overflow-hidden">
                    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto px-3 pb-2 pt-3 text-[11px] font-medium text-[#2f2d2a] sm:flex-wrap sm:gap-5 sm:overflow-visible sm:px-4 sm:pb-1 sm:pt-3 sm:text-[11px]">
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
                      key={courseTreemapKey}
                      variants={createRevealVariants({ distance: 8, duration: 0.2 })}
                      initial="hidden"
                      animate="show"
                      className="overflow-hidden px-[2px] pb-[2px] pt-0"
                      style={{ height: `${courseTreemapHeight}px` }}
                    >
                      {selectedCourses.length > 0 ? (
                        <ApexChart
                          type="treemap"
                          height={courseTreemapHeight}
                          series={[
                            {
                              data: courseTreemapEntries,
                            },
                          ]}
                          options={courseTreemapOptions}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-[13px] text-[#706a63]">
                          Seleciona pelo menos um curso para visualizar a distribuição agregada de risco.
                        </div>
                      )}
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
