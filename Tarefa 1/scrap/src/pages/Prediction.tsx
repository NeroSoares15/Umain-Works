import type { ApexOptions } from 'apexcharts'
import { BrainCircuit, TrendingUp } from 'lucide-react'
import { ApexChart } from '../components/charts/ApexChart'
import { Card, CardContent } from '../components/ui/Card'
import { KpiCard } from '../components/ui/KpiCard'
import { chartColors } from '../lib/chartColors'

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
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Manrope, Arial, sans-serif',
    },
    colors: [chartColors.green, chartColors.red],
    stroke: {
      curve: 'smooth',
      width: 3,
      dashArray: [0, 5],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.3,
        opacityTo: 0,
        stops: [5, 95],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#2D3035',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: mockData.map((item) => item.month),
      labels: {
        style: {
          colors: mockData.map(() => '#94a3b8'),
          fontSize: '11px',
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 60,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (value) => `${value}%`,
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
        formatter: (value) => `${value}%`,
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
        <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 md:grid-cols-2 md:gap-6">
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

        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100 fill-mode-both">
          <Label>Curva de Abandono (Histórico vs. Otimizado com RiskRadar)</Label>
          <Card className="flex min-h-[500px] flex-1 flex-col justify-center border border-umain-border/50 bg-umain-surface/50 p-6">
            <CardContent className="h-[450px] w-full pt-4">
              <ApexChart
                type="area"
                height={450}
                series={[
                  { name: 'Taxa Retenção Otimizada', data: mockData.map((item) => item.otimizado) },
                  { name: 'Taxa Retenção Histórica', data: mockData.map((item) => item.historico) },
                ]}
                options={chartOptions}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
