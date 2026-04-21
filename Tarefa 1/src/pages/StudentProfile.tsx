import type { ApexOptions } from 'apexcharts'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApexChart } from '../components/charts/ApexChart'
import { Card } from '../components/ui/Card'
import { useAppContext } from '../contexts/AppContext'
import { students, type Student } from '../data/students'
import { useAppMotion } from '../lib/appMotion'
import { scoreToLevel } from '../lib/riskUtils'
import { cn } from '../lib/utils'

function obfuscateName(name: string, isObscured: boolean) {
  if (!isObscured) return name
  return name
    .split(' ')
    .map((part) => `${part[0]}***`)
    .join(' ')
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

function scale(value: number, min: number, max: number) {
  if (max <= min) return 0
  return clamp(((value - min) / (max - min)) * 100)
}

function inverseScale(value: number, min: number, max: number) {
  return clamp(100 - scale(value, min, max))
}

function buildStudentRadarData(student: Student) {
  const academicRisk = clamp(
    inverseScale(student.indicators.academic.gpa, 8, 15) * 0.32 +
      scale(student.indicators.academic.ucFailures, 0, 5) * 0.34 +
      scale(student.indicators.academic.negativeGrades, 0, 6) * 0.34
  )

  const attendanceRisk = inverseScale(student.indicators.academic.attendancePercent, 45, 100)

  const financialRisk = clamp(
    scale(student.indicators.financial.tuitionArrearsMonths, 0, 4) * 0.85 +
      scale(student.indicators.financial.monthlyFee, 65, 1250) * 0.15
  )

  const moodleRisk = clamp(
    scale(student.indicators.behavioral.daysSinceLastAccess, 0, 21) * 0.5 +
      inverseScale(student.indicators.behavioral.moodleLoginsLast30Days, 4, 24) * 0.3 +
      inverseScale(student.indicators.behavioral.materialsDownloaded, 1, 20) * 0.2
  )

  const residenceRisk =
    student.indicators.socioeconomic.residence === 'Internacional'
      ? 85
      : student.indicators.socioeconomic.residence === 'Deslocado'
        ? 70
        : 34

  const entryProfileRisk =
    student.indicators.socioeconomic.entryProfile === 'Internacional'
      ? 82
      : student.indicators.socioeconomic.entryProfile === 'Trabalhador-Estudante'
        ? 68
        : student.indicators.socioeconomic.entryProfile === 'Maior 23'
          ? 58
          : student.indicators.socioeconomic.entryProfile === 'CTeSP'
            ? 62
            : 40

  const contextRisk = clamp(
    residenceRisk * 0.38 +
      entryProfileRisk * 0.34 +
      (student.indicators.socioeconomic.nee ? 78 : 36) * 0.28
  )

  return [academicRisk, attendanceRisk, financialRisk, moodleRisk, contextRisk].map((value) => Math.round(value))
}

function StudentSpiderChart({ student, color }: { student: Student; color: string }) {
  const { createChartAnimation } = useAppMotion()

  const chartOptions: ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      parentHeightOffset: 0,
      animations: createChartAnimation(760, 70),
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    legend: { show: false },
    tooltip: { enabled: false },
    xaxis: {
      categories: ['Académico', 'Assiduidade', 'Financeiro', 'Moodle', 'Contexto'],
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100,
      tickAmount: 4,
    },
    plotOptions: {
      radar: {
        size: 84,
        polygons: {
          strokeColors: '#a59d92',
          strokeWidth: '1',
          connectorColors: '#d9d2c7',
          fill: {
            colors: ['rgba(249,245,239,0.72)', 'rgba(255,255,255,0.96)'],
          },
        },
      },
    },
    stroke: {
      width: 2.75,
      colors: [color],
    },
    fill: {
      opacity: 0.14,
      colors: [color],
    },
    markers: {
      size: 4.5,
      colors: [color],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
  }

  return (
    <div className="mx-auto flex w-full max-w-[260px] items-center justify-center">
      <ApexChart
        type="radar"
        series={[{ name: 'Risco', data: buildStudentRadarData(student) }]}
        options={chartOptions}
        height={176}
        className="w-full"
      />
    </div>
  )
}

function RiskRing({ score, color }: { score: number; color: string }) {
  const { createChartAnimation } = useAppMotion()

  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true },
      toolbar: { show: false },
      animations: createChartAnimation(820, 80),
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    colors: [color],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 270,
        hollow: {
          margin: 0,
          size: '69%',
          background: 'transparent',
        },
        track: {
          background: '#f2e9dc',
          strokeWidth: '100%',
          margin: 0,
        },
        dataLabels: {
          show: false,
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    tooltip: { enabled: false },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
  }

  return (
    <div className="relative h-[132px] w-[132px]">
      <ApexChart type="radialBar" series={[score]} options={chartOptions} height={132} width={132} />
      <div className="pointer-events-none absolute inset-[19px] rounded-full border border-[#efe6db] bg-white shadow-[0_10px_24px_rgba(88,70,50,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[40px] font-semibold leading-none text-[#161513]">{score}</span>
        <span className="mt-1 text-[15px] font-semibold text-[#2d2b28]">/100</span>
      </div>
    </div>
  )
}

