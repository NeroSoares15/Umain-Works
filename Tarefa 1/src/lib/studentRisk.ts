import type { Alert } from '../data/alerts'
import type { Intervention, Student } from '../data/students'
import type { AppSettings } from './appSettings'
import {
  canViewFinancialDetails,
  canViewNamedStudents,
  canViewSocioeconomicDetails,
  type ProfileId,
} from './accessControl'
import { scoreToLevel, type RiskLevel } from './riskUtils'

type RiskFactorKey = 'attendance' | 'academic' | 'engagement' | 'financial' | 'context'

interface RiskFactor {
  key: RiskFactorKey
  label: string
  value: number
  restricted: boolean
}

export interface StudentRiskSnapshot {
  score: number
  level: RiskLevel
  factors: RiskFactor[]
}

const SENSITIVE_TEXT_MARKERS = ['propina', 'financeir', 'apoio', 'psico', 'socio', 'nee', 'bolsa']
const SENSITIVE_STATUS_MARKERS = ['propina', 'bolseir', 'nee', 'internacional']

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function roundFactor(value: number) {
  return Number(value.toFixed(1))
}

function isSensitiveText(value: string) {
  const normalized = value.toLowerCase()
  return SENSITIVE_TEXT_MARKERS.some((marker) => normalized.includes(marker))
}

function isSensitiveStatus(value: string) {
  const normalized = value.toLowerCase()
  return SENSITIVE_STATUS_MARKERS.some((marker) => normalized.includes(marker))
}

function getRiskFactors(student: Student, settings: AppSettings): RiskFactor[] {
  const { academic, behavioral, financial, socioeconomic } = student.indicators
  const attendanceGap = Math.max(
    0,
    (100 - academic.attendancePercent) - settings.riskSignals.attendanceTolerancePercent,
  )
  const academicGap = Math.max(
    0,
    academic.negativeGrades - settings.riskSignals.toleratedNegativeGrades,
  )
  const engagementGap = Math.max(
    0,
    behavioral.daysSinceLastAccess - settings.riskSignals.maxDaysSinceLastAccess,
  )
  const financialGap = Math.max(
    0,
    financial.tuitionArrearsMonths - settings.riskSignals.toleratedTuitionArrearsMonths,
  )

  return [
    {
      key: 'attendance',
      label: 'Assiduidade crítica',
      value: roundFactor(attendanceGap * 1.4),
      restricted: false,
    },
    {
      key: 'academic',
      label: 'Baixo desempenho',
      value: roundFactor(
        academicGap * 4 +
          academic.ucFailures * 1.8 +
          Math.max(0, 12 - academic.gpa) * 1.1,
      ),
      restricted: false,
    },
    {
      key: 'engagement',
      label: 'Desengajamento digital',
      value: roundFactor(
        engagementGap * 2 +
          Math.max(0, 10 - behavioral.moodleLoginsLast30Days) * 0.9 +
          Math.max(0, 8 - behavioral.materialsDownloaded) * 0.7,
      ),
      restricted: false,
    },
    {
      key: 'financial',
      label: 'Tensão financeira',
      value: roundFactor(
        financialGap * 5 +
          (financial.paymentAgreement ? 3 : 0) +
          (financial.scholarshipStatus === 'Candidato' ? 2 : 0),
      ),
      restricted: true,
    },
    {
      key: 'context',
      label: 'Vulnerabilidade contextual',
      value: roundFactor(
        (socioeconomic.residence === 'Deslocado' ? 3 : 0) +
          (socioeconomic.residence === 'Internacional' ? 4 : 0) +
          (socioeconomic.entryProfile === 'Internacional' ? 3 : 0) +
          (socioeconomic.entryProfile === 'Trabalhador-Estudante' ? 2 : 0) +
          (socioeconomic.entryProfile === 'Maior 23' ? 1 : 0) +
          (socioeconomic.nee ? 4 : 0),
      ),
      restricted: true,
    },
  ]
}

