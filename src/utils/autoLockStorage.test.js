import AsyncStorage from '@react-native-async-storage/async-storage'

import { getLastActivityAt, setLastActivityAt } from './autoLockStorage'
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

describe('autoLockStorage', () => {
  const { LAST_ACTIVITY_AT } = ASYNC_STORAGE_KEYS

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setLastActivityAt', () => {
    it('stores the provided timestamp', async () => {
      AsyncStorage.setItem.mockResolvedValue()

      await setLastActivityAt(4567)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        LAST_ACTIVITY_AT,
        '4567'
      )
    })

    it('stores Date.now() when no timestamp is provided', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1234)
      AsyncStorage.setItem.mockResolvedValue()

      await setLastActivityAt()

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        LAST_ACTIVITY_AT,
        '1234'
      )
    })

    it('logs when saving fails', async () => {
      const error = new Error('write failed')
      AsyncStorage.setItem.mockRejectedValue(error)

      await setLastActivityAt(1)

      expect(logger.error).toHaveBeenCalledWith(
        'Error saving last activity timestamp:',
        error
      )
    })
  })

  describe('getLastActivityAt', () => {
    it('returns null when no value is stored', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)

      await expect(getLastActivityAt()).resolves.toBeNull()
    })

    it('returns a number when the stored value is valid', async () => {
      AsyncStorage.getItem.mockResolvedValue('9876')

      await expect(getLastActivityAt()).resolves.toBe(9876)
    })

    it('returns null when the stored value is not a number', async () => {
      AsyncStorage.getItem.mockResolvedValue('not-a-number')

      await expect(getLastActivityAt()).resolves.toBeNull()
    })

    it('logs when loading fails and returns null', async () => {
      const error = new Error('read failed')
      AsyncStorage.getItem.mockRejectedValue(error)

      await expect(getLastActivityAt()).resolves.toBeNull()

      expect(logger.error).toHaveBeenCalledWith(
        'Error loading last activity timestamp:',
        error
      )
    })
  })
})
