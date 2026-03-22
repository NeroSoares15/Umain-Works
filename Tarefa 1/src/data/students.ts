export interface StudentIndicators {
  academic: {
    attendancePercent: number
    ucFailures: number
    negativeGrades: number
    gpa: number
  }
  financial: {
    monthlyFee: number
    tuitionArrearsMonths: number
    scholarshipStatus: 'Bolseiro' | 'Não Bolseiro' | 'Candidato'
    paymentAgreement: boolean
  }
  behavioral: {
    moodleLoginsLast30Days: number
    materialsDownloaded: number
    daysSinceLastAccess: number
  }
  socioeconomic: {
    entryProfile: 'Geral' | 'Internacional' | 'Trabalhador-Estudante' | 'Maior 23' | 'CTeSP'
    residence: 'Local' | 'Deslocado' | 'Internacional'
    nee: boolean
  }
}

export interface Intervention {
  date: string
  type: 'Reunião' | 'Email' | 'Encaminhamento SAS' | 'Tutoria' | 'Alerta Gerado'
  description: string
  author: string
}

export interface Student {
  id: string
  name: string
  number: string
  course: string
  year: number
  riskScore: number
  scoreTrend: 'up' | 'down' | 'stable'
  lastUpdated: string
  statuses: string[]
  indicators: StudentIndicators
  interventions: Intervention[]
}

