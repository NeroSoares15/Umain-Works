import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent } from '../components/ui/Card'
import { ChartFrame } from '../components/ui/ChartFrame'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { students } from '../data/students'
import { getStudentRiskSnapshot } from '../lib/studentRisk'
import { useAppContext } from '../contexts/useAppContext'

interface CourseDistribution {
  name: string
  high: number
  medium: number
  low: number
  none: number
}

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">{children}</p>
}

const PIE_COLORS: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6', none: '#10b981' }

export function Analysis() {
  const { settings } = useAppContext()

  // Aggregate student data by course
  const courseData = students.reduce((acc, student) => {
    const course = student.course
    const { level } = getStudentRiskSnapshot(student, settings)
    
    if (!acc[course]) {
      acc[course] = { name: course, high: 0, medium: 0, low: 0, none: 0 }
    }
    acc[course][level] += 1
    return acc
  }, {} as Record<string, CourseDistribution>)

  const chartData = Object.values(courseData)

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen">
      <TopBar title="Análise por Curso" subtitle="Distribuição de risco entre os departamentos" />
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-auto relative z-10 w-full max-w-[1920px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label>Heatmap de Risco por Curso</Label>
          <Card className="flex-1 min-h-[500px] flex flex-col justify-center p-6">
            <CardContent className="w-full pt-4">
              <ChartFrame className="h-[450px]">
                {({ height, width }) => (
                <BarChart
                  width={width}
                  height={height}
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <defs>
                    <linearGradient id="barHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PIE_COLORS.high} stopOpacity={1} />
                      <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="barMedium" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PIE_COLORS.medium} stopOpacity={1} />
                      <stop offset="100%" stopColor="#78350f" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="barLow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PIE_COLORS.low} stopOpacity={1} />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="barNone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PIE_COLORS.none} stopOpacity={1} />
                      <stop offset="100%" stopColor="#064e3b" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3035" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    tickMargin={15}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    tickMargin={10}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#ffffff', opacity: 0.05 }}
                    contentStyle={{ backgroundColor: 'rgba(2, 8, 23, 0.7)', backdropFilter: 'blur(16px)', borderColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', padding: '16px' }} 
                    itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }} 
                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }} 
                    iconType="circle"
                  />
                  <Bar dataKey="high" name="Risco Alto" stackId="a" fill="url(#barHigh)" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="medium" name="Risco Médio" stackId="a" fill="url(#barMedium)" />
                  <Bar dataKey="low" name="Risco Baixo" stackId="a" fill="url(#barLow)" />
                  <Bar dataKey="none" name="Sem Risco" stackId="a" fill="url(#barNone)" radius={[4, 4, 0, 0]} />
                </BarChart>
                )}
              </ChartFrame>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
