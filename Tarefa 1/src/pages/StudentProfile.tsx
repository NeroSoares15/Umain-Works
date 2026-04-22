import { useState, type ReactNode } from 'react'
import type { ApexOptions } from 'apexcharts'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Plus, Save, ShieldAlert, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApexChart } from '../components/charts/ApexChart'
import { Card } from '../components/ui/Card'
import { useAppContext } from '../contexts/AppContext'
import type { Intervention } from '../data/students'
import { canManageInterventions, canViewSensitiveData, obfuscateName, obfuscateNumber, shouldAnonymizeIdentity } from '../lib/access'
import { chartColors } from '../lib/chartColors'
import { useAppMotion } from '../lib/appMotion'
import { getRecommendedActionForProfile, getVisibleTriggerReasons, type ProcessedStudent } from '../lib/riskEngine'
import { cn } from '../lib/utils'

function StudentSpiderChart({
  student,
  color,
  compact = false,
}: {
  student: ProcessedStudent
  color: string
  compact?: boolean
}) {
  const { createChartAnimation } = useAppMotion()
  const radarSize = compact ? 66 : 72
  const radarHeight = compact ? 146 : 154
  const radarWidth = compact ? 172 : 192

  const chartOptions: ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      parentHeightOffset: 0,
      offsetX: 0,
      offsetY: compact ? 0 : -2,
      animations: createChartAnimation(380, 12),
      fontFamily: 'Manrope',
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
        size: radarSize,
        polygons: {
          strokeColors: '#c6beb3',
          strokeWidth: '1',
          connectorColors: '#e4dbcf',
          fill: {
            colors: ['rgba(250,246,240,0.95)', 'rgba(255,255,255,0.98)'],
          },
        },
      },
    },
    stroke: {
      width: compact ? 2 : 2.4,
      colors: [color],
    },
    fill: {
      opacity: 0.12,
      colors: [color],
    },
    markers: {
      size: compact ? 3 : 3.6,
      colors: [color],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: compact ? 4 : 5,
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
    <div className={cn('mx-auto flex h-full items-center justify-center', compact ? 'w-[172px]' : 'w-[192px]')}>
      <ApexChart
        type="radar"
        series={[
          {
            name: 'Risco',
            data: [
              student.riskBreakdown.academic,
              student.riskBreakdown.attendance,
              student.riskBreakdown.financial,
              student.riskBreakdown.moodle,
              student.riskBreakdown.context,
            ],
          },
        ]}
        options={chartOptions}
        height={radarHeight}
        width={radarWidth}
        className="mx-auto"
      />
    </div>
  )
}

