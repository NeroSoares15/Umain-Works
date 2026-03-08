import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { StudentProfile } from './pages/StudentProfile'
import { Pipeline } from './pages/Pipeline'
import { Settings } from './pages/Settings'
import { Analysis } from './pages/Analysis'
import { Prediction } from './pages/Prediction'
import { ROI } from './pages/ROI'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students/:id" element={<StudentProfile />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="settings" element={<Settings />} />
          <Route path="roi" element={<ROI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
