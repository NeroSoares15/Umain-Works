import { useState } from 'react'
import type { ReactNode } from 'react'
import { AppContext } from './AppContext'
import { DEFAULT_PROFILE_ID, type ProfileId } from '../lib/accessControl'
import { DEFAULT_SETTINGS, type AppSettings } from '../lib/appSettings'

export function AppProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeProfileId, setActiveProfileId] = useState<ProfileId>(DEFAULT_PROFILE_ID)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((previous) => ({
      ...previous,
      ...newSettings,
      riskThresholds: newSettings.riskThresholds
        ? { ...previous.riskThresholds, ...newSettings.riskThresholds }
        : previous.riskThresholds,
      riskSignals: newSettings.riskSignals
        ? { ...previous.riskSignals, ...newSettings.riskSignals }
        : previous.riskSignals,
      profileMultipliers: newSettings.profileMultipliers
        ? { ...previous.profileMultipliers, ...newSettings.profileMultipliers }
        : previous.profileMultipliers,
    }))
  }

  return (
    <AppContext.Provider
      value={{ isOpen, setIsOpen, activeProfileId, setActiveProfileId, settings, updateSettings }}
    >
      {children}
    </AppContext.Provider>
  )
}
