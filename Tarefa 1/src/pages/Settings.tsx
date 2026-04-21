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
        <div className="flex-1 flex flex-col h-full bg-[#f9fafb]">
            <main className="flex-1 px-4 py-6 md:px-6 lg:px-10 lg:py-8 w-full max-w-5xl mx-auto overflow-auto">
                <div className="space-y-6">

                    <div className="flex items-start sm:items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center shadow-sm shrink-0">
                            <Sliders className="w-6 h-6 text-[#C15B38]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Regras de Negócio & Pesos</h2>
                            <p className="text-sm font-medium text-gray-500 leading-tight mt-0.5">Ajuste os limiares de tolerância que determinam a geração automática de alertas.</p>
                        </div>
                    </div>

                    {!isSASManager && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[13px] font-bold text-amber-800">Acesso Restrito ao Modo Leitura</h4>
                                <p className="text-xs text-amber-700 mt-1 font-medium">Apenas perfis Diretivos ou de Gestão SAS têm permissão para calibrar o motor de risco.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Assiduidade */}
                        <Card className="bg-white border-[#e5e7eb] shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Assiduidade</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[13px] font-semibold text-gray-500">Faltas Injustificadas Toleradas (%)</label>
                                        <span className="text-lg font-black text-gray-900">{localSettings.assiduidade}%</span>
                                    </div>
                                    <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-1 px-1 -mx-1">
                                        <input
                                            type="range" min="0" max="30" value={localSettings.assiduidade} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings(p => ({ ...p, assiduidade: parseInt(e.target.value) }))}
                                            className="w-full min-w-[200px] accent-[#C15B38] cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Desempenho Académico */}
                        <Card className="bg-white border-[#e5e7eb] shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                    <BookOpen className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Desempenho Académico</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[13px] font-semibold text-gray-500">Nº Negativas Toleradas</label>
                                            <span className="text-lg font-black text-gray-900">{localSettings.negativas}</span>
                                        </div>
                                        <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-1 px-1 -mx-1">
                                            <input
                                                type="range" min="0" max="5" value={localSettings.negativas} disabled={!isSASManager}
                                                onChange={(e) => setLocalSettings(p => ({ ...p, negativas: parseInt(e.target.value) }))}
                                                className="w-full min-w-[200px] accent-[#C15B38] cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[13px] font-semibold text-gray-500">Trabalhos em Atraso Tolerados</label>
                                            <span className="text-lg font-black text-gray-900">{localSettings.trabalhosAtraso}</span>
                                        </div>
                                        <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-1 px-1 -mx-1">
                                            <input
                                                type="range" min="0" max="5" value={localSettings.trabalhosAtraso} disabled={!isSASManager}
                                                onChange={(e) => setLocalSettings(p => ({ ...p, trabalhosAtraso: parseInt(e.target.value) }))}
                                                className="w-full min-w-[200px] accent-[#C15B38] cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financeiro */}
                        <Card className="bg-white border-[#e5e7eb] shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Financeiro</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[13px] font-semibold text-gray-500">Meses de Propinas Atrasadas</label>
                                        <span className="text-lg font-black text-gray-900">{localSettings.propinasAtraso}</span>
                                    </div>
                                    <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-1 px-1 -mx-1">
                                        <input
                                            type="range" min="0" max="4" value={localSettings.propinasAtraso} disabled={!isSASManager}
                                            onChange={(e) => setLocalSettings(p => ({ ...p, propinasAtraso: parseInt(e.target.value) }))}
                                            className="w-full min-w-[200px] accent-[#C15B38] cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-[11px] font-medium text-gray-400 leading-tight">Um valor de 0 significa tolerância zero (alerta gerado ao primeiro dia de atraso).</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ponderação por Perfil */}
                        <Card className="bg-white border-[#e5e7eb] shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Multiplicadores por Perfil</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[13px] font-semibold text-gray-500">Estudante 1º Ano</label>
                                            <span className="text-sm font-black text-emerald-600">+{Math.round((localSettings.multiplicador1Ano - 1) * 100)}% gravidade</span>
                                        </div>
                                        <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-1 px-1 -mx-1">
                                            <input
                                                type="range" min="100" max="150" value={Math.round(localSettings.multiplicador1Ano * 100)} disabled={!isSASManager}
                                                onChange={(e) => setLocalSettings(p => ({ ...p, multiplicador1Ano: parseInt(e.target.value) / 100 }))}
                                                className="w-full min-w-[200px] accent-emerald-600 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[13px] font-semibold text-gray-500">Estudante Bolseiro</label>
                                            <span className="text-sm font-black text-blue-600">+{Math.round((localSettings.multiplicadorBolseiro - 1) * 100)}% gravidade</span>
                                        </div>
                                        <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-1 px-1 -mx-1">
                                            <input
                                                type="range" min="100" max="150" value={Math.round(localSettings.multiplicadorBolseiro * 100)} disabled={!isSASManager}
                                                onChange={(e) => setLocalSettings(p => ({ ...p, multiplicadorBolseiro: parseInt(e.target.value) / 100 }))}
                                                className="w-full min-w-[200px] accent-blue-600 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[13px] font-semibold text-gray-500">Estudante Internacional</label>
                                            <span className="text-sm font-black text-purple-600">+{Math.round((localSettings.multiplicadorIntl - 1) * 100)}% gravidade</span>
                                        </div>
                                        <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-1 px-1 -mx-1">
                                            <input
                                                type="range" min="100" max="150" value={Math.round(localSettings.multiplicadorIntl * 100)} disabled={!isSASManager}
                                                onChange={(e) => setLocalSettings(p => ({ ...p, multiplicadorIntl: parseInt(e.target.value) / 100 }))}
                                                className="w-full min-w-[200px] accent-purple-600 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {isSASManager && (
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-8 py-3 bg-[#C15B38] text-white rounded-xl font-bold hover:bg-[#a34b2f] transition-all shadow-sm active:scale-95 text-sm"
                            >
                                <Save className="w-4 h-4" />
                                {savedStatus ? 'Regras Sincronizadas no Motor!' : 'Atualizar Motor de Risco'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
