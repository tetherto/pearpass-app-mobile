import AsyncStorage from '@react-native-async-storage/async-storage'

import { logger } from './logger'
import { ASYNC_STORAGE_KEYS } from '../constants/asyncStorageKeys'

const { LAST_ACCESSED_VAULT_ID } = ASYNC_STORAGE_KEYS

export const setLastAccessedVaultId = async (vaultId) => {
  if (!vaultId) return
  try {
    await AsyncStorage.setItem(LAST_ACCESSED_VAULT_ID, String(vaultId))
  } catch (error) {
    logger.error('Error saving last accessed vault id:', error)
  }
}

export const getLastAccessedVaultId = async () => {
  try {
    return await AsyncStorage.getItem(LAST_ACCESSED_VAULT_ID)
  } catch (error) {
    logger.error('Error loading last accessed vault id:', error)
    return null
  }
}

export const clearLastAccessedVaultId = async () => {
  try {
    await AsyncStorage.removeItem(LAST_ACCESSED_VAULT_ID)
  } catch (error) {
    logger.error('Error clearing last accessed vault id:', error)
  }
}
