import { useState } from 'react'
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
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { RiskBadge } from '../components/ui/RiskBadge'
import { useAppContext } from '../contexts/AppContext'
import { students, type WorkflowStatus } from '../data/students'
import { dashboardMetrics, dashboardRiskDistribution, dashboardTopRiskStudents } from '../data/referenceData'
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
        'inline-flex items-center gap-1 rounded-[4px] border px-2 py-1 text-[11px] font-medium',
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

function RiskDistributionDonut() {
  const segments = [
    { key: 'medium', value: 8, color: '#d8a127' },
    { key: 'low', value: 23, color: '#bf623b' },
    { key: 'high', value: 41, color: '#e02b2b' },
    { key: 'none', value: 19, color: '#2f9d49' },
  ]

  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  const radius = 58
  const strokeWidth = 18
  const circumference = 2 * Math.PI * radius
  const gapLength = 5

  let cumulativeLength = 0
  const segmentMarkup = segments
    .map((segment) => {
      const rawLength = (segment.value / total) * circumference
      const dashLength = Math.max(rawLength - gapLength, 0)
      const markup = `<circle cx="115" cy="94" r="${radius}" fill="none" stroke="${segment.color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${dashLength} ${circumference}" stroke-dashoffset="${-cumulativeLength}" />`
      cumulativeLength += rawLength
      return markup
    })
    .join('')

  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 190" fill="none">
      <g transform="rotate(-90 115 94)">
        <circle cx="115" cy="94" r="${radius}" fill="none" stroke="#f3ede5" stroke-width="${strokeWidth}" />
        ${segmentMarkup}
      </g>
      <circle cx="115" cy="94" r="41" fill="white" />
      <text x="115" y="102" text-anchor="middle" font-size="19" font-weight="700" fill="#262522" font-family="Manrope, Arial, sans-serif">215</text>
      <text x="36" y="62" font-size="14" font-weight="700" fill="#2f9d49" font-family="Manrope, Arial, sans-serif">19%</text>
      <text x="115" y="23" text-anchor="middle" font-size="14" font-weight="700" fill="#d8a127" font-family="Manrope, Arial, sans-serif">8%</text>
      <text x="189" y="66" font-size="14" font-weight="700" fill="#bf623b" font-family="Manrope, Arial, sans-serif">23%</text>
      <text x="48" y="154" font-size="14" font-weight="700" fill="#e02b2b" font-family="Manrope, Arial, sans-serif">41%</text>
    </svg>
  `

  return (
    <img
      alt=""
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`}
      className="h-[190px] w-[230px]"
    />
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
        <h1 className="text-[16px] font-semibold text-[#2e2d2a]">Dashboard</h1>
      </div>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-5 px-4 py-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <KpiCard
            title="Estudantes Monitorados"
            value={dashboardMetrics.monitoredStudents}
            subtitle="↑ 12% face ao mês anterior"
            subtitleTone="negative"
            icon={UserRound}
            iconBg="bg-[#fbefe8]"
            iconColor="text-[#c5663b]"
          />
          <KpiCard
            title="Risco Alto"
            value={dashboardMetrics.highRiskStudents}
            subtitle="↑ 12% face ao mês anterior"
            subtitleTone="negative"
            icon={TriangleAlert}
            iconBg="bg-[#fbefe8]"
            iconColor="text-[#c5663b]"
          />
          <KpiCard
            title="Risco Médio"
            value={dashboardMetrics.mediumRiskStudents}
            subtitle="↓ 12% face ao mês anterior"
            subtitleTone="positive"
            icon={ShieldAlert}
            iconBg="bg-[#fbefe8]"
            iconColor="text-[#c5663b]"
          />
          <KpiCard
            title="Intervenções este Mês (Fev)"
            value={dashboardMetrics.interventionsThisMonth}
            subtitle="↓ 12% face ao mês anterior"
            subtitleTone="positive"
            icon={RefreshCcw}
            iconBg="bg-[#fbefe8]"
            iconColor="text-[#c5663b]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.85fr)_390px]">
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-[#eee7db] bg-white px-5 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a958d]" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Procurar por nome de aluno"
                      className="h-9 w-full rounded-[4px] border border-[#e6dfd4] bg-white pl-9 pr-3 text-[12px] text-[#2f2d2a] sm:w-[230px]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                    className="h-9 rounded-[4px] border border-[#e6dfd4] bg-white px-3 text-[12px] text-[#2f2d2a]"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === 'All' ? 'Status: All' : `Status: ${option}`}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] bg-[#2d2c2b] px-4 text-[12px] font-semibold text-white">
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
                      <td className="px-3 py-2.5 text-center text-[#c5663b]">
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
                <button className="grid h-7 w-7 place-items-center rounded-[4px] border border-[#dfd8cb] text-[#4d4943]">
                  ‹
                </button>
                <button className="grid h-7 w-7 place-items-center rounded-[4px] border border-[#dfd8cb] text-[#4d4943]">
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
                    <span className={cn('rounded-[4px] px-2 py-1 font-medium', entry.legendBg, entry.legendText)}>
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
                    className="w-full rounded-[4px] bg-[#f4f4f4] p-3 text-left transition-colors hover:bg-[#efefef]"
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
