import * as FileSystem from 'expo-file-system'
import { Platform, Share } from 'react-native'

import { ExportCancelledError, shareExportFile } from './shareExportFile'

jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock-dir/',
  writeAsStringAsync: jest.fn(),
  EncodingType: { UTF8: 'utf8', Base64: 'base64' },
  StorageAccessFramework: {
    requestDirectoryPermissionsAsync: jest.fn(),
    createFileAsync: jest.fn()
  }
}))

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Share: {
    share: jest.fn(),
    sharedAction: 'sharedAction',
    dismissedAction: 'dismissedAction'
  }
}))

describe('shareExportFile', () => {
  const filename = 'PearPass_Vault.json'
  const content = '{"foo":"bar"}'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('iOS', () => {
    beforeEach(() => {
      Platform.OS = 'ios'
    })

    it('writes the file and resolves when the user shares', async () => {
      Share.share.mockResolvedValue({ action: Share.sharedAction })

      await shareExportFile({ filename, content, mimeType: 'application/json' })

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        '/mock-dir/' + filename,
        content,
        { encoding: FileSystem.EncodingType.UTF8 }
      )
      expect(Share.share).toHaveBeenCalledWith({ url: '/mock-dir/' + filename })
    })

    it('throws ExportCancelledError when the user dismisses the sheet', async () => {
      Share.share.mockResolvedValue({ action: Share.dismissedAction })

      await expect(
        shareExportFile({ filename, content, mimeType: 'application/json' })
      ).rejects.toBeInstanceOf(ExportCancelledError)
    })
  })

  describe('Android', () => {
    const SAF = FileSystem.StorageAccessFramework

    beforeEach(() => {
      Platform.OS = 'android'
    })

    it('saves the file through the Storage Access Framework', async () => {
      SAF.requestDirectoryPermissionsAsync.mockResolvedValue({
        granted: true,
        directoryUri: 'content://tree/primary'
      })
      SAF.createFileAsync.mockResolvedValue('content://tree/primary/doc')

      await shareExportFile({ filename, content, mimeType: 'application/json' })

      // extension stripped so SAF doesn't produce "file.json.json"
      expect(SAF.createFileAsync).toHaveBeenCalledWith(
        'content://tree/primary',
        'PearPass_Vault',
        'application/json'
      )
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        'content://tree/primary/doc',
        content,
        { encoding: FileSystem.EncodingType.UTF8 }
      )
    })

    it('throws ExportCancelledError when permission is denied', async () => {
      SAF.requestDirectoryPermissionsAsync.mockResolvedValue({
        granted: false
      })

      await expect(
        shareExportFile({ filename, content, mimeType: 'application/json' })
      ).rejects.toBeInstanceOf(ExportCancelledError)

      expect(SAF.createFileAsync).not.toHaveBeenCalled()
      expect(FileSystem.writeAsStringAsync).not.toHaveBeenCalled()
    })
  })
})
