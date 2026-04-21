import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookCopy, Pencil, Save, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { platformVersion, settingsSections } from '../data/referenceData'
import { useAppMotion } from '../lib/appMotion'
import { cn } from '../lib/utils'

type SettingsTab = 'parameters' | 'credits'

type EditingRowState = {
  sectionId: string
  rowId: string
  maxValue: string
  severity: string
}

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
        'inline-flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-[12px] font-medium shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-[transform,background-color,border-color,color,box-shadow] duration-200 motion-safe:hover:-translate-y-[1px]',
        active
          ? 'border-[#e8c9b9] bg-[#fdf1ea] text-[#c1633d]'
          : 'border-[#e7e1d6] bg-white text-[#2d2b28] hover:border-[#d9cdbc] hover:bg-[#fffaf3] hover:text-[#201f1d]'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

export function Settings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sectionsState, setSectionsState] = useState(settingsSections)
  const [editingRow, setEditingRow] = useState<EditingRowState | null>(null)
  const { createRevealVariants, createStaggerVariants } = useAppMotion()
  const activeTab: SettingsTab = searchParams.get('tab') === 'credits' ? 'credits' : 'parameters'

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

  function handleTabChange(nextTab: SettingsTab) {
    setEditingRow(null)
    updateRoute(nextTab)
  }

  function startRowEdit(sectionId: string, row: { id: string; maxValue: string; severity?: string }) {
    setEditingRow({
      sectionId,
      rowId: row.id,
      maxValue: row.maxValue,
      severity: row.severity ?? '',
    })
    updateRoute('parameters', true)
  }

  function cancelRowEdit() {
    setEditingRow(null)
    updateRoute('parameters')
  }

  function saveRowEdit() {
    if (!editingRow) return

    setSectionsState((previousSections) =>
      previousSections.map((section) => {
        if (section.id !== editingRow.sectionId) return section

        return {
          ...section,
          rows: section.rows.map((row) => {
            if (row.id !== editingRow.rowId) return row

            return {
              ...row,
              maxValue: editingRow.maxValue.trim() || row.maxValue,
              severity: row.severity !== undefined ? editingRow.severity.trim() || row.severity : row.severity,
            }
          }),
        }
      })
    )

    setEditingRow(null)
    updateRoute('parameters')
  }

  return (
    <div className="flex min-h-full flex-col bg-[#fffdf6]">
      <div className="border-b border-[#ede5d7] bg-white px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <h1 className="text-[17px] font-semibold text-[#2e2d2a]">Configurações</h1>
            <div className="flex flex-wrap items-center gap-2">
              <SettingsTabButton active={activeTab === 'parameters'} icon={X} label="Parâmetros" onClick={() => handleTabChange('parameters')} />
              <SettingsTabButton active={activeTab === 'credits'} icon={BookCopy} label="Créditos" onClick={() => handleTabChange('credits')} />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-5 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'parameters' ? (
            <motion.div
              key="parameters"
              className="space-y-6"
              variants={createRevealVariants({ distance: 12, duration: 0.24 })}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <motion.div
                className="space-y-6"
                variants={createStaggerVariants({ staggerChildren: 0.08 })}
                initial="hidden"
                animate="show"
              >
                {sectionsState.map((section) => (
                  <motion.section
                    key={section.id}
                    variants={createRevealVariants({ distance: 10 })}
                    className="border-b border-[#e5ddcf] pb-5 last:border-b-0"
                  >
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
                              {section.rows.map((row) => {
                                const isRowEditing =
                                  editingRow?.sectionId === section.id && editingRow.rowId === row.id

                                return (
                                  <tr
                                    key={row.id}
                                    className={cn(
                                      'border-b border-[#eee7db] text-[#3b3834] transition-colors duration-200 last:border-b-0',
                                      isRowEditing && 'bg-[#fef7f2]'
                                    )}
                                  >
                                    <td className="px-3 py-3">{row.label}</td>

                                    <td className="px-3 py-3">
                                      {isRowEditing ? (
                                        <input
                                          type="text"
                                          value={editingRow.maxValue}
                                          onChange={(event) =>
                                            setEditingRow((previous) =>
                                              previous ? { ...previous, maxValue: event.target.value } : previous
                                            )
                                          }
                                          placeholder={row.maxValue}
                                          className="h-8 w-full rounded-[8px] border border-[#d88960] bg-white px-3 text-[12px] transition-[border-color,box-shadow] duration-200 focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)]"
                                        />
                                      ) : (
                                        row.maxValue
                                      )}
                                    </td>

                                    {section.columns.length === 4 ? (
                                      <td className="px-3 py-3">
                                        {isRowEditing ? (
                                          <input
                                            type="text"
                                            value={editingRow.severity}
                                            onChange={(event) =>
                                              setEditingRow((previous) =>
                                                previous ? { ...previous, severity: event.target.value } : previous
                                              )
                                            }
                                            placeholder={row.severity || ''}
                                            className="h-8 w-full rounded-[8px] border border-[#d88960] bg-white px-3 text-[12px] transition-[border-color,box-shadow] duration-200 focus:shadow-[0_0_0_3px_rgba(193,99,61,0.12)]"
                                          />
                                        ) : (
                                          row.severity
                                        )}
                                      </td>
                                    ) : null}

                                    <td className="px-3 py-3 text-center text-[#c1633d]">
                                      {isRowEditing ? (
                                        <div className="flex items-center justify-center gap-1.5">
                                          <button
                                            onClick={saveRowEdit}
                                            className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px]"
                                            aria-label={`Guardar ${row.label}`}
                                          >
                                            <Save className="h-3.5 w-3.5" />
                                          </button>
                                          <button
                                            onClick={cancelRowEdit}
                                            className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px]"
                                            aria-label={`Cancelar edição de ${row.label}`}
                                          >
                                            <X className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => startRowEdit(section.id, row)}
                                          className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-200 hover:bg-[#fdf2eb] motion-safe:hover:-translate-y-[1px]"
                                          aria-label={`Editar ${row.label}`}
                                        >
                                          <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </div>
                  </motion.section>
                ))}
              </motion.div>

              <motion.div
                variants={createRevealVariants({ distance: 10 })}
                className="grid grid-cols-1 gap-4 pt-2 xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-8"
              >
                <div className="px-1">
                  <h2 className="text-[16px] font-semibold text-[#2f2d2a]">Versão da plataforma</h2>
                </div>
                <div className="px-1 py-1 text-[14px] text-[#4d4a46]">{platformVersion}</div>
              </motion.div>
            </motion.div>
          ) : null}

          {activeTab === 'credits' ? (
            <motion.div
              key="credits"
              variants={createRevealVariants({ distance: 12, duration: 0.24 })}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <Card className="max-w-[980px] p-6">
                <h2 className="text-[16px] font-semibold text-[#2f2d2a]">Créditos</h2>
                <div className="mt-4 space-y-3 text-[14px] text-[#4e4b46]">
                  <p>RiskRadar demonstrador visual para UMAIN WORKS.</p>
                  <p>Interface construída com React, Vite, Tailwind CSS e ApexCharts.</p>
                  <p>Versão atual: {platformVersion}</p>
                </div>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  )
}
