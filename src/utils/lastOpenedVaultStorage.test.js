import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  getLastOpenedVaultId,
  setLastOpenedVaultId
} from './lastOpenedVaultStorage'
import { logger } from './logger'
import { ASYNC_STORAGE_KEYS } from '../constants/asyncStorageKeys'

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn()
}))

jest.mock('./logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

describe('lastOpenedVaultStorage', () => {
  const { LAST_OPENED_VAULT_ID } = ASYNC_STORAGE_KEYS

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setLastOpenedVaultId', () => {
    it('stores the provided vault id', async () => {
      AsyncStorage.setItem.mockResolvedValue()

      await setLastOpenedVaultId('vault-123')

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        LAST_OPENED_VAULT_ID,
        'vault-123'
      )
    })

    it('coerces a non-string vault id to a string', async () => {
      AsyncStorage.setItem.mockResolvedValue()

      await setLastOpenedVaultId(42)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        LAST_OPENED_VAULT_ID,
        '42'
      )
    })

    it.each([undefined, null, '', 0])(
      'does not store when vault id is falsy (%p)',
      async (vaultId) => {
        await setLastOpenedVaultId(vaultId)

        expect(AsyncStorage.setItem).not.toHaveBeenCalled()
      }
    )

    it('logs when saving fails', async () => {
      const error = new Error('write failed')
      AsyncStorage.setItem.mockRejectedValue(error)

      await setLastOpenedVaultId('vault-123')

      expect(logger.error).toHaveBeenCalledWith(
        'Error saving last opened vault id:',
        error
      )
    })
  })

  describe('getLastOpenedVaultId', () => {
    it('returns the stored vault id', async () => {
      AsyncStorage.getItem.mockResolvedValue('vault-123')

      await expect(getLastOpenedVaultId()).resolves.toBe('vault-123')
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(LAST_OPENED_VAULT_ID)
    })

    it('returns null when no value is stored', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)

      await expect(getLastOpenedVaultId()).resolves.toBeNull()
    })

    it('logs when loading fails and returns null', async () => {
      const error = new Error('read failed')
      AsyncStorage.getItem.mockRejectedValue(error)

      await expect(getLastOpenedVaultId()).resolves.toBeNull()

      expect(logger.error).toHaveBeenCalledWith(
        'Error loading last opened vault id:',
        error
      )
    })
  })
})
