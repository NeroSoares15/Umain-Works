export type WorkflowStatus = 'Pendente' | 'Em progresso' | 'Finalizado'

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
    scholarshipStatus: 'Bolseiro' | 'Nao Bolseiro' | 'Candidato'
    paymentAgreement: boolean
  }
  behavioral: {
    moodleLoginsLast30Days: number
    materialsDownloaded: number
    daysSinceLastAccess: number
    firstAccessLabel: string
  }
  socioeconomic: {
    entryProfile: 'Geral' | 'Internacional' | 'Trabalhador-Estudante' | 'Maior 23' | 'CTeSP'
    residence: 'Local' | 'Deslocado' | 'Internacional'
    nee: boolean
  }
}

export interface Intervention {
  date: string
  type: 'Reuniao' | 'Email' | 'Encaminhamento SAS' | 'Tutoria' | 'Alerta Gerado'
  description: string
  author: string
}

export interface Student {
  id: string
  name: string
  number: string
  course: string
  degree: 'CTeSP' | 'LIC.' | 'MEST.' | 'DOUT.'
  year: number
  riskScore: number
  scoreTrend: 'up' | 'down' | 'stable'
  workflowStatus: WorkflowStatus
  mainCause: string
  lastUpdated: string
  statuses: string[]
  indicators: StudentIndicators
  interventions: Intervention[]
}

