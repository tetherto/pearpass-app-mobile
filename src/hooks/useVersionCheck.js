import { useEffect, useState } from 'react'

import Constants from 'expo-constants'
import { Platform } from 'react-native'

import { VERSION_CHECK_CONFIG } from '../constants/versionCheck'
import { logger } from '../utils/logger'

/**
 * Parses a version string into an array of numbers
 * @param {string} value - The version string to parse
 * @returns {number[]|null} An array of numbers, or null if the string is invalid
 */
export const parseParts = (value) => {
  if (typeof value !== 'string') return null

  const cleaned = value.replace(/[^\d.]/g, '').trim()
  if (!cleaned) return []

  const parts = cleaned.split('.').map((segment) => {
    const num = Number(segment)
    return Number.isFinite(num) ? num : null
  })

  return parts.every((part) => part !== null) ? parts : null
}

/**
 * Compares two semver version strings
 * @param {string} current - Current app version
 * @param {string} latest - Latest store version
 * @returns {boolean} True if latest > current
 */
export const compareVersions = (current, latest) => {
  const currentParts = parseParts(current)
  const latestParts = parseParts(latest)

  if (!currentParts || !latestParts) return false

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentPart = currentParts[i] || 0
    const latestPart = latestParts[i] || 0

    if (latestPart > currentPart) return true
    if (currentPart > latestPart) return false
  }

  return false
}

/**
 * Checks if a release date is within the grace period
 * @param {string} releaseDateString - ISO date string of the release
 * @returns {boolean} True if the release is within the grace period
 */
export const isWithinGracePeriod = (releaseDateString) => {
  if (!releaseDateString) return false
  const releaseDate = new Date(releaseDateString)
  if (isNaN(releaseDate.getTime())) return false
  const hoursSinceRelease =
    (Date.now() - releaseDate.getTime()) / (1000 * 60 * 60)
  return hoursSinceRelease < 24
}

/**
 * Fetches latest iOS app version from iTunes API
 * @returns {Promise<{version: string, releaseDate: string}|null>}
 */
const getIOSVersion = async () => {
  try {
    const response = await fetch(
      `${VERSION_CHECK_CONFIG.ITUNES_LOOKUP_URL}?bundleId=${VERSION_CHECK_CONFIG.BUNDLE_ID}`
    )
    const data = await response.json()

    if (data.resultCount > 0) {
      const { version, currentVersionReleaseDate: releaseDate } =
        data.results[0]
      return { version, releaseDate }
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
        const currentVersion =
          Constants.expoConfig?.version ||
          Constants.expoConfig?.extra?.appVersion

        let updateNeeded = false

        if (Platform.OS === 'ios') {
          const iosResult = await getIOSVersion()

          if (!isMounted) return

          if (iosResult) {
            const { version: latestVersion, releaseDate } = iosResult
            updateNeeded =
              compareVersions(currentVersion, latestVersion) &&
              !isWithinGracePeriod(releaseDate)
            setNeedsUpdate(updateNeeded)
            setIsChecking(false)
          } else if (retryCount < 2) {
            retryTimer = setTimeout(() => checkVersion(retryCount + 1), 2000)
          } else {
            setIsChecking(false)
          }
          return
        }

        const latestVersion = await getAndroidVersion()

        if (!isMounted) return

        if (latestVersion) {
          updateNeeded = compareVersions(currentVersion, latestVersion)
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
