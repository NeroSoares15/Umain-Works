export interface Alert {
  id: string
  studentId: string
  studentName: string
  course: string
  level: 'medium' | 'high'
  reason: string
  timestamp: string
  status: 'pending' | 'reviewed'
}

export const alerts: Alert[] = [
  {
    id: 'a1',
    studentId: '4',
    studentName: 'Pedro Santos',
    course: 'Eng. Informática',
    level: 'high',
    reason: 'Ausência prolongada Moodle + 4 UCs negativas + propinas em atraso (4 meses)',
    timestamp: '2026-02-15T09:30:00',
    status: 'pending',
  },
  {
    id: 'a2',
    studentId: '1',
    studentName: 'Mariana Costa',
    course: 'Eng. Informática',
    level: 'high',
    reason: 'Score ultrapassou limiar crítico — combinação de faltas (58%) e atraso financeiro',
    timestamp: '2026-02-15T09:30:00',
    status: 'pending',
  },
  {
    id: 'a3',
    studentId: '7',
    studentName: 'Inês Carvalho',
    course: 'Enfermagem',
    level: 'medium',
    reason: 'Faltas em contexto clínico acima do limiar permitido',
    timestamp: '2026-02-14T14:00:00',
    status: 'pending',
  },
  {
    id: 'a4',
    studentId: '2',
    studentName: 'João Rodrigues',
    course: 'Eng. Informática',
    level: 'high',
    reason: 'Padrão de risco 1º ano — faltas + desengajamento Moodle + sem bolsa',
    timestamp: '2026-02-15T09:30:00',
    status: 'reviewed',
  },
]
