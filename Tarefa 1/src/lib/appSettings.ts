export interface RiskThresholds {
  none: number
  low: number
  medium: number
}

export interface RiskSignalSettings {
  attendanceTolerancePercent: number
  toleratedNegativeGrades: number
  maxDaysSinceLastAccess: number
  toleratedTuitionArrearsMonths: number
}

export interface ProfileMultipliers {
  firstYear: number
  scholarship: number
  international: number
}

export interface AppSettings {
  riskThresholds: RiskThresholds
  riskSignals: RiskSignalSettings
  profileMultipliers: ProfileMultipliers
  enableEffects: boolean
  bmadUnlocked: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  riskThresholds: { none: 20, low: 40, medium: 60 },
  riskSignals: {
    attendanceTolerancePercent: 15,
    toleratedNegativeGrades: 2,
    maxDaysSinceLastAccess: 7,
    toleratedTuitionArrearsMonths: 2,
  },
  profileMultipliers: {
    firstYear: 1.2,
    scholarship: 1.1,
    international: 1.15,
  },
  enableEffects: true,
  bmadUnlocked: false,
}
