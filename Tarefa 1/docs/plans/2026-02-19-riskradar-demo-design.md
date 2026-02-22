# RiskRadar Demo — Design Document
**Date:** 2026-02-19
**Product:** RiskRadar (Lumina Suite — UMAIN Works)
**Client context:** Universidade X (generic demo for Rector-level sales pitch)
**Goal:** Functional frontend demo + high-fidelity mockup showing the full BMAD cycle

---

## 1. Overview

Build a React + TypeScript SPA that demonstrates RiskRadar — a student dropout risk monitoring platform. The demo must look like production software, use realistic Portuguese university data (no Lorem Ipsum), follow Umain brand colors, and guide the viewer through the BMAD methodology (Business → Model → Analysis → Decision).

---

## 2. Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Redirect | → `/dashboard` |
| `/dashboard` | Dashboard | Course Director view — student list + risk distribution |
| `/students/:id` | Student Profile | Individual risk breakdown + intervention history |
| `/pipeline` | Data Pipeline | Animated ingestion flow + BMAD visualization |

---

## 3. Layout Shell

Persistent across all pages:
- **Left sidebar** (240px): RiskRadar logo, nav links (Dashboard, Pipeline, Alertas), user info (role: Diretor de Curso — Eng. Informática)
- **Top bar**: notification bell with active alert count, last sync timestamp, breadcrumb
- **Main content area**: scrollable

---

## 4. Pages

### 4.1 Dashboard (`/dashboard`)

**KPI row (4 cards):**
- Total students monitored
- High risk (score 61–100) — red
- Medium risk (score 41–60) — amber
- Interventions this month — blue

**Main content split:**
- Left 2/3: Sortable/filterable student table
  - Columns: Name, Course, Year, Risk Score (progress bar), Level badge, Last Updated, Action button
  - Filters: Course dropdown, Risk level dropdown
- Right 1/3:
  - Recharts donut chart — risk distribution
  - 3 most recent alert cards (student name, trigger reason, timestamp)

### 4.2 Student Profile (`/students/:id`)

**Header:** Student name, number, course, year, status tags (e.g. "Bolseiro", "Trabalhador-Estudante")

**Risk score hero:** Large circular gauge (0–100), level badge, score trend arrow (↑ improved / ↓ worsened)

**4 indicator panels (grid 2×2):**
- Académico: attendance %, UC failures, negative grades
- Financeiro: tuition arrears (months), scholarship status
- Comportamental (Moodle): login frequency, downloads, last access
- Socioeconómico: entry profile, residence, NEE status

**Recharts radar chart:** visual overlay of all 4 dimensions

**Intervention timeline** (bottom): history of actions taken + recommended next action card

### 4.3 Pipeline (`/pipeline`)

**Animated data flow diagram:**
```
ERP Académico    ──┐
Tesouraria/SAS   ──┤──→ [Observatório do Estudante] ──→ Score ──→ Alert ──→ Dashboard
Plat. Sumários   ──┤     Central DB + Rules Engine
Moodle           ──┘
```

- Each source shows "last sync" timestamp and status (OK/Warning)
- "Simular Cálculo" button triggers fake recalculation animation with progress
- BMAD labels overlaid: Business (sources) → Model (engine) → Analysis (score) → Decision (alert)

---

## 5. Mock Data

All data in `src/data/`. Realistic IPTomar-style content:
- Courses: Engenharia Informática, Gestão de Empresas, Enfermagem, Design de Comunicação, Contabilidade
- ~20 students with Portuguese names, varied risk profiles
- Risk scores 0–100 with realistic contributing factors
- Intervention history entries

---

## 6. Tech Decisions

- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- Recharts for donut + radar charts
- React Router v7 for navigation
- Lucide React for icons
- All Umain brand colors via Tailwind config (already set up)
- No backend — pure mock data, all in-browser

---

## 7. File Structure

```
src/
  components/
    layout/        ← Sidebar, TopBar, Layout wrapper
    ui/            ← Badge, Card, KpiCard, RiskBadge, ScoreBar
  pages/
    Dashboard.tsx
    StudentProfile.tsx
    Pipeline.tsx
  data/
    students.ts    ← mock student records
    alerts.ts      ← mock alert feed
  lib/
    utils.ts       ← cn() helper
    riskUtils.ts   ← score → level/color helpers
  App.tsx          ← router setup
```
