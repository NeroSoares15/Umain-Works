import { Card, CardContent } from '../components/ui/Card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { BrainCircuit, TrendingUp } from 'lucide-react'
import { KpiCard } from '../components/ui/KpiCard'

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">{children}</p>
}

const mockData = [
  { month: 'Set', historico: 100, otimizado: 100 },
  { month: 'Out', historico: 98, otimizado: 99 },
  { month: 'Nov', historico: 95, otimizado: 98 },
  { month: 'Dez', historico: 92, otimizado: 97 },
  { month: 'Jan', historico: 88, otimizado: 96 },
  { month: 'Fev', historico: 85, otimizado: 94 },
  { month: 'Mar', historico: 80, otimizado: 92 },
  { month: 'Abr', historico: 78, otimizado: 91 },
  { month: 'Mai', historico: 75, otimizado: 90 },
  { month: 'Jun', historico: 71, otimizado: 88 },
]

export function Prediction() {
  return (
    <div className="flex-1 flex flex-col h-full min-h-screen">
      <main className="flex-1 px-4 pb-4 md:px-6 md:pb-6 lg:px-10 lg:pb-10 pt-4 overflow-auto relative z-10 w-full max-w-[1920px] mx-auto flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <KpiCard 
            title="Previsão de Retenção (Sem Intervenção)" 
            value="71%" 
            subtitle="Baseado no histórico dos últimos 5 anos" 
            icon={TrendingUp} 
            iconColor="text-red-500" 
            iconBg="bg-transparent" 
          />
          <KpiCard 
            title="Previsão de Retenção (Otimizada)" 
            value="88%" 
            subtitle="Com intervenção guiada por RiskRadar" 
            icon={BrainCircuit} 
            iconColor="text-emerald-500" 
            iconBg="bg-transparent" 
          />
        </div>

        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
          <Label>Curva de Abandono (Histórico vs. Otimizado com RiskRadar)</Label>
          <Card className="flex-1 min-h-[500px] flex flex-col justify-center p-6 bg-umain-surface/50 border border-umain-border/50">
            <CardContent className="h-[450px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockData}
                  margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorOtimizado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHistorico" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3035" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    tickMargin={15}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    tickMargin={10}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                    domain={[60, 100]}
                    width={45}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2, 8, 23, 0.7)', backdropFilter: 'blur(16px)', borderColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', padding: '16px' }} 
                    itemStyle={{ color: '#f8fafc', fontWeight: 'bold', paddingBottom: '4px' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }} 
                    iconType="circle"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="otimizado" 
                    name="Taxa Retenção Otimizada" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorOtimizado)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="historico" 
                    name="Taxa Retenção Histórica" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorHistorico)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
