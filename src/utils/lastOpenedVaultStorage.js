import AsyncStorage from '@react-native-async-storage/async-storage'

import { logger } from './logger'
import { ASYNC_STORAGE_KEYS } from '../constants/asyncStorageKeys'

const { LAST_OPENED_VAULT_ID } = ASYNC_STORAGE_KEYS

export const setLastOpenedVaultId = async (vaultId) => {
  if (!vaultId) {
    return
  }
  try {
    await AsyncStorage.setItem(LAST_OPENED_VAULT_ID, String(vaultId))
  } catch (error) {
    logger.error('Error saving last opened vault id:', error)
  }
}

export const getLastOpenedVaultId = async () => {
  try {
    return await AsyncStorage.getItem(LAST_OPENED_VAULT_ID)
  } catch (error) {
    logger.error('Error loading last opened vault id:', error)
    return null
  }
}
