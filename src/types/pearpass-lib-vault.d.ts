declare module '@tetherto/pearpass-lib-vault' {
  import type * as React from 'react'

  // ─── Constants ────────────────────────────────────────────────────────────

  export const RECORD_TYPES: {
    readonly OTP: 'otp'
    readonly NOTE: 'note'
    readonly CREDIT_CARD: 'creditCard'
    readonly CUSTOM: 'custom'
    readonly IDENTITY: 'identity'
    readonly LOGIN: 'login'
    readonly WIFI_PASSWORD: 'wifiPassword'
    readonly PASS_PHRASE: 'passPhrase'
  }

  export const OTP_TYPE: {
    readonly TOTP: 'TOTP'
    readonly HOTP: 'HOTP'
  }

  // ─── Shared types ─────────────────────────────────────────────────────────

  export interface OtpPublic {
    type: 'TOTP' | 'HOTP'
    digits: number
    period?: number
    issuer?: string
    label?: string
    currentCode: string | null
    timeRemaining?: number | null
  }

  export interface OtpGroupResult {
    totpGroups: Array<{ period: number; records: Array<unknown> }>
    hotpRecords: Array<unknown>
  }

  // ─── Hooks ────────────────────────────────────────────────────────────────

  export function useCreateRecord(options?: {
    onCompleted?: (payload: { record: unknown }) => void
    onError?: (error: Error) => void
  }): {
    isLoading: boolean
    createRecord: (record: unknown, onError?: (error: Error) => void) => Promise<void>
  }

  export function useRecords(options?: {
    onCompleted?: (payload: unknown) => void
    shouldSkip?: boolean
    variables?: {
      vaultId?: string
      filters?: {
        searchPattern?: string
        type?: string
        folder?: string
        isFavorite?: boolean
      }
      sort?: {
        field: string
        direction: 'asc' | 'desc'
        key: string
      }
    }
  }): {
    isLoading: boolean
    isInitialized: boolean
    data: unknown
    deleteRecords: (recordIds: string[]) => Promise<void>
    updateRecords: (records: unknown[], onError?: (error: Error) => void) => Promise<void>
    updateFolder: (recordIds: string[], folder: string) => Promise<void>
    updateFavoriteState: (recordIds: string[], isFavorite: boolean) => Promise<void>
    refetch: (vaultId: string) => Promise<void>
  }

  export function useCreateFolder(options?: {
    onCompleted?: (payload: { name: string }) => void
    onError?: (error: string) => void
  }): {
    isLoading: boolean
    createFolder: (folderName: string) => void
  }

  export function useFolders(options?: {
    variables?: { searchPattern?: string }
  }): {
    isLoading: boolean
    data: unknown[]
    renameFolder: (name: string, newName: string) => Promise<void>
    deleteFolder: (name: string) => Promise<void>
  }

  export function useRecordById(options?: {
    variables?: { id: string }
  }): {
    isLoading: boolean
    data: unknown
  }

  export function useRecordCountsByType(options?: {
    variables?: {
      filters?: {
        folder?: string
        isFavorite?: boolean
      }
    }
  }): {
    isLoading: boolean
    data: unknown
  }

  export function useVault(options?: {
    shouldSkip?: boolean
    variables?: { vaultId?: string }
  }): {
    isLoading: boolean
    isInitialized: boolean
    data: unknown
    refetch: (
      vaultId: string,
      params?: {
        password?: string
        ciphertext?: string
        nonce?: string
        hashedPassword?: string
      }
    ) => Promise<unknown>
    addDevice: (device: unknown) => Promise<void>
    isVaultProtected: (vaultId: string) => Promise<boolean>
    deleteVaultLocal: (vaultId: string) => Promise<unknown[]>
  }

  export function useVaults(options?: {
    onCompleted?: (payload: unknown) => void
    onInitialize?: (payload: unknown) => void
  }): {
    isLoading: boolean
    isInitialized: boolean
    data: unknown
    refetch: () => Promise<unknown>
    initVaults: (params?: {
      ciphertext?: string
      nonce?: string
      salt?: string
      hashedPassword?: string
      password?: Uint8Array
    }) => Promise<void>
    resetState: () => void
  }

  export function useCreateVault(): {
    isLoading: boolean
    createVault: (params: { name: string; password?: string }) => Promise<void>
  }

  export function useUserData(): {
    isLoading: boolean
    isInitialized: boolean
    data: {
      hasPasswordSet: boolean
      isLoggedIn: boolean
      isVaultOpen: boolean
    }
    hasPasswordSet: boolean
    masterPasswordStatus: {
      isLocked: boolean
      lockoutRemainingMs: number
      remainingAttempts: number
    }
    refetch: () => Promise<{
      hasPasswordSet: boolean
      isLoggedIn: boolean
      isVaultOpen: boolean
    }>
    logIn: (params: unknown) => Promise<void>
  }

  export function useFavicon(params: { url: string }): {
    faviconSrc: string | null
    isLoading: boolean
    hasError: boolean
  }

  export function useInvite(): {
    isLoading: boolean
    data: unknown
    createInvite: () => Promise<void>
    deleteInvite: () => Promise<void>
  }

  export function usePair(): {
    isLoading: boolean
    pairActiveVault: (inviteCode: string) => Promise<string>
    cancelPairActiveVault: () => Promise<void>
  }

  export function useBlindMirrors(): {
    isLoading: boolean
    error: string | object | null
    data: unknown[]
    addBlindMirrors: (blindMirrors: string[]) => Promise<unknown>
    addDefaultBlindMirrors: () => Promise<unknown>
    getBlindMirrors: () => Promise<unknown>
    removeBlindMirror: (key: string) => Promise<unknown>
    removeAllBlindMirrors: () => Promise<unknown>
  }

  export function useOtp(params: {
    recordId: string
    otpPublic: OtpPublic | null | undefined
  }): {
    isLoading: boolean
    generateNext: () => Promise<void>
  }

  export function useOtpRefresh(): (() => void) | null

  export function useTimerAnimation(
    timeRemaining: number | null,
    period: number,
    animated?: boolean
  ): {
    noTransition: boolean
    expiring: boolean
    targetTime: number
  }

  // ─── API functions ────────────────────────────────────────────────────────

  export function vaultGetFile(key: string): Promise<unknown>
  export function listRecords(): Promise<unknown[]>
  export function generateOtpCodesByIds(
    recordIds: string[]
  ): Promise<Array<{ recordId: string; code: string; timeRemaining?: number }>>
  export function generateHotpNext(recordId: string): Promise<{ code: string } | null>
  export function closeAllInstances(): Promise<void>
  export function setPearpassVaultClient(client: unknown): void
  export function setStoragePath(path: string): void
  export function authoriseCurrentProtectedVault(params: unknown): Promise<unknown>
  export function getVaultById(vaultId: string): Promise<unknown>
  export function getCurrentProtectedVaultEncryption(): Promise<unknown>
  export function getMasterEncryption(): Promise<unknown>
  export function getDefaultFavicon(): Promise<unknown>
  export function encryptExportData(data: unknown): Promise<unknown>
  export function decryptExportData(data: unknown): Promise<unknown>

  // ─── Utils ────────────────────────────────────────────────────────────────

  export function formatOtpCode(code: string): string
  export function createAlignedInterval(
    callback: () => void,
    period: number
  ): () => void
  export function isExpiring(timeRemaining: number, period: number): boolean
  export const EXPIRY_THRESHOLD_SECONDS: number
  export function groupOtpRecords(
    records: Array<{ otpPublic?: OtpPublic }>
  ): OtpGroupResult

  // ─── Context / Provider ───────────────────────────────────────────────────

  export const VaultProvider: React.ComponentType<{ children: React.ReactNode }>
  export const OtpRefreshProvider: React.ComponentType<{ children: React.ReactNode }>
}
