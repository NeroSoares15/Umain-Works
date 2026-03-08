import { useState } from 'react'
import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calculator, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react'

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">{children}</p>
}

export function ROI() {
  const [successRate, setSuccessRate] = useState(40)
  const [tuition, setTuition] = useState({
    ctesp: 697,
    licenciatura: 697,
    mestrado: 1250,
    internacional: 3500
  })

  // Mock data for student distribution in High Risk
  const riskCounts = {
    ctesp: 45,
    licenciatura: 120,
    mestrado: 35,
    internacional: 25
  }

  // Derived calculations based on interactive inputs
  const calculateValorEmRisco = (count: number, fee: number) => count * fee
  const calculateValorRetido = (count: number, fee: number) => Math.round(count * fee * (successRate / 100))

  const chartData = [
    {
      name: 'CTeSP',
      emRisco: calculateValorEmRisco(riskCounts.ctesp, tuition.ctesp),
      retido: calculateValorRetido(riskCounts.ctesp, tuition.ctesp),
    },
    {
      name: 'Licenciatura',
      emRisco: calculateValorEmRisco(riskCounts.licenciatura, tuition.licenciatura),
      retido: calculateValorRetido(riskCounts.licenciatura, tuition.licenciatura),
    },
    {
      name: 'Mestrado',
      emRisco: calculateValorEmRisco(riskCounts.mestrado, tuition.mestrado),
      retido: calculateValorRetido(riskCounts.mestrado, tuition.mestrado),
    },
    {
      name: 'Internacional',
      emRisco: calculateValorEmRisco(riskCounts.internacional, tuition.internacional),
      retido: calculateValorRetido(riskCounts.internacional, tuition.internacional),
    }
  ]

  const totalEmRisco = chartData.reduce((acc, curr) => acc + curr.emRisco, 0)
  const totalRetido = chartData.reduce((acc, curr) => acc + curr.retido, 0)

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen">
      <TopBar title="Gestão de ROI" subtitle="Simulador de Impacto Financeiro" />
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-auto relative z-10 w-full max-w-[1920px] mx-auto flex flex-col gap-6">

        {/* Dynamic KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <KpiCard
            title="Receita em Risco (Anual)"
            value={`€${totalEmRisco.toLocaleString()}`}
            subtitle="Acumulado - propinas de alunos em risco alto"
            icon={DollarSign}
            iconColor="text-red-500"
            iconBg="bg-transparent"
          />
          <KpiCard
            title="Receita Recuperada (Est.)"
            value={`€${totalRetido.toLocaleString()}`}
            subtitle={`Com taxa de eficácia de ${successRate}% na intervenção`}
            icon={ShieldCheck}
            iconColor="text-emerald-500"
            iconBg="bg-transparent"
          />
          <KpiCard
            title="Multiplicador RiskRadar"
            value={`${(totalRetido / 15000).toFixed(1)}x`}
            subtitle="ROI estimado sobre o custo do software"
            icon={TrendingUp}
            iconColor="text-umain-accent"
            iconBg="bg-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
          
          {/* Calculadora (Inputs) */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <Label>Calculadora de Parâmetros</Label>
            <Card className="flex-1 h-full shadow-lg border-umain-border/50">
              <CardContent className="p-6 md:p-8 space-y-8 flex flex-col h-full">
                <div className="flex items-center gap-3 border-b border-umain-border/50 pb-4">
                  <div className="w-8 h-8 rounded bg-umain-accent/10 flex items-center justify-center shrink-0">
                    <Calculator className="w-4 h-4 text-umain-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">Variáveis de Simulação</h3>
                    <p className="text-[10px] text-umain-text-muted mt-0.5">Defina taxas e valores base anuais.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-semibold text-umain-text-muted">Eficácia da Intervenção (%)</label>
                    <span className="text-lg font-black text-white">{successRate}%</span>
                  </div>
                  <input
                    type="range" min="10" max="90" value={successRate}
                    onChange={(e) => setSuccessRate(parseInt(e.target.value))}
                    className="w-full accent-umain-accent cursor-pointer"
                  />
                  <p className="text-[10px] text-umain-text-muted/60 mt-1">Estimativa de percentagem de alunos que não abandonam após ação dos SAS.</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-umain-border/50">
                  <label className="text-xs font-semibold text-umain-text-muted mb-2 block">Propinas Anuais (€) por Grau</label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-umain-text-muted/70 tracking-widest">CTeSP</span>
                      <input 
                        type="number" 
                        value={tuition.ctesp} 
                        onChange={e => setTuition(p => ({ ...p, ctesp: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-umain-surface border border-umain-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-umain-accent" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-umain-text-muted/70 tracking-widest">Licenciatura</span>
                      <input 
                        type="number" 
                        value={tuition.licenciatura} 
                        onChange={e => setTuition(p => ({ ...p, licenciatura: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-umain-surface border border-umain-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-umain-accent" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-umain-text-muted/70 tracking-widest">Mestrado</span>
                      <input 
                        type="number" 
                        value={tuition.mestrado} 
                        onChange={e => setTuition(p => ({ ...p, mestrado: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-umain-surface border border-umain-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-umain-accent" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-umain-text-muted/70 tracking-widest">Internancional</span>
                      <input 
                        type="number" 
                        value={tuition.internacional} 
                        onChange={e => setTuition(p => ({ ...p, internacional: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-umain-surface border border-umain-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-umain-accent" 
                      />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Visualization (Chart) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <Label>Retenção vs Risco Bruto (Euros)</Label>
            <Card className="flex-1 flex flex-col h-full bg-umain-surface/30">
              <CardContent className="flex-1 p-6 lg:p-8">
                <div style={{ width: '100%', height: '400px' }}>
                  <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="roiRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                        <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="roiGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#064e3b" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3035" vertical={false} />
                    <XAxis 
                      dataKey="name" 
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
                      tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#ffffff', opacity: 0.05 }}
                      contentStyle={{ backgroundColor: 'rgba(2, 8, 23, 0.7)', backdropFilter: 'blur(16px)', borderColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', padding: '16px' }} 
                      itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }} 
                      labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}
                      formatter={(value: any) => [`€${Number(value).toLocaleString()}`, '']}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }} 
                      iconType="circle"
                    />
                    <Bar dataKey="emRisco" name="Receita em Risco" fill="url(#roiRed)" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="retido" name="Receita Preservada" fill="url(#roiGreen)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
