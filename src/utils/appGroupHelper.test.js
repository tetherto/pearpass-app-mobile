import { NativeModules } from 'react-native'

import { getSharedDirectoryPath } from './AppGroupHelper'
import { logger } from './logger'

jest.mock('react-native', () => ({
  NativeModules: {
    AppGroupHelper: {
      getSharedDirectoryPath: jest.fn()
    }
  },
  Platform: {
    OS: 'ios',
    select: (objs) => objs.ios
  }
}))

jest.mock('./logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn()
  }
}))

describe('appGroupHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSharedDirectoryPath', () => {
    test('should return the shared directory path when successful', async () => {
      const mockPath =
        '/Users/app/Library/Group Containers/group.com.example.app'
      NativeModules.AppGroupHelper.getSharedDirectoryPath.mockResolvedValueOnce(
        mockPath
      )

      const result = await getSharedDirectoryPath()

      expect(result).toBe(mockPath)
      expect(
        NativeModules.AppGroupHelper.getSharedDirectoryPath
      ).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith(
        'App Group Helper returned path:',
        mockPath
      )
    })

    test('should return null when AppGroupHelper throws an error', async () => {
      const mockError = new Error('Native module not available')
      NativeModules.AppGroupHelper.getSharedDirectoryPath.mockRejectedValueOnce(
        mockError
      )

      const result = await getSharedDirectoryPath()

      expect(result).toBeNull()
      expect(
        NativeModules.AppGroupHelper.getSharedDirectoryPath
      ).toHaveBeenCalledTimes(1)
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed to get App Group directory:',
        mockError
      )
    })

    test('should handle undefined path gracefully', async () => {
      NativeModules.AppGroupHelper.getSharedDirectoryPath.mockResolvedValueOnce(
        undefined
      )

      const result = await getSharedDirectoryPath()

      expect(result).toBeUndefined()
      expect(
        NativeModules.AppGroupHelper.getSharedDirectoryPath
      ).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith(
        'App Group Helper returned path:',
        undefined
      )
    })

    test('should handle empty string path', async () => {
      const mockPath = ''
      NativeModules.AppGroupHelper.getSharedDirectoryPath.mockResolvedValueOnce(
        mockPath
      )

      const result = await getSharedDirectoryPath()

      expect(result).toBe('')
      expect(
        NativeModules.AppGroupHelper.getSharedDirectoryPath
      ).toHaveBeenCalledTimes(1)
      expect(logger.log).toHaveBeenCalledWith(
        'App Group Helper returned path:',
        mockPath
      )
    })
  })
})
