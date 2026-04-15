import {
  parseDataToCsvText,
  parseDataToJson
} from '@tetherto/pearpass-lib-data-export'
import { encryptExportData } from '@tetherto/pearpass-lib-vault'

import { downloadFile } from './downloadFile'
import { downloadZip } from './downloadZip'
import {
  handleExportCSVPerVault,
  handleExportJsonPerVault
} from './exportVaults'

jest.mock('@tetherto/pearpass-lib-data-export')
jest.mock('@tetherto/pearpass-lib-vault', () => ({
  encryptExportData: jest.fn()
}))
jest.mock('./downloadFile', () => ({
  downloadFile: jest.fn()
}))
jest.mock('./downloadZip', () => ({
  downloadZip: jest.fn()
}))

describe('exportVaults', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('handleExportCSVPerVault', () => {
    it('should return false if no vaults to export', async () => {
      parseDataToCsvText.mockResolvedValue([])
      const result = await handleExportCSVPerVault({})
      expect(result).toBe(false)
    })

    it('should download single file if one vault', async () => {
      const mockData = [{ filename: 'test', data: 'csv-content' }]
      parseDataToCsvText.mockResolvedValue(mockData)

      const result = await handleExportCSVPerVault({})

      expect(downloadFile).toHaveBeenCalledWith(
        { filename: 'test', content: 'csv-content' },
        'csv'
      )
      expect(result).toBe(true)
    })

    it('should use default filename if not provided', async () => {
      const mockData = [{ data: 'csv-content' }]
      parseDataToCsvText.mockResolvedValue(mockData)

      const result = await handleExportCSVPerVault({})

      expect(downloadFile).toHaveBeenCalledWith(
        { filename: 'file', content: 'csv-content' },
        'csv'
      )
      expect(result).toBe(true)
    })

    it('should return false if data is missing in single vault', async () => {
      const mockData = [{ filename: 'test' }]
      parseDataToCsvText.mockResolvedValue(mockData)

      const result = await handleExportCSVPerVault({})

      expect(downloadFile).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should download zip if multiple vaults', async () => {
      const mockData = [
        { filename: 'test1', data: 'csv-content-1' },
        { filename: 'test2', data: 'csv-content-2' }
      ]
      parseDataToCsvText.mockResolvedValue(mockData)

      const result = await handleExportCSVPerVault({})

      expect(downloadZip).toHaveBeenCalledWith(mockData)
      expect(result).toBe(true)
    })

    it('should throw error if download fails', async () => {
      const mockData = [{ filename: 'test', data: 'csv-content' }]
      parseDataToCsvText.mockResolvedValue(mockData)
      downloadFile.mockRejectedValue(new Error('Download failed'))

      await expect(handleExportCSVPerVault({})).rejects.toThrow(
        'Download failed'
      )
    })
  })

  describe('handleExportJsonPerVault', () => {
    it('should return false if no vaults to export', async () => {
      parseDataToJson.mockResolvedValue([])
      const result = await handleExportJsonPerVault({})
      expect(result).toBe(false)
    })

    it('should download single file if one vault', async () => {
      const mockData = [{ filename: 'test', data: 'json-content' }]
      parseDataToJson.mockResolvedValue(mockData)

      const result = await handleExportJsonPerVault({})

      expect(downloadFile).toHaveBeenCalledWith(
        { filename: 'test', content: 'json-content' },
        'json'
      )
      expect(result).toBe(true)
    })

    it('should use default filename if not provided', async () => {
      const mockData = [{ data: 'json-content' }]
      parseDataToJson.mockResolvedValue(mockData)

      const result = await handleExportJsonPerVault({})

      expect(downloadFile).toHaveBeenCalledWith(
        { filename: 'file', content: 'json-content' },
        'json'
      )
      expect(result).toBe(true)
    })

    it('should return false if data is missing in single vault', async () => {
      const mockData = [{ filename: 'test' }]
      parseDataToJson.mockResolvedValue(mockData)

      const result = await handleExportJsonPerVault({})

      expect(downloadFile).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should download zip if multiple vaults', async () => {
      const mockData = [
        { filename: 'test1', data: 'json-content-1' },
        { filename: 'test2', data: 'json-content-2' }
      ]
      parseDataToJson.mockResolvedValue(mockData)

      const result = await handleExportJsonPerVault({})

      expect(downloadZip).toHaveBeenCalledWith(mockData)
      expect(result).toBe(true)
    })

    it('should throw error if download fails', async () => {
      const mockData = [{ filename: 'test', data: 'json-content' }]
      parseDataToJson.mockResolvedValue(mockData)
      downloadFile.mockRejectedValue(new Error('Download failed'))

      await expect(handleExportJsonPerVault({})).rejects.toThrow(
        'Download failed'
      )
    })

    it('should encrypt vault data when encryptionPassword is provided', async () => {
      const mockData = [{ filename: 'vault', data: 'json-content' }]
      const encryptedPayload = { encrypted: true, data: 'encrypted-blob' }
      parseDataToJson.mockResolvedValue(mockData)
      encryptExportData.mockResolvedValue(encryptedPayload)

      const result = await handleExportJsonPerVault({}, 'secret')

      expect(encryptExportData).toHaveBeenCalledWith('json-content', 'secret')
      expect(downloadFile).toHaveBeenCalledWith(
        {
          filename: 'vault',
          content: JSON.stringify(encryptedPayload, null, 2)
        },
        'json'
      )
      expect(result).toBe(true)
    })

    it('should encrypt all vaults and zip when multiple vaults with password', async () => {
      const mockData = [
        { filename: 'vault1', data: 'json-content-1' },
        { filename: 'vault2', data: 'json-content-2' }
      ]
      const encryptedPayload1 = { encrypted: true, data: 'blob-1' }
      const encryptedPayload2 = { encrypted: true, data: 'blob-2' }
      parseDataToJson.mockResolvedValue(mockData)
      encryptExportData
        .mockResolvedValueOnce(encryptedPayload1)
        .mockResolvedValueOnce(encryptedPayload2)

      const result = await handleExportJsonPerVault({}, 'secret')

      expect(encryptExportData).toHaveBeenCalledTimes(2)
      expect(downloadZip).toHaveBeenCalledWith([
        {
          filename: 'vault1',
          data: JSON.stringify(encryptedPayload1, null, 2)
        },
        {
          filename: 'vault2',
          data: JSON.stringify(encryptedPayload2, null, 2)
        }
      ])
      expect(result).toBe(true)
    })

    it('should not encrypt when encryptionPassword is null', async () => {
      const mockData = [{ filename: 'vault', data: 'json-content' }]
      parseDataToJson.mockResolvedValue(mockData)

      await handleExportJsonPerVault({}, null)

      expect(encryptExportData).not.toHaveBeenCalled()
    })
  })
})
