# RiskRadar Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a functional 3-page React SPA demo for RiskRadar — a student dropout risk monitoring platform — ready to present to a Rector.

**Architecture:** Single-page app with React Router v7 for 3 pages (Dashboard, Student Profile, Pipeline). All data is hardcoded mock JSON in `src/data/`. No backend. Layout shell (Sidebar + TopBar) wraps all pages.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Recharts, Lucide React, clsx, tailwind-merge

---

## Task 1: Foundation — utils, riskUtils, folder structure

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/riskUtils.ts`
- Create: `src/components/layout/.gitkeep`
- Create: `src/components/ui/.gitkeep`
- Create: `src/pages/.gitkeep`
- Create: `src/data/.gitkeep`

**Step 1: Create folder structure**

```bash
mkdir -p "src/lib" "src/components/layout" "src/components/ui" "src/pages" "src/data"
```

**Step 2: Create `src/lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 3: Create `src/lib/riskUtils.ts`**

```typescript
export type RiskLevel = 'none' | 'low' | 'medium' | 'high'

export function scoreToLevel(score: number): RiskLevel {
  if (score <= 20) return 'none'
  if (score <= 40) return 'low'
  if (score <= 60) return 'medium'
  return 'high'
}

export const riskConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  none:   { label: 'Sem Risco',    color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  low:    { label: 'Risco Baixo',  color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  medium: { label: 'Risco Médio',  color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200' },
  high:   { label: 'Risco Alto',   color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200' },
}

export function scoreToBarColor(score: number): string {
  const level = scoreToLevel(score)
  if (level === 'none') return 'bg-emerald-500'
  if (level === 'low') return 'bg-blue-500'
  if (level === 'medium') return 'bg-amber-500'
  return 'bg-red-500'
}
```

**Step 4: Run dev to confirm no errors**

```bash
npm run dev
```
Expected: Vite dev server starts at localhost:5173 with no TypeScript errors.

**Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: add cn utility and riskUtils helpers"
```

---

## Task 2: Mock Data

**Files:**
- Create: `src/data/students.ts`
- Create: `src/data/alerts.ts`

**Step 1: Create `src/data/students.ts`**

```typescript
export interface StudentIndicators {
  academic: {
    attendancePercent: number
    ucFailures: number
    negativeGrades: number
    gpa: number
  }
  financial: {
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
      financial: { tuitionArrearsMonths: 3, scholarshipStatus: 'Não Bolseiro', paymentAgreement: false },
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
      financial: { tuitionArrearsMonths: 2, scholarshipStatus: 'Candidato', paymentAgreement: false },
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
      financial: { tuitionArrearsMonths: 0, scholarshipStatus: 'Bolseiro', paymentAgreement: false },
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
      financial: { tuitionArrearsMonths: 4, scholarshipStatus: 'Não Bolseiro', paymentAgreement: true },
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
      financial: { tuitionArrearsMonths: 1, scholarshipStatus: 'Não Bolseiro', paymentAgreement: false },
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
      financial: { tuitionArrearsMonths: 0, scholarshipStatus: 'Bolseiro', paymentAgreement: false },
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
      financial: { tuitionArrearsMonths: 1, scholarshipStatus: 'Não Bolseiro', paymentAgreement: false },
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
      financial: { tuitionArrearsMonths: 0, scholarshipStatus: 'Não Bolseiro', paymentAgreement: false },
      behavioral: { moodleLoginsLast30Days: 22, materialsDownloaded: 19, daysSinceLastAccess: 1 },
      socioeconomic: { entryProfile: 'Maior 23', residence: 'Local', nee: false },
    },
    interventions: [],
  },
]
```

**Step 2: Create `src/data/alerts.ts`**

```typescript
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
```

**Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: add mock student and alert data"
```

---

## Task 3: UI Primitives

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/KpiCard.tsx`
- Create: `src/components/ui/RiskBadge.tsx`
- Create: `src/components/ui/ScoreBar.tsx`

**Step 1: Create `src/components/ui/Badge.tsx`**

```tsx
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variant === 'default' && 'bg-umain-primary/10 text-umain-primary',
      variant === 'outline' && 'border border-umain-muted/30 text-umain-muted',
      className
    )}>
      {children}
    </span>
  )
}
```

**Step 2: Create `src/components/ui/Card.tsx`**

```tsx
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('px-6 py-4 border-b border-gray-100', className)}>{children}</div>
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}
```

**Step 3: Create `src/components/ui/RiskBadge.tsx`**

```tsx
import { cn } from '../../lib/utils'
import { riskConfig, scoreToLevel } from '../../lib/riskUtils'

