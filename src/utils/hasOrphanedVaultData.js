import * as FileSystem from 'expo-file-system'

import { getSharedDirectoryPath } from './AppGroupHelper'

// `pearpass/vault/` (singular) is written only by `initActiveVaultInstance`
// after a successful `createVault`. Its presence with children is
// unambiguous evidence the user already had at least one vault.
export const hasOrphanedVaultData = async () => {
  try {
    const sharedDirectory = await getSharedDirectoryPath()
    const baseDirectory = sharedDirectory
      ? `file://${sharedDirectory}`
      : FileSystem.documentDirectory?.replace(/\/$/, '')
    if (!baseDirectory) return false
    const vaultDataPath = `${baseDirectory}/pearpass/vault`
    const info = await FileSystem.getInfoAsync(vaultDataPath)
    if (!info.exists) return false
    const children = await FileSystem.readDirectoryAsync(vaultDataPath)
    return children.length > 0
  } catch {
    return false
  }
}
