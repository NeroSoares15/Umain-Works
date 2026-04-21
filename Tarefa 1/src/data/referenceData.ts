export interface RiskDistributionEntry {
  key: 'none' | 'low' | 'medium' | 'high'
  label: string
  value: number
  countLabel: string
  percentLabel: string
  color: string
  legendBg: string
  legendText: string
}

export interface SettingsSectionRow {
  id: string
  label: string
  maxValue: string
  severity?: string
  maxPlaceholder?: string
  severityPlaceholder?: string
}

export interface SettingsSection {
  id: string
  title: string
  description: string
  columns: string[]
  rows: SettingsSectionRow[]
}

export const dashboardMetrics = {
  monitoredStudents: 215,
  highRiskStudents: 56,
  mediumRiskStudents: 65,
  interventionsThisMonth: 80,
}

export const dashboardRiskDistribution: RiskDistributionEntry[] = [
  {
    key: 'none',
    label: 'Sem Risco',
    value: 19,
    countLabel: '20 alunos',
    percentLabel: '41%',
    color: '#2f9d49',
    legendBg: 'bg-[#e8f6eb]',
    legendText: 'text-[#2f7f43]',
  },
  {
    key: 'low',
    label: 'Risco Baixo',
    value: 23,
    countLabel: '12 alunos',
    percentLabel: '23%',
    color: '#bf623b',
    legendBg: 'bg-[#f7ede2]',
    legendText: 'text-[#8a5c39]',
  },
  {
    key: 'medium',
    label: 'Risco Médio',
    value: 17,
    countLabel: '44 alunos',
    percentLabel: '17%',
    color: '#d8a127',
    legendBg: 'bg-[#fbf1d4]',
    legendText: 'text-[#8f6d21]',
  },
  {
    key: 'high',
    label: 'Risco Alto',
    value: 41,
    countLabel: '56 alunos',
    percentLabel: '19%',
    color: '#e02b2b',
    legendBg: 'bg-[#fde7e5]',
    legendText: 'text-[#a34945]',
  },
]

export const dashboardTopRiskStudents = [
  {
    id: '4',
    name: 'Pedro Santos',
    reason: 'Ausência prolongada Moodle + 4 UCs negativas + propinas em atraso (4 meses)',
  },
  {
    id: '1',
    name: 'Mariana Costa',
    reason: 'Ausência prolongada Moodle + 4 UCs negativas + propinas em atraso (4 meses)',
  },
  {
    id: '2',
    name: 'João Rodrigues',
    reason: 'Ausência prolongada Moodle + 4 UCs negativas + propinas em atraso (4 meses)',
  },
]

export const roiParameterRows = [
  { type: 'CTeSP', maxDelay: '4', severity: '20%' },
  { type: 'Licenciatura', maxDelay: '2', severity: '15%' },
  { type: 'Mestrado', maxDelay: '1', severity: '10%' },
  { type: 'Internacional', maxDelay: '2.500.000', severity: '10%' },
]

export const roiChartData = [
  { name: 'CTeSP', recovered: 72, risk: 112 },
  { name: 'Licenciatura', recovered: 72, risk: 112 },
  { name: 'Mestrado', recovered: 72, risk: 112 },
  { name: 'Internacional', recovered: 72, risk: 112 },
]

export const retentionData = [
  { month: 'Set', historical: 100, optimized: 100, historicalLabel: '', optimizedLabel: '' },
  { month: 'Out', historical: 96, optimized: 92, historicalLabel: '', optimizedLabel: '' },
  { month: 'Nov', historical: 88, optimized: 80, historicalLabel: '', optimizedLabel: '' },
  { month: 'Dez', historical: 78, optimized: 58, historicalLabel: '', optimizedLabel: '' },
  { month: 'Jan', historical: 70, optimized: 36, historicalLabel: '', optimizedLabel: '' },
  { month: 'Fev', historical: 62, optimized: 31, historicalLabel: '', optimizedLabel: '' },
  { month: 'Mar', historical: 54, optimized: 18, historicalLabel: '', optimizedLabel: '' },
  { month: 'Abr', historical: 40, optimized: 8, historicalLabel: '', optimizedLabel: '' },
  { month: 'Mai', historical: 26, optimized: 0, historicalLabel: '115.3', optimizedLabel: '123.2' },
  { month: 'Jun', historical: 18, optimized: 0, historicalLabel: '', optimizedLabel: '' },
]

