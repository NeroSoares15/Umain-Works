import { Sliders, Save, Info, AlertTriangle, BookOpen, CreditCard, Users } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card, CardContent } from '../components/ui/Card'
import { useState } from 'react'
import { canAdjustSettings } from '../lib/accessControl'
import type { AppSettings } from '../lib/appSettings'
import { useAppContext } from '../contexts/useAppContext'

export function Settings() {
    const { settings, updateSettings, activeProfileId } = useAppContext()
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings)
    const [savedStatus, setSavedStatus] = useState(false)

    const isSASManager = canAdjustSettings(activeProfileId)

    const handleSave = () => {
        if (!isSASManager) {
            return
        }

        updateSettings({ 
            riskThresholds: localSettings.riskThresholds,
            riskSignals: localSettings.riskSignals,
            profileMultipliers: localSettings.profileMultipliers,
            enableEffects: localSettings.enableEffects,
        })
        setSavedStatus(true)
        setTimeout(() => setSavedStatus(false), 2000)
    }

    return (
        <>
            <TopBar title="Parametrização de Gatilhos de Risco" subtitle="Configurações Globais do Modelo de Machine Learning" />
            <main className="flex-1 p-4 md:p-8 space-y-6 overflow-auto">
                <div className="max-w-5xl mx-auto space-y-6">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-umain-surface border border-umain-border flex items-center justify-center shadow-inner">
                            <Sliders className="w-5 h-5 text-umain-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Regras de Negócio & Pesos</h2>
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

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-umain-border/50 pb-4">
                                    <Sliders className="w-4 h-4 text-umain-text-muted" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Patamares de Risco</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Sem risco até</label>
                                            <span className="text-lg font-black text-white">{localSettings.riskThresholds.none}</span>
                                        </div>
                                        <input
                                            type="range" min="5" max="30" value={localSettings.riskThresholds.none} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings((previous) => ({
                                                ...previous,
                                                riskThresholds: { ...previous.riskThresholds, none: parseInt(e.target.value) },
                                            }))}
                                            className="w-full accent-emerald-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Risco baixo até</label>
                                            <span className="text-lg font-black text-white">{localSettings.riskThresholds.low}</span>
                                        </div>
                                        <input
                                            type="range" min="20" max="60" value={localSettings.riskThresholds.low} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings((previous) => ({
                                                ...previous,
                                                riskThresholds: { ...previous.riskThresholds, low: parseInt(e.target.value) },
                                            }))}
                                            className="w-full accent-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Risco médio até</label>
                                            <span className="text-lg font-black text-white">{localSettings.riskThresholds.medium}</span>
                                        </div>
                                        <input
                                            type="range" min="40" max="85" value={localSettings.riskThresholds.medium} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings((previous) => ({
                                                ...previous,
                                                riskThresholds: { ...previous.riskThresholds, medium: parseInt(e.target.value) },
                                            }))}
                                            className="w-full accent-amber-500 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Assiduidade */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-umain-border/50 pb-4">
                                    <AlertTriangle className="w-4 h-4 text-umain-text-muted" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Assiduidade</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-semibold text-umain-text-muted">Faltas Injustificadas Toleradas (%)</label>
                                        <span className="text-lg font-black text-white">{localSettings.riskSignals.attendanceTolerancePercent}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="30" value={localSettings.riskSignals.attendanceTolerancePercent} disabled={!isSASManager}
                                        onChange={(e) => setLocalSettings((previous) => ({
                                            ...previous,
                                            riskSignals: { ...previous.riskSignals, attendanceTolerancePercent: parseInt(e.target.value) },
                                        }))}
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
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Desempenho Académico</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Nº Negativas Toleradas</label>
                                            <span className="text-lg font-black text-white">{localSettings.riskSignals.toleratedNegativeGrades}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="5" value={localSettings.riskSignals.toleratedNegativeGrades} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings((previous) => ({
                                                ...previous,
                                                riskSignals: { ...previous.riskSignals, toleratedNegativeGrades: parseInt(e.target.value) },
                                            }))}
                                            className="w-full accent-umain-accent cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Dias sem Moodle Tolerados</label>
                                            <span className="text-lg font-black text-white">{localSettings.riskSignals.maxDaysSinceLastAccess}</span>
                                        </div>
                                        <input
                                            type="range" min="1" max="21" value={localSettings.riskSignals.maxDaysSinceLastAccess} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings((previous) => ({
                                                ...previous,
                                                riskSignals: { ...previous.riskSignals, maxDaysSinceLastAccess: parseInt(e.target.value) },
                                            }))}
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
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Financeiro</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-semibold text-umain-text-muted">Meses de Propinas em Atraso Tolerados</label>
                                        <span className="text-lg font-black text-white">{localSettings.riskSignals.toleratedTuitionArrearsMonths}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="4" value={localSettings.riskSignals.toleratedTuitionArrearsMonths} disabled={!isSASManager}
                                        onChange={(e) => setLocalSettings((previous) => ({
                                            ...previous,
                                            riskSignals: { ...previous.riskSignals, toleratedTuitionArrearsMonths: parseInt(e.target.value) },
                                        }))}
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
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Multiplicadores de Risco por Perfil</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Estudante 1º Ano</label>
                                            <span className="text-sm font-black text-emerald-400">+{Math.round((localSettings.profileMultipliers.firstYear - 1) * 100)}% gravidade</span>
                                        </div>
                                        <input
                                            type="range" min="100" max="150" value={Math.round(localSettings.profileMultipliers.firstYear * 100)} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings((previous) => ({
                                                ...previous,
                                                profileMultipliers: { ...previous.profileMultipliers, firstYear: parseInt(e.target.value) / 100 },
                                            }))}
                                            className="w-full accent-emerald-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Estudante com Bolsa / Candidatura</label>
                                            <span className="text-sm font-black text-blue-400">+{Math.round((localSettings.profileMultipliers.scholarship - 1) * 100)}% gravidade</span>
                                        </div>
                                        <input
                                            type="range" min="100" max="150" value={Math.round(localSettings.profileMultipliers.scholarship * 100)} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings((previous) => ({
                                                ...previous,
                                                profileMultipliers: { ...previous.profileMultipliers, scholarship: parseInt(e.target.value) / 100 },
                                            }))}
                                            className="w-full accent-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-semibold text-umain-text-muted">Estudante Internacional</label>
                                            <span className="text-sm font-black text-purple-400">+{Math.round((localSettings.profileMultipliers.international - 1) * 100)}% gravidade</span>
                                        </div>
                                        <input
                                            type="range" min="100" max="150" value={Math.round(localSettings.profileMultipliers.international * 100)} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings((previous) => ({
                                                ...previous,
                                                profileMultipliers: { ...previous.profileMultipliers, international: parseInt(e.target.value) / 100 },
                                            }))}
                                            className="w-full accent-purple-500 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    <div className="flex items-center gap-3 mt-10 mb-6 border-t border-umain-border/30 pt-10">
                        <div className="w-10 h-10 rounded-xl bg-umain-surface border border-umain-border flex items-center justify-center shadow-inner">
                            <Sliders className="w-5 h-5 text-umain-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Sistema & Desempenho</h2>
                            <p className="text-sm text-umain-text-muted">Opções globais da interface e aceleração de hardware.</p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Efeitos Visuais e WebGL</h3>
                                    <p className="text-xs text-umain-text-muted mt-1">Desative para melhorar o desempenho em máquinas com recursos limitados. Desliga modelos 3D, partículas e transições pesadas.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={localSettings.enableEffects}
                                        onChange={(e) => setLocalSettings((previous) => ({ ...previous, enableEffects: e.target.checked }))}
                                    />
                                    <div className="w-14 h-7 bg-umain-surface border border-umain-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-umain-accent shadow-inner"></div>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

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
