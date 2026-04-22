import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { students as rawStudents, type Intervention } from '../data/students'
import type { ProfileId } from '../lib/access'
import { DEFAULT_ENGINE_SETTINGS, applySettingsRowEdit, buildDerivedAppData, getSettingsSections, type DerivedAppData, type EngineSettings } from '../lib/riskEngine'

interface AppContextType {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    activeProfileId: ProfileId
    setActiveProfileId: (id: ProfileId) => void
    settings: EngineSettings
    settingsSections: ReturnType<typeof getSettingsSections>
    derivedData: DerivedAppData
    updateSettings: (newSettings: Partial<EngineSettings>) => void
    applySettingsTableEdit: (sectionId: string, rowId: string, values: { maxValue: string; severity?: string }) => void
    addStudentIntervention: (studentId: string, intervention: Intervention) => void
}

const AppContext = createContext<AppContextType>({
    isOpen: false,
    setIsOpen: () => { },
    activeProfileId: 'diretor',
    setActiveProfileId: () => { },
    settings: DEFAULT_ENGINE_SETTINGS,
    settingsSections: getSettingsSections(DEFAULT_ENGINE_SETTINGS),
    derivedData: buildDerivedAppData(rawStudents, DEFAULT_ENGINE_SETTINGS),
    updateSettings: () => { },
    applySettingsTableEdit: () => { },
    addStudentIntervention: () => { },
})

export function AppProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeProfileId, setActiveProfileId] = useState<ProfileId>('diretor')
    const [settings, setSettings] = useState<EngineSettings>(DEFAULT_ENGINE_SETTINGS)
    const [manualInterventions, setManualInterventions] = useState<Record<string, Intervention[]>>({})

    const updateSettings = (newSettings: Partial<EngineSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }))
    }

    const applySettingsTableEdit = (sectionId: string, rowId: string, values: { maxValue: string; severity?: string }) => {
        setSettings(prev => applySettingsRowEdit(prev, sectionId, rowId, values))
    }

    const addStudentIntervention = (studentId: string, intervention: Intervention) => {
        setManualInterventions(prev => ({
            ...prev,
            [studentId]: [...(prev[studentId] ?? []), intervention],
        }))
    }

    const mergedStudents = rawStudents.map(student => {
        const extraInterventions = manualInterventions[student.id] ?? []

        if (extraInterventions.length === 0) {
            return student
        }

        const latestInterventionDate = extraInterventions[extraInterventions.length - 1]?.date ?? student.lastUpdated

        return {
            ...student,
            interventions: [...student.interventions, ...extraInterventions],
            lastUpdated: latestInterventionDate,
        }
    })

    const derivedData = buildDerivedAppData(mergedStudents, settings)
    const settingsSections = getSettingsSections(settings)

    return (
        <AppContext.Provider
            value={{
                isOpen,
                setIsOpen,
                activeProfileId,
                setActiveProfileId,
                settings,
                settingsSections,
                derivedData,
                updateSettings,
                applySettingsTableEdit,
                addStudentIntervention,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}
