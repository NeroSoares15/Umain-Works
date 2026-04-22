export type ProfileId = 'diretor' | 'sas' | 'obs'

export function canViewSensitiveData(profileId: ProfileId) {
  return profileId === 'sas'
}

export function canEditSettings(profileId: ProfileId) {
  return profileId === 'sas'
}

export function canManageInterventions(profileId: ProfileId) {
  return profileId === 'sas'
}

export function shouldAnonymizeIdentity(profileId: ProfileId) {
  return profileId === 'obs'
}

export function obfuscateName(name: string, anonymize: boolean) {
  if (!anonymize) return name

  return name
    .split(' ')
    .map((part) => `${part[0]}***`)
    .join(' ')
}

export function obfuscateNumber(number: string, anonymize: boolean) {
  return anonymize ? '***' : number
}
