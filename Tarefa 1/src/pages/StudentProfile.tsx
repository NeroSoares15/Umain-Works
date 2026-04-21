import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Monitor, ShieldAlert } from 'lucide-react'
import { students } from '../data/students'
import { scoreToLevel } from '../lib/riskUtils'
import { cn } from '../lib/utils'
import { useState, useEffect } from 'react'
import { useAppContext } from '../contexts/AppContext'

function obfuscateName(name: string, isObs: boolean) {
  if (!isObs) return name
  const parts = name.split(' ')
  return `Estudante Anónimo #${parts[0].length}${parts[1]?.length || '0'}`
}

function TypewriterText({ text, delay = 0 }: { text: string, delay?: number }) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let currentIndex = 0
    setDisplayText('')
    setIsTyping(true)

    const startTyping = () => {
      timeout = setInterval(() => {
        if (currentIndex < text.length) {
          const char = text[currentIndex]
          setDisplayText((prev) => prev + char)
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(timeout)
        }
      }, 15)
    }

    const initialDelay = setTimeout(startTyping, delay)
    return () => { clearTimeout(initialDelay); clearInterval(timeout) }
  }, [text, delay])

  return (
    <span className="relative inline-block">
      {displayText}
      {isTyping && <span className="inline-block w-1.5 h-3 ml-0.5 bg-current animate-pulse align-middle" />}
    </span>
  )
}