export const students: Student[] = [
  {
    id: '1',
    name: 'Mariana Costa',
    number: '2022001',
    course: 'Engenharia Informática',
    year: 2,
    riskScore: 78,
    scoreTrend: 'up',
    lastUpdated: '2026-02-15',
    statuses: ['Trabalhador-Estudante', 'Propinas em Atraso'],
    indicators: {
      academic: { attendancePercent: 42, ucFailures: 3, negativeGrades: 4, gpa: 9.2 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 3, scholarshipStatus: 'Não Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 4, materialsDownloaded: 2, daysSinceLastAccess: 12 },
      socioeconomic: { entryProfile: 'Trabalhador-Estudante', residence: 'Deslocado', nee: false },
    },
    interventions: [
      { date: '2026-02-10', type: 'Alerta Gerado', description: 'Score ultrapassou limiar de risco alto (75)', author: 'Sistema' },
      { date: '2026-02-12', type: 'Email', description: 'Contacto inicial enviado pela Direção de Curso', author: 'Prof. António Ferreira' },
    ],
  },
  {
    id: '2',
    name: 'João Rodrigues',
    number: '2023045',
    course: 'Engenharia Informática',
    year: 1,
    riskScore: 65,
    scoreTrend: 'up',
    lastUpdated: '2026-02-15',
    statuses: ['1º Ano'],
    indicators: {
      academic: { attendancePercent: 55, ucFailures: 2, negativeGrades: 3, gpa: 10.5 },
      financial: { monthlyFee: 65, tuitionArrearsMonths: 2, scholarshipStatus: 'Candidato', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 8, materialsDownloaded: 5, daysSinceLastAccess: 6 },
      socioeconomic: { entryProfile: 'Geral', residence: 'Deslocado', nee: false },
    },
    interventions: [
      { date: '2026-02-15', type: 'Alerta Gerado', description: 'Faltas consecutivas e propinas em atraso', author: 'Sistema' },
    ],
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    number: '2021078',
    course: 'Gestão de Empresas',
    year: 3,
    riskScore: 52,
    scoreTrend: 'down',
    lastUpdated: '2026-02-15',
    statuses: ['Bolseira'],
    indicators: {
      academic: { attendancePercent: 68, ucFailures: 1, negativeGrades: 2, gpa: 12.3 },
      financial: { monthlyFee: 65, tuitionArrearsMonths: 0, scholarshipStatus: 'Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 15, materialsDownloaded: 12, daysSinceLastAccess: 2 },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [
      { date: '2026-01-20', type: 'Tutoria', description: 'Sessão de acompanhamento — dificuldades em Contabilidade Avançada', author: 'Prof. Marta Silva' },
      { date: '2026-02-01', type: 'Reunião', description: 'Follow-up positivo, aluna com plano de estudo definido', author: 'Prof. Marta Silva' },
    ],
  },
  {
    id: '4',
    name: 'Pedro Santos',
    number: '2022112',
    course: 'Engenharia Informática',
    year: 2,
    riskScore: 88,
    scoreTrend: 'up',
    lastUpdated: '2026-02-15',
    statuses: ['NEE', 'Propinas em Atraso'],
    indicators: {
      academic: { attendancePercent: 31, ucFailures: 4, negativeGrades: 5, gpa: 7.8 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 4, scholarshipStatus: 'Não Bolseiro', paymentAgreement: true },
      behavioral: { moodleLoginsLast30Days: 2, materialsDownloaded: 1, daysSinceLastAccess: 21 },
      socioeconomic: { entryProfile: 'Geral', residence: 'Deslocado', nee: true },
    },
    interventions: [
      { date: '2026-01-10', type: 'Encaminhamento SAS', description: 'Encaminhado para Gabinete de Apoio Psicopedagógico', author: 'Prof. António Ferreira' },
      { date: '2026-01-25', type: 'Reunião', description: 'Reunião com SAS — plano de acompanhamento definido', author: 'Técnica SAS' },
      { date: '2026-02-15', type: 'Alerta Gerado', description: 'Ausência prolongada Moodle + faltas críticas', author: 'Sistema' },
    ],
  },
  {
    id: '5',
    name: 'Sofia Martins',
    number: '2023089',
    course: 'Design de Comunicação',
    year: 1,
    riskScore: 44,
    scoreTrend: 'stable',
    lastUpdated: '2026-02-15',
    statuses: ['Internacional'],
    indicators: {
      academic: { attendancePercent: 72, ucFailures: 1, negativeGrades: 2, gpa: 11.8 },
      financial: { monthlyFee: 250, tuitionArrearsMonths: 1, scholarshipStatus: 'Não Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 20, materialsDownloaded: 18, daysSinceLastAccess: 1 },
      socioeconomic: { entryProfile: 'Internacional', residence: 'Internacional', nee: false },
    },
    interventions: [],
  },
  {
    id: '6',
    name: 'Rui Fernandes',
    number: '2021034',
    course: 'Contabilidade e Fiscalidade',
    year: 3,
    riskScore: 18,
    scoreTrend: 'down',
    lastUpdated: '2026-02-15',
    statuses: ['Bolseiro'],
    indicators: {
      academic: { attendancePercent: 91, ucFailures: 0, negativeGrades: 0, gpa: 15.2 },
      financial: { monthlyFee: 0, tuitionArrearsMonths: 0, scholarshipStatus: 'Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 28, materialsDownloaded: 35, daysSinceLastAccess: 1 },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [],
  },
  {
    id: '7',
    name: 'Inês Carvalho',
    number: '2022067',
    course: 'Enfermagem',
    year: 2,
    riskScore: 61,
    scoreTrend: 'up',
    lastUpdated: '2026-02-15',
    statuses: ['Trabalhador-Estudante'],
    indicators: {
      academic: { attendancePercent: 59, ucFailures: 2, negativeGrades: 3, gpa: 11.0 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 1, scholarshipStatus: 'Não Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 11, materialsDownloaded: 8, daysSinceLastAccess: 4 },
      socioeconomic: { entryProfile: 'Trabalhador-Estudante', residence: 'Local', nee: false },
    },
    interventions: [
      { date: '2026-02-14', type: 'Alerta Gerado', description: 'Faltas em estágio clínico acima do limiar', author: 'Sistema' },
    ],
  },
  {
    id: '8',
    name: 'Miguel Lopes',
    number: '2023011',
    course: 'Gestão de Empresas',
    year: 1,
    riskScore: 35,
    scoreTrend: 'down',
    lastUpdated: '2026-02-15',
    statuses: ['Maior 23'],
    indicators: {
      academic: { attendancePercent: 78, ucFailures: 0, negativeGrades: 1, gpa: 13.5 },
      financial: { monthlyFee: 65, tuitionArrearsMonths: 0, scholarshipStatus: 'Não Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 22, materialsDownloaded: 19, daysSinceLastAccess: 1 },
      socioeconomic: { entryProfile: 'Maior 23', residence: 'Local', nee: false },
    },
    interventions: [],
  },
]
