import type { Student } from '../data/students'
import { scoreToLevel, type RiskLevel } from './riskUtils'
import type { ProfileId } from './access'
import { canViewSensitiveData } from './access'

const MODELED_STUDENT_POPULATION = 215
const TABLE_POPULATION = 200
const MONTH_LABELS = ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
const CONFIDENTIAL_REASON_LABEL = 'Motivo confidencial - reservado aos SAS'

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

type ProfileMultiplierKey = 'firstYear' | 'scholarship' | 'international'

type ProfileMultiplierSetting = {
  label: string
  maxValue: number
  severity: number
}

export interface EngineSettings {
  riskThresholds: {
    none: number
    low: number
    medium: number
  }
  profileMultipliers: Record<ProfileMultiplierKey, ProfileMultiplierSetting>
  academic: {
    negativeGradesTolerance: number
    lateAssignmentsTolerance: number
  }
  attendance: {
    maxUnjustifiedAbsencesPercent: number
  }
  financial: {
    maxArrearsMonths: number
  }
}

export interface SettingsTableRow {
  id: string
  label: string
  maxValue: string
  severity?: string
}

export interface SettingsSectionView {
  id: string
  title: string
  description: string
  columns: string[]
  rows: SettingsTableRow[]
}

type Trigger = {
  label: string
  sensitive: boolean
  weight: number
}

export interface ProcessedStudent extends Student {
  derivedRiskScore: number
  derivedRiskLevel: RiskLevel
  riskBreakdown: {
    academic: number
    attendance: number
    financial: number
    moodle: number
    context: number
  }
  triggerReasons: string[]
  publicTriggerReasons: string[]
  triggerReasonsFull: Trigger[]
  recommendedAction: {
    priority: 'low' | 'medium' | 'high'
    title: string
    description: string
  }
  lastUpdatedLabel: string
  alertTimestamp: string
  alertTimestampLabel: string
  annualRevenue: number
  revenueAtRisk: number
  recoverableRevenue: number
}

export interface DerivedAlert {
  id: string
  studentId: string
  studentName: string
  course: string
  level: RiskLevel
  riskScore: number
  reason: string
  timestamp: string
  timestampLabel: string
}

export interface RiskDistributionEntry {
  key: RiskLevel
  label: string
  value: number
  countLabel: string
  percentLabel: string
  color: string
  legendBg: string
  legendText: string
}

export interface DashboardMetrics {
  monitoredStudents: number
  highRiskStudents: number
  mediumRiskStudents: number
  interventionsThisMonth: number
}

export interface AnalysisRoiBarDatum {
  name: string
  preserved: number
  risk: number
}

export interface AnalysisAggregates {
  roi: {
    revenueAtRisk: number
    recoverableEstimate: number
    multiplier: number
    parameterRows: Array<{ type: string; maxDelay: string; severity: string }>
    chartData: AnalysisRoiBarDatum[]
  }
  retention: {
    withoutIntervention: number
    optimized: number
    chartData: Array<{ month: string; historical: number; optimized: number }>
  }
  course: {
    courses: string[]
    mixes: Record<string, { none: number; low: number; medium: number; high: number }>
  }
}

export interface DerivedAppData {
  students: ProcessedStudent[]
  alerts: DerivedAlert[]
  dashboardMetrics: DashboardMetrics
  dashboardRiskDistribution: RiskDistributionEntry[]
  analysis: AnalysisAggregates
  courses: string[]
  tablePopulation: number
  modeledPopulation: number
}

