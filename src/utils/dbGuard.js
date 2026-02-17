const DB_WRITE_TIMEOUT_MS = 10000

let writeInProgress = false
let lockRequested = false
let resolveWaitForWrite = null

/**
 * Attempts to acquire the DB write guard.
 * Returns false if auto-lock has already requested a lock (lockRequested=true).
 * Returns true and sets writeInProgress=true if the guard is acquired.
 * @returns {boolean}
 */
export const acquireDbWriteGuard = () => {
  if (lockRequested) {
    return false
  }
  writeInProgress = true
  return true
}

/**
 * Releases the DB write guard.
 * Sets writeInProgress=false and unblocks any pending waitForDbWriteComplete.
 */
export const releaseDbWriteGuard = () => {
  writeInProgress = false
  if (resolveWaitForWrite) {
    resolveWaitForWrite()
    resolveWaitForWrite = null
  }
}

/**
 * Called by auto-lock's performLock() before closing instances.
 * Sets lockRequested=true to block any future acquireDbWriteGuard() calls.
 * If a write is already in progress, waits for it to finish (with 10s timeout).
 * @returns {Promise<void>}
 */
export const waitForDbWriteComplete = () => {
  lockRequested = true

  if (!writeInProgress) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    resolveWaitForWrite = resolve

    setTimeout(() => {
      if (resolveWaitForWrite === resolve) {
        resolveWaitForWrite = null
        resolve()
      }
    }, DB_WRITE_TIMEOUT_MS)
  })
}

/**
 * Resets the lockRequested flag.
 * Called in the finally block of auto-lock's performLock().
 */
export const clearLockRequest = () => {
  lockRequested = false
}
