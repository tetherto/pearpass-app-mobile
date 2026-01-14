import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

import { readFileContent } from './readFileContent'

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
  types: { all: '*/*' }
}))

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: { UTF8: 'utf8' }
}))

describe('readFileContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should read a CSV file and return its content and type', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.csv', name: 'test.csv' }]
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
      fileContent: 'csv,data,here',
      fileType: 'csv'
    })
  })

  it('should read a JSON file and return its content and type', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.json', name: 'test.json' }]
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
      fileContent: '{"key":"value"}',
      fileType: 'json'
    })
  })

  it('should support multiple accepted types', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.txt', name: 'test.txt' }]
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
      fileContent: 'plain text',
      fileType: 'txt'
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
      assets: [{ uri: 'file://no-name' }]
    })
    FileSystem.readAsStringAsync.mockResolvedValue('data')

    const result = await readFileContent(['.csv'])

    expect(result).toEqual({
      fileContent: 'data',
      fileType: 'unknown'
    })
  })
})