export function RiskBadge({ score }: { score: number }) {
  const level = scoreToLevel(score)
  const config = riskConfig[level]
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border',
      config.color, config.bg, config.border
    )}>
      {config.label}
    </span>
  )
}
```

**Step 4: Create `src/components/ui/ScoreBar.tsx`**

```tsx
import { scoreToBarColor } from '../../lib/riskUtils'
import { cn } from '../../lib/utils'

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', scoreToBarColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-umain-text w-8 text-right">{score}</span>
    </div>
  )
}
```

**Step 5: Create `src/components/ui/KpiCard.tsx`**

```tsx
import { Card, CardContent } from './Card'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor = 'text-umain-accent', iconBg = 'bg-umain-accent/10' }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div className={cn('p-3 rounded-xl', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div>
          <p className="text-sm text-umain-muted">{title}</p>
          <p className="text-2xl font-bold text-umain-text">{value}</p>
          {subtitle && <p className="text-xs text-umain-muted mt-0.5">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 6: Verify build**

```bash
npm run build
```
Expected: Build completes with no TypeScript errors.

**Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add UI primitive components"
```

---

## Task 4: Layout Shell

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/TopBar.tsx`
- Create: `src/components/layout/Layout.tsx`

**Step 1: Create `src/components/layout/Sidebar.tsx`**

```tsx
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, GitBranch, Bell, Shield } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pipeline', icon: GitBranch, label: 'Pipeline de Dados' },
]

export function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-umain-primary flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-umain-accent" />
          <div>
            <p className="text-white font-bold text-sm leading-none">RiskRadar</p>
            <p className="text-white/40 text-xs mt-0.5">Lumina Suite</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-umain-accent/20 flex items-center justify-center">
            <span className="text-umain-accent text-xs font-bold">AF</span>
          </div>
          <div>
            <p className="text-white text-xs font-medium">Prof. António Ferreira</p>
            <p className="text-white/40 text-xs">Diretor de Curso</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
```

**Step 2: Create `src/components/layout/TopBar.tsx`**

```tsx
import { Bell } from 'lucide-react'
import { alerts } from '../../data/alerts'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const pendingCount = alerts.filter(a => a.status === 'pending').length

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-umain-text">{title}</h1>
        {subtitle && <p className="text-xs text-umain-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <p className="text-xs text-umain-muted">
          Última sincronização: <span className="font-medium text-umain-text">15 Fev 2026 — 09:30</span>
        </p>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-umain-muted" />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
```

**Step 3: Create `src/components/layout/Layout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-umain-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add layout shell (Sidebar, TopBar, Layout)"
```

---

## Task 5: Router Setup

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Delete content of: `src/App.css` (replace with empty/minimal)
- Modify: `src/index.css`

**Step 1: Update `src/index.css`** — remove default Vite styles, keep Tailwind directives

```css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  margin: 0;
}
```

**Step 2: Clear `src/App.css`**

Replace entire content with:
```css
/* App-level styles — use Tailwind utilities instead */
```

**Step 3: Rewrite `src/App.tsx`**

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { StudentProfile } from './pages/StudentProfile'
import { Pipeline } from './pages/Pipeline'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students/:id" element={<StudentProfile />} />
          <Route path="pipeline" element={<Pipeline />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

**Step 4: Create placeholder pages so router doesn't break**

Create `src/pages/Dashboard.tsx`:
```tsx
export function Dashboard() {
  return <div className="p-6 text-umain-text">Dashboard — em construção</div>
}
```

Create `src/pages/StudentProfile.tsx`:
```tsx
export function StudentProfile() {
  return <div className="p-6 text-umain-text">Perfil do Estudante — em construção</div>
}
```

Create `src/pages/Pipeline.tsx`:
```tsx
export function Pipeline() {
  return <div className="p-6 text-umain-text">Pipeline — em construção</div>
}
```

**Step 5: Run dev and verify routing works**

```bash
npm run dev
```
Expected: App loads at `/dashboard`, sidebar visible, nav links work.

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: set up React Router and layout shell"
```

---

## Task 6: Dashboard Page

**Files:**
- Modify: `src/pages/Dashboard.tsx`

**Step 1: Implement full Dashboard**

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, AlertTriangle, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { RiskBadge } from '../components/ui/RiskBadge'
import { ScoreBar } from '../components/ui/ScoreBar'
import { Badge } from '../components/ui/Badge'
import { students } from '../data/students'
import { alerts } from '../data/alerts'
import { scoreToLevel, riskConfig } from '../lib/riskUtils'

const COURSES = ['Todos', 'Engenharia Informática', 'Gestão de Empresas', 'Enfermagem', 'Design de Comunicação', 'Contabilidade e Fiscalidade']
const RISK_FILTERS = ['Todos', 'Risco Alto', 'Risco Médio', 'Risco Baixo', 'Sem Risco']

const PIE_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6', none: '#10b981' }

export function Dashboard() {
  const navigate = useNavigate()
  const [courseFilter, setCourseFilter] = useState('Todos')
  const [riskFilter, setRiskFilter] = useState('Todos')

  const filtered = students.filter(s => {
    const courseOk = courseFilter === 'Todos' || s.course === courseFilter
    const level = scoreToLevel(s.riskScore)
    const riskOk = riskFilter === 'Todos' ||
      (riskFilter === 'Risco Alto' && level === 'high') ||
      (riskFilter === 'Risco Médio' && level === 'medium') ||
      (riskFilter === 'Risco Baixo' && level === 'low') ||
      (riskFilter === 'Sem Risco' && level === 'none')
    return courseOk && riskOk
  })

  const highCount = students.filter(s => scoreToLevel(s.riskScore) === 'high').length
  const mediumCount = students.filter(s => scoreToLevel(s.riskScore) === 'medium').length
  const interventionsThisMonth = students.flatMap(s => s.interventions).filter(i => i.date.startsWith('2026-02')).length

  const pieData = [
    { name: 'Risco Alto', value: highCount, color: PIE_COLORS.high },
    { name: 'Risco Médio', value: mediumCount, color: PIE_COLORS.medium },
    { name: 'Risco Baixo', value: students.filter(s => scoreToLevel(s.riskScore) === 'low').length, color: PIE_COLORS.low },
    { name: 'Sem Risco', value: students.filter(s => scoreToLevel(s.riskScore) === 'none').length, color: PIE_COLORS.none },
  ]

  const recentAlerts = alerts.filter(a => a.status === 'pending').slice(0, 3)

  return (
    <>
      <TopBar
        title="Dashboard Operacional"
        subtitle="Engenharia Informática — 2025/2026"
      />
      <main className="flex-1 p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard title="Estudantes Monitorizados" value={students.length} icon={Users} />
          <KpiCard title="Risco Alto" value={highCount} subtitle="Intervenção prioritária" icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" />
          <KpiCard title="Risco Médio" value={mediumCount} subtitle="Acompanhamento ativo" icon={AlertCircle} iconColor="text-amber-600" iconBg="bg-amber-50" />
          <KpiCard title="Intervenções (Fev)" value={interventionsThisMonth} subtitle="Este mês" icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Student Table — 2/3 */}
          <div className="col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-umain-text focus:outline-none focus:ring-2 focus:ring-umain-accent/30"
              >
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select
                value={riskFilter}
                onChange={e => setRiskFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-umain-text focus:outline-none focus:ring-2 focus:ring-umain-accent/30"
              >
                {RISK_FILTERS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-umain-text text-sm">Estudantes em Monitorização</h2>
              </CardHeader>
              <div className="divide-y divide-gray-50">
                {filtered.sort((a, b) => b.riskScore - a.riskScore).map(student => (
                  <div key={student.id} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-umain-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-umain-primary text-xs font-bold">
                        {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-umain-text truncate">{student.name}</p>
                      <p className="text-xs text-umain-muted">{student.course} · {student.year}º Ano</p>
                    </div>
                    <div className="w-32">
                      <ScoreBar score={student.riskScore} />
                    </div>
                    <RiskBadge score={student.riskScore} />
                    <button
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="p-1.5 rounded-lg hover:bg-umain-accent/10 transition-colors text-umain-accent"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column — 1/3 */}
          <div className="space-y-4">
            {/* Donut chart */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-umain-text text-sm">Distribuição de Risco</h2>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v} estudantes`]} />
                    <Legend iconSize={8} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent alerts */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-umain-text text-sm">Alertas Recentes</h2>
              </CardHeader>
              <div className="divide-y divide-gray-50">
                {recentAlerts.map(alert => (
                  <div key={alert.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-umain-text">{alert.studentName}</p>
                      <RiskBadge score={alert.level === 'high' ? 80 : 50} />
                    </div>
                    <p className="text-xs text-umain-muted mt-1 line-clamp-2">{alert.reason}</p>
                    <p className="text-xs text-umain-muted/60 mt-1">{alert.course}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
```

**Step 2: Run dev and verify Dashboard renders correctly**

```bash
npm run dev
```
Expected: Dashboard shows KPI cards, student table with risk scores and badges, donut chart, alerts panel. Filters work. Clicking arrow navigates to student profile placeholder.

**Step 3: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: implement Dashboard page with KPIs, student table, risk chart"
```

---

## Task 7: Student Profile Page

**Files:**
- Modify: `src/pages/StudentProfile.tsx`

**Step 1: Implement full Student Profile**

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, BookOpen, DollarSign, Monitor, Heart } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { RiskBadge } from '../components/ui/RiskBadge'
import { Badge } from '../components/ui/Badge'
import { students } from '../data/students'
import { scoreToLevel, riskConfig, scoreToBarColor } from '../lib/riskUtils'
import { cn } from '../lib/utils'

function IndicatorRow({ label, value, status }: { label: string; value: string; status: 'ok' | 'warning' | 'critical' }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-umain-muted">{label}</span>
      <span className={cn(
        'text-sm font-medium',
        status === 'ok' && 'text-emerald-600',
        status === 'warning' && 'text-amber-600',
        status === 'critical' && 'text-red-600',
      )}>{value}</span>
    </div>
  )
}

export function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = students.find(s => s.id === id)

  if (!student) {
    return (
      <div className="p-6">
        <button onClick={() => navigate('/dashboard')} className="text-umain-accent text-sm flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <p className="mt-4 text-umain-muted">Estudante não encontrado.</p>
      </div>
    )
  }

  const level = scoreToLevel(student.riskScore)
  const config = riskConfig[level]

  const TrendIcon = student.scoreTrend === 'up' ? TrendingUp : student.scoreTrend === 'down' ? TrendingDown : Minus
  const trendColor = student.scoreTrend === 'up' ? 'text-red-500' : student.scoreTrend === 'down' ? 'text-emerald-500' : 'text-gray-400'

  const { indicators: ind } = student

  const radarData = [
    { subject: 'Académico', value: Math.min(100, (100 - ind.academic.attendancePercent) + ind.academic.ucFailures * 10) },
    { subject: 'Financeiro', value: Math.min(100, ind.financial.tuitionArrearsMonths * 20 + (ind.financial.scholarshipStatus === 'Não Bolseiro' ? 10 : 0)) },
    { subject: 'Moodle', value: Math.min(100, Math.max(0, 100 - ind.behavioral.moodleLoginsLast30Days * 3)) },
    { subject: 'Social', value: ind.socioeconomic.residence === 'Deslocado' ? 40 : ind.socioeconomic.residence === 'Internacional' ? 50 : 10 },
    { subject: 'Entrada', value: ind.socioeconomic.entryProfile === 'Geral' ? 10 : ind.socioeconomic.entryProfile === 'Internacional' ? 60 : 40 },
  ]

  return (
    <>
      <TopBar
        title={student.name}
        subtitle={`${student.course} · ${student.year}º Ano · Nº ${student.number}`}
      />
      <main className="flex-1 p-6 space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-umain-muted hover:text-umain-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </button>

        {/* Header row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Score hero */}
          <Card className="flex flex-col items-center justify-center py-8">
            <CardContent className="flex flex-col items-center gap-3">
              <div className={cn('w-28 h-28 rounded-full border-8 flex items-center justify-center', config.border)}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-umain-text">{student.riskScore}</p>
                  <p className="text-xs text-umain-muted">/ 100</p>
                </div>
              </div>
              <RiskBadge score={student.riskScore} />
              <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
                <TrendIcon className="w-4 h-4" />
                {student.scoreTrend === 'up' ? 'A agravar' : student.scoreTrend === 'down' ? 'A melhorar' : 'Estável'}
              </div>
            </CardContent>
          </Card>

          {/* Student info */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-umain-text">Perfil do Estudante</h2>
            </CardHeader>
            <CardContent className="space-y-2">
              <IndicatorRow label="Número" value={student.number} status="ok" />
              <IndicatorRow label="Curso" value={student.course} status="ok" />
              <IndicatorRow label="Ano Curricular" value={`${student.year}º Ano`} status="ok" />
              <IndicatorRow label="Residência" value={ind.socioeconomic.residence} status={ind.socioeconomic.residence === 'Deslocado' ? 'warning' : 'ok'} />
              <div className="pt-2 flex flex-wrap gap-1.5">
                {student.statuses.map(s => (
                  <Badge key={s} className="bg-umain-primary/10 text-umain-primary">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Radar chart */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-umain-text">Radar de Risco</h2>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar name="Risco" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Indicator panels */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-umain-accent" />
                <h2 className="text-sm font-semibold text-umain-text">Indicadores Académicos</h2>
              </div>
            </CardHeader>
            <CardContent>
              <IndicatorRow label="Assiduidade" value={`${ind.academic.attendancePercent}%`} status={ind.academic.attendancePercent >= 75 ? 'ok' : ind.academic.attendancePercent >= 50 ? 'warning' : 'critical'} />
              <IndicatorRow label="UCs com Negativa" value={`${ind.academic.ucFailures}`} status={ind.academic.ucFailures === 0 ? 'ok' : ind.academic.ucFailures <= 2 ? 'warning' : 'critical'} />
              <IndicatorRow label="Notas Negativas" value={`${ind.academic.negativeGrades}`} status={ind.academic.negativeGrades === 0 ? 'ok' : ind.academic.negativeGrades <= 2 ? 'warning' : 'critical'} />
              <IndicatorRow label="Média Global" value={`${ind.academic.gpa.toFixed(1)} valores`} status={ind.academic.gpa >= 13 ? 'ok' : ind.academic.gpa >= 10 ? 'warning' : 'critical'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-umain-text">Indicadores Financeiros</h2>
              </div>
            </CardHeader>
            <CardContent>
              <IndicatorRow label="Propinas em Atraso" value={ind.financial.tuitionArrearsMonths === 0 ? 'Regularizado' : `${ind.financial.tuitionArrearsMonths} meses`} status={ind.financial.tuitionArrearsMonths === 0 ? 'ok' : ind.financial.tuitionArrearsMonths <= 1 ? 'warning' : 'critical'} />
              <IndicatorRow label="Bolsa de Estudo" value={ind.financial.scholarshipStatus} status={ind.financial.scholarshipStatus === 'Bolseiro' ? 'ok' : 'warning'} />
              <IndicatorRow label="Acordo de Pagamento" value={ind.financial.paymentAgreement ? 'Sim' : 'Não'} status={ind.financial.paymentAgreement ? 'warning' : 'ok'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-500" />
                <h2 className="text-sm font-semibold text-umain-text">Atividade Moodle</h2>
              </div>
            </CardHeader>
            <CardContent>
              <IndicatorRow label="Acessos (últimos 30 dias)" value={`${ind.behavioral.moodleLoginsLast30Days} sessões`} status={ind.behavioral.moodleLoginsLast30Days >= 15 ? 'ok' : ind.behavioral.moodleLoginsLast30Days >= 5 ? 'warning' : 'critical'} />
              <IndicatorRow label="Materiais Descarregados" value={`${ind.behavioral.materialsDownloaded}`} status={ind.behavioral.materialsDownloaded >= 10 ? 'ok' : ind.behavioral.materialsDownloaded >= 3 ? 'warning' : 'critical'} />
              <IndicatorRow label="Último Acesso" value={`Há ${ind.behavioral.daysSinceLastAccess} dias`} status={ind.behavioral.daysSinceLastAccess <= 3 ? 'ok' : ind.behavioral.daysSinceLastAccess <= 7 ? 'warning' : 'critical'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h2 className="text-sm font-semibold text-umain-text">Contexto Socioeconómico</h2>
              </div>
            </CardHeader>
            <CardContent>
              <IndicatorRow label="Perfil de Entrada" value={ind.socioeconomic.entryProfile} status="ok" />
              <IndicatorRow label="Residência" value={ind.socioeconomic.residence} status={ind.socioeconomic.residence === 'Local' ? 'ok' : 'warning'} />
              <IndicatorRow label="NEE" value={ind.socioeconomic.nee ? 'Sim' : 'Não'} status={ind.socioeconomic.nee ? 'warning' : 'ok'} />
            </CardContent>
          </Card>
        </div>

        {/* Intervention timeline */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-umain-text">Histórico de Intervenções</h2>
          </CardHeader>
          <CardContent>
            {student.interventions.length === 0 ? (
              <p className="text-sm text-umain-muted">Sem intervenções registadas.</p>
            ) : (
              <div className="relative space-y-4 pl-4 border-l-2 border-gray-100">
                {student.interventions.map((intervention, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-umain-accent border-2 border-white" />
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-umain-accent/10 text-umain-accent">{intervention.type}</Badge>
                          <span className="text-xs text-umain-muted">{intervention.author}</span>
                        </div>
                        <p className="text-sm text-umain-text mt-1">{intervention.description}</p>
                      </div>
                      <span className="text-xs text-umain-muted flex-shrink-0 ml-4">{intervention.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Recommended action */}
            {scoreToLevel(student.riskScore) === 'high' && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-xs font-semibold text-red-700">Ação Recomendada</p>
                <p className="text-sm text-red-600 mt-0.5">
                  Contactar estudante e encaminhar para SAS dado o nível de risco crítico.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
```

**Step 2: Verify in browser** — click a student from dashboard, confirm profile loads with all sections.

**Step 3: Commit**

```bash
git add src/pages/StudentProfile.tsx
git commit -m "feat: implement Student Profile page with indicators and timeline"
```

---

## Task 8: Pipeline Page

**Files:**
- Modify: `src/pages/Pipeline.tsx`

**Step 1: Implement Pipeline page**

```tsx
import { useState } from 'react'
import { CheckCircle2, RefreshCw, Database, Zap, BarChart3, Bell } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { cn } from '../lib/utils'

const dataSources = [
  { id: 'erp', name: 'ERP Académico', description: 'Notas, inscrições, estatutos, via de acesso', lastSync: '15 Fev 2026 — 08:00', status: 'ok', records: '1.247 registos', viability: 'H' },
  { id: 'sas', name: 'Tesouraria / SAS', description: 'Propinas, bolsas, acordos de pagamento', lastSync: '15 Fev 2026 — 08:05', status: 'ok', records: '1.247 registos', viability: 'H' },
  { id: 'summaries', name: 'Plataforma de Sumários', description: 'Presenças e faltas em aulas', lastSync: '15 Fev 2026 — 08:10', status: 'ok', records: '18.432 registos', viability: 'H' },
  { id: 'moodle', name: 'Moodle / LMS', description: 'Acessos e downloads de materiais', lastSync: '15 Fev 2026 — 08:15', status: 'warning', records: '9.821 registos', viability: 'M' },
]

const bmadSteps = [
  { id: 'B', label: 'Business', description: 'Centralização de dados das fontes institucionais', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'M', label: 'Model', description: 'Motor de regras determinístico — cálculo do score 0–100', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'A', label: 'Analysis', description: 'Dashboards hierarquizados por perfil de acesso', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'D', label: 'Decision', description: 'Alertas e plano de intervenção com validação humana', icon: Bell, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
]

export function Pipeline() {
  const [calculating, setCalculating] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  function simulate() {
    if (calculating) return
    setCalculating(true)
    setDone(false)
    setActiveStep(0)
    const steps = [0, 1, 2, 3]
    steps.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(step)
        if (i === steps.length - 1) {
          setTimeout(() => { setCalculating(false); setDone(true); setActiveStep(null) }, 800)
        }
      }, i * 900)
    })
  }

  return (
    <>
      <TopBar title="Pipeline de Dados" subtitle="Fluxo de ingestão e cálculo — BMAD Methodology" />
      <main className="flex-1 p-6 space-y-6">

        {/* BMAD steps */}
        <div className="grid grid-cols-4 gap-4">
          {bmadSteps.map((step, i) => {
            const Icon = step.icon
            const isActive = activeStep === i
            return (
              <Card key={step.id} className={cn('transition-all duration-300', isActive && 'ring-2 ring-umain-accent shadow-lg scale-[1.02]')}>
                <CardContent className="py-5">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', step.bg, step.border, 'border')}>
                    <Icon className={cn('w-5 h-5', step.color)} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={cn('text-2xl font-black', step.color)}>{step.id}</span>
                    <span className="text-sm font-semibold text-umain-text">{step.label}</span>
                  </div>
                  <p className="text-xs text-umain-muted mt-1">{step.description}</p>
                  {isActive && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-umain-accent font-medium">
                      <RefreshCw className="w-3 h-3 animate-spin" /> A processar...
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-umain-text">Fontes de Dados</h2>
              <button
                onClick={simulate}
                disabled={calculating}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  calculating
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-umain-accent text-white hover:bg-umain-accent/90'
                )}
              >
                <RefreshCw className={cn('w-4 h-4', calculating && 'animate-spin')} />
                {calculating ? 'A calcular...' : 'Simular Cálculo'}
              </button>
            </div>
          </CardHeader>
          <div className="divide-y divide-gray-50">
            {dataSources.map((source, i) => (
              <div
                key={source.id}
                className={cn(
                  'px-6 py-4 flex items-center gap-4 transition-colors duration-300',
                  activeStep === 0 && i <= 3 && 'bg-blue-50/50'
                )}
              >
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full flex-shrink-0',
                  source.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'
                )} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-umain-text">{source.name}</p>
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded font-bold',
                      source.viability === 'H' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {source.viability}
                    </span>
                  </div>
                  <p className="text-xs text-umain-muted">{source.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-umain-text">{source.records}</p>
                  <p className="text-xs text-umain-muted">Sync: {source.lastSync}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Done state */}
        {done && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Cálculo concluído com sucesso</p>
                <p className="text-xs text-emerald-600">1.247 estudantes processados · 8 alertas gerados · 15 Fev 2026 — 09:30</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
```

**Step 2: Verify in browser** — pipeline page loads, "Simular Cálculo" button triggers animated BMAD walkthrough.

**Step 3: Commit**

```bash
git add src/pages/Pipeline.tsx
git commit -m "feat: implement Pipeline page with BMAD visualization and simulation"
```

---

## Task 9: Final Polish

**Files:**
- Modify: `src/index.css` — add Inter font import
- Modify: `tailwind.config.js` — verify umain colors work with Tailwind v4

**Step 1: Add Inter font to `index.html`**

Add in `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

**Step 2: Update `tailwind.config.js` for Tailwind v4 compatibility**

Tailwind v4 uses CSS-based config. Move theme colors to `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --color-umain-primary: #0f172a;
  --color-umain-secondary: #334155;
  --color-umain-accent: #2563eb;
  --color-umain-background: #f8fafc;
  --color-umain-surface: #ffffff;
  --color-umain-text: #0f172a;
  --color-umain-muted: #64748b;
  --color-risk-low: #10b981;
  --color-risk-medium: #f59e0b;
  --color-risk-high: #ef4444;
}

* { box-sizing: border-box; }
body { font-family: var(--font-sans); margin: 0; }
```

**Step 3: Final build check**

```bash
npm run build
```
Expected: Clean build, no TypeScript errors, no Tailwind warnings.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete RiskRadar demo — Dashboard, Student Profile, Pipeline"
```

---

## Done

Run `npm run dev` and open `http://localhost:5173`. The demo should show:
- `/dashboard` — Operational dashboard with KPIs, student table, risk chart, alerts
- `/students/4` — Pedro Santos' high-risk profile with radar chart and intervention history
- `/pipeline` — BMAD visualization with animated simulation button
