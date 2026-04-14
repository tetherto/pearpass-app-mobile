import AsyncStorage from '@react-native-async-storage/async-storage'
import { renderHook, waitFor } from '@testing-library/react-native'
import * as FileSystem from 'expo-file-system'
import * as SecureStore from 'expo-secure-store'

import { useFirstLaunchCleanUp } from './useFirstLaunchCleanUp'
import { ASYNC_STORAGE_KEYS } from '../constants/asyncStorageKeys'
import { SECURE_STORAGE_KEYS } from '../constants/secureStorageKeys'
import { getSharedDirectoryPath } from '../utils/AppGroupHelper'
import { logger } from '../utils/logger'

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

jest.mock('../utils/AppGroupHelper', () => ({
  getSharedDirectoryPath: jest.fn()
}))

jest.mock('../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('useFirstLaunchCleanUp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    FileSystem.getInfoAsync.mockResolvedValue({ exists: false })
    FileSystem.deleteAsync.mockResolvedValue()
    getSharedDirectoryPath.mockResolvedValue(null)
  })

  describe('First launch scenarios', () => {
    it('should clear all SecureStore data on first launch', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()
      SecureStore.deleteItemAsync.mockResolvedValue()

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FIRST_LAUNCH_KEY
        )
      })

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

    it('should clear shared vault directories on first launch when app group path is available', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()
      SecureStore.deleteItemAsync.mockResolvedValue()
      getSharedDirectoryPath.mockResolvedValue('/shared/group')
      FileSystem.getInfoAsync
        .mockResolvedValueOnce({ exists: true })
        .mockResolvedValueOnce({ exists: true })
      FileSystem.deleteAsync.mockResolvedValue()

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
          'file:///shared/group/pearpass',
          { idempotent: true }
        )
      })

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///shared/group/pearpass_jobs',
        { idempotent: true }
      )
    })

    it('should handle SecureStore deletion failures on first launch', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()

      // Mock all keys to fail except one
      const allKeys = Object.values(SECURE_STORAGE_KEYS)
      const failingKeys = allKeys.slice(0, -1) // All but last key fail

      SecureStore.deleteItemAsync.mockImplementation((key) => {
        if (failingKeys.includes(key)) {
          return Promise.reject(new Error('Delete failed'))
        }
        return Promise.resolve()
      })

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FIRST_LAUNCH_KEY,
          'true'
        )
      })

      // Should store failed keys for retry
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY,
        JSON.stringify(failingKeys)
      )
    })

    it('should handle complete SecureStore deletion failure on first launch', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()

      // Mock all keys failing to delete
      SecureStore.deleteItemAsync.mockRejectedValue(
        new Error('All deletes failed')
      )

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FIRST_LAUNCH_KEY,
          'true'
        )
      })

      // Should store all keys as failed
      const expectedKeys = Object.values(SECURE_STORAGE_KEYS)
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY,
        JSON.stringify(expectedKeys)
      )
    })
  })

  describe('Subsequent launch scenarios', () => {
    it('should retry failed keys on subsequent launch', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('true') // First launch flag exists
        .mockResolvedValueOnce(
          JSON.stringify([
            SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED
          ])
        ) // Failed keys exist

      AsyncStorage.removeItem.mockResolvedValue()
      SecureStore.deleteItemAsync.mockResolvedValue()

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY
        )
      })

      // Should retry the failed key
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
        SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED
      )

      // Should remove failed keys list since all succeeded
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY
      )
    })

    it('should handle partial retry success on subsequent launch', async () => {
      const failedKeys = [
        SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED,
        SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD
      ]

      AsyncStorage.getItem
        .mockResolvedValueOnce('true') // First launch flag exists
        .mockResolvedValueOnce(JSON.stringify(failedKeys)) // Failed keys exist

      AsyncStorage.setItem.mockResolvedValue()

      // Mock first key succeeds, second fails
      SecureStore.deleteItemAsync
        .mockResolvedValueOnce() // First key succeeds
        .mockRejectedValueOnce(new Error('Still failing')) // Second key still fails

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY,
          JSON.stringify([SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD])
        )
      })
    })

    it('should handle no failed keys on subsequent launch', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('true') // First launch flag exists
        .mockResolvedValueOnce(null) // No failed keys

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY
        )
      })

      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled()

      // Should not call AsyncStorage.setItem or removeItem
      expect(AsyncStorage.setItem).not.toHaveBeenCalled()
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('should handle AsyncStorage errors gracefully', async () => {
      AsyncStorage.getItem.mockRejectedValue(new Error('AsyncStorage error'))

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          'Error clearing data on first launch:',
          expect.any(Error)
        )
      })

      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled()
    })

    it('should handle SecureStore errors during retry gracefully', async () => {
      const failedKey = SECURE_STORAGE_KEYS.IS_PASSKEY_ENABLED

      AsyncStorage.getItem
        .mockResolvedValueOnce('true') // First launch flag exists
        .mockResolvedValueOnce(JSON.stringify([failedKey])) // Failed keys exist

      SecureStore.deleteItemAsync.mockRejectedValue(
        new Error('SecureStore error')
      )

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          `Failed to clear SecureStore key ${failedKey}:`,
          expect.any(Error)
        )
      })

      // Should still try to update failed keys list
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY,
        JSON.stringify([failedKey])
      )
    })

    it('should handle JSON parsing errors in failed keys', async () => {
      AsyncStorage.getItem
        .mockResolvedValueOnce('true') // First launch flag exists
        .mockResolvedValueOnce('invalid-json') // Invalid JSON

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          'Error retrying failed keys:',
          expect.any(Error)
        )
      })

      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled()
    })
  })

  describe('Hook behavior', () => {
    it('should report ready after cleanup finishes', async () => {
      AsyncStorage.getItem.mockResolvedValue('true')

      const { result } = renderHook(() => useFirstLaunchCleanUp())

      expect(result.current).toBe(false)

      await waitFor(() => {
        expect(result.current).toBe(true)
      })
    })

    it('should run cleanup only once on mount', async () => {
      AsyncStorage.getItem.mockResolvedValue('true')
      AsyncStorage.getItem.mockResolvedValueOnce(null) // No failed keys

      const { rerender } = renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FIRST_LAUNCH_KEY
        )
      })

      jest.clearAllMocks()

      rerender()

      expect(AsyncStorage.getItem).not.toHaveBeenCalled()
    })
  })

  describe('Integration scenarios', () => {
    it('should handle first launch with failures and store failed keys', async () => {
      // First launch - some keys fail
      AsyncStorage.getItem.mockResolvedValue(null)
      AsyncStorage.setItem.mockResolvedValue()

      const allKeys = Object.values(SECURE_STORAGE_KEYS)
      const failingKeys = allKeys.slice(0, 2) // First 2 keys fail

      SecureStore.deleteItemAsync.mockImplementation((key) => {
        if (failingKeys.includes(key)) {
          return Promise.reject(new Error('Delete failed'))
        }
        return Promise.resolve()
      })

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY,
          JSON.stringify(failingKeys)
        )
      })

      // Should set first launch flag
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        ASYNC_STORAGE_KEYS.FIRST_LAUNCH_KEY,
        'true'
      )
    })

    it('should handle subsequent launch with successful retry', async () => {
      const failedKeys = [SECURE_STORAGE_KEYS.IS_PASSKEY_ENABLED]

      // Mock subsequent launch with failed keys
      AsyncStorage.getItem
        .mockResolvedValueOnce('true') // First launch flag exists
        .mockResolvedValueOnce(JSON.stringify(failedKeys)) // Failed keys exist

      AsyncStorage.removeItem.mockResolvedValue()
      SecureStore.deleteItemAsync.mockResolvedValue()

      renderHook(() => useFirstLaunchCleanUp())

      await waitFor(() => {
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
          ASYNC_STORAGE_KEYS.FAILED_KEYS_KEY
        )
      })

      // Should successfully retry the failed keys
      for (const key of failedKeys) {
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key)
      }
      expect(logger.log).toHaveBeenCalledWith(
        'Completed SecureStore data clearing - no failed keys'
      )
    })
  })
})
