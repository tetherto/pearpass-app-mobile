import * as FileSystem from 'expo-file-system'

import { getSharedDirectoryPath } from './AppGroupHelper'
import { hasOrphanedVaultData } from './hasOrphanedVaultData'

jest.mock('expo-file-system', () => ({
  __esModule: true,
  documentDirectory: 'file:///documents/',
  getInfoAsync: jest.fn(),
  readDirectoryAsync: jest.fn()
}))

jest.mock('./AppGroupHelper', () => ({
  getSharedDirectoryPath: jest.fn()
}))

describe('hasOrphanedVaultData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getSharedDirectoryPath.mockResolvedValue(null)
    FileSystem.getInfoAsync.mockResolvedValue({ exists: false })
    FileSystem.readDirectoryAsync.mockResolvedValue([])
  })

  it('returns false when pearpass/vault does not exist', async () => {
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: false })
    await expect(hasOrphanedVaultData()).resolves.toBe(false)
  })

  it('returns false when pearpass/vault exists but is empty', async () => {
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true })
    FileSystem.readDirectoryAsync.mockResolvedValueOnce([])
    await expect(hasOrphanedVaultData()).resolves.toBe(false)
  })

  it('returns true when pearpass/vault has children', async () => {
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true })
    FileSystem.readDirectoryAsync.mockResolvedValueOnce(['some-vault-id'])
    await expect(hasOrphanedVaultData()).resolves.toBe(true)
  })

  it('uses the shared directory path when available', async () => {
    getSharedDirectoryPath.mockResolvedValueOnce('/group/com.example')
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true })
    FileSystem.readDirectoryAsync.mockResolvedValueOnce(['some-vault-id'])

    await expect(hasOrphanedVaultData()).resolves.toBe(true)
    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
      'file:///group/com.example/pearpass/vault'
    )
  })

  it('returns false when no base directory can be resolved', async () => {
    Object.defineProperty(FileSystem, 'documentDirectory', {
      value: null,
      configurable: true,
      writable: true
    })

    try {
      await expect(hasOrphanedVaultData()).resolves.toBe(false)
      expect(FileSystem.getInfoAsync).not.toHaveBeenCalled()
    } finally {
      Object.defineProperty(FileSystem, 'documentDirectory', {
        value: 'file:///documents/',
        configurable: true,
        writable: true
      })
    }
  })

  it('returns false when getInfoAsync throws', async () => {
    FileSystem.getInfoAsync.mockRejectedValueOnce(new Error('boom'))
    await expect(hasOrphanedVaultData()).resolves.toBe(false)
  })
})
