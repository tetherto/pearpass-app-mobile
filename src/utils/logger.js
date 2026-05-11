/* global __DEV__ */
import { File, Paths } from 'expo-file-system/next'
import * as Sharing from 'expo-sharing'
import JSZip from 'jszip'

import {
  captureException,
  captureMessage,
  registerLogSink
} from './errorReporter'
import { getLogLevelSync } from './logConfigurationStorage.js'

// Higher number = more severe. We write when the writer's severity is >=
// the user-chosen threshold. 'off' uses Infinity so nothing qualifies.
// 'log' is an alias for 'info' — createFileConsoleLog is called with
// `level: 'log' | 'warn' | 'error'` from the public exports below.
const SEVERITY = {
  off: Infinity,
  error: 3,
  warn: 2,
  info: 1,
  log: 1,
  debug: 0
}

export const coreLogsFileURI = `${Paths.cache.uri}core.txt`
export const mainLogsFileURI = `${Paths.cache.uri}main.log`

const MAX_CONSOLE_ENTRY_LENGTH = 12000
const MAX_LOG_FILE_SIZE = 5 * 1024 * 1024
const TRUNCATION_KEEP_RATIO = 0.5
const TRUNCATION_CHECK_INTERVAL = 100

function stringifyValue(value) {
  if (value instanceof Error)
    return value.stack ?? `${value.name}: ${value.message}`
  if (typeof value === 'string') return value
  try {
    const s = JSON.stringify(value)
    if (s) return s
  } catch {}
  return String(value)
}

const formatLogLine = (args) => {
  const value = args.map(stringifyValue).join(' ')
  return value.length > MAX_CONSOLE_ENTRY_LENGTH
    ? `${value.slice(0, MAX_CONSOLE_ENTRY_LENGTH)} ...[truncated]`
    : value
}

export const ensureFileExists = (fileUri) => {
  const file = new File(fileUri)
  if (!file.exists) {
    file.create({ intermediates: true })
  }
  return file
}

export const truncateLogFile = (file) => {
  if (file.size < MAX_LOG_FILE_SIZE) return
  const text = file.text()
  const cutPoint = Math.floor(text.length * (1 - TRUNCATION_KEEP_RATIO))
  const newlineIndex = text.indexOf('\n', cutPoint)
  if (newlineIndex === -1) return
  file.write(text.slice(newlineIndex + 1))
}

export const createFileLogger = (fileUri) => {
  let writeCount = 0
  return (level, ...args) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      const debugConsole = console[level] || console.log
      debugConsole(...args)
    }

    if (SEVERITY[level] < SEVERITY[getLogLevelSync()]) return

    const message = formatLogLine(args)
    const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}\n`
    const bytes = new TextEncoder().encode(line)

    try {
      const file = ensureFileExists(fileUri)
      // expo-file-system/next has no append flag — File.write overwrites.
      // FileHandle is the canonical append API: seek to EOF, then write.
      const handle = file.open()
      try {
        handle.offset = handle.size ?? 0
        handle.writeBytes(bytes)
      } finally {
        handle.close()
      }

      writeCount++
      if (writeCount >= TRUNCATION_CHECK_INTERVAL) {
        writeCount = 0
        truncateLogFile(file)
      }
    } catch {
      // silent — avoid recursive logging on file system failures
    }
  }
}

const writeMainLog = createFileLogger(mainLogsFileURI)

// Let errorReporter mirror captureException/captureMessage payloads to
// main.log. Done here (not at the top of the file) so writeMainLog exists
// by the time the sink fires.
registerLogSink((level, message) => writeMainLog(level, message))

const safeFileSize = (fileUri) => {
  try {
    const file = new File(fileUri)
    return file.exists ? (file.size ?? 0) : 0
  } catch {
    return 0
  }
}

export const getLogFileStats = () => ({
  core: safeFileSize(coreLogsFileURI),
  main: safeFileSize(mainLogsFileURI),
  totalBytes: safeFileSize(coreLogsFileURI) + safeFileSize(mainLogsFileURI)
})

const readTextSafe = (fileUri) => {
  try {
    const file = new File(fileUri)
    if (!file.exists) return ''
    return file.text()
  } catch {
    return ''
  }
}

/**
 * Bundle both log files plus a metadata.txt into a single zip and share it.
 * @param {Object} metadata - app/device info to include alongside the logs
 * @returns {Promise<{ shared: boolean, reason?: string }>}
 */
export const shareAllLogs = async (metadata = {}) => {
  if (!(await Sharing.isAvailableAsync())) {
    return { shared: false, reason: 'sharing-unavailable' }
  }

  const coreText = readTextSafe(coreLogsFileURI)
  const mainText = readTextSafe(mainLogsFileURI)
  if (!coreText && !mainText) {
    return { shared: false, reason: 'no-logs' }
  }

  const metadataLines = [
    `generatedAt: ${new Date().toISOString()}`,
    ...Object.entries(metadata).map(([k, v]) => `${k}: ${v}`)
  ].join('\n')

  const zip = new JSZip()
  if (coreText) zip.file('core-logs.txt', coreText)
  if (mainText) zip.file('main.log', mainText)
  zip.file('metadata.txt', metadataLines)

  const bytes = await zip.generateAsync({ type: 'uint8array' })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const zipUri = `${Paths.cache.uri}pearpass-logs-${stamp}.zip`
  const zipFile = new File(zipUri)
  if (zipFile.exists) zipFile.delete()
  zipFile.create()
  zipFile.write(bytes)

  await Sharing.shareAsync(zipUri, {
    mimeType: 'application/zip',
    dialogTitle: 'Share PearPass diagnostic logs'
  })
  return { shared: true }
}

/**
 * File-backed logger gated by the user-selected log level in Diagnostics.
 * `debug`, `log` (severity "info"), and `error` are wired today because those
 * are the only severities call sites currently emit at. To add `warn` or
 * `info` when a real caller appears, mirror the one-liner pattern with the
 * matching key from `SEVERITY`:
 *
 *   warn(...args) { writeMainLog('warn', ...args) }
 *   info(...args) { writeMainLog('info', ...args) }
 *
 * Then add the new method to any `jest.mock('../utils/logger', ...)` stub
 * the consuming module's tests use, or they'll throw "is not a function".
 */
export class Logger {
  debug(...args) {
    writeMainLog('debug', ...args)
  }
  log(...args) {
    writeMainLog('log', ...args)
  }
  error(...args) {
    if (!__DEV__) {
      // eslint-disable-next-line no-console
      console.error(...args)
    }
    writeMainLog('error', ...args)
    const errArg = args.find((a) => a instanceof Error)
    if (errArg) {
      const rest = args.filter((a) => a !== errArg)
      captureException(errArg, rest.length ? { args: rest } : undefined)
    } else if (args.length) {
      captureMessage(args.map(String).join(' '), 'error', { silent: true })
    }
  }
}
export const logger = new Logger()
