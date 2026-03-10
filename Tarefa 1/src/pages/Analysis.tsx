import { Card, CardContent } from '../components/ui/Card'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { students } from '../data/students'
import { scoreToLevel } from '../lib/riskUtils'
import { useAppContext } from '../contexts/AppContext'

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">{children}</p>
}

const COLORS = {
  high: '#ef4444', 
  medium: '#f59e0b', 
  low: '#3b82f6', 
  none: '#10b981'
}

function CustomizedContent(props: any) {
  const { depth, x, y, width, height, payload, name } = props

  // Ensure robust rendering even if width/height are zero
  const safeWidth = Math.max(0, width || 0);
  const safeHeight = Math.max(0, height || 0);

  if (safeWidth <= 0 || safeHeight <= 0) return null;

  if (depth === 1) {
    // Course Container Box
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={safeWidth}
          height={safeHeight}
          fill="rgba(243, 244, 246, 0.4)"
          stroke="#e5e7eb"
          strokeWidth={2}
        />
        {safeWidth > 60 && safeHeight > 30 && (
          <text 
            x={x + 6} 
            y={y + 18} 
            fill="#4b5563" 
            fontSize={11} 
            fontWeight={700} 
            style={{ 
              pointerEvents: 'none', 
              textTransform: 'uppercase',
              textShadow: '0px 0px 4px rgba(255,255,255,1)'
            }}
          >
            {name ? String(name).substring(0, Math.max(0, Math.floor(safeWidth / 7))) : ''}
            {name && String(name).length > Math.floor(safeWidth / 7) ? '...' : ''}
          </text>
        )}
      </g>
    )
  }

  if (depth === 2 || depth === 3) {
    // Leaf node: Student block (handling varying depths just in case)
    const risk = props.risk || payload?.risk || 'none'
    const color = COLORS[risk as keyof typeof COLORS] || '#ccc'
    
    const inset = 1
    return (
      <g>
        <rect
          x={x + inset}
          y={y + inset}
          width={Math.max(0, safeWidth - inset * 2)}
          height={Math.max(0, safeHeight - inset * 2)}
          style={{
            fill: color,
            fillOpacity: 1,
            stroke: '#ffffff',
            strokeWidth: Math.min(safeWidth, safeHeight) > 10 ? 1 : 0,
            cursor: 'crosshair',
          }}
        />
      </g>
    )
  }

  // Root fallback or unhandled depths
  return (
      <rect x={x} y={y} width={safeWidth} height={safeHeight} fill="transparent" stroke="none" />
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    if (data.risk) {
      return (
        <div className="bg-white border border-umain-border p-3 rounded-xl shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] z-50 min-w-[200px]">
          <p className="text-[10px] font-bold text-umain-text-muted uppercase tracking-wider mb-2">{data.course}</p>
          <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[data.risk as keyof typeof COLORS] }} />
                <p className="text-[13px] font-bold text-umain-text">{data.name}</p>
             </div>
             <p className="text-xs font-bold bg-umain-background px-2 py-1 rounded-md text-umain-text border border-umain-border">{data.size} {data.size === 1 ? 'aluno' : 'alunos'}</p>
          </div>
        </div>
      )
    }
  }
  return null
}

export function Analysis() {
  const { settings } = useAppContext()

  const courseData = students.reduce((acc, student) => {
    const course = student.course
    const level = scoreToLevel(student.riskScore, settings.riskThresholds)
    
    if (!acc[course]) {
      acc[course] = { 
        name: course, 
        counts: { high: 0, medium: 0, low: 0, none: 0 }
      }
    }
    
    acc[course].counts[level] += 1
    return acc
  }, {} as Record<string, any>)

  // Wrap in a single root node for robust Treemap rendering in Recharts 3.x
  const chartData = [{
    name: 'Escola',
    children: Object.values(courseData).map((course: any) => ({
      name: course.name,
      children: [
        ...(course.counts.high > 0 ? [{ name: 'Risco Alto', size: course.counts.high, risk: 'high', course: course.name }] : []),
        ...(course.counts.medium > 0 ? [{ name: 'Risco Médio', size: course.counts.medium, risk: 'medium', course: course.name }] : []),
        ...(course.counts.low > 0 ? [{ name: 'Risco Baixo', size: course.counts.low, risk: 'low', course: course.name }] : []),
        ...(course.counts.none > 0 ? [{ name: 'Sem Risco', size: course.counts.none, risk: 'none', course: course.name }] : [])
      ]
    }))
  }]

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen">
      <main className="flex-1 px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 pt-4 overflow-auto bg-umain-background relative z-10 w-full max-w-[1920px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label>Heatmap de Risco (Visão Micro)</Label>
          <Card className="flex-1 min-h-[500px] flex flex-col p-6">
            
            <div className="flex flex-wrap items-center gap-4 mb-4 mt-2 pl-2">
              <span className="text-xs font-bold text-umain-text-muted uppercase tracking-wider mr-2">Legenda:</span>
              {Object.entries({ high: 'Risco Alto', medium: 'Risco Médio', low: 'Risco Baixo', none: 'Sem Risco' }).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: COLORS[key as keyof typeof COLORS] }} />
                      <span className="text-xs font-semibold text-umain-text">{label}</span>
                  </div>
              ))}
            </div>

            <CardContent className="w-full p-0 h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={chartData}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  content={<CustomizedContent />}
                  animationDuration={800}
                >
                  <Tooltip content={<CustomTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
