import * as FileSystem from 'expo-file-system'

import { getSharedDirectoryPath } from './AppGroupHelper'
import { logger } from './logger'

// Recovers from a partial master-password creation: if the app was killed
// between vault-blind-encryption setup and the encryption-store write, the
// `pearpass/vaults` dir is left blind-encrypted with the previous hashed
// password and the next attempt will fail to open it with a new salt.
// Safe to call only before vaults are opened by the worklet (i.e. before
// createMasterPassword / login).
export const clearStaleVaultsDir = async () => {
  try {
    const sharedDirectory = await getSharedDirectoryPath()
    const baseDirectory = sharedDirectory
      ? `file://${sharedDirectory}`
      : FileSystem.documentDirectory?.replace(/\/$/, '')

    if (!baseDirectory) {
      return
    }

    const vaultsPath = `${baseDirectory}/pearpass/vaults`
    const vaultDataPath = `${baseDirectory}/pearpass/vault`
    const encryptionPath = `${baseDirectory}/pearpass/encryption`

    const [vaultsInfo, vaultDataInfo, encryptionInfo] = await Promise.all([
      FileSystem.getInfoAsync(vaultsPath),
      FileSystem.getInfoAsync(vaultDataPath),
      FileSystem.getInfoAsync(encryptionPath)
    ])

    if (!vaultsInfo.exists) {
      return
    }

    // Safety guard: only safe to wipe `pearpass/vaults` when there is no
    // sign of completed sign-up state on disk. If `pearpass/vault/<id>`
    // (real records) or `pearpass/encryption` (master password store)
    // has any children, deleting the vaults registry would orphan the
    // user's records permanently.
    const hasVaultData =
      vaultDataInfo.exists &&
      (await FileSystem.readDirectoryAsync(vaultDataPath)).length > 0
    const hasEncryption =
      encryptionInfo.exists &&
      (await FileSystem.readDirectoryAsync(encryptionPath)).length > 0

    if (hasVaultData || hasEncryption) {
      logger.warn(
        'clearStaleVaultsDir: refusing to delete pearpass/vaults — found existing user data',
        { hasVaultData, hasEncryption }
      )
      return
    }

    await FileSystem.deleteAsync(vaultsPath, { idempotent: true })
  } catch (error) {
    logger.warn('Failed to clear stale vaults dir:', error)
  }
}
