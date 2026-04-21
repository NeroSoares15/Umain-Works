import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { scoreToLevel } from '../lib/riskUtils'
import { students } from '../data/students'
import { useAppContext } from '../contexts/AppContext'
import { cn } from '../lib/utils'

function obfuscateName(name: string, isObscured: boolean) {
  if (!isObscured) return name
  return name
    .split(' ')
    .map((part) => `${part[0]}***`)
    .join(' ')
}

function radarPoint(index: number, radius: number, center: number, value: number) {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / 5
  return {
    x: center + radius * value * Math.cos(angle),
    y: center + radius * value * Math.sin(angle),
  }
}

function radarPolygon(scale: number, radius: number, center: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const point = radarPoint(index, radius, center, scale)
    return `${point.x},${point.y}`
  }).join(' ')
}

function RadarMesh() {
  const center = 105
  const radius = 72

  return (
    <svg viewBox="0 0 210 210" className="mx-auto h-[210px] w-full max-w-[220px]">
      {[1, 0.8, 0.6, 0.4, 0.2].map((scale) => (
        <polygon
          key={scale}
          points={radarPolygon(scale, radius, center)}
          fill="none"
          stroke="#20201f"
          strokeOpacity={0.8}
          strokeWidth={1}
        />
      ))}

      {Array.from({ length: 5 }, (_, index) => {
        const point = radarPoint(index, radius, center, 1)
        return <line key={index} x1={center} y1={center} x2={point.x} y2={point.y} stroke="#20201f" strokeWidth={1} />
      })}
    </svg>
  )
}

function ProfilePanel({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="border-b border-[#e8e1d4] bg-[#ececec] px-4 py-3 text-[13px] font-medium text-[#2f2d2a]">{title}</div>
      <div className="p-4">{children}</div>
    </Card>
  )
}

function ProfileField({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: string
  tone?: 'default' | 'accent' | 'danger' | 'muted'
}) {
  const toneClassName =
    tone === 'accent'
      ? 'text-[#2f9d49]'
      : tone === 'danger'
        ? 'text-[#e3312d]'
        : tone === 'muted'
          ? 'text-[#726d67]'
          : 'text-[#2d2b28]'

  return (
    <div className="flex items-center justify-between gap-4 py-2 text-[13px]">
      <span className="text-[#3b3834]">{label}</span>
      <span className={cn('text-right font-medium', toneClassName)}>{value}</span>
    </div>
  )
}

