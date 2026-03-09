import { Suspense, lazy, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { AppProvider } from './contexts/AppProvider'

const Dashboard = lazy(async () => {
  const module = await import('./pages/Dashboard')
  return { default: module.Dashboard }
})
const StudentProfile = lazy(async () => {
  const module = await import('./pages/StudentProfile')
  return { default: module.StudentProfile }
})
const Pipeline = lazy(async () => {
  const module = await import('./pages/Pipeline')
  return { default: module.Pipeline }
})
const Settings = lazy(async () => {
  const module = await import('./pages/Settings')
  return { default: module.Settings }
})
const Analysis = lazy(async () => {
  const module = await import('./pages/Analysis')
  return { default: module.Analysis }
})
const Prediction = lazy(async () => {
  const module = await import('./pages/Prediction')
  return { default: module.Prediction }
})
const ROI = lazy(async () => {
  const module = await import('./pages/ROI')
  return { default: module.ROI }
})

function RouteFallback() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-umain-background px-6 text-center">
      <div className="rounded-3xl border border-umain-border/60 bg-umain-surface/80 px-8 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-umain-text-muted">RiskRadar</p>
        <p className="mt-2 text-sm font-semibold text-white">A preparar a próxima vista...</p>
      </div>
    </div>
  )
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<LazyPage><Dashboard /></LazyPage>} />
            <Route
              path="students/:id"
              element={
                <ProtectedRoute routeKey="studentProfile">
                  <LazyPage><StudentProfile /></LazyPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="pipeline"
              element={
                <ProtectedRoute routeKey="pipeline">
                  <LazyPage><Pipeline /></LazyPage>
                </ProtectedRoute>
              }
            />
            <Route path="analysis" element={<LazyPage><Analysis /></LazyPage>} />
            <Route
              path="prediction"
              element={
                <ProtectedRoute routeKey="prediction">
                  <LazyPage><Prediction /></LazyPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute routeKey="settings">
                  <LazyPage><Settings /></LazyPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="roi"
              element={
                <ProtectedRoute routeKey="roi">
                  <LazyPage><ROI /></LazyPage>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
