import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type ProfileId = 'diretor' | 'sas' | 'obs'

interface AppSettings {
    riskThresholds: {
        none: number
        low: number
        medium: number
    }
    enableEffects: boolean
    bmadUnlocked: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
    riskThresholds: { none: 20, low: 40, medium: 60 },
    enableEffects: true,
    bmadUnlocked: false
}

interface AppContextType {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    activeProfileId: ProfileId
    setActiveProfileId: (id: ProfileId) => void
    settings: AppSettings
    updateSettings: (newSettings: Partial<AppSettings>) => void
}

const AppContext = createContext<AppContextType>({
    isOpen: false,
    setIsOpen: () => { },
    activeProfileId: 'diretor',
    setActiveProfileId: () => { },
    settings: DEFAULT_SETTINGS,
    updateSettings: () => { }
})

export function AppProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeProfileId, setActiveProfileId] = useState<ProfileId>('diretor')
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }))
    }

    return (
        <AppContext.Provider value={{ isOpen, setIsOpen, activeProfileId, setActiveProfileId, settings, updateSettings }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}