export function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activeProfileId, settings } = useAppContext()
  const student = students.find((candidate) => candidate.id === id)
  const isObservatoryView = activeProfileId === 'obs'

  if (!student) {
    return (
      <div className="px-5 py-5">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#5c5852]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao dashboard
        </button>
      </div>
    )
  }

  const riskLevel = scoreToLevel(student.riskScore, settings.riskThresholds)
  const riskColor = riskLevel === 'high' ? '#e3312d' : riskLevel === 'medium' ? '#d8a127' : riskLevel === 'low' ? '#bf623b' : '#2f9d49'
  const riskBadgeClassName =
    riskLevel === 'high'
      ? 'bg-[#fde7e5] text-[#a54a44]'
      : riskLevel === 'medium'
        ? 'bg-[#fbf1d4] text-[#8f6b1f]'
        : riskLevel === 'low'
          ? 'bg-[#f7ece1] text-[#8b5b39]'
          : 'bg-[#e8f6eb] text-[#2f7f43]'

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ece4d8] bg-white px-5 py-5">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-4 text-[16px] font-medium text-[#6b6761]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium text-[#6b6761]">Dashboard</span>
          <span>/</span>
          <span className="font-semibold text-[#2d2b28]">{obfuscateName(student.name, isObservatoryView)}</span>
        </button>
      </div>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-4 py-5">
        <Card className="bg-white p-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[330px_minmax(0,1fr)_350px]">
            <ProfilePanel title="Nível de Risco">
              <div className="flex h-full items-center justify-center gap-8 py-4">
                <div className="relative flex h-[132px] w-[132px] items-center justify-center">
                  <svg viewBox="0 0 132 132" className="absolute inset-0 h-full w-full -rotate-90">
                    <circle cx="66" cy="66" r="56" stroke="#f3f0ea" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="66"
                      cy="66"
                      r="56"
                      stroke={riskColor}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={351.85}
                      strokeDashoffset={351.85 - (351.85 * student.riskScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[54px] font-semibold leading-none text-[#161513]">{student.riskScore}</span>
                    <span className="mt-1 text-[16px] font-semibold text-[#2d2b28]">/100</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className={cn('inline-flex rounded-[4px] px-3 py-2 text-[16px] font-medium', riskBadgeClassName)}>
                    {riskLevel === 'high' ? 'Risco Alto' : riskLevel === 'medium' ? 'Risco Médio' : riskLevel === 'low' ? 'Risco Baixo' : 'Sem Risco'}
                  </span>
                  <span className="text-[16px] font-semibold uppercase tracking-tight text-[#e3312d]">A AGRAVAR ^</span>
                </div>
              </div>
            </ProfilePanel>

            <ProfilePanel title="Informações do Aluno">
              <div className="space-y-3 pt-1">
                <ProfileField label="Nome" value={obfuscateName(student.name, isObservatoryView)} tone="accent" />
                <ProfileField label="Número" value={isObservatoryView ? '***' : student.number} tone="accent" />
                <ProfileField label="Curso" value={student.course} tone="accent" />
                <ProfileField label="Ano Curricular" value={`${student.year}º Ano`} tone="accent" />
              </div>
            </ProfilePanel>

            <ProfilePanel title="Análise Multidimensional">
              <RadarMesh />
            </ProfilePanel>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ProfilePanel title="Indicadores Académicos">
              <ProfileField label="Assiduidade" value={`${student.indicators.academic.attendancePercent}%`} tone="danger" />
              <ProfileField label="UCs com Negativa" value={`${student.indicators.academic.ucFailures}`} tone="danger" />
              <ProfileField label="Notas Negativas" value={`${student.indicators.academic.negativeGrades}`} tone="danger" />
              <ProfileField label="Média Global" value={`${student.indicators.academic.gpa.toFixed(1)} valores`} tone="danger" />
            </ProfilePanel>

            <ProfilePanel title="Indicadores Financeiros">
              <ProfileField label="Impacto Mensal (ROI)" value={`€${student.indicators.financial.monthlyFee}`} tone="accent" />
              <ProfileField
                label="Propinas em Atraso"
                value={`${student.indicators.financial.tuitionArrearsMonths} meses`}
                tone="danger"
              />
              <ProfileField
                label="Bolsa de Estudo"
                value={student.indicators.financial.scholarshipStatus === 'Nao Bolseiro' ? 'Não Bolseiro' : student.indicators.financial.scholarshipStatus}
                tone="muted"
              />
              <ProfileField label="Acordo de Pagamento" value={student.indicators.financial.paymentAgreement ? 'Sim' : 'Não'} tone="muted" />
            </ProfilePanel>

            <ProfilePanel title="Atividade Moodle">
              <ProfileField label="Primeiro Acesso" value={student.indicators.behavioral.firstAccessLabel} tone="danger" />
              <ProfileField label="Último Acesso" value={`Há ${student.indicators.behavioral.daysSinceLastAccess} dias`} tone="danger" />
            </ProfilePanel>

            <ProfilePanel title="Contexto Socioeconómico">
              <ProfileField label="Perfil de Entrada" value={student.indicators.socioeconomic.entryProfile} tone="accent" />
              <ProfileField label="Residência" value={student.indicators.socioeconomic.residence} tone="muted" />
              <ProfileField label="NEE" value={student.indicators.socioeconomic.nee ? 'Sim' : 'Não'} tone="muted" />
            </ProfilePanel>
          </div>
        </Card>
      </main>
    </div>
  )
}
