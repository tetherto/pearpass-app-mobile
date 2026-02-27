import { useCallback, useEffect, useRef } from 'react'

import { useCreateRecord, useRecords } from 'pearpass-lib-vault'
import { pearpassVaultClient } from 'pearpass-lib-vault/src/instances'
import { selectVault } from 'pearpass-lib-vault/src/selectors/selectVault'
import { AppState } from 'react-native'
import { useSelector } from 'react-redux'

import { POST_RESUME_DELAY_MS, SAFETY_THRESHOLD_MS } from './constants'
import { jobFileExists } from './JobFileReader'
import { processJobQueue } from './processJobQueue'
import { useAutoLockContext } from '../context/AutoLockContext'
import { getLastActivityAt, setLastActivityAt } from '../utils/autoLockStorage'
import { logger } from '../utils/logger'

/**
 * React hook that triggers job queue processing on mount and on app resume.
 * Coordinates with auto-lock to ensure DB writes are safe.
 */
export const useJobQueueProcessor = () => {
  const processingRef = useRef(false)
  const appStateRef = useRef(AppState.currentState)

  const { data: vaultData, isInitialized: isVaultInitialized } =
    useSelector(selectVault)

  const activeVaultId = vaultData?.id
  const isVaultActive = isVaultInitialized && !!activeVaultId

  const { autoLockTimeout, isAutoLockEnabled, notifyInteraction } =
    useAutoLockContext()

  const { createRecord } = useCreateRecord()

  const { updateRecords } = useRecords({ shouldSkip: true })

  const getRecord = useCallback(async (recordId) => {
    try {
      const record = await pearpassVaultClient.activeVaultGet(
        `record/${recordId}`
      )
      return record
    } catch (error) {
      logger.error('[jobQueue] Failed to get record:', error)
      return null
    }
  }, [])

  const updateRecord = useCallback(
    async (recordId, updates) => {
      const existing = await getRecord(recordId)
      if (!existing) {
        throw new Error(`Record ${recordId} not found for update`)
      }

      const updatedRecord = {
        ...existing,
        ...updates,
        data: updates.data || existing.data,
        updatedAt: Date.now()
      }

      await updateRecords([updatedRecord])
    },
    [getRecord, updateRecords]
  )

  const checkAutoLockWillNotTrigger = useCallback(async () => {
    if (!isAutoLockEnabled || autoLockTimeout === null) {
      return true
    }

    const lastActivity = await getLastActivityAt()
    if (!lastActivity) {
      return true
    }

    const remaining = autoLockTimeout - (Date.now() - lastActivity)

    return remaining > SAFETY_THRESHOLD_MS
  }, [isAutoLockEnabled, autoLockTimeout])

  const processJobs = useCallback(async () => {
    if (processingRef.current) {
      return
    }

    if (!isVaultActive) {
      return
    }

    const hasJobs = await jobFileExists()
    if (!hasJobs) {
      return
    }

    processingRef.current = true

    try {
      const result = await processJobQueue({
        createRecord,
        getRecord,
        updateRecord,
        activeVaultId,
        vaultClient: pearpassVaultClient
      })

      if (result.processed > 0) {
        logger.log(
          `[jobQueue] Processed ${result.processed} jobs: ${result.succeeded} succeeded, ${result.failed} failed`
        )
      }
    } catch (error) {
      logger.error('[jobQueue] Error processing job queue:', error)
    } finally {
      processingRef.current = false
    }
  }, [isVaultActive, activeVaultId, createRecord, getRecord, updateRecord])

  const triggerProcessing = useCallback(async () => {
    const now = Date.now()
    await setLastActivityAt(now)
    notifyInteraction()

    setTimeout(async () => {
      const safe = await checkAutoLockWillNotTrigger()
      if (!safe) {
        logger.log('[jobQueue] Auto-lock imminent, skipping job processing')
        return
      }

      await processJobs()
    }, POST_RESUME_DELAY_MS)
  }, [checkAutoLockWillNotTrigger, notifyInteraction, processJobs])

  useEffect(() => {
    if (isVaultActive) {
      triggerProcessing()
    }
  }, [isVaultActive])

  useEffect(() => {
    const handleAppStateChange = (nextState) => {
      const prev = appStateRef.current
      appStateRef.current = nextState

      if (nextState === 'active' && prev !== 'active' && isVaultActive) {
        triggerProcessing()
      }
    }

    const sub = AppState.addEventListener('change', handleAppStateChange)
    return () => sub.remove()
  }, [isVaultActive, triggerProcessing])
}
