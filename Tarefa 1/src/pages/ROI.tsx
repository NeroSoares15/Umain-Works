import { useState } from 'react'
import type { ApexOptions } from 'apexcharts'
import { Calculator, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react'
import { ApexChart } from '../components/charts/ApexChart'
import { Card, CardContent } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { chartColors } from '../lib/chartColors'

function Label({ children }: { children: string }) {
  return <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">{children}</p>
}

export function ROI() {
  const [successRate, setSuccessRate] = useState(40)
  const [tuition, setTuition] = useState({
    ctesp: 697,
    licenciatura: 697,
    mestrado: 1250,
    internacional: 3500,
  })

  const riskCounts = {
    ctesp: 45,
    licenciatura: 120,
    mestrado: 35,
    internacional: 25,
  }

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
    },
  ]

  const totalEmRisco = chartData.reduce((acc, curr) => acc + curr.emRisco, 0)
  const totalRetido = chartData.reduce((acc, curr) => acc + curr.retido, 0)

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    colors: [chartColors.red, chartColors.green],
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        columnWidth: '48%',
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#2D3035',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: chartData.map((item) => item.name),
      labels: {
        style: {
          colors: chartData.map(() => '#94a3b8'),
          fontSize: '11px',
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `€${Math.round(value / 1000)}k`,
        style: {
          colors: ['#94a3b8'],
          fontSize: '11px',
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `€${Number(value).toLocaleString()}`,
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      labels: { colors: '#94a3b8' },
      markers: { size: 10 },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } },
    },
  }

  return (
    <div className="flex-1 flex min-h-screen flex-col">
      <main className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-1 flex-col gap-6 overflow-auto px-4 pt-4 pb-4 md:px-6 md:pb-6 lg:px-10 lg:pb-10">
        <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 sm:grid-cols-3 md:gap-6">
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

        <div className="grid grid-cols-1 gap-6 pt-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100 fill-mode-both lg:grid-cols-3">
          <div className="flex flex-col gap-3 lg:col-span-1">
            <Label>Calculadora de Parâmetros</Label>
            <Card className="h-full flex-1 border-umain-border/50 shadow-lg">
              <CardContent className="flex h-full flex-col space-y-8 p-6 md:p-8">
                <div className="flex items-center gap-3 border-b border-umain-border/50 pb-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-umain-accent/10">
                    <Calculator className="h-4 w-4 text-umain-accent" />
                  </div>
                  <div>
                    <h3 className="leading-tight font-bold text-umain-text">Variáveis de Simulação</h3>
                    <p className="mt-0.5 text-[10px] text-umain-text-muted">Defina taxas e valores base anuais.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <label className="text-xs font-semibold text-umain-text-muted">Eficácia da Intervenção (%)</label>
                    <span className="text-lg font-black text-umain-text">{successRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={successRate}
                    onChange={(event) => setSuccessRate(parseInt(event.target.value, 10))}
                    className="w-full cursor-pointer accent-umain-accent"
                  />
                  <p className="mt-1 text-[10px] text-umain-text-muted/60">
                    Estimativa de percentagem de alunos que não abandonam após ação dos SAS.
                  </p>
                </div>

                <div className="space-y-4 border-t border-umain-border/50 pt-4">
                  <label className="mb-2 block text-xs font-semibold text-umain-text-muted">Propinas Anuais (€) por Grau</label>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-widest text-umain-text-muted/70 uppercase">CTeSP</span>
                      <input
                        type="number"
                        value={tuition.ctesp}
                        onChange={(event) => setTuition((previous) => ({ ...previous, ctesp: parseInt(event.target.value, 10) || 0 }))}
                        className="w-full rounded-lg border border-umain-border bg-umain-background px-3 py-2 text-sm font-mono text-umain-text focus:border-umain-accent focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-widest text-umain-text-muted/70 uppercase">Licenciatura</span>
                      <input
                        type="number"
                        value={tuition.licenciatura}
                        onChange={(event) =>
                          setTuition((previous) => ({ ...previous, licenciatura: parseInt(event.target.value, 10) || 0 }))
                        }
                        className="w-full rounded-lg border border-umain-border bg-umain-background px-3 py-2 text-sm font-mono text-umain-text focus:border-umain-accent focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-widest text-umain-text-muted/70 uppercase">Mestrado</span>
                      <input
                        type="number"
                        value={tuition.mestrado}
                        onChange={(event) => setTuition((previous) => ({ ...previous, mestrado: parseInt(event.target.value, 10) || 0 }))}
                        className="w-full rounded-lg border border-umain-border bg-umain-background px-3 py-2 text-sm font-mono text-umain-text focus:border-umain-accent focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-widest text-umain-text-muted/70 uppercase">Internacional</span>
                      <input
                        type="number"
                        value={tuition.internacional}
                        onChange={(event) =>
                          setTuition((previous) => ({ ...previous, internacional: parseInt(event.target.value, 10) || 0 }))
                        }
                        className="w-full rounded-lg border border-umain-border bg-umain-background px-3 py-2 text-sm font-mono text-umain-text focus:border-umain-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-2">
            <Label>Retenção vs Risco Bruto (Euros)</Label>
            <Card className="flex h-full flex-1 flex-col bg-umain-surface/30">
              <CardContent className="flex-1 p-6 lg:p-8">
                <ApexChart
                  type="bar"
                  height={400}
                  series={[
                    { name: 'Receita em Risco', data: chartData.map((item) => item.emRisco) },
                    { name: 'Receita Preservada', data: chartData.map((item) => item.retido) },
                  ]}
                  options={chartOptions}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
