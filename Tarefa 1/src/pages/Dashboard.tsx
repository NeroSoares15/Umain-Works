import { useEffect, useState } from 'react'
import type { ApexOptions } from 'apexcharts'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  ListFilter,
  RefreshCcw,
  Search,
  ShieldAlert,
  TriangleAlert,
  User,
  UserRound,
  Clock3,
  GraduationCap,
} from 'lucide-react'
import { ApexChart } from '../components/charts/ApexChart'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { RiskBadge } from '../components/ui/RiskBadge'
import { useAppContext } from '../contexts/AppContext'
import { chartColors } from '../lib/chartColors'
import { useAppMotion } from '../lib/appMotion'
import { obfuscateName, shouldAnonymizeIdentity } from '../lib/access'
import { getRiskLevelOrder, getVisiblePrimaryReason, type ProcessedStudent, type RiskDistributionEntry } from '../lib/riskEngine'
import { scoreToBarColor } from '../lib/riskUtils'
import { cn } from '../lib/utils'

type SortKey = 'name' | 'course' | 'year' | 'risk' | 'lastUpdated'
type SortDirection = 'asc' | 'desc'
type RiskFilter = 'All' | 'none' | 'low' | 'medium' | 'high'

const DESKTOP_ROWS_PER_PAGE = 10
const MOBILE_ROWS_PER_PAGE = 10

function RiskProgress({
  score,
  barClassName,
}: {
  score: number
  barClassName: string
}) {
  return (
    <div className="flex min-w-[160px] items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f1ebe0]">
        <div className={cn('h-full rounded-full transition-[width] duration-300', barClassName)} style={{ width: `${score}%` }} />
      </div>
      <span className="min-w-[32px] text-right text-[11px] font-semibold text-[#2f2d2a] sm:text-[12px]">{score}</span>
    </div>
  )
}

function SortableHeader({
  label,
  active,
  direction,
  onClick,
  align = 'left',
}: {
  label: string
  active: boolean
  direction: SortDirection
  onClick: () => void
  align?: 'left' | 'center'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold transition-colors duration-150 hover:text-[#171614] sm:text-[12px]',
        align === 'center' && 'mx-auto'
      )}
    >
      {label}
      {active ? (
        direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 text-[#8c877f]" />
      )}
    </button>
  )
}

