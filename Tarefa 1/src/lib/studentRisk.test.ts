import { describe, expect, it } from 'vitest'
import { students } from '../data/students'
import { canAccessRoute } from './accessControl'
import { DEFAULT_SETTINGS } from './appSettings'
import {
  getAlertDisplayReason,
  getRiskNarrative,
  getStudentRiskSnapshot,
  getVisibleStatuses,
} from './studentRisk'

describe('access control', () => {
  it('blocks observer access to individual student profiles', () => {
    expect(canAccessRoute('obs', 'studentProfile')).toBe(false)
    expect(canAccessRoute('sas', 'studentProfile')).toBe(true)
  })
})

describe('student risk engine', () => {
  it('reacts to calibration changes in settings', () => {
    const baseline = getStudentRiskSnapshot(students[0], DEFAULT_SETTINGS)
    const tuned = getStudentRiskSnapshot(students[0], {
      ...DEFAULT_SETTINGS,
      riskSignals: {
        ...DEFAULT_SETTINGS.riskSignals,
        toleratedNegativeGrades: 0,
        toleratedTuitionArrearsMonths: 0,
      },
    })

    expect(tuned.score).toBeGreaterThanOrEqual(baseline.score)
  })

  it('redacts sensitive dashboard copy for non-SAS roles', () => {
    const alert = {
      id: 'audit-check',
      studentId: '4',
      studentName: 'Pedro Santos',
      course: 'Eng. Informática',
      level: 'high' as const,
      reason: 'Propinas em atraso e necessidade de apoio psicopedagógico',
      timestamp: '2026-02-15T09:30:00',
      status: 'pending' as const,
    }

    expect(getAlertDisplayReason(alert, 'diretor')).not.toContain('Propinas')
    expect(getRiskNarrative(students[3], DEFAULT_SETTINGS, 'diretor')).not.toContain('propinas')
    expect(getVisibleStatuses(students[3], 'diretor')).toEqual(['Perfil reservado'])
  })
})