function ProfilePanel({
  title,
  children,
  className,
  bodyClassName,
}: {
  title: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="border-b border-[#e8e1d4] bg-[#ececec] px-4 py-3 text-[13px] font-medium text-[#2f2d2a]">{title}</div>
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </Card>
  )
}

function ProfileField({
  label,
  value,
  tone = 'default',
  compact = false,
}: {
  label: string
  value: string
  tone?: 'default' | 'accent' | 'danger' | 'muted'
  compact?: boolean
}) {
  const toneClassName =
    tone === 'accent'
      ? 'text-[#2a9f4b]'
      : tone === 'danger'
        ? 'text-[#e72a2a]'
        : tone === 'muted'
          ? 'text-[#726d67]'
          : 'text-[#2d2b28]'

  return (
    <div className={cn('flex items-center justify-between gap-4 text-[13px]', compact ? 'py-1.5' : 'py-2')}>
      <span className="text-[#3b3834]">{label}</span>
      <span className={cn('text-right font-medium', toneClassName)}>{value}</span>
    </div>
  )
}

export function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activeProfileId, settings } = useAppContext()
  const { createRevealVariants, createStaggerVariants } = useAppMotion()
  const student = students.find((candidate) => candidate.id === id)
  const isObservatoryView = activeProfileId === 'obs'

  if (!student) {
    return (
      <div className="px-5 py-5">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#5c5852]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao dashboard
        </button>
      </div>
    )
  }

  const riskLevel = scoreToLevel(student.riskScore, settings.riskThresholds)
  const riskColor = riskLevel === 'high' ? '#e72a2a' : riskLevel === 'medium' ? '#e7a92a' : riskLevel === 'low' ? '#c1633d' : '#2a9f4b'
  const riskLabel = riskLevel === 'high' ? 'Risco Alto' : riskLevel === 'medium' ? 'Risco Médio' : riskLevel === 'low' ? 'Risco Baixo' : 'Sem Risco'
  const trendLabel = student.scoreTrend === 'up' ? 'A AGRAVAR' : student.scoreTrend === 'down' ? 'A RECUPERAR' : 'ESTÁVEL'
  const trendIndicator = student.scoreTrend === 'up' ? '↑' : student.scoreTrend === 'down' ? '↓' : '•'
  const riskBadgeClassName =
    riskLevel === 'high'
      ? 'border-[#f3d5d2] bg-[#fdebe8] text-[#a54a44]'
      : riskLevel === 'medium'
        ? 'border-[#f1dfaf] bg-[#fbf1d4] text-[#8f6b1f]'
        : riskLevel === 'low'
          ? 'border-[#eacdbd] bg-[#fbefe8] text-[#8f4d32]'
          : 'border-[#cce8d3] bg-[#e8f6eb] text-[#2f7f43]'

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ece4d8] bg-white px-5 py-5">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-4 rounded-[8px] px-1 py-1 text-[17px] font-medium text-[#6b6761] transition-[background-color,color,transform] duration-200 hover:bg-[#fbf5ec] hover:text-[#2d2b28] motion-safe:hover:-translate-y-[1px]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-semibold text-[#6b6761]">Dashboard</span>
          <span>/</span>
          <span className="font-semibold text-[#2d2b28]">{obfuscateName(student.name, isObservatoryView)}</span>
        </button>
      </div>

      <motion.main
        className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-5 py-5"
        variants={createStaggerVariants({ staggerChildren: 0.1 })}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={createRevealVariants({ distance: 12 })}>
          <Card className="bg-white p-4">
            <motion.div
              className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
              variants={createStaggerVariants({ staggerChildren: 0.08 })}
            >
              <motion.div
                className="grid grid-cols-1 gap-4 lg:grid-cols-[318px_minmax(0,1fr)]"
                variants={createStaggerVariants({ staggerChildren: 0.07 })}
              >
                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <ProfilePanel title="Nível de Risco" className="h-full" bodyClassName="flex h-[176px] items-center justify-center p-4">
                    <div className="flex items-center justify-center gap-5">
                      <RiskRing score={student.riskScore} color={riskColor} />

                      <div className="flex min-w-[128px] flex-col items-start gap-3">
                        <span
                          className={cn(
                            'inline-flex rounded-[2px] border px-4 py-2 text-[15px] font-semibold shadow-[0_1px_0_rgba(0,0,0,0.02)]',
                            'transition-[box-shadow,background-color] duration-150',
                            riskBadgeClassName
                          )}
                        >
                          {riskLabel}
                        </span>
                        <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#e72a2a] transition-transform duration-200 motion-safe:hover:translate-x-[1px]">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] bg-[#fde7e5] text-[12px] leading-none text-[#e72a2a] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                            {trendIndicator}
                          </span>
                          {trendLabel}
                        </span>
                      </div>
                    </div>
                  </ProfilePanel>
                </motion.div>

                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <ProfilePanel title="Informações do Aluno" className="h-full" bodyClassName="flex h-[176px] flex-col justify-center p-4">
                    <div className="space-y-0.5">
                      <ProfileField label="Nome" value={obfuscateName(student.name, isObservatoryView)} tone="accent" compact />
                      <ProfileField label="Número" value={isObservatoryView ? '***' : student.number} tone="accent" compact />
                      <ProfileField label="Curso" value={student.course} tone="accent" compact />
                      <ProfileField label="Ano Curricular" value={`${student.year}º Ano`} tone="accent" compact />
                    </div>
                  </ProfilePanel>
                </motion.div>
              </motion.div>

              <motion.div variants={createRevealVariants({ distance: 10 })}>
                <ProfilePanel
                  title="Análise Multidimensional"
                  className="h-full"
                  bodyClassName="flex h-[176px] items-center justify-center p-4"
                >
                  <StudentSpiderChart student={student} color={riskColor} />
                </ProfilePanel>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2"
              variants={createStaggerVariants({ staggerChildren: 0.07, delayChildren: 0.08 })}
            >
              <motion.div variants={createRevealVariants({ distance: 10 })}>
                <ProfilePanel title="Indicadores Académicos" className="h-full" bodyClassName="min-h-[150px] p-4">
                  <ProfileField label="Assiduidade" value={`${student.indicators.academic.attendancePercent}%`} tone="danger" />
                  <ProfileField label="UCs com Negativa" value={`${student.indicators.academic.ucFailures}`} tone="danger" />
                  <ProfileField label="Notas Negativas" value={`${student.indicators.academic.negativeGrades}`} tone="danger" />
                  <ProfileField label="Média Global" value={`${student.indicators.academic.gpa.toFixed(1)} valores`} tone="danger" />
                </ProfilePanel>
              </motion.div>

              <motion.div variants={createRevealVariants({ distance: 10 })}>
                <ProfilePanel title="Indicadores Financeiros" className="h-full" bodyClassName="min-h-[150px] p-4">
                  <ProfileField label="Impacto Mensal (ROI)" value={`€${student.indicators.financial.monthlyFee}`} tone="accent" />
                  <ProfileField
                    label="Propinas em Atraso"
                    value={`${student.indicators.financial.tuitionArrearsMonths} meses`}
                    tone="danger"
                  />
                  <ProfileField
                    label="Bolsa de Estudo"
                    value={student.indicators.financial.scholarshipStatus === 'Nao Bolseiro' ? 'Não Bolseiro' : student.indicators.financial.scholarshipStatus}
                    tone="muted"
                  />
                  <ProfileField label="Acordo de Pagamento" value={student.indicators.financial.paymentAgreement ? 'Sim' : 'Não'} tone="muted" />
                </ProfilePanel>
              </motion.div>

              <motion.div variants={createRevealVariants({ distance: 10 })}>
                <ProfilePanel title="Atividade Moodle" className="h-full" bodyClassName="min-h-[116px] p-4">
                  <ProfileField label="Primeiro Acesso" value={student.indicators.behavioral.firstAccessLabel} tone="danger" />
                  <ProfileField label="Último Acesso" value={`Há ${student.indicators.behavioral.daysSinceLastAccess} dias`} tone="danger" />
                </ProfilePanel>
              </motion.div>

              <motion.div variants={createRevealVariants({ distance: 10 })}>
                <ProfilePanel title="Contexto Socioeconómico" className="h-full" bodyClassName="min-h-[116px] p-4">
                  <ProfileField label="Perfil de Entrada" value={student.indicators.socioeconomic.entryProfile} tone="accent" />
                  <ProfileField label="Residência" value={student.indicators.socioeconomic.residence} tone="muted" />
                  <ProfileField label="NEE" value={student.indicators.socioeconomic.nee ? 'Sim' : 'Não'} tone="muted" />
                </ProfilePanel>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  )
}
