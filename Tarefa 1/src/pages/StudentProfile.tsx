import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, BookOpen, DollarSign, Monitor, Heart } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { RiskBadge } from '../components/ui/RiskBadge'
import { Badge } from '../components/ui/Badge'
import { students } from '../data/students'
import { scoreToLevel, riskConfig } from '../lib/riskUtils'
import { cn } from '../lib/utils'
import { motion } from 'framer-motion'
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
      }, 15) // writing speed
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

function IndicatorRow({ label, value, status }: { label: string; value: string; status: 'ok' | 'warning' | 'critical' }) {
  return (
    <div className="flex items-center justify-between py-2.5 gap-4 border-b border-umain-border last:border-0">
      <span className="text-xs font-medium text-umain-text-muted truncate">{label}</span>
      <span className={cn(
        'text-sm font-semibold whitespace-nowrap text-right',
        status === 'ok' && 'text-emerald-400',
        status === 'warning' && 'text-amber-400',
        status === 'critical' && 'text-red-400',
      )}>{value}</span>
    </div>
  )
}

function SectionLabel({ icon: Icon, iconColor, children }: { icon: React.ComponentType<{ className?: string }>; iconColor: string; children: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn('w-3.5 h-3.5', iconColor)} />
      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">{children}</p>
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
        <button onClick={() => navigate('/dashboard')} className="text-umain-accent text-sm flex items-center gap-1.5 font-medium">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <p className="mt-4 text-umain-text-muted text-sm">Estudante não encontrado.</p>
      </div>
    )
  }

  const level = scoreToLevel(student.riskScore, settings.riskThresholds)
  const config = riskConfig[level]
  const TrendIcon = student.scoreTrend === 'up' ? TrendingUp : student.scoreTrend === 'down' ? TrendingDown : Minus
  const trendColor = student.scoreTrend === 'up' ? 'text-red-400' : student.scoreTrend === 'down' ? 'text-emerald-400' : 'text-umain-text-muted'
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
      <main className="flex-1 p-4 md:p-8 space-y-4 md:space-y-6 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-umain-text tracking-tight">{obfuscateName(student.name, isObs)}</h1>
            <p className="text-sm font-medium text-umain-text-muted mt-0.5">{`${student.course} · ${student.year}º Ano · ${isObs ? 'Nº Oculto' : 'Nº ' + student.number}`}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-umain-text-muted hover:text-umain-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Dashboard
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Score */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="h-full">
            <Card className="flex flex-col items-center justify-center py-10 h-full">
              <CardContent className="flex flex-col items-center gap-4">
                <div className={cn('w-36 h-36 rounded-full border-[10px] flex items-center justify-center', config.border, 'bg-umain-background shadow-inner')}>
                  <div className="text-center">
                    <p
                      className="text-5xl font-black text-umain-text leading-none drop-shadow-sm"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {student.riskScore}
                    </p>
                    <p className="text-xs text-umain-text-muted mt-1 font-medium">/ 100</p>
                  </div>
                </div>
                <RiskBadge score={student.riskScore} />
                <div className={cn('flex items-center gap-1.5 text-sm font-semibold', trendColor)}>
                  <TrendIcon className="w-4 h-4" />
                  {student.scoreTrend === 'up' ? 'A agravar' : student.scoreTrend === 'down' ? 'A melhorar' : 'Estável'}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="h-full">
            <Card className="h-full">
              <CardHeader>
                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">Perfil do Estudante</p>
              </CardHeader>
              <CardContent className="space-y-0">
                <IndicatorRow label="Número" value={isObs ? 'Oculto' : student.number} status="ok" />
                <IndicatorRow label="Curso" value={student.course} status="ok" />
                <IndicatorRow label="Ano Curricular" value={`${student.year}º Ano`} status="ok" />
                <IndicatorRow
                  label="Residência"
                  value={isDiretor ? 'Acesso Restrito' : ind.socioeconomic.residence}
                  status={isDiretor ? 'ok' : ind.socioeconomic.residence === 'Deslocado' ? 'warning' : 'ok'}
                />
                <div className="pt-3 flex flex-wrap gap-1.5">
                  {student.statuses.map((s: string) => (
                    <Badge key={s} className="bg-umain-muted text-umain-text text-[10px] font-bold border border-umain-border">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Radar */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="h-full">
            <Card className="h-full">
              <CardHeader>
                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">Análise Multidimensional</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                    <Radar name="Risco" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <SectionLabel icon={BookOpen} iconColor="text-umain-accent">Indicadores Académicos</SectionLabel>
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
              <SectionLabel icon={DollarSign} iconColor={isDiretor ? "text-umain-text-muted" : "text-amber-400"}>Indicadores Financeiros</SectionLabel>
            </CardHeader>
            <CardContent>
              {isDiretor ? (
                <div className="flex flex-col items-center justify-center py-6 px-4 text-center border border-dashed border-umain-border rounded-xl bg-umain-surface/30">
                  <DollarSign className="w-5 h-5 text-umain-text-muted/50 mb-2" />
                  <p className="text-[10px] font-bold tracking-widest uppercase text-umain-text-muted mb-1">Acesso Restrito</p>
                  <p className="text-xs text-umain-text-muted/70">Dados financeiros são da exclusiva competência dos Serviços de Ação Social (SAS).</p>
                </div>
              ) : (
                <>
                  <IndicatorRow label="Impacto Mensal (ROI)" value={ind.financial.monthlyFee > 0 ? `€${ind.financial.monthlyFee}` : 'Funded'} status="ok" />
                  <IndicatorRow label="Propinas em Atraso" value={ind.financial.tuitionArrearsMonths === 0 ? 'Regularizado' : `${ind.financial.tuitionArrearsMonths} meses`} status={ind.financial.tuitionArrearsMonths === 0 ? 'ok' : ind.financial.tuitionArrearsMonths <= 1 ? 'warning' : 'critical'} />
                  <IndicatorRow label="Bolsa de Estudo" value={ind.financial.scholarshipStatus} status={ind.financial.scholarshipStatus === 'Bolseiro' ? 'ok' : 'warning'} />
                  <IndicatorRow label="Acordo de Pagamento" value={ind.financial.paymentAgreement ? 'Sim' : 'Não'} status={ind.financial.paymentAgreement ? 'warning' : 'ok'} />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionLabel icon={Monitor} iconColor="text-blue-500">Atividade Moodle</SectionLabel>
            </CardHeader>
            <CardContent>
              <IndicatorRow label="Acessos (últimos 30 dias)" value={`${ind.behavioral.moodleLoginsLast30Days} sessões`} status={ind.behavioral.moodleLoginsLast30Days >= 15 ? 'ok' : ind.behavioral.moodleLoginsLast30Days >= 5 ? 'warning' : 'critical'} />
              <IndicatorRow label="Materiais Descarregados" value={`${ind.behavioral.materialsDownloaded}`} status={ind.behavioral.materialsDownloaded >= 10 ? 'ok' : ind.behavioral.materialsDownloaded >= 3 ? 'warning' : 'critical'} />
              <IndicatorRow label="Último Acesso" value={`Há ${ind.behavioral.daysSinceLastAccess} dias`} status={ind.behavioral.daysSinceLastAccess <= 3 ? 'ok' : ind.behavioral.daysSinceLastAccess <= 7 ? 'warning' : 'critical'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionLabel icon={Heart} iconColor={isDiretor ? "text-umain-text-muted" : "text-rose-400"}>Contexto Socioeconómico</SectionLabel>
            </CardHeader>
            <CardContent>
              {isDiretor ? (
                <div className="flex flex-col items-center justify-center py-6 px-4 text-center border border-dashed border-umain-border rounded-xl bg-umain-surface/30">
                  <Heart className="w-5 h-5 text-umain-text-muted/50 mb-2" />
                  <p className="text-[10px] font-bold tracking-widest uppercase text-umain-text-muted mb-1">Acesso Restrito</p>
                  <p className="text-xs text-umain-text-muted/70">Dados de saúde e contexto socioeconómico reservados aos SAS.</p>
                </div>
              ) : (
                <>
                  <IndicatorRow label="Perfil de Entrada" value={ind.socioeconomic.entryProfile} status="ok" />
                  <IndicatorRow label="Residência" value={ind.socioeconomic.residence} status={ind.socioeconomic.residence === 'Local' ? 'ok' : 'warning'} />
                  <IndicatorRow label="NEE" value={ind.socioeconomic.nee ? 'Sim' : 'Não'} status={ind.socioeconomic.nee ? 'warning' : 'ok'} />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted">Histórico de Intervenções / Decisão</p>
          </CardHeader>
          <CardContent>
            {student.interventions.length === 0 ? (
              <p className="text-sm text-umain-text-muted">Sem intervenções registadas.</p>
            ) : (
              <div className="relative space-y-5 pl-5 border-l-2 border-umain-border">
                {student.interventions.map((intervention, i: number) => (
                  <div key={i} className="relative anim-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="absolute -left-[23px] w-3 h-3 rounded-full bg-umain-accent border-2 border-umain-surface shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-umain-accent/10 text-umain-accent text-[10px] font-bold border border-umain-accent/20">{intervention.type}</Badge>
                          <span className="text-xs text-umain-text-muted">{isObs ? 'Técnico(a)' : intervention.author}</span>
                        </div>
                        <p className="text-sm text-umain-text leading-relaxed">
                          {isDiretor && (intervention.description.toLowerCase().includes('financeir') || intervention.description.toLowerCase().includes('apoio') || intervention.description.toLowerCase().includes('psico'))
                            ? 'Detalhes da intervenção de natureza confidencial mantidos em segredo (apenas SAS).'
                            : intervention.description}
                        </p>
                      </div>
                      <span className="text-xs text-umain-text-muted shrink-0 font-medium">{intervention.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className={cn("mt-6 p-5 rounded-xl border relative overflow-hidden", level === 'high' ? 'bg-red-950/20 border-red-900/50' : 'bg-umain-muted/10 border-umain-border')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              <div className="flex items-center gap-2 mb-3">
                <Monitor className={cn("w-4 h-4", level === 'high' ? 'text-red-400' : 'text-umain-text')} />
                <p className={cn("text-xs font-bold tracking-widest uppercase", level === 'high' ? 'text-red-400' : 'text-umain-text')}>
                  AI Risk Narrative
                </p>
              </div>
              <p className={cn("text-sm leading-relaxed font-mono", level === 'high' ? 'text-red-300' : 'text-umain-text-muted')}>
                <TypewriterText
                  text={level === 'high'
                    ? `> DETETADO PADRÃO DE CHURN: O score de risco atingiu ${student.riskScore} pontos, ultrapassando o limiar crítico. Observa-se uma quebra de ${ind.academic.attendancePercent}% na assiduidade combinada com ${ind.behavioral.daysSinceLastAccess} dias de ausência na plataforma Moodle. A situação agrava-se com os ${ind.financial.tuitionArrearsMonths} meses de propinas em atraso. Recomenda-se acionamento do protocolo SAS imediatamente.`
                    : `> ANÁLISE ESTÁVEL: O estudante apresenta um score de ${student.riskScore} pontos. Os indicadores de assiduidade (${ind.academic.attendancePercent}%) e engajamento Moodle (último acesso há ${ind.behavioral.daysSinceLastAccess} dias) estão dentro dos limites operacionais seguros.`
                  }
                  delay={1000}
                />
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </main >
    </>
  )
}
