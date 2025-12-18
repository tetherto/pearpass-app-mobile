import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import { Platform } from 'react-native'

import { handleDownloadFile } from './handleDownloadFile'
import { logger } from './logger'

jest.mock('expo-file-system', () => ({
  cacheDirectory: 'file:///cache/directory/',
  writeAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64'
  }
}))

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn()
}))

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android'
  }
}))

jest.mock('./logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

describe('handleDownloadFile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should write file to filesystem and share it on mobile', async () => {
    const file = {
      base64: 'base64EncodedContent',
      name: 'test-file.pdf'
    }

    await handleDownloadFile(file)

    const expectedPath = 'file:///cache/directory/test-file.pdf'
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      expectedPath,
      'base64EncodedContent',
      { encoding: 'base64' }
    )
    expect(shareAsync).toHaveBeenCalledWith(expectedPath, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share file'
    })
  })

  it('should not share file on web platform', async () => {
    Platform.OS = 'web'
    const file = {
      base64: 'base64EncodedContent',
      name: 'test-file.pdf'
    }

    await handleDownloadFile(file)

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled()
    expect(shareAsync).not.toHaveBeenCalled()
  })

  it('should log error when file operation fails', async () => {
    const error = new Error('File system error')
    FileSystem.writeAsStringAsync.mockRejectedValueOnce(error)
    const file = {
      base64: 'base64EncodedContent',
      name: 'test-file.pdf'
    }

    await handleDownloadFile(file)

    expect(logger.error).toHaveBeenCalledWith('Error saving file:', error)
    expect(shareAsync).not.toHaveBeenCalled()
  })
})
