import { File } from 'expo-file-system/next'
import * as Sharing from 'expo-sharing'

jest.mock('expo-file-system/next', () => {
  const fileMocks = new Map()
  const FileMock = jest.fn().mockImplementation((uri) => {
    if (!fileMocks.has(uri)) {
      const mock = {
        uri,
        exists: false,
        size: 0,
        contents: '',
        create: jest.fn(function () {
          this.exists = true
        }),
        delete: jest.fn(function () {
          this.exists = false
          this.contents = ''
          this.size = 0
        }),
        write: jest.fn(function (content) {
          this.exists = true
          if (typeof content === 'string') {
            this.contents = content
          } else {
            this.contents = new TextDecoder().decode(content)
          }
          this.size = this.contents.length
        }),
        text: jest.fn(function () {
          return this.contents
        }),
        open: jest.fn(function () {
          const file = this
          return {
            offset: 0,
            get size() {
              return file.size
            },
            writeBytes: jest.fn(function (bytes) {
              const text = new TextDecoder().decode(bytes)
              file.exists = true
              file.contents += text
              file.size = file.contents.length
            }),
            close: jest.fn()
          }
        })
      }
      fileMocks.set(uri, mock)
    }
    return fileMocks.get(uri)
  })
  return {
    File: FileMock,
    Paths: { cache: { uri: 'file:///mock-cache/' } }
  }
})

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn().mockResolvedValue(undefined),
  isAvailableAsync: jest.fn().mockResolvedValue(true)
}))

jest.mock('./logConfigurationStorage.js', () => ({
  getLogLevelSync: jest.fn().mockReturnValue('off')
}))

const { getLogLevelSync } = require('./logConfigurationStorage.js')

describe('mobile logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset shared file mock state from prior tests
    new File('file:///mock-cache/core-logs.txt').delete()
    new File('file:///mock-cache/main.log').delete()
  })

  test('createFileLogger skips file write when level is off', async () => {
    getLogLevelSync.mockReturnValue('off')
    const { createFileLogger, mainLogsFileURI } = await import('./logger.js')
    const write = createFileLogger(mainLogsFileURI)
    write('log', 'hi')
    const file = new File(mainLogsFileURI)
    expect(file.open).not.toHaveBeenCalled()
  })

  test('createFileLogger appends two lines via FileHandle', async () => {
    getLogLevelSync.mockReturnValue('info')
    const { createFileLogger, mainLogsFileURI } = await import('./logger.js')
    const write = createFileLogger(mainLogsFileURI)
    write('log', 'one')
    write('log', 'two')
    const file = new File(mainLogsFileURI)
    expect(file.contents).toContain('[LOG] one')
    expect(file.contents).toContain('[LOG] two')
  })

  test('createFileLogger skips when writer severity below threshold', async () => {
    getLogLevelSync.mockReturnValue('error')
    const { createFileLogger, mainLogsFileURI } = await import('./logger.js')
    const write = createFileLogger(mainLogsFileURI)
    write('log', 'hi')
    const file = new File(mainLogsFileURI)
    expect(file.open).not.toHaveBeenCalled()
  })

  test('createFileLogger writes errors at threshold "error"', async () => {
    getLogLevelSync.mockReturnValue('error')
    const { createFileLogger, mainLogsFileURI } = await import('./logger.js')
    const write = createFileLogger(mainLogsFileURI)
    write('error', 'boom')
    const file = new File(mainLogsFileURI)
    expect(file.contents).toContain('[ERROR] boom')
  })

  test('getLogFileStats reflects accumulated log size', async () => {
    getLogLevelSync.mockReturnValue('info')
    const { createFileLogger, getLogFileStats, mainLogsFileURI } =
      await import('./logger.js')
    const write = createFileLogger(mainLogsFileURI)
    write('log', 'hello world')
    const stats = getLogFileStats()
    expect(stats.main).toBeGreaterThan(0)
    expect(stats.totalBytes).toBe(stats.core + stats.main)
  })

  test('shareAllLogs returns no-logs when both files empty', async () => {
    Sharing.isAvailableAsync.mockResolvedValueOnce(true)
    const { shareAllLogs } = await import('./logger.js')
    const result = await shareAllLogs({})
    expect(result.shared).toBe(false)
    expect(result.reason).toBe('no-logs')
    expect(Sharing.shareAsync).not.toHaveBeenCalled()
  })

  test('shareAllLogs zips logs + metadata and shares', async () => {
    Sharing.isAvailableAsync.mockResolvedValueOnce(true)
    getLogLevelSync.mockReturnValue('info')
    const { createFileLogger, shareAllLogs, mainLogsFileURI } =
      await import('./logger.js')
    const write = createFileLogger(mainLogsFileURI)
    write('log', 'reproduction step')
    const result = await shareAllLogs({ appVersion: '9.9.9' })
    expect(result.shared).toBe(true)
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      expect.stringMatching(/pearpass-logs-.*\.zip$/),
      expect.objectContaining({ mimeType: 'application/zip' })
    )
  })

  test('shareAllLogs returns sharing-unavailable when sheet missing', async () => {
    Sharing.isAvailableAsync.mockResolvedValueOnce(false)
    const { shareAllLogs } = await import('./logger.js')
    const result = await shareAllLogs({})
    expect(result).toEqual({ shared: false, reason: 'sharing-unavailable' })
  })

  test('compat-shim Logger.error always calls console.error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const { Logger } = await import('./logger.js')
    const log = new Logger({ debugMode: false })
    log.error('boom')
    expect(spy).toHaveBeenCalledWith('boom')
    spy.mockRestore()
  })
})
