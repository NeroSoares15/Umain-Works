import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { canAccessRoute, getDefaultRouteForRole, type AppRouteKey } from '../../lib/accessControl'
import { useAppContext } from '../../contexts/useAppContext'

interface ProtectedRouteProps {
  children: ReactNode
  routeKey: AppRouteKey
}

export function ProtectedRoute({ children, routeKey }: ProtectedRouteProps) {
  const { activeProfileId, settings } = useAppContext()

  if (!canAccessRoute(activeProfileId, routeKey, { bmadUnlocked: settings.bmadUnlocked })) {
    return <Navigate to={getDefaultRouteForRole(activeProfileId)} replace />
  }

  return <>{children}</>
}
