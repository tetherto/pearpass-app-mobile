import { Buffer } from 'buffer'

import { useCallback, useEffect, useRef } from 'react'

import { vaultGetFile } from 'pearpass-lib-vault'

import { useLoadingContext } from '../context/LoadingContext'
import { fileCache, MAX_CACHE_SIZE } from '../utils/filesCache'
import { logger } from '../utils/logger'

/**
 * @param {Object} param0
 * @param {string[]} param0.fieldNames
 * @param {Function} param0.updateValues
 * @param {Object} param0.initialRecord
 * @param {Object} param0.currentValues - Optional: current form values to merge with loaded files
 * @returns {{ refetch: () => Promise<void> }} Object with refetch function
 */
export const useGetMultipleFiles = ({
  fieldNames,
  updateValues,
  initialRecord,
  currentValues
} = {}) => {
  const isMountedRef = useRef(true)
  const initialRecordRef = useRef(initialRecord)
  const currentValuesRef = useRef(currentValues)
  const { setIsLoading: setIsLoadingContext } = useLoadingContext()

  // Keep refs updated with latest values
  useEffect(() => {
    initialRecordRef.current = initialRecord
  }, [initialRecord])

  useEffect(() => {
    currentValuesRef.current = currentValues
  }, [currentValues])

  useEffect(
    () => () => {
      isMountedRef.current = false
    },
    []
  )

  const getFilesAsync = async (fieldName) => {
    const currentRecord = initialRecordRef.current
    const attachments = currentRecord?.data?.[fieldName] || []

    if (!attachments.length) {
      return
    }

    try {
      // Check if any files need to be loaded from server (not in cache)
      const needsLoading = attachments.some((attachment) => {
        const cacheKey = `record/${currentRecord.id}/file/${attachment.id}`
        return !fileCache.has(cacheKey)
      })

      // Show loading only if files need to be loaded from server
      if (needsLoading && isMountedRef.current) {
        setIsLoadingContext(true)
      }

      // Load files in parallel instead of sequentially
      const filePromises = attachments.map(async (attachment) => {
        const cacheKey = `record/${currentRecord.id}/file/${attachment.id}`

        // Check cache first
        if (fileCache.has(cacheKey)) {
          const cachedBase64 = fileCache.get(cacheKey)
          return { ...attachment, base64: cachedBase64 }
        }

        const file = await vaultGetFile(cacheKey)

        // Convert to base64
        const base64 = Buffer.from(file).toString('base64')

        // Cache the result (limit cache size to prevent memory issues)
        // Use FIFO eviction: remove oldest entry (first in Map) when limit reached
        if (fileCache.size >= MAX_CACHE_SIZE) {
          // Remove oldest entry (first key in Map)
          const firstKey = fileCache.keys().next().value
          if (firstKey) {
            fileCache.delete(firstKey)
          }
        }
        fileCache.set(cacheKey, base64)

        return { ...attachment, base64 }
      })

      const results = await Promise.allSettled(filePromises)
      const files = []
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          files.push(result.value)
        } else {
          logger.error(
            `Error loading file ${attachments[index]?.id || index}:`,
            result.reason
          )
        }
      })

      if (needsLoading && isMountedRef.current) {
        setIsLoadingContext(false)
      }

      // Only update if component is still mounted
      if (isMountedRef.current) {
        // Merge with existing form values to preserve newly added pictures
        // that aren't in initialRecord yet
        const currentFormValues = currentValuesRef.current
        if (currentFormValues) {
          const existingValues = currentFormValues[fieldName] || []
          const loadedIds = new Set(files.map((item) => item.id))

          // Keep items from form that aren't in initialRecord (newly added)
          const newItems = existingValues.filter(
            (item) => !loadedIds.has(item.id)
          )

          // Combine loaded files with newly added items
          const mergedFiles = [...files, ...newItems]
          updateValues(fieldName, mergedFiles)
        } else {
          updateValues(fieldName, files)
        }
      }
    } catch (error) {
      logger.error('Error retrieving files:', error)
      if (isMountedRef.current) {
        setIsLoadingContext(false)
      }
    }
  }

  useEffect(() => {
    if (!fieldNames || !updateValues || !initialRecord) {
      return
    }

    // Load all fields in parallel
    // Use requestIdleCallback to defer loading until the browser/JS thread is idle
    const idleCallbackId = requestIdleCallback(
      async () => {
        try {
          const promises = fieldNames
            .filter(Boolean)
            .map((fieldName) => getFilesAsync(fieldName))

          await Promise.allSettled(promises)
        } catch (error) {
          logger.error('Error loading files:', error)
          // Hide loading on error
          if (isMountedRef.current) {
            setIsLoadingContext(false)
          }
        }
      },
      { timeout: 2000 } // Fallback timeout to ensure it runs even if idle time never comes
    )

    return () => {
      cancelIdleCallback(idleCallbackId)
    }
  }, [
    initialRecord?.id,
    initialRecord?.isFavorite,
    ...fieldNames.map((fieldName) =>
      JSON.stringify(initialRecord?.data?.[fieldName] || [])
    )
  ])

  const refetch = useCallback(async () => {
    if (!fieldNames || !updateValues || !initialRecord) {
      return
    }

    try {
      const promises = fieldNames
        .filter(Boolean)
        .map((fieldName) => getFilesAsync(fieldName))

      const results = await Promise.allSettled(promises)
      results.forEach((result, index) => {
          if (result.status === 'rejected') {
            logger.error(`Failed to fetch files for ${fieldNames[index]}`, result.reason)
          }
      })
    } catch (error) {
      logger.error('Error refetching files:', error)
      if (isMountedRef.current) {
        setIsLoadingContext(false)
      }
    }
  }, [fieldNames, updateValues, initialRecord])

  return { refetch }
}
