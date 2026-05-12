// Abstraction layer between the app and any error-reporting backend (Sentry).
// Modules import this freely — it never imports `@sentry/react-native`, so it
// does not pull Sentry's module tree into non-nightly bundles. Sentry registers
// its implementation at `initSentry()` time on nightly distributions only.

let captureExceptionImpl = null
let captureMessageImpl = null
let logSinkImpl = null

export function registerErrorReporter(impl) {
  captureExceptionImpl = impl?.captureException || null
  captureMessageImpl = impl?.captureMessage || null
}

export function registerLogSink(sink) {
  logSinkImpl = sink || null
}

function formatContext(context) {
  if (!context) return ''
  try {
    return ' ' + JSON.stringify(context)
  } catch {
    return ''
  }
}

export function captureException(error, context, opts) {
  if (!opts?.silent && logSinkImpl && captureExceptionImpl) {
    try {
      const detail =
        error instanceof Error
          ? error.stack || `${error.name}: ${error.message}`
          : String(error)
      logSinkImpl('error', `[reported] ${detail}${formatContext(context)}`)
    } catch {}
  }
  try {
    captureExceptionImpl?.(error, context)
  } catch {}
}

export function captureMessage(message, level, opts) {
  if (!opts?.silent && logSinkImpl && captureMessageImpl) {
    try {
      logSinkImpl(level || 'error', `[reported] ${String(message)}`)
    } catch {}
  }
  try {
    captureMessageImpl?.(message, level)
  } catch {}
}
