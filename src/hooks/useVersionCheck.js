import { useEffect, useState } from 'react'

import Constants from 'expo-constants'
import { Platform } from 'react-native'

import { VERSION_CHECK_CONFIG } from '../constants/versionCheck'
import { logger } from '../utils/logger'

/**
 * Compares two semver version strings
 * @param {string} current - Current app version
 * @param {string} latest - Latest store version
 * @returns {boolean} True if latest > current
 */
export const compareVersions = (current, latest) => {
  const currentParts = current.split('.').map(Number)
  const latestParts = latest.split('.').map(Number)

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentPart = currentParts[i] || 0
    const latestPart = latestParts[i] || 0

    if (latestPart > currentPart) return true
    if (currentPart > latestPart) return false
  }

  return false
}

/**
 * Fetches latest iOS app version from iTunes API
 * @returns {Promise<string|null>}
 */
const getIOSVersion = async () => {
  try {
    const response = await fetch(
      `${VERSION_CHECK_CONFIG.ITUNES_LOOKUP_URL}?bundleId=${VERSION_CHECK_CONFIG.BUNDLE_ID}`
    )
    const data = await response.json()

    if (data.resultCount > 0) {
      return data.results[0].version
    }
    return null
  } catch (error) {
    logger.error('Error fetching iOS version:', error)
    return null
  }
}

/**
 * Fetches latest Android app version from Play Store
 * @returns {Promise<string|null>}
 */
const getAndroidVersion = async () => {
  try {
    const response = await fetch(
      `${VERSION_CHECK_CONFIG.PLAY_STORE_URL}?id=${VERSION_CHECK_CONFIG.BUNDLE_ID}&hl=en`
    )
    const html = await response.text()

    const match = html.match(/\[\[\["(\d+\.\d+\.?\d*)"\]\]/)
    if (match) {
      return match[1]
    }
    return null
  } catch (error) {
    logger.error('Error fetching Android version:', error)
    return null
  }
}

/**
 * @typedef {Object} VersionCheckResult
 * @property {boolean} needsUpdate - Whether the app needs to be updated
 * @property {boolean} isChecking - Whether the version check is in progress
 */

/**
 * Hook to check if app needs updating by comparing with store version
 * @returns {VersionCheckResult}
 */
export const useVersionCheck = () => {
  const [needsUpdate, setNeedsUpdate] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true
    let retryTimer = null

    const checkVersion = async (retryCount = 0) => {
      try {
        const currentVersion = Constants.expoConfig?.version || '1.0.0'

        const latestVersion =
          Platform.OS === 'ios'
            ? await getIOSVersion()
            : await getAndroidVersion()

        if (!isMounted) return

        if (latestVersion) {
          const updateNeeded = compareVersions(currentVersion, latestVersion)
          setNeedsUpdate(updateNeeded)
          setIsChecking(false)
        } else if (retryCount < 2) {
          retryTimer = setTimeout(() => checkVersion(retryCount + 1), 2000)
        } else {
          setIsChecking(false)
        }
      } catch (error) {
        logger.error('Error checking version:', error)

        if (!isMounted) return

        if (retryCount < 2) {
          retryTimer = setTimeout(() => checkVersion(retryCount + 1), 2000)
        } else {
          setIsChecking(false)
        }
      }
    }

    const initialTimer = setTimeout(() => checkVersion(), 1000)

    return () => {
      isMounted = false
      clearTimeout(initialTimer)
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [])

  return { needsUpdate, isChecking }
}
