export type ProfileId = 'diretor' | 'sas' | 'obs'

export type AppRouteKey =
  | 'dashboard'
  | 'analysis'
  | 'prediction'
  | 'settings'
  | 'roi'
  | 'studentProfile'
  | 'pipeline'

interface RouteAccessRule {
  path: string
  allowedRoles: readonly ProfileId[]
  requiresUnlockedPipeline?: boolean
}

const ALL_ROLES = ['diretor', 'sas', 'obs'] as const satisfies readonly ProfileId[]
const DIRECTOR_AND_SAS = ['diretor', 'sas'] as const satisfies readonly ProfileId[]
const DIRECTOR_AND_OBS = ['diretor', 'obs'] as const satisfies readonly ProfileId[]

export const DEFAULT_PROFILE_ID: ProfileId = 'obs'

export const PROFILE_OPTIONS: ReadonlyArray<{ id: ProfileId; name: string }> = [
  { id: 'diretor', name: 'Diretor de Curso' },
  { id: 'sas', name: 'Técnico SAS' },
  { id: 'obs', name: 'Observatório' },
]

export const ROUTE_ACCESS: Record<AppRouteKey, RouteAccessRule> = {
  dashboard: { path: '/dashboard', allowedRoles: ALL_ROLES },
  analysis: { path: '/analysis', allowedRoles: ALL_ROLES },
  prediction: { path: '/prediction', allowedRoles: DIRECTOR_AND_OBS },
  settings: { path: '/settings', allowedRoles: DIRECTOR_AND_SAS },
  roi: { path: '/roi', allowedRoles: DIRECTOR_AND_SAS },
  studentProfile: { path: '/students/:id', allowedRoles: DIRECTOR_AND_SAS },
  pipeline: { path: '/pipeline', allowedRoles: DIRECTOR_AND_SAS, requiresUnlockedPipeline: true },
}

export function getDefaultRouteForRole(profileId: ProfileId): string {
  return profileId === 'obs' ? ROUTE_ACCESS.analysis.path : ROUTE_ACCESS.dashboard.path
}

export function canAccessRoute(
  profileId: ProfileId,
  routeKey: AppRouteKey,
  options?: { bmadUnlocked?: boolean },
): boolean {
  const route = ROUTE_ACCESS[routeKey]
  if (!route.allowedRoles.includes(profileId)) {
    return false
  }

  if (route.requiresUnlockedPipeline && !options?.bmadUnlocked) {
    return false
  }

  return true
}

export function canUseCommandBar(profileId: ProfileId): boolean {
  return profileId !== 'obs'
}

export function canViewStudentProfiles(profileId: ProfileId): boolean {
  return profileId !== 'obs'
}

export function canViewNamedStudents(profileId: ProfileId): boolean {
  return profileId !== 'obs'
}

export function canViewFinancialDetails(profileId: ProfileId): boolean {
  return profileId === 'sas'
}

export function canViewSocioeconomicDetails(profileId: ProfileId): boolean {
  return profileId === 'sas'
}

export function canViewRoiMetrics(profileId: ProfileId): boolean {
  return profileId !== 'obs'
}

export function canAdjustSettings(profileId: ProfileId): boolean {
  return profileId === 'diretor' || profileId === 'sas'
}
