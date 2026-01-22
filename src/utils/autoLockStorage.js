import AsyncStorage from '@react-native-async-storage/async-storage'

import { logger } from './logger'
import { ASYNC_STORAGE_KEYS } from '../constants/asyncStorageKeys'

const { LAST_ACTIVITY_AT } = ASYNC_STORAGE_KEYS

export const setLastActivityAt = async (timestamp = Date.now()) => {
  try {
    await AsyncStorage.setItem(LAST_ACTIVITY_AT, String(timestamp))
  } catch (error) {
    logger.error('Error saving last activity timestamp:', error)
  }
}

export const getLastActivityAt = async () => {
  try {
    const storedTimestamp = await AsyncStorage.getItem(LAST_ACTIVITY_AT)
    if (!storedTimestamp) {
      return null
    }

    const parsedTimestamp = Number(storedTimestamp)
    return Number.isNaN(parsedTimestamp) ? null : parsedTimestamp
  } catch (error) {
    logger.error('Error loading last activity timestamp:', error)
    return null
  }
}