function RiskRing({ score, color, compact = false }: { score: number; color: string; compact?: boolean }) {
  const { reduceMotion } = useAppMotion()
  const resolvedScore = Math.max(0, Math.min(100, score))
  const ringSize = compact ? 128 : 152
  const strokeWidth = compact ? 12 : 14
  const padding = compact ? 9 : 11
  const radius = ringSize / 2 - padding - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - resolvedScore / 100)
  const innerInset = compact ? 28 : 32

  return (
    <div className="relative" style={{ height: `${ringSize}px`, width: `${ringSize}px` }}>
      <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${ringSize} ${ringSize}`} aria-hidden="true">
        <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="#efe8dc" strokeWidth={strokeWidth} />
        <motion.circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          style={{ filter: 'drop-shadow(0 6px 12px rgba(193,99,61,0.12))' }}
        />
      </svg>
      <div
        className="pointer-events-none absolute rounded-full bg-white shadow-[0_10px_18px_rgba(88,70,50,0.05)]"
        style={{ inset: `${innerInset}px` }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-semibold leading-none text-[#161513]', compact ? 'text-[30px]' : 'text-[46px]')}>{resolvedScore}</span>
        <span className={cn('font-semibold text-[#2d2b28]', compact ? 'mt-1 text-[11px]' : 'mt-1 text-[15px]')}>/100</span>
      </div>
    </div>
  )
}

function ProfilePanel({
  title,
  children,
  className,
  bodyClassName,
  headerAction,
}: {
  title: string
  children: ReactNode
  className?: string
  bodyClassName?: string
  headerAction?: ReactNode
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-[#e8e1d4] bg-[#ececec] px-3 py-2 text-[11px] font-medium text-[#2f2d2a] sm:px-4 sm:py-3 sm:text-[13px]">
        <span>{title}</span>
        {headerAction}
      </div>
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
    <div
      className={cn(
        'flex items-center justify-between gap-3 text-[11px] sm:gap-4 sm:text-[13px]',
        compact ? 'py-1.5' : 'py-2'
      )}
    >
      <span className="text-[#3b3834]">{label}</span>
      <span className={cn('text-right font-medium', toneClassName)}>{value}</span>
    </div>
  )
}

function getTodayInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, '0')
  const day = `${today.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatInterventionTypeLabel(type: Intervention['type']) {
  if (type === 'Reuniao') return 'Reunião'
  if (type === 'Encaminhamento SAS') return 'Encaminhamento SAS'
  if (type === 'Alerta Gerado') return 'Alerta Gerado'
  return type
}

type InterventionDraft = {
  date: string
  type: Intervention['type']
  author: string
  description: string
}

function InterventionTimeline({
  student,
  riskColor,
  riskBadgeClassName,
  actionTitle,
  actionDescription,
  canManage,
  draft,
  isComposerOpen,
  onComposerToggle,
  onDraftChange,
  onSaveIntervention,
}: {
  student: ProcessedStudent
  riskColor: string
  riskBadgeClassName: string
  actionTitle: string
  actionDescription: string
  canManage: boolean
  draft: InterventionDraft
  isComposerOpen: boolean
  onComposerToggle: (open: boolean) => void
  onDraftChange: (changes: Partial<InterventionDraft>) => void
  onSaveIntervention: () => void
}) {
  const timelineEntries = [...student.interventions].sort((left, right) => right.date.localeCompare(left.date))

  return (
    <ProfilePanel
      title="Histórico de Intervenções / Decisão"
      headerAction={
        canManage ? (
          <button
            type="button"
            onClick={() => onComposerToggle(!isComposerOpen)}
            className="inline-flex items-center gap-1 rounded-[8px] border border-[#e0d5c7] bg-white px-2.5 py-1 text-[11px] font-medium text-[#6a645d] transition-[background-color,border-color,color] duration-150 hover:border-[#d1b59d] hover:bg-[#fff9f2] hover:text-[#2d2b28]"
          >
            {isComposerOpen ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isComposerOpen ? 'Fechar' : 'Adicionar registo'}
          </button>
        ) : null
      }
      bodyClassName="space-y-4 p-4"
    >
      {canManage && isComposerOpen ? (
        <div className="rounded-[8px] border border-[#eadfd0] bg-[#fff8f0] p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="space-y-1">
              <span className="text-[11px] font-medium text-[#655f58]">Data</span>
              <input
                type="date"
                value={draft.date}
                onChange={(event) => onDraftChange({ date: event.target.value })}
                className="h-9 w-full rounded-[8px] border border-[#e1d6c8] bg-white px-3 text-[12px] text-[#2d2b28] transition-[border-color,box-shadow] duration-150 focus:border-[#d59d82] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)]"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-medium text-[#655f58]">Tipo</span>
              <select
                value={draft.type}
                onChange={(event) => onDraftChange({ type: event.target.value as Intervention['type'] })}
                className="h-9 w-full rounded-[8px] border border-[#e1d6c8] bg-white px-3 text-[12px] text-[#2d2b28] transition-[border-color,box-shadow] duration-150 focus:border-[#d59d82] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)]"
              >
                <option value="Reuniao">Reunião</option>
                <option value="Email">Email</option>
                <option value="Tutoria">Tutoria</option>
                <option value="Encaminhamento SAS">Encaminhamento SAS</option>
                <option value="Alerta Gerado">Alerta Gerado</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] font-medium text-[#655f58]">Autor</span>
              <input
                type="text"
                value={draft.author}
                onChange={(event) => onDraftChange({ author: event.target.value })}
                className="h-9 w-full rounded-[8px] border border-[#e1d6c8] bg-white px-3 text-[12px] text-[#2d2b28] transition-[border-color,box-shadow] duration-150 focus:border-[#d59d82] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)]"
              />
            </label>
          </div>
          <label className="mt-3 block space-y-1">
            <span className="text-[11px] font-medium text-[#655f58]">Descrição</span>
            <textarea
              value={draft.description}
              onChange={(event) => onDraftChange({ description: event.target.value })}
              rows={3}
              placeholder="Descreve a intervenção efetuada para este estudante."
              className="w-full rounded-[8px] border border-[#e1d6c8] bg-white px-3 py-2 text-[12px] text-[#2d2b28] transition-[border-color,box-shadow] duration-150 focus:border-[#d59d82] focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)]"
            />
          </label>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onComposerToggle(false)}
              className="inline-flex items-center gap-1 rounded-[8px] border border-[#e0d5c7] bg-white px-3 py-2 text-[12px] font-medium text-[#5f5952] transition-colors duration-150 hover:bg-[#fffdfa]"
            >
              <X className="h-3.5 w-3.5" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSaveIntervention}
              className="inline-flex items-center gap-1 rounded-[8px] bg-[#2d2c2b] px-3 py-2 text-[12px] font-semibold text-white transition-colors duration-150 hover:bg-[#242321]"
            >
              <Save className="h-3.5 w-3.5" />
              Guardar registo
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {timelineEntries.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-[#e3dbcf] bg-[#fffdfa] px-4 py-5 text-[12px] text-[#6b665f]">
            Ainda não existem intervenções registadas para este estudante.
          </div>
        ) : (
          timelineEntries.map((intervention, index) => (
            <div key={`${intervention.date}-${intervention.type}-${index}`} className="relative pl-6">
              <span
                className="absolute left-[3px] top-1.5 h-3 w-3 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(193,99,61,0.2)]"
                style={{ backgroundColor: riskColor }}
              />
              {index < timelineEntries.length - 1 ? (
                <span className="absolute left-[8px] top-4 h-[calc(100%+10px)] w-px bg-[#e8e0d5]" />
              ) : null}

              <div className="rounded-[8px] border border-[#ebe4d8] bg-[#fffdfa] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('inline-flex rounded-[2px] border px-2 py-1 text-[11px] font-semibold', riskBadgeClassName)}>
                    {formatInterventionTypeLabel(intervention.type)}
                  </span>
                  <span className="text-[11px] text-[#706a63]">{intervention.author}</span>
                  <span className="text-[11px] text-[#8a847d]">{intervention.date}</span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-[#3b3935]">{intervention.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-[8px] border border-[#eadfd0] bg-[#fff8f0] p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#fde7e5] text-[#c1633d]">
            <ShieldAlert className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[#2e2d2a]">{actionTitle}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#5d5954]">{actionDescription}</p>
          </div>
        </div>
      </div>
    </ProfilePanel>
  )
}

export function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activeProfileId, derivedData, addStudentIntervention } = useAppContext()
  const { createRevealVariants, createStaggerVariants } = useAppMotion()
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [draftIntervention, setDraftIntervention] = useState<InterventionDraft>({
    date: getTodayInputValue(),
    type: 'Reuniao',
    author: 'Técnica SAS',
    description: '',
  })
  const student = derivedData.students.find((candidate) => candidate.id === id)
  const anonymize = shouldAnonymizeIdentity(activeProfileId)
  const canViewSensitive = canViewSensitiveData(activeProfileId)
  const canAddIntervention = canManageInterventions(activeProfileId)

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

  const riskColor =
    student.derivedRiskLevel === 'high'
      ? chartColors.red
      : student.derivedRiskLevel === 'medium'
        ? chartColors.yellow
        : student.derivedRiskLevel === 'low'
          ? chartColors.main
          : chartColors.green

  const riskBadgeClassName =
    student.derivedRiskLevel === 'high'
      ? 'border-[#f3d5d2] bg-[#fdebe8] text-[#a54a44]'
      : student.derivedRiskLevel === 'medium'
        ? 'border-[#f1dfaf] bg-[#fbf1d4] text-[#8f6b1f]'
        : student.derivedRiskLevel === 'low'
          ? 'border-[#eacdbd] bg-[#fbefe8] text-[#8f4d32]'
          : 'border-[#cce8d3] bg-[#e8f6eb] text-[#2f7f43]'

  const riskLabel =
    student.derivedRiskLevel === 'high'
      ? 'Risco Alto'
      : student.derivedRiskLevel === 'medium'
        ? 'Risco Médio'
        : student.derivedRiskLevel === 'low'
          ? 'Risco Baixo'
          : 'Sem Risco'

  const trendLabel =
    student.scoreTrend === 'up' ? 'A AGRAVAR' : student.scoreTrend === 'down' ? 'A RECUPERAR' : 'ESTÁVEL'
  const trendIndicator = student.scoreTrend === 'up' ? '↑' : student.scoreTrend === 'down' ? '↓' : '•'
  const visibleTriggers = getVisibleTriggerReasons(student, activeProfileId)
  const recommendedAction = getRecommendedActionForProfile(student, activeProfileId)
  function handleDraftChange(changes: Partial<InterventionDraft>) {
    setDraftIntervention((previous) => ({ ...previous, ...changes }))
  }

  function handleComposerToggle(open: boolean) {
    setIsComposerOpen(open)

    if (!open) {
      setDraftIntervention({
        date: getTodayInputValue(),
        type: 'Reuniao',
        author: 'Técnica SAS',
        description: '',
      })
    }
  }

  function handleSaveIntervention() {
    if (!student || !draftIntervention.description.trim()) {
      return
    }

    addStudentIntervention(student.id, {
      date: draftIntervention.date,
      type: draftIntervention.type,
      author: draftIntervention.author.trim() || 'Técnica SAS',
      description: draftIntervention.description.trim(),
    })

    handleComposerToggle(false)
  }

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ece4d8] bg-white px-2 py-2 sm:px-5 sm:py-5">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-[6px] px-1 py-1 text-[12px] font-medium text-[#6b6761] transition-[background-color,color,transform] duration-150 hover:bg-[#fbf5ec] hover:text-[#2d2b28] sm:gap-3 sm:rounded-[8px] sm:text-[13px]"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="font-semibold text-[#6b6761]">Dashboard</span>
          <span>/</span>
          <span className="font-semibold text-[#2d2b28]">{obfuscateName(student.name, anonymize)}</span>
        </button>
      </div>

      <motion.main
        className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-2 py-3 sm:px-5 sm:py-5"
        variants={createStaggerVariants({ staggerChildren: 0.08 })}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={createRevealVariants({ distance: 12 })}>
          <Card className="bg-white p-2 sm:p-4">
            <div className="space-y-2 md:hidden">
              <ProfilePanel title="Informações do Aluno" bodyClassName="p-3">
                <div className="space-y-0.5">
                  <ProfileField label="Nome" value={obfuscateName(student.name, anonymize)} tone="accent" compact />
                  <ProfileField label="Número" value={obfuscateNumber(student.number, anonymize)} tone="accent" compact />
                  <ProfileField label="Curso" value={student.course} tone="accent" compact />
                  <ProfileField label="Ano Curricular" value={`${student.year}º Ano`} tone="accent" compact />
                </div>
              </ProfilePanel>

              <ProfilePanel title="Nível de Risco" bodyClassName="flex flex-col items-center justify-center gap-3 px-4 py-5">
                <RiskRing score={student.derivedRiskScore} color={riskColor} compact />
                <span className={cn('inline-flex whitespace-nowrap rounded-[2px] border px-3 py-1 text-[11px] font-semibold', riskBadgeClassName)}>
                  {riskLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.04em] text-[#e72a2a]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] bg-[#fde7e5] text-[10px] leading-none text-[#e72a2a]">
                    {trendIndicator}
                  </span>
                  {trendLabel}
                </span>
              </ProfilePanel>

              <ProfilePanel title="Análise Multidimensional" bodyClassName="px-3 py-4">
                <StudentSpiderChart student={student} color={riskColor} compact />
              </ProfilePanel>

              <ProfilePanel title="Indicadores Académicos" bodyClassName="p-3">
                <ProfileField label="Assiduidade" value={`${student.indicators.academic.attendancePercent}%`} tone="danger" compact />
                <ProfileField label="UCs com Negativa" value={`${student.indicators.academic.ucFailures}`} tone="danger" compact />
                <ProfileField label="Notas Negativas" value={`${student.indicators.academic.negativeGrades}`} tone="danger" compact />
                <ProfileField label="Média Global" value={`${student.indicators.academic.gpa.toFixed(1)} valores`} tone="danger" compact />
              </ProfilePanel>

              {canViewSensitive ? (
                <ProfilePanel title="Indicadores Financeiros" bodyClassName="p-3">
                  <ProfileField label="Impacto Mensal (ROI)" value={`€${student.indicators.financial.monthlyFee}`} tone="accent" compact />
                  <ProfileField label="Propinas em Atraso" value={`${student.indicators.financial.tuitionArrearsMonths} meses`} tone="danger" compact />
                  <ProfileField
                    label="Bolsa de Estudo"
                    value={student.indicators.financial.scholarshipStatus === 'Nao Bolseiro' ? 'Não Bolseiro' : student.indicators.financial.scholarshipStatus}
                    tone="muted"
                    compact
                  />
                  <ProfileField label="Acordo de Pagamento" value={student.indicators.financial.paymentAgreement ? 'Sim' : 'Não'} tone="muted" compact />
                </ProfilePanel>
              ) : null}

              <ProfilePanel title="Atividade Moodle" bodyClassName="p-3">
                <ProfileField label="Primeiro Acesso" value={student.indicators.behavioral.firstAccessLabel} tone="danger" compact />
                <ProfileField label="Último Acesso" value={`Há ${student.indicators.behavioral.daysSinceLastAccess} dias`} tone="danger" compact />
              </ProfilePanel>

              {canViewSensitive ? (
                <ProfilePanel title="Contexto Socioeconómico" bodyClassName="p-3">
                  <ProfileField label="Perfil de Entrada" value={student.indicators.socioeconomic.entryProfile} tone="accent" compact />
                  <ProfileField label="Residência" value={student.indicators.socioeconomic.residence} tone="muted" compact />
                  <ProfileField label="NEE" value={student.indicators.socioeconomic.nee ? 'Sim' : 'Não'} tone="muted" compact />
                </ProfilePanel>
              ) : null}

              <InterventionTimeline
                student={student}
                riskColor={riskColor}
                riskBadgeClassName={riskBadgeClassName}
                actionTitle={recommendedAction.title}
                actionDescription={recommendedAction.description}
                canManage={canAddIntervention}
                draft={draftIntervention}
                isComposerOpen={isComposerOpen}
                onComposerToggle={handleComposerToggle}
                onDraftChange={handleDraftChange}
                onSaveIntervention={handleSaveIntervention}
              />
            </div>

            <div className="hidden md:block">
              <motion.div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:auto-rows-fr" variants={createStaggerVariants({ staggerChildren: 0.08 })}>
                  <motion.div variants={createRevealVariants({ distance: 10 })}>
                    <ProfilePanel title="Nível de Risco" className="h-full" bodyClassName="flex h-[220px] items-center justify-center px-5 py-4">
                      <div className="grid w-full max-w-[286px] grid-cols-[152px_minmax(0,1fr)] items-center gap-5">
                        <div className="flex items-center justify-center">
                          <RiskRing score={student.derivedRiskScore} color={riskColor} />
                        </div>
                        <div className="flex min-w-0 flex-col items-start justify-center gap-3">
                          <span className={cn('inline-flex whitespace-nowrap rounded-[2px] border px-4 py-2 text-[15px] font-semibold', riskBadgeClassName)}>
                            {riskLabel}
                          </span>
                          <span className="inline-flex items-center gap-2 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.04em] text-[#e72a2a]">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[8px] bg-[#fde7e5] text-[12px] leading-none text-[#e72a2a]">
                              {trendIndicator}
                            </span>
                            {trendLabel}
                          </span>
                        </div>
                      </div>
                    </ProfilePanel>
                  </motion.div>

                  <motion.div variants={createRevealVariants({ distance: 10 })}>
                    <ProfilePanel title="Informações do Aluno" className="h-full" bodyClassName="flex h-[220px] flex-col justify-center p-4">
                      <div className="space-y-0.5">
                        <ProfileField label="Nome" value={obfuscateName(student.name, anonymize)} tone="accent" compact />
                        <ProfileField label="Número" value={obfuscateNumber(student.number, anonymize)} tone="accent" compact />
                        <ProfileField label="Curso" value={student.course} tone="accent" compact />
                        <ProfileField label="Ano Curricular" value={`${student.year}º Ano`} tone="accent" compact />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {visibleTriggers.slice(0, 2).map((trigger) => (
                          <span key={trigger} className="rounded-[2px] bg-[#f5efe5] px-2 py-1 text-[11px] text-[#665f58]">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </ProfilePanel>
                  </motion.div>

                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <ProfilePanel title="Análise Multidimensional" className="h-full" bodyClassName="grid h-[220px] place-items-center p-4">
                    <StudentSpiderChart student={student} color={riskColor} />
                  </ProfilePanel>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-4 grid grid-cols-2 gap-4"
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

                {canViewSensitive ? (
                  <motion.div variants={createRevealVariants({ distance: 10 })}>
                    <ProfilePanel title="Indicadores Financeiros" className="h-full" bodyClassName="min-h-[150px] p-4">
                      <ProfileField label="Impacto Mensal (ROI)" value={`€${student.indicators.financial.monthlyFee}`} tone="accent" />
                      <ProfileField label="Propinas em Atraso" value={`${student.indicators.financial.tuitionArrearsMonths} meses`} tone="danger" />
                      <ProfileField
                        label="Bolsa de Estudo"
                        value={student.indicators.financial.scholarshipStatus === 'Nao Bolseiro' ? 'Não Bolseiro' : student.indicators.financial.scholarshipStatus}
                        tone="muted"
                      />
                      <ProfileField label="Acordo de Pagamento" value={student.indicators.financial.paymentAgreement ? 'Sim' : 'Não'} tone="muted" />
                    </ProfilePanel>
                  </motion.div>
                ) : (
                  <motion.div variants={createRevealVariants({ distance: 10 })}>
                    <ProfilePanel title="Resumo do Caso" className="h-full" bodyClassName="min-h-[150px] p-4">
                      <div className="space-y-3">
                        <div className="rounded-[8px] bg-[#f8f3ea] p-3 text-[12px] text-[#5c5751]">
                          O perfil atual tem acesso apenas à identificação, indicadores académicos, atividade Moodle e histórico de intervenção.
                        </div>
                        <div className="space-y-2">
                          {visibleTriggers.slice(0, 3).map((trigger) => (
                            <div key={trigger} className="rounded-[8px] border border-[#ece3d7] bg-[#fffdfa] px-3 py-2 text-[12px] text-[#45413c]">
                              {trigger}
                            </div>
                          ))}
                        </div>
                      </div>
                    </ProfilePanel>
                  </motion.div>
                )}

                <motion.div variants={createRevealVariants({ distance: 10 })}>
                  <ProfilePanel title="Atividade Moodle" className="h-full" bodyClassName="min-h-[96px] p-4">
                    <ProfileField label="Primeiro Acesso" value={student.indicators.behavioral.firstAccessLabel} tone="danger" />
                    <ProfileField label="Último Acesso" value={`Há ${student.indicators.behavioral.daysSinceLastAccess} dias`} tone="danger" />
                  </ProfilePanel>
                </motion.div>

                {canViewSensitive ? (
                  <motion.div variants={createRevealVariants({ distance: 10 })}>
                    <ProfilePanel title="Contexto Socioeconómico" className="h-full" bodyClassName="min-h-[116px] p-4">
                      <ProfileField label="Perfil de Entrada" value={student.indicators.socioeconomic.entryProfile} tone="accent" />
                      <ProfileField label="Residência" value={student.indicators.socioeconomic.residence} tone="muted" />
                      <ProfileField label="NEE" value={student.indicators.socioeconomic.nee ? 'Sim' : 'Não'} tone="muted" />
                    </ProfilePanel>
                  </motion.div>
                ) : (
                  <motion.div variants={createRevealVariants({ distance: 10 })}>
                    <ProfilePanel title="Próxima Ação Recomendada" className="h-full" bodyClassName="min-h-[116px] p-4">
                      <div className="rounded-[8px] border border-[#eadfd0] bg-[#fff8f0] p-4">
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#fde7e5] text-[#c1633d]">
                            <Mail className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-[13px] font-semibold text-[#2e2d2a]">{recommendedAction.title}</p>
                            <p className="mt-1 text-[12px] leading-relaxed text-[#5d5954]">{recommendedAction.description}</p>
                          </div>
                        </div>
                      </div>
                    </ProfilePanel>
                  </motion.div>
                )}
              </motion.div>

              <motion.div className="mt-4" variants={createRevealVariants({ distance: 10 })}>
                <InterventionTimeline
                  student={student}
                  riskColor={riskColor}
                  riskBadgeClassName={riskBadgeClassName}
                  actionTitle={recommendedAction.title}
                  actionDescription={recommendedAction.description}
                  canManage={canAddIntervention}
                  draft={draftIntervention}
                  isComposerOpen={isComposerOpen}
                  onComposerToggle={handleComposerToggle}
                  onDraftChange={handleDraftChange}
                  onSaveIntervention={handleSaveIntervention}
                />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  )
}