export function getStudentRiskSnapshot(
  student: Student,
  settings: AppSettings,
): StudentRiskSnapshot {
  const factors = getRiskFactors(student, settings)
  let score = student.riskScore + factors.reduce((total, factor) => total + factor.value, 0)

  if (student.year === 1) {
    score *= settings.profileMultipliers.firstYear
  }

  if (student.indicators.financial.scholarshipStatus !== 'Não Bolseiro') {
    score *= settings.profileMultipliers.scholarship
  }

  if (
    student.indicators.socioeconomic.entryProfile === 'Internacional' ||
    student.indicators.socioeconomic.residence === 'Internacional' ||
    student.statuses.some((status) => status.toLowerCase().includes('internacional'))
  ) {
    score *= settings.profileMultipliers.international
  }

  const normalizedScore = clampScore(score)

  return {
    score: normalizedScore,
    level: scoreToLevel(normalizedScore, settings.riskThresholds),
    factors,
  }
}

export function getStudentDisplayName(student: Student, profileId: ProfileId, rowIndex = 0) {
  if (canViewNamedStudents(profileId)) {
    return student.name
  }

  return `Estudante anonimizado ${String(rowIndex + 1).padStart(2, '0')}`
}

export function getStudentDisplayNumber(student: Student, profileId: ProfileId) {
  return canViewNamedStudents(profileId) ? student.number : 'Oculto'
}

export function getStudentDisplayCourse(student: Student, profileId: ProfileId) {
  return canViewNamedStudents(profileId) ? student.course : 'Curso protegido'
}

export function getVisibleStatuses(student: Student, profileId: ProfileId) {
  if (canViewSocioeconomicDetails(profileId)) {
    return student.statuses
  }

  const visibleStatuses = student.statuses.filter((status) => !isSensitiveStatus(status))
  return visibleStatuses.length > 0 && profileId !== 'diretor' ? visibleStatuses : ['Perfil reservado']
}

export function getPrimaryRiskCause(
  student: Student,
  settings: AppSettings,
  profileId: ProfileId,
) {
  const { factors } = getStudentRiskSnapshot(student, settings)
  const visibleFactors = factors.filter(
    (factor) =>
      !factor.restricted ||
      (factor.key === 'financial' && canViewFinancialDetails(profileId)) ||
      (factor.key === 'context' && canViewSocioeconomicDetails(profileId)),
  )

  const topFactor = visibleFactors.sort((left, right) => right.value - left.value)[0]
  return topFactor?.value ? topFactor.label : 'Sinais combinados'
}

export function getVisibleLastIntervention(student: Student, profileId: ProfileId) {
  if (student.interventions.length === 0) {
    return 'Sem intervenções'
  }

  if (!canViewNamedStudents(profileId)) {
    return 'Intervenção ativa'
  }

  return student.interventions[student.interventions.length - 1].type
}

export function getVisibleInterventionAuthor(intervention: Intervention, profileId: ProfileId) {
  if (profileId === 'sas') {
    return intervention.author
  }

  if (profileId === 'diretor') {
    return 'Equipa responsável'
  }

  return 'Equipa institucional'
}

export function getVisibleInterventionDescription(
  intervention: Intervention,
  profileId: ProfileId,
) {
  if (profileId === 'sas') {
    return intervention.description
  }

  if (isSensitiveText(intervention.description)) {
    return 'Detalhes sensíveis reservados para validação SAS.'
  }

  return intervention.description
}

export function getAlertDisplayTitle(
  alert: Alert,
  students: Student[],
  profileId: ProfileId,
  index: number,
) {
  if (!canViewNamedStudents(profileId)) {
    return `Perfil agregado ${String(index + 1).padStart(2, '0')}`
  }

  const student = students.find((candidate) => candidate.id === alert.studentId)
  return student?.name ?? alert.studentName
}

