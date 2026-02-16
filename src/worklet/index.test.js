import * as FileSystem from 'expo-file-system'
import { PearpassVaultClient } from 'pearpass-lib-vault-core'
import { Platform } from 'react-native'
import { Worklet } from 'react-native-bare-kit'

import { createPearpassVaultClient } from './index'

jest.mock('expo-file-system', () => ({
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  documentDirectory: 'file:///test-dir/'
}))

jest.mock('react-native-bare-kit', () => ({
  Worklet: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    IPC: {}
  }))
}))

jest.mock('pearpass-lib-vault-core', () => ({
  PearpassVaultClient: jest
    .fn()
    .mockImplementation(function PearpassVaultClient() {
      return {
        setJobStoragePath: jest.fn()
      }
    })
}))

jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn()
  },
  AppState: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn()
    }))
  }
}))

jest.mock('../../bundles/app-ios.bundle.js', () => 'ios-bundle-content', {
  virtual: true
})
jest.mock(
  '../../bundles/app-android.bundle.js',
  () => 'android-bundle-content',
  {
    virtual: true
  }
)
jest.mock('../utils/AppGroupHelper.js', () => ({
  getSharedDirectoryPath: jest.fn().mockResolvedValue('/test-dir')
}))

describe('createPearpassVaultClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a client for iOS', async () => {
    Platform.select.mockReturnValue(require('../../bundles/app-ios.bundle.js'))
    FileSystem.getInfoAsync.mockResolvedValue({
      exists: false
    })

    const client = await createPearpassVaultClient()

    expect(Platform.select).toHaveBeenCalledWith({
      ios: expect.any(String),
      android: expect.any(String)
    })
    expect(Worklet).toHaveBeenCalledTimes(1)
    const workletInstance = Worklet.mock.results[0].value
    expect(workletInstance.start).toHaveBeenCalledWith(
      '/worklet.bundle',
      'ios-bundle-content'
    )
    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
      'file:///test-dir/pearpass'
    )
    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
      'file:///test-dir/pearpass',
      {
        intermediates: true
      }
    )
    expect(PearpassVaultClient).toHaveBeenCalledWith(
      workletInstance.IPC,
      'file:///test-dir/pearpass',
      {
        debugMode: undefined
      }
    )
    expect(client).toBe(PearpassVaultClient.mock.results[0].value)
  })

  it('should create a client for Android', async () => {
    Platform.select.mockReturnValue(
      require('../../bundles/app-android.bundle.js')
    )
    FileSystem.getInfoAsync.mockResolvedValue({
      exists: false
    })

    await createPearpassVaultClient()

    const workletInstance = Worklet.mock.results[0].value
    expect(workletInstance.start).toHaveBeenCalledWith(
      '/worklet.bundle',
      'android-bundle-content'
    )
  })

  it('should not create directory if it already exists', async () => {
    Platform.select.mockReturnValue(require('../../bundles/app-ios.bundle.js'))
    FileSystem.getInfoAsync.mockResolvedValue({
      exists: true
    })

    await createPearpassVaultClient()

    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
      'file:///test-dir/pearpass'
    )
    expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled()
  })

  it('should throw an error if bundle is not available', async () => {
    Platform.select.mockReturnValue(undefined)

    await expect(createPearpassVaultClient()).rejects.toThrow(
      'File URI is not available.'
    )
  })

  it('should pass debugMode option to the client', async () => {
    Platform.select.mockReturnValue(require('../../bundles/app-ios.bundle.js'))
    FileSystem.getInfoAsync.mockResolvedValue({
      exists: true
    })

    await createPearpassVaultClient({
      debugMode: true
    })

    const workletInstance = Worklet.mock.results[0].value
    expect(PearpassVaultClient).toHaveBeenCalledWith(
      workletInstance.IPC,
      'file:///test-dir/pearpass',
      {
        debugMode: true
      }
    )
  })
})