export const students: Student[] = [
  {
    id: '4',
    name: 'Pedro Santos',
    number: '2022112',
    course: 'Engenharia Informática',
    degree: 'LIC.',
    year: 2,
    riskScore: 88,
    scoreTrend: 'up',
    workflowStatus: 'Pendente',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Propinas em Atraso', 'NEE'],
    indicators: {
      academic: { attendancePercent: 31, ucFailures: 4, negativeGrades: 5, gpa: 7.8 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 4, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: true },
      behavioral: { moodleLoginsLast30Days: 2, materialsDownloaded: 1, daysSinceLastAccess: 21, firstAccessLabel: '16 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Deslocado', nee: true },
    },
    interventions: [
      { date: '2026-01-10', type: 'Encaminhamento SAS', description: 'Encaminhado para gabinete de apoio psicopedagogico.', author: 'Prof. Antonio Ferreira' },
      { date: '2026-01-25', type: 'Reuniao', description: 'Reuniao com SAS e plano de acompanhamento definido.', author: 'Tecnica SAS' },
    ],
  },
  {
    id: '1',
    name: 'Mariana Costa',
    number: '2022001',
    course: 'Engenharia Informática',
    degree: 'LIC.',
    year: 2,
    riskScore: 84,
    scoreTrend: 'up',
    workflowStatus: 'Em progresso',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Trabalhador-Estudante'],
    indicators: {
      academic: { attendancePercent: 42, ucFailures: 3, negativeGrades: 4, gpa: 9.2 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 4, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 4, materialsDownloaded: 2, daysSinceLastAccess: 18, firstAccessLabel: '02 de Outubro de 2024' },
      socioeconomic: { entryProfile: 'Trabalhador-Estudante', residence: 'Deslocado', nee: false },
    },
    interventions: [
      { date: '2026-02-10', type: 'Email', description: 'Contacto inicial enviado pela direcao de curso.', author: 'Prof. Antonio Ferreira' },
    ],
  },
  {
    id: '2',
    name: 'João Rodrigues',
    number: '2023045',
    course: 'Engenharia Informática',
    degree: 'LIC.',
    year: 1,
    riskScore: 82,
    scoreTrend: 'up',
    workflowStatus: 'Finalizado',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['1 Ano'],
    indicators: {
      academic: { attendancePercent: 47, ucFailures: 4, negativeGrades: 4, gpa: 9.8 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 4, scholarshipStatus: 'Candidato', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 5, materialsDownloaded: 3, daysSinceLastAccess: 16, firstAccessLabel: '23 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Deslocado', nee: false },
    },
    interventions: [
      { date: '2026-02-12', type: 'Alerta Gerado', description: 'Faltas consecutivas e atraso financeiro critico.', author: 'Sistema' },
    ],
  },
  {
    id: '7',
    name: 'Ines Carvalho',
    number: '2022067',
    course: 'Enfermagem',
    degree: 'LIC.',
    year: 2,
    riskScore: 81,
    scoreTrend: 'up',
    workflowStatus: 'Finalizado',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Trabalhador-Estudante'],
    indicators: {
      academic: { attendancePercent: 52, ucFailures: 3, negativeGrades: 3, gpa: 10.6 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 2, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 7, materialsDownloaded: 6, daysSinceLastAccess: 9, firstAccessLabel: '30 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Trabalhador-Estudante', residence: 'Local', nee: false },
    },
    interventions: [
      { date: '2026-02-14', type: 'Tutoria', description: 'Plano de regularizacao definido com o curso.', author: 'Coordenacao' },
    ],
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    number: '2021078',
    course: 'Gestão de Empresas',
    degree: 'LIC.',
    year: 3,
    riskScore: 39,
    scoreTrend: 'down',
    workflowStatus: 'Finalizado',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Bolseira'],
    indicators: {
      academic: { attendancePercent: 68, ucFailures: 1, negativeGrades: 2, gpa: 12.3 },
      financial: { monthlyFee: 65, tuitionArrearsMonths: 0, scholarshipStatus: 'Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 15, materialsDownloaded: 12, daysSinceLastAccess: 2, firstAccessLabel: '18 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [
      { date: '2026-02-01', type: 'Reuniao', description: 'Follow-up positivo com plano de estudo definido.', author: 'Prof. Marta Silva' },
    ],
  },
  {
    id: '8',
    name: 'Miguel Lopes',
    number: '2023011',
    course: 'Design de Comunicação',
    degree: 'LIC.',
    year: 1,
    riskScore: 52,
    scoreTrend: 'stable',
    workflowStatus: 'Finalizado',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Maior 23'],
    indicators: {
      academic: { attendancePercent: 61, ucFailures: 2, negativeGrades: 2, gpa: 11.6 },
      financial: { monthlyFee: 250, tuitionArrearsMonths: 1, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 12, materialsDownloaded: 9, daysSinceLastAccess: 5, firstAccessLabel: '20 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Maior 23', residence: 'Local', nee: false },
    },
    interventions: [],
  },
  {
    id: '6',
    name: 'Rui Fernandes',
    number: '2021034',
    course: 'Contabilidade',
    degree: 'LIC.',
    year: 3,
    riskScore: 18,
    scoreTrend: 'down',
    workflowStatus: 'Finalizado',
    mainCause: 'Faltas/Motivacional',
    lastUpdated: '2026-02-15',
    statuses: ['Bolseiro'],
    indicators: {
      academic: { attendancePercent: 91, ucFailures: 0, negativeGrades: 0, gpa: 15.2 },
      financial: { monthlyFee: 0, tuitionArrearsMonths: 0, scholarshipStatus: 'Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 28, materialsDownloaded: 35, daysSinceLastAccess: 1, firstAccessLabel: '12 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [],
  },
  {
    id: '9',
    name: 'Sofia Almeida',
    number: '2024102',
    course: 'Psicologia',
    degree: 'MEST.',
    year: 1,
    riskScore: 54,
    scoreTrend: 'up',
    workflowStatus: 'Pendente',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Internacional'],
    indicators: {
      academic: { attendancePercent: 58, ucFailures: 2, negativeGrades: 2, gpa: 11.1 },
      financial: { monthlyFee: 1250, tuitionArrearsMonths: 1, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 10, materialsDownloaded: 8, daysSinceLastAccess: 7, firstAccessLabel: '25 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Internacional', residence: 'Internacional', nee: false },
    },
    interventions: [],
  },
  {
    id: '10',
    name: 'Ricardo Silva',
    number: '2021184',
    course: 'Engenharia Civil',
    degree: 'LIC.',
    year: 3,
    riskScore: 79,
    scoreTrend: 'up',
    workflowStatus: 'Em progresso',
    mainCause: 'Faltas/Motivacional',
    lastUpdated: '2026-02-15',
    statuses: ['Deslocado'],
    indicators: {
      academic: { attendancePercent: 49, ucFailures: 3, negativeGrades: 3, gpa: 10.2 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 3, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: true },
      behavioral: { moodleLoginsLast30Days: 6, materialsDownloaded: 5, daysSinceLastAccess: 14, firstAccessLabel: '19 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Deslocado', nee: false },
    },
    interventions: [
      { date: '2026-02-11', type: 'Email', description: 'Proposta de reuniao enviada ao estudante.', author: 'SAS' },
    ],
  },
  {
    id: '11',
    name: 'Carla Mendes',
    number: '2020199',
    course: 'Medicina',
    degree: 'DOUT.',
    year: 2,
    riskScore: 34,
    scoreTrend: 'down',
    workflowStatus: 'Finalizado',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Bolseira'],
    indicators: {
      academic: { attendancePercent: 73, ucFailures: 1, negativeGrades: 1, gpa: 13.1 },
      financial: { monthlyFee: 1250, tuitionArrearsMonths: 0, scholarshipStatus: 'Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 18, materialsDownloaded: 13, daysSinceLastAccess: 3, firstAccessLabel: '10 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [],
  },
  {
    id: '12',
    name: 'Bruno Teixeira',
    number: '2023018',
    course: 'Arquitetura',
    degree: 'LIC.',
    year: 2,
    riskScore: 58,
    scoreTrend: 'stable',
    workflowStatus: 'Em progresso',
    mainCause: 'Faltas/Motivacional',
    lastUpdated: '2026-02-15',
    statuses: ['Trabalhador-Estudante'],
    indicators: {
      academic: { attendancePercent: 60, ucFailures: 2, negativeGrades: 2, gpa: 11.0 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 1, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 9, materialsDownloaded: 6, daysSinceLastAccess: 8, firstAccessLabel: '22 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Trabalhador-Estudante', residence: 'Local', nee: false },
    },
    interventions: [
      { date: '2026-02-08', type: 'Tutoria', description: 'Plano de trabalho definido para entregas em atraso.', author: 'Tutor' },
    ],
  },
  {
    id: '13',
    name: 'Patricia Gomes',
    number: '2022117',
    course: 'Direito',
    degree: 'LIC.',
    year: 2,
    riskScore: 74,
    scoreTrend: 'up',
    workflowStatus: 'Pendente',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Deslocada'],
    indicators: {
      academic: { attendancePercent: 53, ucFailures: 3, negativeGrades: 3, gpa: 10.3 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 2, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 7, materialsDownloaded: 4, daysSinceLastAccess: 10, firstAccessLabel: '26 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Deslocado', nee: false },
    },
    interventions: [],
  },
  {
    id: '14',
    name: 'Tomas Pereira',
    number: '2020177',
    course: 'Engenharia Informática',
    degree: 'MEST.',
    year: 1,
    riskScore: 20,
    scoreTrend: 'down',
    workflowStatus: 'Finalizado',
    mainCause: 'Faltas/Motivacional',
    lastUpdated: '2026-02-15',
    statuses: [],
    indicators: {
      academic: { attendancePercent: 88, ucFailures: 0, negativeGrades: 0, gpa: 14.8 },
      financial: { monthlyFee: 1250, tuitionArrearsMonths: 0, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 24, materialsDownloaded: 20, daysSinceLastAccess: 1, firstAccessLabel: '14 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [],
  },
  {
    id: '15',
    name: 'Clara Sousa',
    number: '2023155',
    course: 'Gestão de Empresas',
    degree: 'LIC.',
    year: 1,
    riskScore: 47,
    scoreTrend: 'stable',
    workflowStatus: 'Em progresso',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['1 Ano'],
    indicators: {
      academic: { attendancePercent: 64, ucFailures: 2, negativeGrades: 2, gpa: 11.7 },
      financial: { monthlyFee: 65, tuitionArrearsMonths: 1, scholarshipStatus: 'Candidato', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 10, materialsDownloaded: 9, daysSinceLastAccess: 6, firstAccessLabel: '17 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [
      { date: '2026-02-09', type: 'Email', description: 'Partilha de plano de recuperacao academica.', author: 'Direcao de Curso' },
    ],
  },
  {
    id: '16',
    name: 'Daniel Martins',
    number: '2022146',
    course: 'Engenharia Eletrotecnica',
    degree: 'LIC.',
    year: 2,
    riskScore: 76,
    scoreTrend: 'up',
    workflowStatus: 'Pendente',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Propinas em Atraso'],
    indicators: {
      academic: { attendancePercent: 46, ucFailures: 4, negativeGrades: 4, gpa: 9.7 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 3, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 6, materialsDownloaded: 4, daysSinceLastAccess: 15, firstAccessLabel: '28 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Deslocado', nee: false },
    },
    interventions: [],
  },
  {
    id: '17',
    name: 'Isabel Rocha',
    number: '2021140',
    course: 'Enfermagem',
    degree: 'MEST.',
    year: 2,
    riskScore: 54,
    scoreTrend: 'stable',
    workflowStatus: 'Em progresso',
    mainCause: 'Faltas/Motivacional',
    lastUpdated: '2026-02-15',
    statuses: ['Internacional'],
    indicators: {
      academic: { attendancePercent: 57, ucFailures: 2, negativeGrades: 2, gpa: 11.2 },
      financial: { monthlyFee: 1250, tuitionArrearsMonths: 1, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 11, materialsDownloaded: 8, daysSinceLastAccess: 7, firstAccessLabel: '11 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Internacional', residence: 'Internacional', nee: false },
    },
    interventions: [
      { date: '2026-02-06', type: 'Reuniao', description: 'Acompanhamento com coordenacao do curso.', author: 'Coordenacao' },
    ],
  },
  {
    id: '18',
    name: 'Filipe Costa',
    number: '2023124',
    course: 'Design de Comunicação',
    degree: 'LIC.',
    year: 1,
    riskScore: 36,
    scoreTrend: 'down',
    workflowStatus: 'Pendente',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: [],
    indicators: {
      academic: { attendancePercent: 70, ucFailures: 1, negativeGrades: 1, gpa: 12.5 },
      financial: { monthlyFee: 250, tuitionArrearsMonths: 0, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 14, materialsDownloaded: 11, daysSinceLastAccess: 4, firstAccessLabel: '15 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [],
  },
  {
    id: '19',
    name: 'Rafaela Pinto',
    number: '2020127',
    course: 'Medicina',
    degree: 'LIC.',
    year: 4,
    riskScore: 48,
    scoreTrend: 'stable',
    workflowStatus: 'Pendente',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: [],
    indicators: {
      academic: { attendancePercent: 66, ucFailures: 2, negativeGrades: 2, gpa: 11.9 },
      financial: { monthlyFee: 1250, tuitionArrearsMonths: 1, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 13, materialsDownloaded: 7, daysSinceLastAccess: 5, firstAccessLabel: '09 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [],
  },
  {
    id: '20',
    name: 'Andre Neves',
    number: '2020110',
    course: 'Contabilidade',
    degree: 'MEST.',
    year: 1,
    riskScore: 69,
    scoreTrend: 'up',
    workflowStatus: 'Finalizado',
    mainCause: 'Faltas/Motivacional',
    lastUpdated: '2026-02-15',
    statuses: ['Deslocado'],
    indicators: {
      academic: { attendancePercent: 54, ucFailures: 3, negativeGrades: 3, gpa: 10.4 },
      financial: { monthlyFee: 1250, tuitionArrearsMonths: 2, scholarshipStatus: 'Nao Bolseiro', paymentAgreement: true },
      behavioral: { moodleLoginsLast30Days: 8, materialsDownloaded: 5, daysSinceLastAccess: 11, firstAccessLabel: '21 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Deslocado', nee: false },
    },
    interventions: [
      { date: '2026-02-04', type: 'Email', description: 'Partilha de cronograma para regularizacao.', author: 'SAS' },
    ],
  },
  {
    id: '21',
    name: 'Helena Carvalho',
    number: '2022108',
    course: 'Direito',
    degree: 'LIC.',
    year: 2,
    riskScore: 35,
    scoreTrend: 'down',
    workflowStatus: 'Finalizado',
    mainCause: 'Baixo Desempenho',
    lastUpdated: '2026-02-15',
    statuses: ['Bolseira'],
    indicators: {
      academic: { attendancePercent: 75, ucFailures: 1, negativeGrades: 1, gpa: 12.8 },
      financial: { monthlyFee: 85, tuitionArrearsMonths: 0, scholarshipStatus: 'Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 16, materialsDownloaded: 12, daysSinceLastAccess: 3, firstAccessLabel: '13 de Setembro de 2024' },
      socioeconomic: { entryProfile: 'Geral', residence: 'Local', nee: false },
    },
    interventions: [],
  },
]
