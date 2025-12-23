import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'

import { handleChooseFile, handleChooseMedia } from './handleChooseFile'
import { logger } from './logger'

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn()
}))

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn()
}))

jest.mock('./logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

const setupMocks = () => {
  const mockFileReader = {
    onloadend: null,
    onerror: null,
    result: 'data:image/png;base64,dGVzdEJhc2U2NA==',
    readAsDataURL: jest.fn(function () {
      setTimeout(() => this.onloadend && this.onloadend(), 0)
    })
  }

  global.FileReader = jest.fn(() => mockFileReader)

  const mockFetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      blob: () => Promise.resolve(new Blob(['test'], { type: 'image/png' }))
    })
  )
  global.fetch = mockFetch

  return { mockFetch, mockFileReader }
}

describe('handleChooseFile', () => {
  let mockFetch
  let mockFileReader

  beforeEach(() => {
    jest.clearAllMocks()
    const mocks = setupMocks()
    mockFetch = mocks.mockFetch
    mockFileReader = mocks.mockFileReader
  })

  it('should handle file selection correctly', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.png', name: 'test.png' }]
    })

    const onFileSelect = jest.fn()
    await handleChooseFile(onFileSelect)

    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false
    })
    expect(mockFetch).toHaveBeenCalledWith('file://test.png')
    expect(mockFileReader.readAsDataURL).toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(onFileSelect).toHaveBeenCalledWith({
      base64: 'dGVzdEJhc2U2NA==',
      name: 'test.png'
    })
  })

  it('should handle images only mode correctly', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://image.jpg', name: 'image.jpg' }]
    })

    const onFileSelect = jest.fn()
    await handleChooseFile(onFileSelect, null, true)

    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
      type: 'image/*',
      copyToCacheDirectory: true,
      multiple: false
    })
  })

  it('should return early if selection is canceled', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: true
    })

    const onFileSelect = jest.fn()
    await handleChooseFile(onFileSelect)

    expect(onFileSelect).not.toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should log error when file picking fails', async () => {
    const error = new Error('Failed to pick file')
    DocumentPicker.getDocumentAsync.mockRejectedValue(error)

    const onFileSelect = jest.fn()
    await handleChooseFile(onFileSelect)

    expect(logger.error).toHaveBeenCalledWith('Error picking file:', error)
    expect(onFileSelect).not.toHaveBeenCalled()
  })

  it('should handle fetch failure gracefully', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.png', name: 'test.png' }]
    })

    const fetchError = new Error('Fetch failed')
    mockFetch.mockRejectedValue(fetchError)

    const onFileSelect = jest.fn()
    await handleChooseFile(onFileSelect)

    expect(logger.error).toHaveBeenCalledWith('Error picking file:', fetchError)
    expect(onFileSelect).not.toHaveBeenCalled()
  })

  it('should handle FileReader error gracefully', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.png', name: 'test.png' }]
    })

    const fileReaderError = new Error('FileReader failed')
    mockFileReader.readAsDataURL = jest.fn(function () {
      setTimeout(() => this.onerror && this.onerror(fileReaderError), 0)
    })

    const onFileSelect = jest.fn()
    await handleChooseFile(onFileSelect)

    expect(logger.error).toHaveBeenCalledWith(
      'Error picking file:',
      fileReaderError
    )
    expect(onFileSelect).not.toHaveBeenCalled()
  })

  it('should work without onFileSelect callback', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test.png', name: 'test.png' }]
    })

    await expect(handleChooseFile()).resolves.not.toThrow()
    expect(mockFetch).toHaveBeenCalledWith('file://test.png')
    expect(mockFileReader.readAsDataURL).toHaveBeenCalled()
  })
})

describe('handleChooseMedia', () => {
  let mockFetch
  let mockFileReader

  beforeEach(() => {
    jest.clearAllMocks()
    const mocks = setupMocks()
    mockFetch = mocks.mockFetch
    mockFileReader = mocks.mockFileReader
    // Override result for media test to be distinct
    mockFileReader.result = 'data:image/jpeg;base64,dGVzdE1lZGlhQmFzZTY0'
  })

  it('should handle media selection correctly', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://media.jpg', fileName: 'media.jpg' }]
    })

    const onMediaSelect = jest.fn()
    await handleChooseMedia(onMediaSelect)

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ['images', 'videos', 'livePhotos'],
      allowsEditing: false,
      quality: 1
    })
    expect(mockFetch).toHaveBeenCalledWith('file://media.jpg')
    expect(mockFileReader.readAsDataURL).toHaveBeenCalled()

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(onMediaSelect).toHaveBeenCalledWith({
      base64: 'dGVzdE1lZGlhQmFzZTY0',
      name: 'media.jpg'
    })
  })

  it('should return early if media selection is canceled', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: true
    })

    const onMediaSelect = jest.fn()
    await handleChooseMedia(onMediaSelect)

    expect(onMediaSelect).not.toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should log error when media picking fails', async () => {
    const error = new Error('Failed to pick media')
    ImagePicker.launchImageLibraryAsync.mockRejectedValue(error)

    const onMediaSelect = jest.fn()
    await handleChooseMedia(onMediaSelect)

    expect(logger.error).toHaveBeenCalledWith('Error picking media:', error)
    expect(onMediaSelect).not.toHaveBeenCalled()
  })

  it('should handle fetch failure gracefully', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://media.jpg', fileName: 'media.jpg' }]
    })

    const fetchError = new Error('Fetch failed')
    mockFetch.mockRejectedValue(fetchError)

    const onMediaSelect = jest.fn()
    await handleChooseMedia(onMediaSelect)

    expect(logger.error).toHaveBeenCalledWith(
      'Error picking media:',
      fetchError
    )
    expect(onMediaSelect).not.toHaveBeenCalled()
  })

  it('should handle FileReader error gracefully', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://media.jpg', fileName: 'media.jpg' }]
    })

    const fileReaderError = new Error('FileReader failed')
    mockFileReader.readAsDataURL = jest.fn(function () {
      setTimeout(() => this.onerror && this.onerror(fileReaderError), 0)
    })

    const onMediaSelect = jest.fn()
    await handleChooseMedia(onMediaSelect)

    expect(logger.error).toHaveBeenCalledWith(
      'Error picking media:',
      fileReaderError
    )
    expect(onMediaSelect).not.toHaveBeenCalled()
  })

  it('should work without onMediaSelect callback', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://media.jpg', fileName: 'media.jpg' }]
    })

    await expect(handleChooseMedia()).resolves.not.toThrow()
    expect(mockFetch).toHaveBeenCalledWith('file://media.jpg')
    expect(mockFileReader.readAsDataURL).toHaveBeenCalled()
  })
})
