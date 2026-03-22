import { Sliders, Save, Info, AlertTriangle, BookOpen, CreditCard, Users } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { useAppContext } from '../contexts/AppContext'
import { useState } from 'react'

export function Settings() {
    const { settings, updateSettings, activeProfileId } = useAppContext()
    const [localSettings, setLocalSettings] = useState({
        ...settings.riskThresholds,
        assiduidade: 15,
        negativas: 2,
        trabalhosAtraso: 1,
        propinasAtraso: 2,
        multiplicador1Ano: 1.2,
        multiplicadorBolseiro: 1.15,
        multiplicadorIntl: 1.10
    })
    const [savedStatus, setSavedStatus] = useState(false)

    const isSASManager = activeProfileId === 'sas' || activeProfileId === 'diretor'

    const handleSave = () => {
        updateSettings({ 
            riskThresholds: { none: localSettings.none, low: localSettings.low, medium: localSettings.medium }
        })
        setSavedStatus(true)
        setTimeout(() => setSavedStatus(false), 2000)
    }

    return (
        <>
            <main className="flex-1 px-4 pb-4 md:px-6 md:pb-6 lg:px-10 lg:pb-10 pt-4 overflow-auto bg-umain-background">
                <div className="max-w-5xl mx-auto space-y-6">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-umain-surface border border-umain-border flex items-center justify-center shadow-inner">
                            <Sliders className="w-5 h-5 text-umain-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-umain-text tracking-tight">Regras de Negócio & Pesos</h2>
                            <p className="text-sm text-umain-text-muted">Ajuste os limiares de tolerância que determinam a geração automática de alertas.</p>
                        </div>
                    </div>

                    {!isSASManager && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-500">Acesso Restrito ao Modo Leitura</h4>
                                <p className="text-xs text-amber-200/70 mt-1">Apenas perfis Diretivos ou de Gestão SAS têm permissão para calibrar o motor de risco.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Assiduidade */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-umain-border/50 pb-4">
                                    <AlertTriangle className="w-4 h-4 text-umain-text-muted" />
                                    <h3 className="text-sm font-bold text-umain-text uppercase tracking-widest">Assiduidade</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-semibold text-umain-text-muted">Faltas Injustificadas Toleradas (%)</label>
                                        <span className="text-lg font-black text-umain-text">{localSettings.assiduidade}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="30" value={localSettings.assiduidade} disabled={!isSASManager}
                                        onChange={(e) => setLocalSettings(p => ({ ...p, assiduidade: parseInt(e.target.value) }))}
                                        className="w-full accent-umain-accent cursor-pointer"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Desempenho Académico */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-umain-border/50 pb-4">
                                    <BookOpen className="w-4 h-4 text-umain-text-muted" />
                                    <h3 className="text-sm font-bold text-umain-text uppercase tracking-widest">Desempenho Académico</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Nº Negativas Toleradas</label>
                                            <span className="text-lg font-black text-umain-text">{localSettings.negativas}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="5" value={localSettings.negativas} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings(p => ({ ...p, negativas: parseInt(e.target.value) }))}
                                            className="w-full accent-umain-accent cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Trabalhos em Atraso Tolerados</label>
                                            <span className="text-lg font-black text-umain-text">{localSettings.trabalhosAtraso}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="5" value={localSettings.trabalhosAtraso} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings(p => ({ ...p, trabalhosAtraso: parseInt(e.target.value) }))}
                                            className="w-full accent-umain-accent cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financeiro */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-umain-border/50 pb-4">
                                    <CreditCard className="w-4 h-4 text-umain-text-muted" />
                                    <h3 className="text-sm font-bold text-umain-text uppercase tracking-widest">Financeiro</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-semibold text-umain-text-muted">Meses de Propinas em Atraso Tolerados</label>
                                        <span className="text-lg font-black text-umain-text">{localSettings.propinasAtraso}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="4" value={localSettings.propinasAtraso} disabled={!isSASManager}
                                        onChange={(e) => setLocalSettings(p => ({ ...p, propinasAtraso: parseInt(e.target.value) }))}
                                        className="w-full accent-umain-accent cursor-pointer"
                                    />
                                    <p className="text-[10px] text-umain-text-muted/60 leading-tight">Um valor de 0 significa tolerância zero (alerta gerado ao primeiro dia de atraso).</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ponderação por Perfil */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-umain-border/50 pb-4">
                                    <Users className="w-4 h-4 text-umain-text-muted" />
                                    <h3 className="text-sm font-bold text-umain-text uppercase tracking-widest">Multiplicadores de Risco por Perfil</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Estudante 1º Ano</label>
                                            <span className="text-sm font-black text-emerald-400">+{Math.round((localSettings.multiplicador1Ano - 1) * 100)}% gravidade</span>
                                        </div>
                                        <input
                                            type="range" min="100" max="150" value={Math.round(localSettings.multiplicador1Ano * 100)} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings(p => ({ ...p, multiplicador1Ano: parseInt(e.target.value) / 100 }))}
                                            className="w-full accent-emerald-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Estudante Bolseiro</label>
                                            <span className="text-sm font-black text-blue-400">+{Math.round((localSettings.multiplicadorBolseiro - 1) * 100)}% gravidade</span>
                                        </div>
                                        <input
                                            type="range" min="100" max="150" value={Math.round(localSettings.multiplicadorBolseiro * 100)} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings(p => ({ ...p, multiplicadorBolseiro: parseInt(e.target.value) / 100 }))}
                                            className="w-full accent-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Estudante Internacional</label>
                                            <span className="text-sm font-black text-purple-400">+{Math.round((localSettings.multiplicadorIntl - 1) * 100)}% gravidade</span>
                                        </div>
                                        <input
                                            type="range" min="100" max="150" value={Math.round(localSettings.multiplicadorIntl * 100)} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings(p => ({ ...p, multiplicadorIntl: parseInt(e.target.value) / 100 }))}
                                            className="w-full accent-purple-500 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {isSASManager && (
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-8 py-3 bg-umain-accent text-white rounded-xl font-bold hover:bg-umain-accent/90 transition-all shadow-xl shadow-umain-accent/20 active:scale-95 text-sm"
                            >
                                <Save className="w-4 h-4" />
                                {savedStatus ? 'Regras Sincronizadas no Motor!' : 'Atualizar Motor de Risco'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