export function getAlertDisplayReason(alert: Alert, profileId: ProfileId) {
  if (profileId === 'sas') {
    return alert.reason
  }

  if (profileId === 'diretor') {
    return isSensitiveText(alert.reason)
      ? 'Conjunto de sinais críticos exige articulação com os SAS.'
      : alert.reason
  }

  return alert.level === 'high'
    ? 'Perfil agregado com sinais críticos e intervenção prioritária.'
    : 'Perfil agregado com sinais moderados em monitorização.'
}

export function getAlertDisplayCourse(alert: Alert, students: Student[], profileId: ProfileId) {
  if (!canViewNamedStudents(profileId)) {
    return 'Área protegida'
  }

  const student = students.find((candidate) => candidate.id === alert.studentId)
  return student?.course ?? alert.course
}

export function getRiskNarrative(
  student: Student,
  settings: AppSettings,
  profileId: ProfileId,
) {
  const snapshot = getStudentRiskSnapshot(student, settings)
  const { academic, behavioral, financial } = student.indicators

  if (profileId === 'sas') {
    return snapshot.level === 'high'
      ? `> CASO PRIORITÁRIO: score ${snapshot.score}. A assiduidade está em ${academic.attendancePercent}% e o último acesso ao Moodle ocorreu há ${behavioral.daysSinceLastAccess} dias. Existem ${financial.tuitionArrearsMonths} meses de propinas em atraso, pelo que se recomenda contacto imediato e plano articulado SAS.`
      : `> MONITORIZAÇÃO ESTÁVEL: score ${snapshot.score}. A evolução recente mantém-se dentro de parâmetros observáveis, com assiduidade de ${academic.attendancePercent}% e atividade Moodle em ${behavioral.moodleLoginsLast30Days} acessos nos últimos 30 dias.`
  }

  return snapshot.level === 'high'
    ? `> SINAL PRIORITÁRIO: score ${snapshot.score}. A assiduidade está em ${academic.attendancePercent}% e o histórico mostra ${behavioral.daysSinceLastAccess} dias sem atividade na plataforma. Recomenda-se articulação com os SAS para validar fatores sensíveis antes da próxima intervenção.`
    : `> MONITORIZAÇÃO ATIVA: score ${snapshot.score}. Os indicadores académicos e de engagement permanecem dentro dos limites operacionais, com assiduidade de ${academic.attendancePercent}% e atividade Moodle recente.`
}

export function getRadarData(student: Student, profileId: ProfileId) {
  const { academic, behavioral, financial, socioeconomic } = student.indicators

  if (profileId === 'sas') {
    return [
      { subject: 'Académico', value: Math.min(100, (100 - academic.attendancePercent) + academic.ucFailures * 10) },
      { subject: 'Financeiro', value: Math.min(100, financial.tuitionArrearsMonths * 20 + (financial.scholarshipStatus === 'Não Bolseiro' ? 10 : 0)) },
      { subject: 'Moodle', value: Math.min(100, Math.max(0, 100 - behavioral.moodleLoginsLast30Days * 3)) },
      { subject: 'Social', value: socioeconomic.residence === 'Deslocado' ? 40 : socioeconomic.residence === 'Internacional' ? 50 : 10 },
      { subject: 'Entrada', value: socioeconomic.entryProfile === 'Geral' ? 10 : socioeconomic.entryProfile === 'Internacional' ? 60 : 40 },
    ]
  }

  return [
    {
      subject: 'Assiduidade',
      value: Math.min(100, Math.max(0, 100 - academic.attendancePercent)),
    },
    {
      subject: 'Académico',
      value: Math.min(100, academic.negativeGrades * 12 + academic.ucFailures * 10),
    },
    {
      subject: 'Moodle',
      value: Math.min(100, behavioral.daysSinceLastAccess * 6 + Math.max(0, 10 - behavioral.moodleLoginsLast30Days) * 3),
    },
  ]
}
