import { createContext } from 'react'
import { DEFAULT_PROFILE_ID, type ProfileId } from '../lib/accessControl'
import { DEFAULT_SETTINGS, type AppSettings } from '../lib/appSettings'

export interface AppContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  activeProfileId: ProfileId
  setActiveProfileId: (id: ProfileId) => void
  settings: AppSettings
  updateSettings: (newSettings: Partial<AppSettings>) => void
}

export const AppContext = createContext<AppContextType>({
  isOpen: false,
  setIsOpen: () => {},
  activeProfileId: DEFAULT_PROFILE_ID,
  setActiveProfileId: () => {},
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
})
