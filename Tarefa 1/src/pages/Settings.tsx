import { BookCopy, Pencil, Save, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { cn } from '../lib/utils'
import { platformVersion, settingsSections } from '../data/referenceData'

type SettingsTab = 'parameters' | 'credits'

function SettingsTabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'border-[#f1d7c6] bg-[#fdf1ea] text-[#c5663b]'
          : 'border-[#e7e1d6] bg-white text-[#2d2b28]'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

export function Settings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab: SettingsTab = searchParams.get('tab') === 'credits' ? 'credits' : 'parameters'
  const isEditing = activeTab === 'parameters' && searchParams.get('edit') === '1'

  function updateRoute(nextTab: SettingsTab, nextEditing = false) {
    const nextParams = new URLSearchParams()

    if (nextTab === 'credits') {
      nextParams.set('tab', 'credits')
    }

    if (nextTab === 'parameters' && nextEditing) {
      nextParams.set('edit', '1')
    }

    setSearchParams(nextParams)
  }

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <h1 className="text-[16px] font-semibold text-[#2e2d2a]">Configurações</h1>
            <div className="flex flex-wrap items-center gap-2">
              <SettingsTabButton active={activeTab === 'parameters'} icon={X} label="Parâmetros" onClick={() => updateRoute('parameters')} />
              <SettingsTabButton active={activeTab === 'credits'} icon={BookCopy} label="Créditos" onClick={() => updateRoute('credits')} />
            </div>
          </div>

          {activeTab === 'parameters' && isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateRoute('parameters')}
                className="rounded-[4px] border border-[#e3d8c8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4b4742]"
              >
                Cancelar
              </button>
              <button
                onClick={() => updateRoute('parameters')}
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#c5663b] px-3 py-1.5 text-[12px] font-semibold text-white"
              >
                <Save className="h-3.5 w-3.5" />
                Guardar
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-4 py-4">
        {activeTab === 'parameters' ? (
          <div className="space-y-6">
            {settingsSections.map((section) => (
              <section key={section.id} className="border-b border-[#e5ddcf] pb-5 last:border-b-0">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-8">
                  <div className="px-1 py-2">
                    <h2 className="text-[16px] font-semibold text-[#2f2d2a]">{section.title}</h2>
                    <p className="mt-3 max-w-[320px] text-[14px] leading-relaxed text-[#4d4a46]">{section.description}</p>
                  </div>

                  <Card className="overflow-hidden">
                    <div className="border-b border-[#ece5da] px-4 py-3 text-[13px] font-medium text-[#2f2d2a]">Parâmetros</div>

                    <div className="px-4 py-3">
                      <table className="w-full border-collapse text-left text-[12px]">
                        <thead>
                          <tr className="bg-[#ececec] text-[#2f2d2a]">
                            {section.columns.map((column) => (
                              <th key={column} className="px-3 py-3 font-semibold">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows.map((row) => (
                            <tr
                              key={row.id}
                              className={cn(
                                'border-b border-[#eee7db] text-[#3b3834] last:border-b-0',
                                isEditing && 'bg-[#fef7f2]'
                              )}
                            >
                              <td className="px-3 py-3">{row.label}</td>

                              <td className="px-3 py-3">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    placeholder={row.maxPlaceholder || 'Number'}
                                    className="h-8 w-full rounded-[4px] border border-[#d88960] bg-white px-3 text-[12px]"
                                  />
                                ) : (
                                  row.maxValue
                                )}
                              </td>

                              {section.columns.length === 4 ? (
                                <td className="px-3 py-3">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      placeholder={row.severityPlaceholder || 'Percentage'}
                                      className="h-8 w-full rounded-[4px] border border-[#d88960] bg-white px-3 text-[12px]"
                                    />
                                  ) : (
                                    row.severity
                                  )}
                                </td>
                              ) : null}

                              <td className="px-3 py-3 text-center text-[#c5663b]">
                                {isEditing ? (
                                  <button className="inline-flex h-6 w-6 items-center justify-center">
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => updateRoute('parameters', true)}
                                    className="inline-flex h-6 w-6 items-center justify-center"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </section>
            ))}

            <div className="grid grid-cols-1 gap-4 pt-2 xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-8">
              <div className="px-1">
                <h2 className="text-[16px] font-semibold text-[#2f2d2a]">Versão da plataforma</h2>
              </div>
              <div className="px-1 py-1 text-[14px] text-[#4d4a46]">{platformVersion}</div>
            </div>
          </div>
        ) : (
          <Card className="max-w-[980px] p-6">
            <h2 className="text-[16px] font-semibold text-[#2f2d2a]">Créditos</h2>
            <div className="mt-4 space-y-3 text-[14px] text-[#4e4b46]">
              <p>RiskRadar demonstrador visual para UMAIN WORKS.</p>
              <p>Interface construída com React, Vite, Tailwind CSS e Recharts.</p>
              <p>Versão atual: {platformVersion}</p>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
