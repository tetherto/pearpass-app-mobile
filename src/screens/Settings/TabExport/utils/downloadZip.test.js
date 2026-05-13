import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import JSZip from 'jszip'

import { downloadZip } from './downloadZip'

jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock-dir/',
  writeAsStringAsync: jest.fn(),
  EncodingType: { Base64: 'base64' }
}))

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn()
}))

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

  it('creates a zip, writes it as base64, and shares if available', async () => {
    mockGenerateAsync.mockResolvedValue('base64content')
    Sharing.isAvailableAsync.mockResolvedValue(true)

    await downloadZip(files)

    expect(JSZip).toHaveBeenCalled()
    expect(mockFile).toHaveBeenCalledWith('file1.txt', 'data1')
    expect(mockFile).toHaveBeenCalledWith('file2.txt', 'data2')
    expect(mockGenerateAsync).toHaveBeenCalledWith({ type: 'base64' })

    const fileUriArg = FileSystem.writeAsStringAsync.mock.calls[0][0]
    expect(fileUriArg).toMatch(/\/mock-dir\/PearPass_Export_.*\.zip/)

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      expect.stringContaining('/mock-dir/PearPass_Export_'),
      'base64content',
      { encoding: FileSystem.EncodingType.Base64 }
    )
    expect(Sharing.shareAsync).toHaveBeenCalledWith(fileUriArg)
  })

  it('throws an error if sharing is not available', async () => {
    mockGenerateAsync.mockResolvedValue('base64content')
    Sharing.isAvailableAsync.mockResolvedValue(false)
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await downloadZip(files)

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled()
    expect(Sharing.shareAsync).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith(
      'Error creating or saving zip:',
      new Error('Sharing is not available on this platform')
    )

    errorSpy.mockRestore()
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