export const DEFAULT_ENGINE_SETTINGS: EngineSettings = {
  riskThresholds: { none: 20, low: 40, medium: 60 },
  profileMultipliers: {
    firstYear: { label: 'Estudante 1 Ano', maxValue: 4, severity: 20 },
    scholarship: { label: 'Estudante Bolseiro', maxValue: 2, severity: 15 },
    international: { label: 'Estudante Internacional', maxValue: 1, severity: 10 },
  },
  academic: {
    negativeGradesTolerance: 2,
    lateAssignmentsTolerance: 1,
  },
  attendance: {
    maxUnjustifiedAbsencesPercent: 15,
  },
  financial: {
    maxArrearsMonths: 2,
  },
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

function toCurrency(value: number) {
  return `€${Math.round(value).toLocaleString('pt-PT')}`
}

function formatPercentage(value: number) {
  return `${Math.round(value)}%`
}

function formatDateLabel(input: string) {
  const date = new Date(`${input}T09:00:00`)
  return `${String(date.getDate()).padStart(2, '0')} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

function formatTimestampLabel(input: string) {
  const date = new Date(input)
  return `${String(date.getDate()).padStart(2, '0')} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()} — ${String(
    date.getHours()
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function buildAlertTimestamp(student: Student, index: number) {
  const sourceDate =
    student.interventions.find((intervention) => intervention.type === 'Alerta Gerado')?.date ?? student.lastUpdated
  const date = new Date(`${sourceDate}T08:15:00`)
  date.setHours(8 + (index % 5), 10 + (index * 7) % 45)
  return date.toISOString()
}

function getEntryProfileRisk(student: Student) {
  switch (student.indicators.socioeconomic.entryProfile) {
    case 'Internacional':
      return 82
    case 'Trabalhador-Estudante':
      return 68
    case 'Maior 23':
      return 58
    case 'CTeSP':
      return 62
    default:
      return 38
  }
}

function getResidenceRisk(student: Student) {
  switch (student.indicators.socioeconomic.residence) {
    case 'Internacional':
      return 84
    case 'Deslocado':
      return 66
    default:
      return 34
  }
}

function buildSettingsSections(settings: EngineSettings): SettingsSectionView[] {
  return [
    {
      id: 'risk-multipliers',
      title: 'Multiplicadores de Risco',
      description:
        'Define os perfis de estudante com maior vulnerabilidade ao abandono e o peso agravado que cada um representa no cálculo global de risco.',
      columns: ['Tipo de Estudante', 'Max. Meses em Atraso', 'Gravidade', 'Ações'],
      rows: [
        {
          id: 'firstYear',
          label: settings.profileMultipliers.firstYear.label,
          maxValue: `${settings.profileMultipliers.firstYear.maxValue}`,
          severity: `${settings.profileMultipliers.firstYear.severity}%`,
        },
        {
          id: 'scholarship',
          label: settings.profileMultipliers.scholarship.label,
          maxValue: `${settings.profileMultipliers.scholarship.maxValue}`,
          severity: `${settings.profileMultipliers.scholarship.severity}%`,
        },
        {
          id: 'international',
          label: settings.profileMultipliers.international.label,
          maxValue: `${settings.profileMultipliers.international.maxValue}`,
          severity: `${settings.profileMultipliers.international.severity}%`,
        },
      ],
    },
    {
      id: 'academic-performance',
      title: 'Desempenho Académico',
      description:
        'Estabelece os limiares máximos de tolerância para resultados negativos e trabalhos em atraso antes de o estudante ser sinalizado em risco.',
      columns: ['Tipo', 'Max. Tolerado', 'Ações'],
      rows: [
        {
          id: 'negativeGradesTolerance',
          label: 'Nº Negativas Toleradas',
          maxValue: `${settings.academic.negativeGradesTolerance}`,
        },
        {
          id: 'lateAssignmentsTolerance',
          label: 'Trabalhos em Atraso Tolerados',
          maxValue: `${settings.academic.lateAssignmentsTolerance}`,
        },
      ],
    },
    {
      id: 'attendance',
      title: 'Assiduidade',
      description:
        'Configura a percentagem máxima de faltas injustificadas permitidas antes de o sistema considerar o estudante em situação de risco de abandono.',
      columns: ['Tipo', 'Max. Tolerado', 'Ações'],
      rows: [
        {
          id: 'maxUnjustifiedAbsencesPercent',
          label: 'Nº de Faltas Injustificadas Toleradas',
          maxValue: `${settings.attendance.maxUnjustifiedAbsencesPercent}%`,
        },
      ],
    },
    {
      id: 'financial',
      title: 'Financeiro',
      description:
        'Define o número máximo de propinas em atraso toleradas antes de acionar alertas de risco financeiro para o estudante.',
      columns: ['Tipo', 'Max. Tolerado', 'Ações'],
      rows: [
        {
          id: 'maxArrearsMonths',
          label: 'Nº de Propinas em Atraso',
          maxValue: `${settings.financial.maxArrearsMonths}`,
        },
      ],
    },
  ]
}

function parseNumberInput(value: string) {
  const numericValue = Number.parseFloat(value.replace('%', '').replace(',', '.').trim())
  return Number.isFinite(numericValue) ? numericValue : 0
}

export function applySettingsRowEdit(
  settings: EngineSettings,
  sectionId: string,
  rowId: string,
  values: { maxValue: string; severity?: string }
) {
  const nextSettings: EngineSettings = {
    ...settings,
    riskThresholds: { ...settings.riskThresholds },
    profileMultipliers: {
      firstYear: { ...settings.profileMultipliers.firstYear },
      scholarship: { ...settings.profileMultipliers.scholarship },
      international: { ...settings.profileMultipliers.international },
    },
    academic: { ...settings.academic },
    attendance: { ...settings.attendance },
    financial: { ...settings.financial },
  }

  const maxValue = Math.max(0, parseNumberInput(values.maxValue))
  const severity = Math.max(0, parseNumberInput(values.severity ?? '0'))

  if (sectionId === 'risk-multipliers' && rowId in nextSettings.profileMultipliers) {
    const key = rowId as ProfileMultiplierKey
    nextSettings.profileMultipliers[key].maxValue = maxValue || nextSettings.profileMultipliers[key].maxValue
    nextSettings.profileMultipliers[key].severity = severity || nextSettings.profileMultipliers[key].severity
  }

  if (sectionId === 'academic-performance') {
    if (rowId === 'negativeGradesTolerance') {
      nextSettings.academic.negativeGradesTolerance = maxValue || nextSettings.academic.negativeGradesTolerance
    }

    if (rowId === 'lateAssignmentsTolerance') {
      nextSettings.academic.lateAssignmentsTolerance = maxValue || nextSettings.academic.lateAssignmentsTolerance
    }
  }

  if (sectionId === 'attendance' && rowId === 'maxUnjustifiedAbsencesPercent') {
    nextSettings.attendance.maxUnjustifiedAbsencesPercent =
      maxValue || nextSettings.attendance.maxUnjustifiedAbsencesPercent
  }

  if (sectionId === 'financial' && rowId === 'maxArrearsMonths') {
    nextSettings.financial.maxArrearsMonths = maxValue || nextSettings.financial.maxArrearsMonths
  }

  return nextSettings
}

function buildRiskBreakdown(student: Student, settings: EngineSettings) {
  const negativeTolerance = Math.max(1, settings.academic.negativeGradesTolerance)
  const lateTolerance = Math.max(1, settings.academic.lateAssignmentsTolerance)
  const attendanceTolerance = Math.max(5, settings.attendance.maxUnjustifiedAbsencesPercent)
  const arrearsTolerance = Math.max(1, settings.financial.maxArrearsMonths)

  const academic =
    scale(student.indicators.academic.ucFailures, 0, negativeTolerance + lateTolerance + 1) * 0.32 +
    scale(student.indicators.academic.negativeGrades, 0, negativeTolerance + 2) * 0.43 +
    inverseScale(student.indicators.academic.gpa, 9, 15) * 0.25

  const attendance = scale(100 - student.indicators.academic.attendancePercent, 0, attendanceTolerance + 18)

  const financial =
    scale(student.indicators.financial.tuitionArrearsMonths, 0, arrearsTolerance + 2) * 0.76 +
    scale(student.indicators.financial.monthlyFee, 65, 1250) * 0.24

  const moodle =
    scale(student.indicators.behavioral.daysSinceLastAccess, 0, 21) * 0.52 +
    inverseScale(student.indicators.behavioral.moodleLoginsLast30Days, 5, 24) * 0.28 +
    inverseScale(student.indicators.behavioral.materialsDownloaded, 2, 20) * 0.2

  const context =
    getEntryProfileRisk(student) * 0.42 +
    getResidenceRisk(student) * 0.32 +
    (student.indicators.socioeconomic.nee ? 76 : 28) * 0.26

  return {
    academic: Math.round(clamp(academic)),
    attendance: Math.round(clamp(attendance)),
    financial: Math.round(clamp(financial)),
    moodle: Math.round(clamp(moodle)),
    context: Math.round(clamp(context)),
  }
}

function buildProfileBoost(student: Student, settings: EngineSettings, baseScore: number) {
  let boost = 0

  if (student.year === 1) {
    const multiplier = settings.profileMultipliers.firstYear
    const factor = clamp(
      ((student.indicators.academic.ucFailures +
        student.indicators.academic.negativeGrades +
        (100 - student.indicators.academic.attendancePercent) / 15) /
        Math.max(multiplier.maxValue, 1)) *
        40,
      35,
      100
    )
    boost += baseScore * (multiplier.severity / 100) * (factor / 100)
  }

  if (student.indicators.financial.scholarshipStatus !== 'Nao Bolseiro') {
    const multiplier = settings.profileMultipliers.scholarship
    const factor = clamp(
      ((student.indicators.financial.tuitionArrearsMonths + 1) / Math.max(multiplier.maxValue, 1)) * 55,
      28,
      100
    )
    boost += baseScore * (multiplier.severity / 100) * (factor / 100)
  }

  if (
    student.indicators.socioeconomic.entryProfile === 'Internacional' ||
    student.indicators.socioeconomic.residence === 'Internacional'
  ) {
    const multiplier = settings.profileMultipliers.international
    const factor = clamp(
      ((student.indicators.behavioral.daysSinceLastAccess / 6 + 1) / Math.max(multiplier.maxValue, 1)) * 52,
      35,
      100
    )
    boost += baseScore * (multiplier.severity / 100) * (factor / 100)
  }

  return boost
}

function buildTriggerReasons(student: Student, settings: EngineSettings, breakdown: ProcessedStudent['riskBreakdown']) {
  const triggers: Trigger[] = []
  const negativeTolerance = Math.max(1, settings.academic.negativeGradesTolerance)
  const attendanceTolerance = Math.max(5, settings.attendance.maxUnjustifiedAbsencesPercent)
  const arrearsTolerance = Math.max(1, settings.financial.maxArrearsMonths)

  if (student.indicators.academic.negativeGrades > negativeTolerance) {
    triggers.push({
      label: `${student.indicators.academic.negativeGrades} avaliações negativas acima do limiar`,
      sensitive: false,
      weight: 96,
    })
  }

  if (student.indicators.academic.ucFailures > settings.academic.lateAssignmentsTolerance) {
    triggers.push({
      label: `${student.indicators.academic.ucFailures} UCs com desempenho crítico`,
      sensitive: false,
      weight: 90,
    })
  }

  if (100 - student.indicators.academic.attendancePercent > attendanceTolerance) {
    triggers.push({
      label: 'Assiduidade abaixo do limiar de segurança',
      sensitive: false,
      weight: 88,
    })
  }

  if (student.indicators.behavioral.daysSinceLastAccess >= 10 || breakdown.moodle >= 72) {
    triggers.push({
      label: 'Ausência prolongada no Moodle',
      sensitive: false,
      weight: 82,
    })
  }

  if (student.indicators.financial.tuitionArrearsMonths > arrearsTolerance) {
    triggers.push({
      label: `Propinas em atraso (${student.indicators.financial.tuitionArrearsMonths} meses)`,
      sensitive: true,
      weight: 94,
    })
  }

  if (student.indicators.socioeconomic.nee) {
    triggers.push({
      label: 'Necessita de acompanhamento socioeducativo',
      sensitive: true,
      weight: 70,
    })
  }

  if (student.year === 1) {
    triggers.push({
      label: 'Perfil 1.º ano com agravamento',
      sensitive: false,
      weight: 68,
    })
  }

  if (
    student.indicators.socioeconomic.entryProfile === 'Internacional' ||
    student.indicators.socioeconomic.residence === 'Internacional'
  ) {
    triggers.push({
      label: 'Perfil internacional com necessidade de reforço de acompanhamento',
      sensitive: true,
      weight: 62,
    })
  }

  if (triggers.length === 0) {
    triggers.push({
      label: 'Sem sinais críticos ativos neste ciclo',
      sensitive: false,
      weight: 10,
    })
  }

  triggers.sort((left, right) => right.weight - left.weight)
  return triggers
}

function buildRecommendedAction(
  riskLevel: RiskLevel,
  visibleTriggers: string[],
  canViewSensitive: boolean
) {
  const triggerLead = visibleTriggers[0] ?? 'monitorização de rotina'

  if (riskLevel === 'high') {
    return {
      priority: 'high' as const,
      title: canViewSensitive ? 'Triagem prioritária em 24h' : 'Contacto imediato e escalonamento',
      description: canViewSensitive
        ? `Abrir triagem SAS, validar ${triggerLead.toLowerCase()} e agendar contacto com o estudante nas próximas 24 horas.`
        : `Contactar o estudante, confirmar o enquadramento académico e Moodle e encaminhar o alerta para SAS para avaliação complementar.`,
    }
  }

  if (riskLevel === 'medium') {
    return {
      priority: 'medium' as const,
      title: 'Intervenção preventiva guiada',
      description: canViewSensitive
        ? `Registar contacto preventivo, acompanhar ${triggerLead.toLowerCase()} e rever evolução no próximo ciclo semanal.`
        : `Agendar follow-up com o estudante e reforçar o acompanhamento do curso durante os próximos 7 dias.`,
    }
  }

  if (riskLevel === 'low') {
    return {
      priority: 'low' as const,
      title: 'Monitorização leve',
      description: 'Manter observação do caso e validar se os sinais estabilizam no próximo ciclo de análise.',
    }
  }

  return {
    priority: 'low' as const,
    title: 'Sem ação imediata',
    description: 'O estudante encontra-se dentro dos limiares atuais. Manter monitorização regular.',
  }
}

function finalizeCountBuckets(buckets: number[]) {
  const total = buckets.reduce((sum, value) => sum + value, 0)
  const delta = MODELED_STUDENT_POPULATION - total

  if (delta !== 0) {
    const highestIndex = buckets.indexOf(Math.max(...buckets))
    buckets[highestIndex] += delta
  }

  return buckets
}

export function buildDerivedAppData(rawStudents: Student[], settings: EngineSettings): DerivedAppData {
  const processedStudents = rawStudents.map((student, index) => {
    const riskBreakdown = buildRiskBreakdown(student, settings)

    const baseScore =
      riskBreakdown.academic * 0.31 +
      riskBreakdown.attendance * 0.19 +
      riskBreakdown.financial * 0.18 +
      riskBreakdown.moodle * 0.18 +
      riskBreakdown.context * 0.14

    const boost = buildProfileBoost(student, settings, baseScore)
    const workflowAdjustment =
      student.workflowStatus === 'Finalizado' ? -7 : student.workflowStatus === 'Em progresso' ? -2.5 : 0
    const interventionAdjustment = clamp(student.interventions.length * 2.4, 0, 8)
    const anchoredScore = clamp(baseScore * 0.72 + student.riskScore * 0.28 + boost + workflowAdjustment - interventionAdjustment)
    const derivedRiskScore = Math.round(anchoredScore)
    const derivedRiskLevel = scoreToLevel(derivedRiskScore, settings.riskThresholds)
    const triggers = buildTriggerReasons(student, settings, riskBreakdown)
    const publicTriggerReasons = triggers.filter((trigger) => !trigger.sensitive).map((trigger) => trigger.label)
    const annualRevenue = student.indicators.financial.monthlyFee * 12
    const revenueAtRisk = annualRevenue * (derivedRiskScore / 100)
    const recoveryRate =
      derivedRiskLevel === 'high' ? 0.34 : derivedRiskLevel === 'medium' ? 0.46 : derivedRiskLevel === 'low' ? 0.58 : 0.72
    const recoverableRevenue = revenueAtRisk * recoveryRate
    const alertTimestamp = buildAlertTimestamp(student, index)

    return {
      ...student,
      derivedRiskScore,
      derivedRiskLevel,
      riskBreakdown,
      triggerReasons: triggers.map((trigger) => trigger.label),
      publicTriggerReasons,
      triggerReasonsFull: triggers,
      recommendedAction: buildRecommendedAction(derivedRiskLevel, publicTriggerReasons, true),
      lastUpdatedLabel: formatDateLabel(student.lastUpdated),
      alertTimestamp,
      alertTimestampLabel: formatTimestampLabel(alertTimestamp),
      annualRevenue,
      revenueAtRisk,
      recoverableRevenue,
    }
  })

  const sortedAlerts = processedStudents
    .filter((student) => student.derivedRiskLevel === 'high' || student.derivedRiskLevel === 'medium')
    .sort((left, right) => {
      if (right.alertTimestamp !== left.alertTimestamp) {
        return right.alertTimestamp.localeCompare(left.alertTimestamp)
      }

      return right.derivedRiskScore - left.derivedRiskScore
    })

  const alerts: DerivedAlert[] = sortedAlerts.map((student) => ({
    id: `alert-${student.id}`,
    studentId: student.id,
    studentName: student.name,
    course: student.course,
    level: student.derivedRiskLevel,
    riskScore: student.derivedRiskScore,
    reason: student.triggerReasons[0] ?? 'Sinal de risco detetado',
    timestamp: student.alertTimestamp,
    timestampLabel: student.alertTimestampLabel,
  }))

  const countsByLevel = processedStudents.reduce(
    (accumulator, student) => {
      accumulator[student.derivedRiskLevel] += 1
      return accumulator
    },
    { none: 0, low: 0, medium: 0, high: 0 }
  )

  const ratios = {
    none: countsByLevel.none / processedStudents.length,
    low: countsByLevel.low / processedStudents.length,
    medium: countsByLevel.medium / processedStudents.length,
    high: countsByLevel.high / processedStudents.length,
  }

  const scaledBuckets = finalizeCountBuckets([
    Math.round(ratios.none * MODELED_STUDENT_POPULATION),
    Math.round(ratios.low * MODELED_STUDENT_POPULATION),
    Math.round(ratios.medium * MODELED_STUDENT_POPULATION),
    Math.round(ratios.high * MODELED_STUDENT_POPULATION),
  ])

  const dashboardRiskDistribution: RiskDistributionEntry[] = [
    {
      key: 'none',
      label: 'Sem Risco',
      value: ratios.none * 100,
      countLabel: `${scaledBuckets[0]} alunos`,
      percentLabel: formatPercentage((scaledBuckets[0] / MODELED_STUDENT_POPULATION) * 100),
      color: '#2a9f4b',
      legendBg: 'bg-[#e8f6eb]',
      legendText: 'text-[#2f7f43]',
    },
    {
      key: 'low',
      label: 'Risco Baixo',
      value: ratios.low * 100,
      countLabel: `${scaledBuckets[1]} alunos`,
      percentLabel: formatPercentage((scaledBuckets[1] / MODELED_STUDENT_POPULATION) * 100),
      color: '#c1633d',
      legendBg: 'bg-[#f7ede2]',
      legendText: 'text-[#8a5c39]',
    },
    {
      key: 'medium',
      label: 'Risco Médio',
      value: ratios.medium * 100,
      countLabel: `${scaledBuckets[2]} alunos`,
      percentLabel: formatPercentage((scaledBuckets[2] / MODELED_STUDENT_POPULATION) * 100),
      color: '#e7a92a',
      legendBg: 'bg-[#fbf1d4]',
      legendText: 'text-[#8f6d21]',
    },
    {
      key: 'high',
      label: 'Risco Alto',
      value: ratios.high * 100,
      countLabel: `${scaledBuckets[3]} alunos`,
      percentLabel: formatPercentage((scaledBuckets[3] / MODELED_STUDENT_POPULATION) * 100),
      color: '#e72a2a',
      legendBg: 'bg-[#fde7e5]',
      legendText: 'text-[#a34945]',
    },
  ]

  const interventionsThisMonth = Math.round(
    clamp((processedStudents.reduce((sum, student) => sum + student.interventions.length, 0) / processedStudents.length) * 34, 24, 95)
  )

  const dashboardMetrics: DashboardMetrics = {
    monitoredStudents: MODELED_STUDENT_POPULATION,
    highRiskStudents: scaledBuckets[3],
    mediumRiskStudents: scaledBuckets[2],
    interventionsThisMonth,
  }

  const roiCategories = [
    {
      name: 'CTeSP',
      match: (student: ProcessedStudent) =>
        student.degree === 'CTeSP' || student.indicators.socioeconomic.entryProfile === 'CTeSP',
    },
    {
      name: 'Licenciatura',
      match: (student: ProcessedStudent) => student.degree === 'LIC.',
    },
    {
      name: 'Mestrado',
      match: (student: ProcessedStudent) => student.degree === 'MEST.' || student.degree === 'DOUT.',
    },
    {
      name: 'Internacional',
      match: (student: ProcessedStudent) =>
        student.indicators.socioeconomic.entryProfile === 'Internacional' ||
        student.indicators.socioeconomic.residence === 'Internacional',
    },
  ]

  const roiChartData = roiCategories.map((category) => {
    const matches = processedStudents.filter(category.match)
    const risk = matches.reduce((sum, student) => sum + student.revenueAtRisk, 0)
    const preserved = matches.reduce((sum, student) => sum + student.recoverableRevenue, 0)

    return {
      name: category.name,
      risk: Math.round(risk),
      preserved: Math.round(preserved),
    }
  })

  const totalRevenueAtRisk = processedStudents.reduce((sum, student) => sum + student.revenueAtRisk, 0)
  const totalRecoverableEstimate = processedStudents.reduce((sum, student) => sum + student.recoverableRevenue, 0)
  const softwareCost = 15000

  const highRatio = ratios.high
  const mediumRatio = ratios.medium
  const lowRatio = ratios.low
  const historicalRetention = Math.round(clamp(92 - highRatio * 38 - mediumRatio * 24 - lowRatio * 8, 61, 92))
  const optimizedRetention = Math.round(
    clamp(
      historicalRetention +
        9 +
        settings.profileMultipliers.firstYear.severity * 0.08 +
        settings.financial.maxArrearsMonths * 1.2 +
        settings.academic.negativeGradesTolerance * 0.8,
      historicalRetention + 4,
      96
    )
  )

  const historicalLoss = 100 - historicalRetention
  const optimizedLoss = 100 - optimizedRetention
  const historicalCurveShape = [0, 0.07, 0.16, 0.28, 0.41, 0.54, 0.68, 0.81, 0.93, 1]
  const optimizedCurveShape = [0, 0.05, 0.11, 0.19, 0.29, 0.39, 0.5, 0.63, 0.8, 1]

  const retentionChartData = MONTH_LABELS.map((month, index) => ({
    month,
    historical: Math.round(clamp(100 - historicalLoss * historicalCurveShape[index], 0, 100)),
    optimized: Math.round(clamp(100 - optimizedLoss * optimizedCurveShape[index], 0, 100)),
  }))

  const courses = Array.from(new Set(processedStudents.map((student) => student.course))).sort((left, right) =>
    left.localeCompare(right, 'pt-PT')
  )

  const mixes = courses.reduce<Record<string, { none: number; low: number; medium: number; high: number }>>((accumulator, course) => {
    const courseStudents = processedStudents.filter((student) => student.course === course)
    accumulator[course] = courseStudents.reduce(
      (sum, student) => {
        sum[student.derivedRiskLevel] += 1
        return sum
      },
      { none: 0, low: 0, medium: 0, high: 0 }
    )
    return accumulator
  }, {})

  return {
    students: processedStudents,
    alerts,
    dashboardMetrics,
    dashboardRiskDistribution,
    analysis: {
      roi: {
        revenueAtRisk: Math.round(totalRevenueAtRisk),
        recoverableEstimate: Math.round(totalRecoverableEstimate),
        multiplier: Number((totalRecoverableEstimate / softwareCost).toFixed(1)),
        parameterRows: [
          {
            type: '1.º Ano',
            maxDelay: `${settings.profileMultipliers.firstYear.maxValue}`,
            severity: `${settings.profileMultipliers.firstYear.severity}%`,
          },
          {
            type: 'Bolseiro',
            maxDelay: `${settings.profileMultipliers.scholarship.maxValue}`,
            severity: `${settings.profileMultipliers.scholarship.severity}%`,
          },
          {
            type: 'Internacional',
            maxDelay: `${settings.profileMultipliers.international.maxValue}`,
            severity: `${settings.profileMultipliers.international.severity}%`,
          },
        ],
        chartData: roiChartData,
      },
      retention: {
        withoutIntervention: historicalRetention,
        optimized: optimizedRetention,
        chartData: retentionChartData,
      },
      course: {
        courses,
        mixes,
      },
    },
    courses,
    tablePopulation: TABLE_POPULATION,
    modeledPopulation: MODELED_STUDENT_POPULATION,
  }
}

export function getVisibleTriggerReasons(student: ProcessedStudent, profileId: ProfileId) {
  if (canViewSensitiveData(profileId)) {
    return student.triggerReasons
  }

  if (student.publicTriggerReasons.length > 0) {
    return student.publicTriggerReasons
  }

  return student.triggerReasonsFull.some((trigger) => trigger.sensitive) ? [CONFIDENTIAL_REASON_LABEL] : student.publicTriggerReasons
}

export function getVisiblePrimaryReason(student: ProcessedStudent, profileId: ProfileId) {
  const reasons = getVisibleTriggerReasons(student, profileId)
  return reasons[0] ?? 'Sinal de risco em observação'
}

export function getRecommendedActionForProfile(student: ProcessedStudent, profileId: ProfileId) {
  const visibleReasons = getVisibleTriggerReasons(student, profileId)
  return buildRecommendedAction(student.derivedRiskLevel, visibleReasons, canViewSensitiveData(profileId))
}

export function getSettingsSections(settings: EngineSettings) {
  return buildSettingsSections(settings)
}

export function getRiskLevelOrder(level: RiskLevel) {
  if (level === 'high') return 3
  if (level === 'medium') return 2
  if (level === 'low') return 1
  return 0
}

export function formatAnnualCurrency(value: number) {
  return toCurrency(value)
}
