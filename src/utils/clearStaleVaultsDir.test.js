import * as FileSystem from 'expo-file-system'

import { getSharedDirectoryPath } from './AppGroupHelper'
import { clearStaleVaultsDir } from './clearStaleVaultsDir'
import { logger } from './logger'

jest.mock('expo-file-system', () => ({
  __esModule: true,
  documentDirectory: 'file:///documents/',
  getInfoAsync: jest.fn(),
  readDirectoryAsync: jest.fn(),
  deleteAsync: jest.fn()
}))

jest.mock('./AppGroupHelper', () => ({
  getSharedDirectoryPath: jest.fn()
}))

jest.mock('./logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn()
  }
}))

const VAULTS_PATH = 'file:///documents/pearpass/vaults'
const VAULT_DATA_PATH = 'file:///documents/pearpass/vault'

const mockInfo = ({ vaults, vault }) => {
  FileSystem.getInfoAsync.mockImplementation(async (path) => {
    if (path === VAULTS_PATH) return vaults
    if (path === VAULT_DATA_PATH) return vault
    return { exists: false }
  })
}

describe('clearStaleVaultsDir', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockInfo({
      vaults: { exists: false },
      vault: { exists: false }
    })
    FileSystem.readDirectoryAsync.mockResolvedValue([])
    FileSystem.deleteAsync.mockResolvedValue()
    getSharedDirectoryPath.mockResolvedValue(null)
  })

  it('deletes the vaults dir under the document directory when it exists and no user data is present', async () => {
    mockInfo({
      vaults: { exists: true },
      vault: { exists: false }
    })

    await clearStaleVaultsDir()

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(VAULTS_PATH, {
      idempotent: true
    })
  })

  it('deletes the vaults dir under the iOS shared directory when available', async () => {
    getSharedDirectoryPath.mockResolvedValueOnce('/group/com.example')
    FileSystem.getInfoAsync.mockImplementation(async (path) => {
      if (path === 'file:///group/com.example/pearpass/vaults') {
        return { exists: true }
      }
      return { exists: false }
    })

    await clearStaleVaultsDir()

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      'file:///group/com.example/pearpass/vaults',
      { idempotent: true }
    )
  })

  it('does nothing when the vaults dir does not exist', async () => {
    mockInfo({
      vaults: { exists: false },
      vault: { exists: false }
    })

    await clearStaleVaultsDir()

    expect(FileSystem.deleteAsync).not.toHaveBeenCalled()
  })

  it('does nothing when no base directory can be resolved', async () => {
    Object.defineProperty(FileSystem, 'documentDirectory', {
      value: null,
      configurable: true,
      writable: true
    })

    try {
      await clearStaleVaultsDir()

      expect(FileSystem.getInfoAsync).not.toHaveBeenCalled()
      expect(FileSystem.deleteAsync).not.toHaveBeenCalled()
    } finally {
      Object.defineProperty(FileSystem, 'documentDirectory', {
        value: 'file:///documents/',
        configurable: true,
        writable: true
      })
    }
  })

  it('refuses to delete when pearpass/vault has children', async () => {
    mockInfo({
      vaults: { exists: true },
      vault: { exists: true }
    })
    FileSystem.readDirectoryAsync.mockImplementation(async (path) => {
      if (path === VAULT_DATA_PATH) return ['some-vault-id']
      return []
    })

    await clearStaleVaultsDir()

    expect(FileSystem.deleteAsync).not.toHaveBeenCalled()
    expect(logger.log).toHaveBeenCalledWith(
      'clearStaleVaultsDir: refusing to delete pearpass/vaults — found existing user data',
      { hasVaultData: true }
    )
  })

  it('deletes when pearpass/vault exists but is empty', async () => {
    mockInfo({
      vaults: { exists: true },
      vault: { exists: true }
    })
    FileSystem.readDirectoryAsync.mockResolvedValue([])

    await clearStaleVaultsDir()

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(VAULTS_PATH, {
      idempotent: true
    })
  })

  it('swallows errors and logs a warning', async () => {
    const error = new Error('boom')
    FileSystem.getInfoAsync.mockRejectedValueOnce(error)

    await expect(clearStaleVaultsDir()).resolves.toBeUndefined()

    expect(logger.warn).toHaveBeenCalledWith(
      'Failed to clear stale vaults dir:',
      error
    )
    expect(FileSystem.deleteAsync).not.toHaveBeenCalled()
  })

  it('swallows errors thrown from deleteAsync', async () => {
    const error = new Error('delete failed')
    mockInfo({
      vaults: { exists: true },
      vault: { exists: false }
    })
    FileSystem.deleteAsync.mockRejectedValueOnce(error)

    await expect(clearStaleVaultsDir()).resolves.toBeUndefined()

    expect(logger.warn).toHaveBeenCalledWith(
      'Failed to clear stale vaults dir:',
      error
    )
  })
})