export const courseSelectionRows = [
  'Engenharia Informática',
  'Enfermagem',
  'Gestão de Empresas',
  'Design de Comunicação',
  'Contabilidade',
  'Psicologia',
  'Medicina',
  'Arquitetura',
  'Direito',
]

export const courseHeatmapMix: Record<string, { high: number; medium: number; low: number; none: number }> = {
  'Engenharia Informática': { high: 56, medium: 22, low: 17, none: 9 },
  Enfermagem: { high: 28, medium: 18, low: 14, none: 7 },
  'Gestão de Empresas': { high: 48, medium: 26, low: 34, none: 14 },
  'Design de Comunicação': { high: 17, medium: 12, low: 18, none: 8 },
  Contabilidade: { high: 12, medium: 9, low: 15, none: 11 },
  Psicologia: { high: 21, medium: 19, low: 14, none: 10 },
  Medicina: { high: 33, medium: 16, low: 18, none: 6 },
  Arquitetura: { high: 18, medium: 17, low: 11, none: 5 },
  Direito: { high: 27, medium: 14, low: 16, none: 9 },
}

export const settingsSections: SettingsSection[] = [
  {
    id: 'risk-multipliers',
    title: 'Multiplicadores de Risco',
    description:
      'Define os perfis de estudante com maior vulnerabilidade ao abandono e o peso agravado que cada um representa no cálculo global de risco.',
    columns: ['Tipo de Estudante', 'Max. Meses em Atraso', 'Gravidade', 'Ações'],
    rows: [
      { id: 'first-year', label: 'Estudante 1 Ano', maxValue: '4', severity: '20%', maxPlaceholder: 'Number', severityPlaceholder: 'Percentage' },
      { id: 'scholarship', label: 'Estudante Bolseiro', maxValue: '2', severity: '15%', maxPlaceholder: 'Number', severityPlaceholder: 'Percentage' },
      { id: 'international', label: 'Estudante Internacional', maxValue: '1', severity: '10%', maxPlaceholder: 'Number', severityPlaceholder: 'Percentage' },
    ],
  },
  {
    id: 'academic-performance',
    title: 'Desempenho Académico',
    description:
      'Estabelece os limiares máximos de tolerância para resultados negativos e trabalhos em atraso antes de o estudante ser sinalizado em risco.',
    columns: ['Tipo', 'Max. Tolerado', 'Ações'],
    rows: [
      { id: 'negative-grades', label: 'Nº Negativas Toleradas', maxValue: '2', maxPlaceholder: 'Number' },
      { id: 'late-assignments', label: 'Trabalhos em Atraso Tolerados', maxValue: '1', maxPlaceholder: 'Number' },
    ],
  },
  {
    id: 'attendance',
    title: 'Assiduidade',
    description:
      'Configura a percentagem máxima de faltas injustificadas permitidas antes de o sistema considerar o estudante em situação de risco de abandono.',
    columns: ['Tipo', 'Max. Tolerado', 'Ações'],
    rows: [
      { id: 'attendance-threshold', label: 'Nº de Faltas Injustificadas Toleradas', maxValue: '15%', maxPlaceholder: 'Number' },
    ],
  },
  {
    id: 'financial',
    title: 'Financeiro',
    description:
      'Define o número máximo de propinas em atraso toleradas antes de acionar alertas de risco financeiro para o estudante.',
    columns: ['Tipo', 'Max. Tolerado', 'Ações'],
    rows: [
      { id: 'arrears-threshold', label: 'Nº de Propinas em Atraso', maxValue: '2', maxPlaceholder: 'Number' },
    ],
  },
]

export const platformVersion = '0.2.0+25-12-1814:20+3044e80'
