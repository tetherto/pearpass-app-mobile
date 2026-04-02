import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

import { readFileContent } from './readFileContent'

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
  types: { all: '*/*' }
}))

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: { UTF8: 'utf8', Base64: 'base64' }
}))

jest.mock('@tetherto/pearpass-lib-constants', () => ({
  MAX_FILE_SIZE_BYTES: 6 * 1024 * 1024, // 6 MB
  MAX_FILE_SIZE_MB: 6
}))

describe('readFileContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should read a CSV file and return its content and type', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.csv', name: 'test.csv', size: 1024 }]
    })
    FileSystem.readAsStringAsync.mockResolvedValue('csv,data,here')

    const result = await readFileContent(['.csv'])

    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
      type: ['text/csv', 'text/comma-separated-values']
    })
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      'file://test.csv',
      { encoding: FileSystem.EncodingType.UTF8 }
    )
    expect(result).toEqual({
      filename: 'test.csv',
      size: 1024,
      fileContent: 'csv,data,here',
      fileType: 'csv',
      isEncrypted: false
    })
  })

  it('should read a JSON file and return its content and type', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.json', name: 'test.json', size: 2048 }]
    })
    FileSystem.readAsStringAsync.mockResolvedValue('{"key":"value"}')

    const result = await readFileContent(['.json'])

    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
      type: ['application/json']
    })
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      'file://test.json',
      { encoding: FileSystem.EncodingType.UTF8 }
    )
    expect(result).toEqual({
      filename: 'test.json',
      size: 2048,
      fileContent: '{"key":"value"}',
      fileType: 'json',
      isEncrypted: false
    })
  })

  it('should support multiple accepted types', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.txt', name: 'test.txt', size: 512 }]
    })
    FileSystem.readAsStringAsync.mockResolvedValue('plain text')

    const result = await readFileContent(['.csv', '.json', 'text/plain'])

    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
      type: [
        'text/csv',
        'text/comma-separated-values',
        'application/json',
        'text/plain'
      ]
    })
    expect(result).toEqual({
      filename: 'test.txt',
      size: 512,
      fileContent: 'plain text',
      fileType: 'txt',
      isEncrypted: false
    })
  })

  it('should read a KDBX file and return ArrayBuffer with isEncrypted true', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.kdbx', name: 'test.kdbx', size: 2048 }]
    })
    FileSystem.readAsStringAsync.mockResolvedValue('aGVsbG8=')

    const result = await readFileContent(['.kdbx'])

    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
      type: ['application/octet-stream', '*/*']
    })
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      'file://test.kdbx',
      { encoding: FileSystem.EncodingType.Base64 }
    )
    expect(result).toMatchObject({
      filename: 'test.kdbx',
      size: 2048,
      fileType: 'kdbx',
      isEncrypted: true
    })
    expect(result.fileContent).toBeInstanceOf(ArrayBuffer)
  })

  it('should read an XML file and return its content', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.xml', name: 'test.xml', size: 512 }]
    })
    FileSystem.readAsStringAsync.mockResolvedValue('<root><item/></root>')

    const result = await readFileContent(['.xml'])

    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
      type: ['text/xml', 'application/xml']
    })
    expect(result).toEqual({
      filename: 'test.xml',
      size: 512,
      fileContent: '<root><item/></root>',
      fileType: 'xml',
      isEncrypted: false
    })
  })

  it('should return isEncrypted true for JSON file with encrypted flag', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [
        { uri: 'file://encrypted.json', name: 'encrypted.json', size: 100 }
      ]
    })
    FileSystem.readAsStringAsync.mockResolvedValue(
      '{"encrypted":true,"data":"..."}'
    )

    const result = await readFileContent(['.json'])

    expect(result).toEqual({
      filename: 'encrypted.json',
      size: 100,
      fileContent: '{"encrypted":true,"data":"..."}',
      fileType: 'json',
      isEncrypted: true
    })
  })

  it('should return isEncrypted true for invalid JSON content', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://bad.json', name: 'bad.json', size: 50 }]
    })
    FileSystem.readAsStringAsync.mockResolvedValue('not valid json {{{')

    const result = await readFileContent(['.json'])

    expect(result).toEqual({
      filename: 'bad.json',
      size: 50,
      fileContent: 'not valid json {{{',
      fileType: 'json',
      isEncrypted: true
    })
  })

  it('should throw an error if file picking is canceled', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: true
    })

    await expect(readFileContent(['.csv'])).rejects.toThrow(
      'File picking was canceled.'
    )
  })

  it('should return fileType as "unknown" if file name is missing', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://no-name', size: 256 }]
    })
    FileSystem.readAsStringAsync.mockResolvedValue('data')

    const result = await readFileContent(['.csv'])

    expect(result).toEqual({
      filename: '',
      size: 256,
      fileContent: 'data',
      fileType: 'unknown',
      isEncrypted: false
    })
  })

  it('should throw an error if file size exceeds maximum', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://large.csv',
          name: 'large.csv',
          size: 6 * 1024 * 1024 + 1 // Slightly over 6 MB
        }
      ]
    })

    await expect(readFileContent(['.csv'])).rejects.toThrow(
      'File too large. Maximum size is 6 MB.'
    )

    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled()
  })
})
