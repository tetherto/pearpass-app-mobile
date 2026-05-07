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

    const [vaultsInfo, vaultDataInfo] = await Promise.all([
      FileSystem.getInfoAsync(vaultsPath),
      FileSystem.getInfoAsync(vaultDataPath)
    ])

    if (!vaultsInfo.exists) {
      return
    }

    const hasVaultData =
      vaultDataInfo.exists &&
      (await FileSystem.readDirectoryAsync(vaultDataPath)).length > 0

    if (hasVaultData) {
      logger.log(
        'clearStaleVaultsDir: refusing to delete pearpass/vaults — found existing user data',
        { hasVaultData }
      )
      return
    }

    await FileSystem.deleteAsync(vaultsPath, { idempotent: true })
  } catch (error) {
    logger.warn('Failed to clear stale vaults dir:', error)
  }
}
