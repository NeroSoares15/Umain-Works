import { useEffect, useState } from 'react'
import type { ApexOptions } from 'apexcharts'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Download,
  Hourglass,
  ListFilter,
  RefreshCcw,
  Search,
  ShieldAlert,
  TriangleAlert,
  User,
  UserRound,
  CheckCircle2,
} from 'lucide-react'
import { ApexChart } from '../components/charts/ApexChart'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { RiskBadge } from '../components/ui/RiskBadge'
import { useAppContext } from '../contexts/AppContext'
import { students, type WorkflowStatus } from '../data/students'
import { dashboardMetrics, dashboardRiskDistribution, dashboardTopRiskStudents } from '../data/referenceData'
import { useAppMotion } from '../lib/appMotion'
import { chartColors } from '../lib/chartColors'
import { cn } from '../lib/utils'

const statusOptions: Array<'All' | WorkflowStatus> = ['All', 'Pendente', 'Em progresso', 'Finalizado']
const DESKTOP_ROWS_PER_PAGE = 25
const MOBILE_ROWS_PER_PAGE = 10

function obfuscateName(name: string, isObscured: boolean) {
  if (!isObscured) return name
  return name
    .split(' ')
    .map((part) => `${part[0]}***`)
    .join(' ')
}

function DashboardStatusBadge({ status }: { status: WorkflowStatus }) {
  const config =
    status === 'Pendente'
      ? {
          label: 'Pendente',
          className: 'border-[#d9d7d1] bg-[#f7f7f6] text-[#46433e]',
          icon: Hourglass,
        }
      : status === 'Em progresso'
        ? {
            label: 'Em progresso',
            className: 'border-[#ebd59e] bg-[#fbf4dc] text-[#7a5d1f]',
            icon: RefreshCcw,
          }
        : {
            label: 'Finalizado',
            className: 'border-[#bfe0c8] bg-[#e7f6ec] text-[#2f7146]',
            icon: CheckCircle2,
          }

  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[2px] border px-2 py-1 text-[11px] font-medium',
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

function RiskDistributionDonut() {
  const { createChartAnimation } = useAppMotion()
  const donutSeries = [19, 8, 23, 41]

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Manrope, Arial, sans-serif',
      toolbar: { show: false },
      animations: createChartAnimation(920, 95),
    },
    labels: ['Sem Risco', 'Risco Médio', 'Risco Baixo', 'Risco Alto'],
    colors: [chartColors.green, chartColors.yellow, chartColors.main, chartColors.red],
    legend: { show: false },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      marker: { show: false },
      x: { show: false },
      y: { formatter: undefined },
      custom: ({ series, seriesIndex }) => {
        const value = Math.round(Number(series[seriesIndex] ?? 0))

        return [
          '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:40px;padding:6px 10px;border-radius:999px;background:rgba(45,43,40,0.92);color:#ffffff;font:700 11px Manrope, Arial, sans-serif;line-height:1;box-shadow:0 8px 18px rgba(0,0,0,0.18);">',
          `${value}%`,
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
          size: '58%',
          labels: {
            show: false,
            name: { show: false },
            value: { show: false },
            total: {
              show: false,
              showAlways: true,
              label: '',
              fontSize: '19px',
              fontWeight: '700',
              color: '#262522',
              formatter: () => '215',
            },
          },
        },
      },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
  }

  return (
    <div className="relative h-[210px] w-[250px] max-[360px]:h-[190px] max-[360px]:w-[230px]">
      <ApexChart type="donut" series={donutSeries} options={chartOptions} height={210} width={250} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="translate-y-[4px] text-[21px] font-bold text-[#262522] max-[360px]:text-[19px]">215</span>
      </div>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const { activeProfileId } = useAppContext()
  const { createRevealVariants, createStaggerVariants } = useAppMotion()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All')
  const [currentPage, setCurrentPage] = useState(0)
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  )
  const isObservatoryView = activeProfileId === 'obs'

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const syncViewport = (event?: MediaQueryListEvent) => {
      setIsMobileViewport(event ? event.matches : mediaQuery.matches)
    }

    syncViewport()
    mediaQuery.addEventListener('change', syncViewport)

    return () => {
      mediaQuery.removeEventListener('change', syncViewport)
    }
  }, [])

  const filteredStudents = students.filter((student) => {
    const searchText = searchTerm.trim().toLowerCase()
    const matchesSearch =
      searchText.length === 0 ||
      student.name.toLowerCase().includes(searchText) ||
      student.course.toLowerCase().includes(searchText) ||
      student.number.includes(searchText)

    const matchesStatus = statusFilter === 'All' || student.workflowStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const rowsPerPage = isMobileViewport ? MOBILE_ROWS_PER_PAGE : DESKTOP_ROWS_PER_PAGE
  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / rowsPerPage))

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, pageCount - 1))
  }, [pageCount])

  const startIndex = currentPage * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const visibleStudents = filteredStudents.slice(startIndex, endIndex)
  const visibleStudentCount = filteredStudents.length === 0 ? 0 : Math.min(endIndex, filteredStudents.length)
  const footerTotalStudents = statusFilter === 'All' && searchTerm.trim().length === 0 ? 200 : filteredStudents.length

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-2 py-1.5 sm:px-5 sm:py-3">
        <h1 className="text-[15px] font-semibold text-[#2e2d2a] min-[420px]:text-[17px]">Dashboard</h1>
      </div>

      <motion.main
        className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col gap-3 px-2 py-2 min-[420px]:gap-4 min-[420px]:px-3 min-[420px]:py-3 sm:gap-5 sm:px-5 sm:py-4"
        variants={createStaggerVariants({ staggerChildren: 0.1 })}
        initial="hidden"
        animate="show"
      >
        <motion.div className="grid grid-cols-1 gap-1.5 min-[420px]:gap-3 sm:gap-4 xl:grid-cols-4" variants={createStaggerVariants({ staggerChildren: 0.08 })}>
          <motion.div variants={createRevealVariants({ distance: 12 })}>
            <KpiCard
              title="Estudantes Monitorados"
              value={dashboardMetrics.monitoredStudents}
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
              value={dashboardMetrics.highRiskStudents}
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
              value={dashboardMetrics.mediumRiskStudents}
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
              value={dashboardMetrics.interventionsThisMonth}
              subtitle="↓ 12% face ao mês anterior"
              subtitleTone="positive"
              icon={RefreshCcw}
              iconBg="bg-[#fbefe8]"
              iconColor="text-[#c1633d]"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:gap-4 sm:gap-4 min-[1180px]:grid-cols-[minmax(0,1.55fr)_328px] min-[1180px]:items-start xl:grid-cols-[minmax(0,1.82fr)_384px]">
          <motion.div className="min-h-0" variants={createRevealVariants({ distance: 14 })}>
            <Card className="flex h-full min-h-0 flex-col overflow-hidden">
              <div className="flex flex-col gap-2 border-b border-[#eee7db] bg-white px-2 py-2 min-[420px]:gap-3 min-[420px]:px-4 min-[420px]:py-4">
                <div className="grid gap-2 min-[720px]:grid-cols-[minmax(0,1fr)_auto] min-[720px]:items-center min-[720px]:gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <div className="relative min-w-0 flex-[1_1_210px]">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a958d]" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => {
                          setSearchTerm(event.target.value)
                          setCurrentPage(0)
                        }}
                        placeholder="Procurar por nome de aluno"
                        className="h-10 w-full rounded-[8px] border border-[#e6dfd4] bg-white pl-9 pr-3 text-[12px] text-[#2f2d2a] transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#d8cebe] focus:border-[#d59d82] focus:bg-[#fffdfa] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] min-[720px]:max-w-[270px]"
                      />
                    </div>

                    <div className="relative shrink-0">
                      <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#716b64]" />
                      <select
                        value={statusFilter}
                        onChange={(event) => {
                          setStatusFilter(event.target.value as typeof statusFilter)
                          setCurrentPage(0)
                        }}
                        className="h-10 w-[132px] appearance-none rounded-[8px] border border-[#e6dfd4] bg-white pl-9 pr-9 text-[12px] text-[#2f2d2a] transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#d8cebe] focus:border-[#d59d82] focus:bg-[#fffdfa] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] min-[520px]:w-[150px]"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option === 'All' ? 'Status: All' : `Status: ${option}`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#716b64]" />
                    </div>
                  </div>

                  <button className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#2d2c2b] px-4 text-[12px] font-semibold text-white shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-[background-color,box-shadow] duration-150 hover:bg-[#242321] hover:shadow-[0_8px_18px_rgba(26,24,22,0.14)] focus-visible:shadow-[0_0_0_3px_rgba(45,44,43,0.16)] min-[720px]:w-auto">
                    <Download className="h-4 w-4" />
                    Exportar relatório
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-visible min-[1180px]:min-h-0 min-[1180px]:flex-1 min-[1180px]:overflow-auto min-[1180px]:max-h-[560px] 2xl:max-h-[640px]">
                <table className="w-full min-w-[760px] border-collapse text-left text-[11px] sm:min-w-[820px] sm:text-[12px]">
                  <thead>
                    <tr className="bg-[#ececec] font-semibold text-[#2f2d2a]">
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-[11px] sm:px-4 sm:text-[12px]">Nome de Aluno</th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-[11px] sm:px-3 sm:text-[12px]">Curso</th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-[11px] sm:px-3 sm:text-[12px]">Grau</th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-[11px] sm:px-3 sm:text-[12px]">Causa</th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-[11px] sm:px-3 sm:text-[12px]">Status</th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-[11px] sm:px-3 sm:text-[12px]">Score</th>
                      <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-center text-[11px] sm:px-3 sm:text-[12px]">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="cursor-pointer border-b border-[#efebe3] text-[11px] text-[#36332f] transition-[background-color,border-color] duration-150 hover:border-[#eadfce] hover:bg-[#fff9f2] sm:text-[12px]"
                      >
                        <td className="px-3 py-3 font-medium text-[#2f2d2a] sm:px-4 sm:py-2.5">
                          {obfuscateName(student.name, isObservatoryView)}
                        </td>
                        <td className="max-w-[140px] truncate px-3 py-3 text-[#5b5650] sm:max-w-[170px] sm:px-3 sm:py-2.5">{student.course}</td>
                        <td className="px-3 py-3 text-[#5b5650] sm:px-3 sm:py-2.5">{student.degree}</td>
                        <td className="max-w-[130px] truncate px-3 py-3 text-[#5b5650] sm:max-w-[170px] sm:px-3 sm:py-2.5">{student.mainCause}</td>
                        <td className="px-3 py-3 sm:px-3 sm:py-2.5">
                          <DashboardStatusBadge status={student.workflowStatus} />
                        </td>
                        <td className="px-3 py-3 sm:px-3 sm:py-2.5">
                          <RiskBadge score={student.riskScore} />
                        </td>
                        <td className="px-3 py-3 text-center text-[#c1633d] sm:px-3 sm:py-2.5">
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

          <motion.div className="flex h-full min-h-0 flex-col gap-3 min-[420px]:gap-4 xl:min-h-0" variants={createStaggerVariants({ staggerChildren: 0.08, delayChildren: 0.05 })}>
            <motion.div variants={createRevealVariants({ distance: 12 })}>
              <Card className="p-3 min-[420px]:p-4">
                <h2 className="text-[16px] font-semibold text-[#262522]">Distribuição de Riscos</h2>

                <div className="relative mt-3 flex items-center justify-center min-[420px]:mt-4">
                  <div>
                    <RiskDistributionDonut />
                  </div>
                </div>

                <div className="mt-2 space-y-1.5 min-[420px]:space-y-2">
                  {dashboardRiskDistribution.map((entry) => (
                    <div
                      key={entry.key}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-[#f0ece4] pb-1.5 text-[11px] last:border-b-0 min-[420px]:gap-3 min-[420px]:pb-2 min-[420px]:text-[12px]"
                    >
                      <span className={cn('rounded-[2px] px-2 py-0.5 font-medium min-[420px]:rounded-[8px] min-[420px]:px-2 min-[420px]:py-1', entry.legendBg, entry.legendText)}>
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
                <h2 className="text-[16px] font-semibold text-[#262522]">Alunos com Maior Risco</h2>

                <div className="mt-3 space-y-2 min-[420px]:mt-4">
                  {dashboardTopRiskStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="w-full rounded-[6px] border border-transparent bg-[#f4f4f4] p-3 text-left transition-[background-color,border-color,box-shadow] duration-150 hover:border-[#e5d8c6] hover:bg-[#f7f2eb] hover:shadow-[0_8px_18px_rgba(64,50,39,0.06)]"
                    >
                      <p className="text-[12px] font-semibold text-[#2d2b28] min-[420px]:text-[13px]">{obfuscateName(student.name, isObservatoryView)}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-[#5d5954] min-[420px]:text-[12px]">{student.reason}</p>
                    </button>
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
