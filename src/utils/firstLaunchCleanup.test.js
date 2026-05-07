import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system'
import * as SecureStore from 'expo-secure-store'

import { getSharedDirectoryPath } from './AppGroupHelper'
import { runFirstLaunchCleanup } from './firstLaunchCleanup'
import { logger } from './logger'
import { ASYNC_STORAGE_KEYS } from '../constants/asyncStorageKeys'
import { SECURE_STORAGE_KEYS } from '../constants/secureStorageKeys'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}))

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn()
}))

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///documents/',
  getInfoAsync: jest.fn(),
  deleteAsync: jest.fn()
}))

jest.mock('./AppGroupHelper', () => ({
  getSharedDirectoryPath: jest.fn()
}))

jest.mock('./logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('runFirstLaunchCleanup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    FileSystem.getInfoAsync.mockResolvedValue({ exists: false })
    FileSystem.deleteAsync.mockResolvedValue()
    getSharedDirectoryPath.mockResolvedValue(null)
  })

  describe('First launch scenarios', () => {
    it('clears all SecureStore data on first launch', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()
      SecureStore.deleteItemAsync.mockResolvedValue()

      const result = await runFirstLaunchCleanup()

      expect(result).toEqual({ ok: true })
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FIRST_LAUNCH_KEY
      )

      const expectedKeys = Object.values(SECURE_STORAGE_KEYS)
      for (const key of expectedKeys) {
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key)
      }

      expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
        'file:///documents/pearpass'
      )
      expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
        'file:///documents/pearpass_jobs'
      )

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FIRST_LAUNCH_KEY,
        'true'
      )
    })

    it('clears shared vault directories on first launch when app group path is available', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()
      SecureStore.deleteItemAsync.mockResolvedValue()
      getSharedDirectoryPath.mockResolvedValue('/shared/group')
      FileSystem.getInfoAsync
        .mockResolvedValueOnce({ exists: true })
        .mockResolvedValueOnce({ exists: true })

      const result = await runFirstLaunchCleanup()

      expect(result).toEqual({ ok: true })
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///shared/group/pearpass',
        { idempotent: true }
      )
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///shared/group/pearpass_jobs',
        { idempotent: true }
      )
    })

    it('stores failed SecureStore keys for retry on first launch', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()

      const allKeys = Object.values(SECURE_STORAGE_KEYS)
      const failingKeys = allKeys.slice(0, -1)

      SecureStore.deleteItemAsync.mockImplementation((key) => {
        if (failingKeys.includes(key)) {
          return Promise.reject(new Error('Delete failed'))
        }
        return Promise.resolve()
      })

      const result = await runFirstLaunchCleanup()

      expect(result).toEqual({ ok: true })
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FIRST_LAUNCH_KEY,
        'true'
      )
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY,
        JSON.stringify(failingKeys)
      )
    })

    it('returns ok: false when clearVaultFileData throws', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()
      SecureStore.deleteItemAsync.mockResolvedValue()

      const deleteError = new Error('Unable to delete directory')
      FileSystem.getInfoAsync.mockResolvedValue({ exists: true })
      FileSystem.deleteAsync.mockRejectedValue(deleteError)

      const result = await runFirstLaunchCleanup()

      expect(result.ok).toBe(false)
      expect(result.error).toBe(deleteError)
      expect(logger.error).toHaveBeenCalledWith(
        'Error clearing data on first launch:',
        deleteError
      )
    })
  })

  describe('Subsequent launch scenarios', () => {
    it('retries failed keys on subsequent launch', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('true')
        .mockResolvedValueOnce(
          JSON.stringify([
            SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED
          ])
        )

      AsyncStorage.removeItem.mockResolvedValue()
      SecureStore.deleteItemAsync.mockResolvedValue()

      const result = await runFirstLaunchCleanup()

      expect(result).toEqual({ ok: true })
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
        SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED
      )
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY
      )
    })

    it('preserves still-failing keys on partial retry', async () => {
      const failedKeys = [
        SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED,
        SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD
      ]

      AsyncStorage.getItem
        .mockResolvedValueOnce('true')
        .mockResolvedValueOnce(JSON.stringify(failedKeys))

      AsyncStorage.setItem.mockResolvedValue()

      SecureStore.deleteItemAsync
        .mockResolvedValueOnce()
        .mockRejectedValueOnce(new Error('Still failing'))

      await runFirstLaunchCleanup()

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY,
        JSON.stringify([SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD])
      )
    })

    it('does nothing when there are no failed keys on subsequent launch', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('true')
        .mockResolvedValueOnce(null)

      const result = await runFirstLaunchCleanup()

      expect(result).toEqual({ ok: true })
      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled()
      expect(AsyncStorage.setItem).not.toHaveBeenCalled()
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('returns ok: false when AsyncStorage.getItem throws', async () => {
      const error = new Error('AsyncStorage error')
      AsyncStorage.getItem.mockRejectedValue(error)

      const result = await runFirstLaunchCleanup()

      expect(result.ok).toBe(false)
      expect(result.error).toBe(error)
      expect(logger.error).toHaveBeenCalledWith(
        'Error clearing data on first launch:',
        error
      )
      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled()
    })

    it('handles JSON parsing errors in failed keys gracefully', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('true')
        .mockResolvedValueOnce('invalid-json')

      const result = await runFirstLaunchCleanup()

      expect(result).toEqual({ ok: true })
      expect(logger.error).toHaveBeenCalledWith(
        'Error retrying failed keys:',
        expect.any(Error)
      )
      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled()
    })
  })
})
