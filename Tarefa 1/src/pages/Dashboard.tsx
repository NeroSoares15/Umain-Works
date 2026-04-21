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
const ROWS_PER_PAGE = 25

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
  const donutMarkers = [
    { label: `${donutSeries[0]}%`, className: 'left-[16px] top-[67px]' },
    { label: `${donutSeries[1]}%`, className: 'left-1/2 top-[12px] -translate-x-1/2' },
    { label: `${donutSeries[2]}%`, className: 'right-[16px] top-[79px]' },
    { label: `${donutSeries[3]}%`, className: 'left-1/2 bottom-[8px] -translate-x-1/2' },
  ]

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
    tooltip: { enabled: false },
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
    <div className="relative h-[190px] w-[230px]">
      <ApexChart
        type="donut"
        series={donutSeries}
        options={chartOptions}
        height={190}
        width={230}
      />
      <div className="pointer-events-none absolute inset-0">
        {donutMarkers.map((marker) => (
          <span
            key={marker.label}
            className={cn(
              'absolute inline-flex min-w-[40px] items-center justify-center rounded-full bg-[#2d2b28]/88 px-2.5 py-1 text-[11px] font-bold leading-none text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)]',
              marker.className
            )}
          >
            {marker.label}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="translate-y-[4px] text-[19px] font-bold text-[#262522]">215</span>
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
  const isObservatoryView = activeProfileId === 'obs'

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

  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / ROWS_PER_PAGE))

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, pageCount - 1))
  }, [pageCount])

  const startIndex = currentPage * ROWS_PER_PAGE
  const endIndex = startIndex + ROWS_PER_PAGE
  const visibleStudents = filteredStudents.slice(startIndex, endIndex)
  const visibleStudentCount = filteredStudents.length === 0 ? 0 : Math.min(endIndex, filteredStudents.length)
  const footerTotalStudents = statusFilter === 'All' && searchTerm.trim().length === 0 ? 200 : filteredStudents.length

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-5 py-3">
        <h1 className="text-[17px] font-semibold text-[#2e2d2a]">Dashboard</h1>
      </div>

      <motion.main
        className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-5 px-5 py-4"
        variants={createStaggerVariants({ staggerChildren: 0.1 })}
        initial="hidden"
        animate="show"
      >
        <motion.div className="grid grid-cols-1 gap-4 xl:grid-cols-4" variants={createStaggerVariants({ staggerChildren: 0.08 })}>
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

        <div className="grid grid-cols-1 gap-4 xl:h-[calc(100vh-278px)] xl:grid-cols-[minmax(0,1.82fr)_384px] xl:items-stretch">
          <motion.div className="min-h-0" variants={createRevealVariants({ distance: 14 })}>
            <Card className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-[#eee7db] bg-white px-4 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a958d]" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => {
                        setSearchTerm(event.target.value)
                        setCurrentPage(0)
                      }}
                      placeholder="Procurar por nome de aluno"
                      className="h-8 w-full rounded-[8px] border border-[#e6dfd4] bg-white pl-9 pr-3 text-[12px] text-[#2f2d2a] transition-[border-color,box-shadow,background-color] duration-200 hover:border-[#d8cebe] focus:border-[#d59d82] focus:bg-[#fffdfa] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)] sm:w-[230px]"
                    />
                  </div>

                  <div className="relative">
                    <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#716b64]" />
                    <select
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(event.target.value as typeof statusFilter)
                        setCurrentPage(0)
                      }}
                      className="h-8 appearance-none rounded-[8px] border border-[#e6dfd4] bg-white pl-8 pr-9 text-[12px] text-[#2f2d2a] transition-[border-color,box-shadow,background-color] duration-200 hover:border-[#d8cebe] focus:border-[#d59d82] focus:bg-[#fffdfa] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)]"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === 'All' ? 'Status: All' : `Status: ${option}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#716b64]" />
                  </div>
                </div>

                <button className="inline-flex h-8 items-center justify-center gap-2 rounded-[8px] bg-[#2d2c2b] px-4 text-[12px] font-semibold text-white shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-[transform,box-shadow,background-color] duration-200 hover:bg-[#242321] hover:shadow-[0_10px_20px_rgba(26,24,22,0.18)] focus-visible:shadow-[0_0_0_3px_rgba(45,44,43,0.16)] motion-safe:hover:-translate-y-[1px]">
                  <Download className="h-4 w-4" />
                  Exportar relatório
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#ececec] text-[12px] font-semibold text-[#2f2d2a]">
                    <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-4 py-3">Nome de Aluno</th>
                    <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">Curso</th>
                    <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">Grau</th>
                    <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">Causa</th>
                    <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">Status</th>
                    <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3">Score</th>
                    <th className="sticky top-0 z-10 border-b border-[#e2ddd3] bg-[#ececec] px-3 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="cursor-pointer border-b border-[#efebe3] text-[12px] text-[#36332f] transition-[background-color,border-color] duration-200 hover:border-[#eadfce] hover:bg-[#fff9f2]"
                    >
                      <td className="px-4 py-2.5 font-medium text-[#2f2d2a]">
                        {obfuscateName(student.name, isObservatoryView)}
                      </td>
                      <td className="max-w-[170px] truncate px-3 py-2.5 text-[#5b5650]">{student.course}</td>
                      <td className="px-3 py-2.5 text-[#5b5650]">{student.degree}</td>
                      <td className="max-w-[170px] truncate px-3 py-2.5 text-[#5b5650]">{student.mainCause}</td>
                      <td className="px-3 py-2.5">
                        <DashboardStatusBadge status={student.workflowStatus} />
                      </td>
                      <td className="px-3 py-2.5">
                        <RiskBadge score={student.riskScore} />
                      </td>
                      <td className="px-3 py-2.5 text-center text-[#c1633d]">
                        <User className="mx-auto h-4 w-4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#ece6da] px-4 py-3 text-[12px] text-[#57534f]">
              <span>
                {visibleStudentCount} de {footerTotalStudents} alunos
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                  disabled={currentPage === 0}
                  className="grid h-7 w-7 place-items-center rounded-[8px] border border-[#dfd8cb] text-[#4d4943] transition-[background-color,border-color,color,opacity] duration-150 hover:border-[#d4c7b5] hover:bg-[#faf5ec] hover:text-[#2f2d2a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(pageCount - 1, page + 1))}
                  disabled={currentPage >= pageCount - 1}
                  className="grid h-7 w-7 place-items-center rounded-[8px] border border-[#dfd8cb] text-[#4d4943] transition-[background-color,border-color,color,opacity] duration-150 hover:border-[#d4c7b5] hover:bg-[#faf5ec] hover:text-[#2f2d2a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
            </Card>
          </motion.div>

          <motion.div className="flex h-full min-h-0 flex-col gap-4" variants={createStaggerVariants({ staggerChildren: 0.08, delayChildren: 0.05 })}>
            <motion.div variants={createRevealVariants({ distance: 12 })}>
              <Card className="p-4">
              <h2 className="text-[18px] font-semibold text-[#262522]">Distribuição de Riscos</h2>

              <div className="relative mt-4 flex items-center justify-center">
                <RiskDistributionDonut />
              </div>

              <div className="mt-1 space-y-2">
                {dashboardRiskDistribution.map((entry) => (
                  <div
                    key={entry.key}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[#f0ece4] pb-2 text-[12px] last:border-b-0"
                  >
                    <span className={cn('rounded-[8px] px-2 py-1 font-medium', entry.legendBg, entry.legendText)}>
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
              <Card className="flex flex-1 flex-col p-4">
              <h2 className="text-[18px] font-semibold text-[#262522]">Alunos com Maior Risco</h2>

              <div className="mt-4 space-y-2">
                {dashboardTopRiskStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="w-full rounded-[8px] border border-transparent bg-[#f4f4f4] p-3 text-left transition-[transform,background-color,border-color,box-shadow] duration-200 hover:border-[#e5d8c6] hover:bg-[#f7f2eb] hover:shadow-[0_8px_18px_rgba(64,50,39,0.06)] motion-safe:hover:-translate-y-[1px]"
                  >
                    <p className="text-[13px] font-semibold text-[#2d2b28]">{obfuscateName(student.name, isObservatoryView)}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#5d5954]">{student.reason}</p>
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