function AlertCard({
  student,
  reason,
  anonymize,
  onClick,
}: {
  student: ProcessedStudent
  reason: string
  anonymize: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[8px] border border-transparent bg-[#f4f4f4] p-3 text-left transition-[background-color,border-color,box-shadow] duration-150 hover:border-[#e5d8c6] hover:bg-[#f7f2eb] hover:shadow-[0_8px_18px_rgba(64,50,39,0.06)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#2d2b28]">{obfuscateName(student.name, anonymize)}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#5d5954]">{reason}</p>
        </div>
        <RiskBadge score={student.derivedRiskScore} />
      </div>
      <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#7a746d]">
        <Clock3 className="h-3.5 w-3.5" />
        {student.alertTimestampLabel}
      </div>
    </button>
  )
}

function RiskDistributionDonut({
  entries,
  total,
}: {
  entries: RiskDistributionEntry[]
  total: number
}) {
  const { createChartAnimation } = useAppMotion()
  const donutSeries = entries.map((entry) => Number(entry.value.toFixed(1)))

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Manrope',
      toolbar: { show: false },
      animations: createChartAnimation(380, 14),
    },
    labels: entries.map((entry) => entry.label),
    colors: entries.map((entry) => entry.color),
    legend: { show: false },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      marker: { show: false },
      x: { show: false },
      custom: ({ series, seriesIndex }) => {
        const entry = entries[seriesIndex]
        const value = Math.round(Number(series[seriesIndex] ?? 0))

        return [
          '<div style="display:flex;flex-direction:column;gap:4px;padding:8px 10px;border-radius:10px;background:rgba(45,43,40,0.94);color:#ffffff;font-family:Manrope;font-size:11px;font-weight:600;line-height:1.2;box-shadow:0 8px 18px rgba(0,0,0,0.18);">',
          `<span>${entry.label}</span>`,
          `<span style="font-weight:700;">${value}%</span>`,
          '</div>',
        ].join('')
      },
    },
    stroke: {
      colors: [chartColors.white],
      width: 5,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '60%',
          labels: {
            show: false,
          },
        },
      },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'darken' } },
    },
  }

  return (
    <div className="relative h-[210px] w-[250px] max-[360px]:h-[190px] max-[360px]:w-[230px]">
      <ApexChart type="donut" series={donutSeries} options={chartOptions} height={210} width={250} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="translate-y-[4px] text-[21px] font-bold text-[#262522] max-[360px]:text-[19px]">{total}</span>
      </div>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const { activeProfileId, derivedData, settings } = useAppContext()
  const { createRevealVariants, createStaggerVariants } = useAppMotion()
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('All')
  const [currentPage, setCurrentPage] = useState(0)
  const [sortKey, setSortKey] = useState<SortKey>('risk')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  )

  const anonymize = shouldAnonymizeIdentity(activeProfileId)
  const courseOptions = ['All', ...derivedData.courses]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const syncViewport = (event?: MediaQueryListEvent) => {
      setIsMobileViewport(event ? event.matches : mediaQuery.matches)
    }

    syncViewport()
    mediaQuery.addEventListener('change', syncViewport)
    return () => mediaQuery.removeEventListener('change', syncViewport)
  }, [])

  const searchText = searchTerm.trim().toLowerCase()

  const filteredStudents = derivedData.students.filter((student) => {
    const matchesSearch =
      searchText.length === 0 ||
      student.name.toLowerCase().includes(searchText) ||
      student.course.toLowerCase().includes(searchText) ||
      student.number.includes(searchText)

    const matchesCourse = courseFilter === 'All' || student.course === courseFilter
    const matchesRisk = riskFilter === 'All' || student.derivedRiskLevel === riskFilter

    return matchesSearch && matchesCourse && matchesRisk
  })

  const sortedStudents = [...filteredStudents].sort((left, right) => {
    const directionFactor = sortDirection === 'asc' ? 1 : -1

    if (sortKey === 'name') return left.name.localeCompare(right.name, 'pt-PT') * directionFactor
    if (sortKey === 'course') return left.course.localeCompare(right.course, 'pt-PT') * directionFactor
    if (sortKey === 'year') return (left.year - right.year) * directionFactor
    if (sortKey === 'lastUpdated') return left.lastUpdated.localeCompare(right.lastUpdated) * directionFactor

    const riskDelta = left.derivedRiskScore - right.derivedRiskScore
    if (riskDelta !== 0) return riskDelta * directionFactor

    return (getRiskLevelOrder(left.derivedRiskLevel) - getRiskLevelOrder(right.derivedRiskLevel)) * directionFactor
  })

  const rowsPerPage = isMobileViewport ? MOBILE_ROWS_PER_PAGE : DESKTOP_ROWS_PER_PAGE
  const pageCount = Math.max(1, Math.ceil(sortedStudents.length / rowsPerPage))

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, pageCount - 1))
  }, [pageCount])

  const startIndex = currentPage * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const visibleStudents = sortedStudents.slice(startIndex, endIndex)
  const visibleStudentCount = sortedStudents.length === 0 ? 0 : Math.min(endIndex, sortedStudents.length)
  const footerTotalStudents =
    courseFilter === 'All' && riskFilter === 'All' && searchTerm.trim().length === 0
      ? derivedData.tablePopulation
      : sortedStudents.length

  const recentAlertStudents = derivedData.alerts
    .slice(0, 3)
    .map((alert) => derivedData.students.find((student) => student.id === alert.studentId))
    .filter((student): student is ProcessedStudent => Boolean(student))

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((previous) => (previous === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(nextKey)
    setSortDirection(nextKey === 'name' || nextKey === 'course' ? 'asc' : 'desc')
  }

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-2 py-1.5 sm:px-5 sm:py-3">
        <h1 className="text-[15px] font-semibold text-[#2e2d2a] min-[420px]:text-[17px]">Dashboard</h1>
      </div>

      <motion.main
        className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col gap-3 px-2 py-2 min-[420px]:gap-4 min-[420px]:px-3 min-[420px]:py-3 sm:gap-5 sm:px-5 sm:py-4"
        variants={createStaggerVariants({ staggerChildren: 0.08 })}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="grid grid-cols-1 gap-1.5 min-[420px]:gap-3 sm:gap-4 xl:grid-cols-4"
          variants={createStaggerVariants({ staggerChildren: 0.08 })}
        >
          <motion.div variants={createRevealVariants({ distance: 12 })}>
            <KpiCard
              title="Estudantes Monitorados"
              value={derivedData.dashboardMetrics.monitoredStudents}
              subtitle="↑ 12% face ao mês anterior"
              subtitleTone="negative"
              icon={UserRound}
              iconBg="bg-[#fbefe8]"
              iconColor="text-[#c1633d]"
            />
          </motion.div>
          <motion.div variants={createRevealVariants({ distance: 12 })}>
            <KpiCard
              title="Risco Alto"
              value={derivedData.dashboardMetrics.highRiskStudents}
              subtitle="↑ 12% face ao mês anterior"
              subtitleTone="negative"
              icon={TriangleAlert}
              iconBg="bg-[#fbefe8]"
              iconColor="text-[#c1633d]"
            />
          </motion.div>
          <motion.div variants={createRevealVariants({ distance: 12 })}>
            <KpiCard
              title="Risco Médio"
              value={derivedData.dashboardMetrics.mediumRiskStudents}
              subtitle="↓ 12% face ao mês anterior"
              subtitleTone="positive"
              icon={ShieldAlert}
              iconBg="bg-[#fbefe8]"
              iconColor="text-[#c1633d]"
            />
          </motion.div>
          <motion.div variants={createRevealVariants({ distance: 12 })}>
            <KpiCard
              title="Intervenções este Mês (Fev)"
              value={derivedData.dashboardMetrics.interventionsThisMonth}
              subtitle="↓ 12% face ao mês anterior"
              subtitleTone="positive"
              icon={RefreshCcw}
              iconBg="bg-[#fbefe8]"
              iconColor="text-[#c1633d]"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:gap-4 sm:gap-4 min-[1180px]:grid-cols-[minmax(0,1.62fr)_336px] min-[1180px]:items-start xl:grid-cols-[minmax(0,1.84fr)_384px]">
          <motion.div className="min-h-0" variants={createRevealVariants({ distance: 14 })}>
            <Card className="flex h-full min-h-0 flex-col overflow-hidden">
              <div className="flex flex-col gap-2 border-b border-[#eee7db] bg-white px-2 py-2 min-[420px]:gap-3 min-[420px]:px-4 min-[420px]:py-4">
                <div className="grid gap-2 min-[920px]:grid-cols-[minmax(0,1fr)_auto] min-[920px]:items-center min-[920px]:gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <div className="relative min-w-0 flex-[1_1_220px]">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a958d]" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => {
                          setSearchTerm(event.target.value)
                          setCurrentPage(0)
                        }}
                        placeholder="Procurar por nome de aluno"
                        className="h-10 w-full rounded-[8px] border border-[#e6dfd4] bg-white pl-9 pr-3 text-[12px] text-[#2f2d2a] transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#d8cebe] focus:border-[#d59d82] focus:bg-[#fffdfa] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] min-[920px]:h-9 min-[920px]:max-w-[270px]"
                      />
                    </div>

                    <div className="relative shrink-0">
                      <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#716b64]" />
                      <select
                        value={courseFilter}
                        onChange={(event) => {
                          setCourseFilter(event.target.value)
                          setCurrentPage(0)
                        }}
                        className="h-10 w-[170px] appearance-none rounded-[8px] border border-[#e6dfd4] bg-white pl-9 pr-9 text-[12px] text-[#2f2d2a] transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#d8cebe] focus:border-[#d59d82] focus:bg-[#fffdfa] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] min-[920px]:h-9 min-[920px]:w-[196px]"
                      >
                        {courseOptions.map((option) => (
                          <option key={option} value={option}>
                            {option === 'All' ? 'Curso: Todos' : option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#716b64]" />
                    </div>

                    <div className="relative shrink-0">
                      <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#716b64]" />
                      <select
                        value={riskFilter}
                        onChange={(event) => {
                          setRiskFilter(event.target.value as RiskFilter)
                          setCurrentPage(0)
                        }}
                        className="h-10 w-[150px] appearance-none rounded-[8px] border border-[#e6dfd4] bg-white pl-9 pr-9 text-[12px] text-[#2f2d2a] transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#d8cebe] focus:border-[#d59d82] focus:bg-[#fffdfa] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] min-[920px]:h-9 min-[920px]:w-[184px]"
                      >
                        <option value="All">Risco: Todos</option>
                        <option value="high">Risco Alto</option>
                        <option value="medium">Risco Médio</option>
                        <option value="low">Risco Baixo</option>
                        <option value="none">Sem Risco</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#716b64]" />
                    </div>
                  </div>

                  <button className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#2d2c2b] px-4 text-[12px] font-semibold text-white shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-[background-color,box-shadow] duration-150 hover:bg-[#242321] hover:shadow-[0_8px_18px_rgba(26,24,22,0.14)] focus-visible:shadow-[0_0_0_3px_rgba(45,44,43,0.16)] min-[920px]:h-9 min-[920px]:w-auto min-[920px]:px-4">
                    <Download className="h-4 w-4" />
                    Exportar relatório
                  </button>
                </div>
              </div>

              <div
                className="overflow-x-auto overflow-y-visible min-[1180px]:min-h-0 min-[1180px]:flex-1 min-[1180px]:overflow-auto"
                style={{ maxHeight: isMobileViewport ? undefined : 'min(640px, calc(100vh - 332px))' }}
              >
                <table className="w-full min-w-[860px] border-collapse text-left text-[11px] sm:text-[12px]">
                  <thead>
                    <tr className="bg-[#ececec] font-semibold text-[#2f2d2a]">
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-4 py-3">
                        <SortableHeader
                          label="Nome"
                          active={sortKey === 'name'}
                          direction={sortDirection}
                          onClick={() => toggleSort('name')}
                        />
                      </th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">
                        <SortableHeader
                          label="Curso"
                          active={sortKey === 'course'}
                          direction={sortDirection}
                          onClick={() => toggleSort('course')}
                        />
                      </th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">
                        <SortableHeader
                          label="Ano"
                          active={sortKey === 'year'}
                          direction={sortDirection}
                          onClick={() => toggleSort('year')}
                        />
                      </th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">
                        <SortableHeader
                          label="Risco"
                          active={sortKey === 'risk'}
                          direction={sortDirection}
                          onClick={() => toggleSort('risk')}
                        />
                      </th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">Nível</th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">
                        <SortableHeader
                          label="Última Atualização"
                          active={sortKey === 'lastUpdated'}
                          direction={sortDirection}
                          onClick={() => toggleSort('lastUpdated')}
                        />
                      </th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-center">
                        <span className="inline-flex items-center justify-center text-[11px] font-semibold sm:text-[12px]">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="cursor-pointer border-b border-[#efebe3] text-[11px] text-[#36332f] transition-[background-color,border-color] duration-150 hover:border-[#eadfce] hover:bg-[#fff9f2] sm:text-[12px]"
                      >
                        <td className="px-4 py-3 font-medium text-[#2f2d2a]">{obfuscateName(student.name, anonymize)}</td>
                        <td className="max-w-[170px] truncate px-3 py-3 text-[#5b5650]">{student.course}</td>
                        <td className="px-3 py-3 text-[#5b5650]">{student.year}º Ano</td>
                        <td className="px-3 py-3">
                          <RiskProgress
                            score={student.derivedRiskScore}
                            barClassName={scoreToBarColor(student.derivedRiskScore, settings.riskThresholds)}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <RiskBadge score={student.derivedRiskScore} />
                        </td>
                        <td className="px-3 py-3 text-[#5b5650]">{student.lastUpdatedLabel}</td>
                        <td className="px-3 py-3 text-center text-[#c1633d]">
                          <User className="mx-auto h-4 w-4" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-[#ece6da] px-3 py-3 text-[11px] text-[#57534f] sm:px-4 sm:text-[12px]">
                <span>{visibleStudentCount} de {footerTotalStudents} alunos</span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                    disabled={currentPage === 0}
                    className="grid h-5 w-5 place-items-center rounded-[6px] border border-[#dfd8cb] text-[#4d4943] transition-[background-color,border-color,color,opacity] duration-150 hover:border-[#d4c7b5] hover:bg-[#faf5ec] hover:text-[#2f2d2a] disabled:cursor-not-allowed disabled:opacity-40 sm:h-7 sm:w-7 sm:rounded-[8px]"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(pageCount - 1, page + 1))}
                    disabled={currentPage >= pageCount - 1}
                    className="grid h-5 w-5 place-items-center rounded-[6px] border border-[#dfd8cb] text-[#4d4943] transition-[background-color,border-color,color,opacity] duration-150 hover:border-[#d4c7b5] hover:bg-[#faf5ec] hover:text-[#2f2d2a] disabled:cursor-not-allowed disabled:opacity-40 sm:h-7 sm:w-7 sm:rounded-[8px]"
                  >
                    ›
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="flex h-full min-h-0 flex-col gap-3 min-[420px]:gap-4 xl:min-h-0"
            variants={createStaggerVariants({ staggerChildren: 0.08, delayChildren: 0.05 })}
          >
            <motion.div variants={createRevealVariants({ distance: 12 })}>
              <Card className="p-3 min-[420px]:p-4">
                <h2 className="text-[16px] font-semibold text-[#262522]">Distribuição de Riscos</h2>

                <div className="relative mt-3 flex items-center justify-center min-[420px]:mt-4">
                  <RiskDistributionDonut entries={derivedData.dashboardRiskDistribution} total={derivedData.modeledPopulation} />
                </div>

                <div className="mt-2 space-y-1.5 min-[420px]:space-y-2">
                  {derivedData.dashboardRiskDistribution.map((entry) => (
                    <div
                      key={entry.key}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-[#f0ece4] pb-1.5 text-[11px] last:border-b-0 min-[420px]:gap-3 min-[420px]:pb-2 min-[420px]:text-[12px]"
                    >
                      <span className={cn('rounded-[2px] px-2 py-0.5 font-medium min-[420px]:px-2 min-[420px]:py-1', entry.legendBg, entry.legendText)}>
                        {entry.label}
                      </span>
                      <span className="text-[#3d3935]">{entry.countLabel}</span>
                      <span className="text-[#57534f]">{entry.percentLabel}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={createRevealVariants({ distance: 12 })}>
              <Card className="flex flex-1 flex-col p-3 min-[420px]:p-4">
                <h2 className="text-[16px] font-semibold text-[#262522]">Alertas Recentes</h2>

                <div className="mt-3 space-y-2 min-[420px]:mt-4">
                  {recentAlertStudents.map((student) => (
                    <AlertCard
                      key={student.id}
                      student={student}
                      anonymize={anonymize}
                      reason={getVisiblePrimaryReason(student, activeProfileId)}
                      onClick={() => navigate(`/students/${student.id}`)}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}
