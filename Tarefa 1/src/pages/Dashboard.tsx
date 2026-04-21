import { useState } from 'react'
import type { ApexOptions } from 'apexcharts'
import { useNavigate } from 'react-router-dom'
import {
  Download,
  Hourglass,
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
import { chartColors } from '../lib/chartColors'
import { cn } from '../lib/utils'

const statusOptions: Array<'All' | WorkflowStatus> = ['All', 'Pendente', 'Em progresso', 'Finalizado']

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
        'inline-flex items-center gap-1 rounded-[8px] border px-2 py-1 text-[11px] font-medium',
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

function RiskDistributionDonut() {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Manrope, Arial, sans-serif',
      toolbar: { show: false },
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
      enabled: true,
      formatter: (value) => `${Math.round(Number(value))}%`,
      style: {
        fontSize: '14px',
        fontWeight: '700',
        colors: [chartColors.green, chartColors.yellow, chartColors.main, chartColors.red],
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '64%',
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
        series={[19, 8, 23, 41]}
        options={chartOptions}
        height={190}
        width={230}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="translate-y-[4px] text-[19px] font-bold text-[#262522]">215</span>
      </div>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const { activeProfileId } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All')
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

  const visibleStudents = filteredStudents.slice(0, 20)

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-5 py-3">
        <h1 className="text-[17px] font-semibold text-[#2e2d2a]">Dashboard</h1>
      </div>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-5 px-5 py-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <KpiCard
            title="Estudantes Monitorados"
            value={dashboardMetrics.monitoredStudents}
            subtitle="↑ 12% face ao mês anterior"
            subtitleTone="negative"
            icon={UserRound}
            iconBg="bg-[#fbefe8]"
            iconColor="text-[#c1633d]"
          />
          <KpiCard
            title="Risco Alto"
            value={dashboardMetrics.highRiskStudents}
            subtitle="↑ 12% face ao mês anterior"
            subtitleTone="negative"
            icon={TriangleAlert}
            iconBg="bg-[#fbefe8]"
            iconColor="text-[#c1633d]"
          />
          <KpiCard
            title="Risco Médio"
            value={dashboardMetrics.mediumRiskStudents}
            subtitle="↓ 12% face ao mês anterior"
            subtitleTone="positive"
            icon={ShieldAlert}
            iconBg="bg-[#fbefe8]"
            iconColor="text-[#c1633d]"
          />
          <KpiCard
            title="Intervenções este Mês (Fev)"
            value={dashboardMetrics.interventionsThisMonth}
            subtitle="↓ 12% face ao mês anterior"
            subtitleTone="positive"
            icon={RefreshCcw}
            iconBg="bg-[#fbefe8]"
            iconColor="text-[#c1633d]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.82fr)_384px]">
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-[#eee7db] bg-white px-4 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a958d]" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Procurar por nome de aluno"
                      className="h-8 w-full rounded-[8px] border border-[#e6dfd4] bg-white pl-9 pr-3 text-[12px] text-[#2f2d2a] sm:w-[230px]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                    className="h-8 rounded-[8px] border border-[#e6dfd4] bg-white px-3 text-[12px] text-[#2f2d2a]"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === 'All' ? 'Status: All' : `Status: ${option}`}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="inline-flex h-8 items-center justify-center gap-2 rounded-[8px] bg-[#2d2c2b] px-4 text-[12px] font-semibold text-white">
                  <Download className="h-4 w-4" />
                  Exportar relatório
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#ececec] text-[12px] font-semibold text-[#2f2d2a]">
                    <th className="border-b border-[#e2ddd3] px-4 py-3">Nome de Aluno</th>
                    <th className="border-b border-[#e2ddd3] px-3 py-3">Curso</th>
                    <th className="border-b border-[#e2ddd3] px-3 py-3">Grau</th>
                    <th className="border-b border-[#e2ddd3] px-3 py-3">Causa</th>
                    <th className="border-b border-[#e2ddd3] px-3 py-3">Status</th>
                    <th className="border-b border-[#e2ddd3] px-3 py-3">Score</th>
                    <th className="border-b border-[#e2ddd3] px-3 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="cursor-pointer border-b border-[#efebe3] text-[12px] text-[#36332f] transition-colors hover:bg-[#fff9f0]"
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
              <span>10 de 200 alunos</span>
              <div className="flex items-center gap-2">
                <button className="grid h-7 w-7 place-items-center rounded-[8px] border border-[#dfd8cb] text-[#4d4943]">
                  ‹
                </button>
                <button className="grid h-7 w-7 place-items-center rounded-[8px] border border-[#dfd8cb] text-[#4d4943]">
                  ›
                </button>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
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

            <Card className="p-4">
              <h2 className="text-[18px] font-semibold text-[#262522]">Alunos com Maior Risco</h2>

              <div className="mt-4 space-y-2">
                {dashboardTopRiskStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="w-full rounded-[8px] bg-[#f4f4f4] p-3 text-left transition-colors hover:bg-[#efefef]"
                  >
                    <p className="text-[13px] font-semibold text-[#2d2b28]">{obfuscateName(student.name, isObservatoryView)}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#5d5954]">{student.reason}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
