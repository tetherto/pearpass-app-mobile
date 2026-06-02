import * as FileSystem from 'expo-file-system'
import JSZip from 'jszip'

import { downloadZip } from './downloadZip'
import { ExportCancelledError, shareExportFile } from './shareExportFile'

jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock-dir/',
  writeAsStringAsync: jest.fn(),
  EncodingType: { Base64: 'base64' }
}))

jest.mock('./shareExportFile', () => {
  class ExportCancelledError extends Error {}
  return {
    ExportCancelledError,
    shareExportFile: jest.fn()
  }
})

jest.mock('jszip')

describe('downloadZip', () => {
  const mockGenerateAsync = jest.fn()
  const mockFile = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    JSZip.mockImplementation(() => ({
      file: mockFile,
      generateAsync: mockGenerateAsync
    }))
  })

  const files = [
    { filename: 'file1.txt', data: 'data1' },
    { filename: 'file2.txt', data: 'data2' }
  ]

  it('creates a zip and shares it as base64', async () => {
    mockGenerateAsync.mockResolvedValue('base64content')

    await downloadZip(files)

    expect(JSZip).toHaveBeenCalled()
    expect(mockFile).toHaveBeenCalledWith('file1.txt', 'data1')
    expect(mockFile).toHaveBeenCalledWith('file2.txt', 'data2')
    expect(mockGenerateAsync).toHaveBeenCalledWith({ type: 'base64' })

    expect(shareExportFile).toHaveBeenCalledWith({
      filename: expect.stringMatching(/PearPass_Export_.*\.zip/),
      content: 'base64content',
      encoding: FileSystem.EncodingType.Base64,
      mimeType: 'application/zip'
    })
  })

  it('rethrows cancellation so callers stay silent', async () => {
    mockGenerateAsync.mockResolvedValue('base64content')
    shareExportFile.mockRejectedValueOnce(new ExportCancelledError())

    await expect(downloadZip(files)).rejects.toBeInstanceOf(
      ExportCancelledError
    )
  })

  it('logs error if something fails', async () => {
    const error = new Error('zip fail')
    JSZip.mockImplementation(() => {
      throw error
    })
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await downloadZip(files)

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      'Error creating or saving zip:',
      error
    )

    errorSpy.mockRestore()
  })
})