function ProfileCard({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white border border-[#e5e7eb] shadow-sm flex flex-col items-stretch overflow-hidden rounded-xl h-full", className)}>
      <div className="bg-[#f9fafb] border-b border-[#e5e7eb] px-5 py-3">
        <h3 className="text-[13px] font-bold text-gray-800">{title}</h3>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}

function IndicatorListItem({ label, value, valueClass }: { label: string, value: string | number, valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-[13px] font-semibold text-gray-600 truncate mr-4">{label}</span>
      <span className={cn("text-[13px] font-bold text-right", valueClass || "text-gray-900")}>{value}</span>
    </div>
  )
}

export function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activeProfileId, settings } = useAppContext()
  const student = students.find(s => s.id === id)

  const isObs = activeProfileId === 'obs'
  const isDiretor = activeProfileId === 'diretor'

  if (!student) {
    return (
      <div className="p-8">
        <button onClick={() => navigate('/dashboard')} className="text-[#C15B38] text-sm flex items-center gap-1.5 font-bold">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <p className="mt-4 text-gray-500 font-medium">Estudante não encontrado.</p>
      </div>
    )
  }

  const level = scoreToLevel(student.riskScore, settings.riskThresholds)
  const TrendIcon = student.scoreTrend === 'up' ? TrendingUp : student.scoreTrend === 'down' ? TrendingDown : Minus
  const trendColor = student.scoreTrend === 'up' ? 'text-red-500' : student.scoreTrend === 'down' ? 'text-emerald-500' : 'text-gray-400'
  const { indicators: ind } = student

  // Circular progress math
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (student.riskScore / 100) * circumference
  
  const riskColor = level === 'high' ? '#ef4444' : level === 'medium' ? '#f59e0b' : level === 'low' ? '#3b82f6' : '#10b981'
  const riskBgColor = level === 'high' ? 'bg-red-50 text-red-700 border-red-200' : level === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : level === 'low' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9fafb]">
      {/* Header Layout */}
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-6 lg:px-10">
        <div className="max-w-[1920px] mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#C15B38] transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{obfuscateName(student.name, isObs)}</h1>
              <p className="text-sm font-semibold text-gray-500 mt-1">{`${student.course} · ${student.year}º Ano · ${isObs ? 'Nº Oculto' : 'Nº ' + student.number}`}</p>
            </div>
            {/* Buttons were removed per request */}
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-10 w-full max-w-[1920px] mx-auto flex flex-col gap-6">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="order-2 md:order-1 col-span-1 md:col-span-1">
            <ProfileCard title="Nível de Risco">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full py-2">
                <div className="relative w-36 h-36 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                    <circle 
                      cx="72" cy="72" r="64" stroke={riskColor} strokeWidth="12" fill="transparent" 
                      strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-900 leading-none">{student.riskScore}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-start gap-3">
                  <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold border", riskBgColor)}>
                    {level === 'high' ? 'Risco Alto' : level === 'medium' ? 'Risco Médio' : level === 'low' ? 'Risco Baixo' : 'Sem Risco'}
                  </span>
                  <div className={cn('flex items-center gap-1.5 text-[13px] font-bold', trendColor)}>
                    <TrendIcon className="w-4 h-4" />
                    {student.scoreTrend === 'up' ? 'A agravar' : student.scoreTrend === 'down' ? 'A melhorar' : 'Estável'}
                  </div>
                </div>
              </div>
            </ProfileCard>
          </div>

          <div className="order-1 md:order-2 col-span-1 md:col-span-2">
            <ProfileCard title="Informações do Aluno">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 mt-2">
                <IndicatorListItem label="Número" value={isObs ? 'Oculto' : student.number} />
                <IndicatorListItem label="Curso" value={student.course} />
                <IndicatorListItem label="Ano Curricular" value={`${student.year}º Ano`} />
                <IndicatorListItem label="Residência" value={isDiretor ? 'Acesso Restrito' : ind.socioeconomic.residence} />
                <IndicatorListItem label="Estatutos" value={student.statuses.length ? student.statuses.join(', ') : 'Nenhum'} />
              </div>
            </ProfileCard>
          </div>
        </div>

        {/* Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <ProfileCard title="Académicos">
            <div className="flex flex-col mt-2">
              <IndicatorListItem label="Assiduidade" value={`${ind.academic.attendancePercent}%`} valueClass={ind.academic.attendancePercent >= 75 ? 'text-emerald-600' : ind.academic.attendancePercent >= 50 ? 'text-amber-600' : 'text-red-600'} />
              <IndicatorListItem label="UCs com Negativa" value={`${ind.academic.ucFailures}`} valueClass={ind.academic.ucFailures === 0 ? 'text-emerald-600' : ind.academic.ucFailures <= 2 ? 'text-amber-600' : 'text-red-600'} />
              <IndicatorListItem label="Notas Negativas" value={`${ind.academic.negativeGrades}`} valueClass={ind.academic.negativeGrades === 0 ? 'text-emerald-600' : ind.academic.negativeGrades <= 2 ? 'text-amber-600' : 'text-red-600'} />
              <IndicatorListItem label="Média Global" value={`${ind.academic.gpa.toFixed(1)} val`} valueClass={ind.academic.gpa >= 13 ? 'text-emerald-600' : ind.academic.gpa >= 10 ? 'text-amber-600' : 'text-red-600'} />
            </div>
          </ProfileCard>

          <ProfileCard title="Financeiros">
            <div className="flex flex-col mt-2">
              {isDiretor ? (
                <div className="py-8 text-center flex flex-col items-center">
                   <ShieldAlert className="w-6 h-6 text-gray-300 mb-2" />
                   <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Acesso Restrito (SAS)</p>
                </div>
              ) : (
                <>
                  <IndicatorListItem label="Impacto Mensal" value={ind.financial.monthlyFee > 0 ? `€${ind.financial.monthlyFee}` : 'Financiado'} />
                  <IndicatorListItem label="Propinas em Atraso" value={ind.financial.tuitionArrearsMonths === 0 ? 'Regularizado' : `${ind.financial.tuitionArrearsMonths} meses`} valueClass={ind.financial.tuitionArrearsMonths === 0 ? 'text-emerald-600' : ind.financial.tuitionArrearsMonths <= 1 ? 'text-amber-600' : 'text-red-600'} />
                  <IndicatorListItem label="Bolsa de Estudo" value={ind.financial.scholarshipStatus} />
                  <IndicatorListItem label="Acordo de Pagamento" value={ind.financial.paymentAgreement ? 'Sim' : 'Não'} />
                </>
              )}
            </div>
          </ProfileCard>

          <ProfileCard title="Atividade Moodle">
            <div className="flex flex-col mt-2">
              <IndicatorListItem label="Acessos (30 dias)" value={`${ind.behavioral.moodleLoginsLast30Days}`} valueClass={ind.behavioral.moodleLoginsLast30Days >= 15 ? 'text-emerald-600' : ind.behavioral.moodleLoginsLast30Days >= 5 ? 'text-amber-600' : 'text-red-600'} />
              <IndicatorListItem label="Downloads" value={`${ind.behavioral.materialsDownloaded}`} valueClass={ind.behavioral.materialsDownloaded >= 10 ? 'text-emerald-600' : ind.behavioral.materialsDownloaded >= 3 ? 'text-amber-600' : 'text-red-600'} />
              <IndicatorListItem label="Último Acesso" value={`Há ${ind.behavioral.daysSinceLastAccess} dias`} valueClass={ind.behavioral.daysSinceLastAccess <= 3 ? 'text-emerald-600' : ind.behavioral.daysSinceLastAccess <= 7 ? 'text-amber-600' : 'text-red-600'} />
            </div>
          </ProfileCard>

          <ProfileCard title="Socioeconómico">
            <div className="flex flex-col mt-2">
              {isDiretor ? (
                <div className="py-8 text-center flex flex-col items-center">
                   <ShieldAlert className="w-6 h-6 text-gray-300 mb-2" />
                   <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Acesso Restrito (SAS)</p>
                </div>
              ) : (
                <>
                  <IndicatorListItem label="Perfil de Entrada" value={ind.socioeconomic.entryProfile} />
                  <IndicatorListItem label="Residência" value={ind.socioeconomic.residence} />
                  <IndicatorListItem label="NEE" value={ind.socioeconomic.nee ? 'Sim' : 'Não'} />
                </>
              )}
            </div>
          </ProfileCard>
        </div>

        {/* History and AI Narrative */}
        <ProfileCard title="Histórico e IA">
            {student.interventions.length === 0 ? (
              <p className="text-[13px] text-gray-500 font-medium">Sem intervenções registadas.</p>
            ) : (
              <div className="space-y-4">
                {student.interventions.map((intervention, i: number) => (
                  <div key={i} className="flex flex-col pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#C15B38] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">{intervention.type}</span>
                      <span className="text-xs font-semibold text-gray-400">{intervention.date} · {isObs ? 'Técnico(a)' : intervention.author}</span>
                    </div>
                    <p className="text-[13px] font-medium text-gray-700 leading-relaxed">
                      {isDiretor && (intervention.description.toLowerCase().includes('financeir') || intervention.description.toLowerCase().includes('apoio') || intervention.description.toLowerCase().includes('psico'))
                        ? 'Detalhes da intervenção de natureza confidencial mantidos em segredo (apenas SAS).'
                        : intervention.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className={cn("mt-6 p-4 rounded-xl border relative overflow-hidden", level === 'high' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200')}>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className={cn("w-4 h-4", level === 'high' ? 'text-red-500' : 'text-gray-700')} />
                <p className={cn("text-xs font-bold tracking-widest uppercase", level === 'high' ? 'text-red-600' : 'text-gray-700')}>
                  RiskRadar AI Narrative
                </p>
              </div>
              <p className={cn("text-[13px] leading-relaxed font-mono font-semibold", level === 'high' ? 'text-red-800' : 'text-gray-600')}>
                <TypewriterText
                  text={level === 'high'
                    ? `> DETETADO PADRÃO DE CHURN: O score de risco atingiu ${student.riskScore} pontos. Observa-se uma quebra de ${ind.academic.attendancePercent}% na assiduidade combinada com ${ind.behavioral.daysSinceLastAccess} dias de ausência no Moodle. A situação agrava-se com os ${ind.financial.tuitionArrearsMonths} meses de propinas em atraso. Recomenda-se acionamento do protocolo SAS.`
                    : `> ANÁLISE ESTÁVEL: Score de ${student.riskScore} pontos. Os indicadores de assiduidade (${ind.academic.attendancePercent}%) e engajamento Moodle (último acesso há ${ind.behavioral.daysSinceLastAccess} dias) estão dentro dos limites.`
                  }
                  delay={500}
                />
              </p>
            </div>
        </ProfileCard>

      </main>
    </div>
  )
}
