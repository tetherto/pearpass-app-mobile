import * as FileSystem from 'expo-file-system'

import { getSharedDirectoryPath } from './AppGroupHelper'
import { clearStaleVaultsDir } from './clearStaleVaultsDir'
import { logger } from './logger'

jest.mock('expo-file-system', () => ({
  __esModule: true,
  documentDirectory: 'file:///documents/',
  getInfoAsync: jest.fn(),
  deleteAsync: jest.fn()
}))

jest.mock('./AppGroupHelper', () => ({
  getSharedDirectoryPath: jest.fn()
}))

jest.mock('./logger', () => ({
  logger: {
    warn: jest.fn()
  }
}))

describe('clearStaleVaultsDir', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    FileSystem.getInfoAsync.mockResolvedValue({ exists: false })
    FileSystem.deleteAsync.mockResolvedValue()
    getSharedDirectoryPath.mockResolvedValue(null)
  })

  it('deletes the vaults dir under the document directory when it exists', async () => {
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true })

    await clearStaleVaultsDir()

    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
      'file:///documents/pearpass/vaults'
    )
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      'file:///documents/pearpass/vaults',
      { idempotent: true }
    )
  })

  it('deletes the vaults dir under the iOS shared directory when available', async () => {
    getSharedDirectoryPath.mockResolvedValueOnce('/group/com.example')
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true })

    await clearStaleVaultsDir()

    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
      'file:///group/com.example/pearpass/vaults'
    )
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      'file:///group/com.example/pearpass/vaults',
      { idempotent: true }
    )
  })

  it('does nothing when the vaults dir does not exist', async () => {
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: false })

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

  it('strips a trailing slash from documentDirectory before joining', async () => {
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true })

    await clearStaleVaultsDir()

    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
      'file:///documents/pearpass/vaults'
    )
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
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true })
    FileSystem.deleteAsync.mockRejectedValueOnce(error)

    await expect(clearStaleVaultsDir()).resolves.toBeUndefined()

    expect(logger.warn).toHaveBeenCalledWith(
      'Failed to clear stale vaults dir:',
      error
    )
  })
})
