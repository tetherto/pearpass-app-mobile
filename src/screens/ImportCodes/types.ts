export type ImportCodesState = 'default' | 'upload' | 'reviewed'

export enum ImportCodesOptionType {
  Aegis = 'aegis',
  GoogleAuthenticator = 'google-authenticator',
  Bitwarden = 'bitwarden',
  Proton2FA = 'proton-2fa',
  PearPassEncrypted = 'pearpass-encrypted',
  PearPassUnencrypted = 'pearpass-unencrypted'
}

export type ImportCodesOption = {
  title: string
  type: ImportCodesOptionType
  description: string
  testId: string
  accepts: string[]
  supportLink?: string
}

export type ImportedCode = {
  id: string
  issuer: string
  accountName: string
}

export type MatchRecord = {
  id: string
  title: string
  subtitle?: string
}

export type CodeMatchEntry = {
  code: ImportedCode
  matchedRecord: MatchRecord | null
}
