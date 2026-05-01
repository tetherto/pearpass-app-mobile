import { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  GITHUB_LATEST_RELEASE_URLS,
  VERSION_CHECK_CONFIG
} from '@tetherto/pearpass-lib-constants'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

import { isFdroid } from '../constants/distribution'
import { logger } from '../utils/logger'

const MS_PER_HOUR = 1000 * 60 * 60

export const parseParts = (value) => {
  if (typeof value !== 'string') return null

  const cleaned = value.replace(/[^\d.]/g, '').trim()
  if (!cleaned) return null

  const parts = cleaned.split('.').map((segment) => {
    const num = Number(segment)
    return Number.isFinite(num) ? num : null
  })

  if (parts.length === 0 || parts.some((part) => part === null)) return null
  return parts
}

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

export const isPastGracePeriod = (releaseDateString) => {
  if (!releaseDateString) return false
  const releaseDate = new Date(releaseDateString)
  if (isNaN(releaseDate.getTime())) return false
  const hoursSinceRelease = (Date.now() - releaseDate.getTime()) / MS_PER_HOUR
  return hoursSinceRelease >= VERSION_CHECK_CONFIG.GRACE_PERIOD_DAYS * 24
}

// Accepts "1.6.0" or "v1.6.0"; rejects anything else (e.g. "release-1.0").
const normalizeTag = (tagName) => {
  if (typeof tagName !== 'string') return null
  const match = tagName.trim().match(/^v?(\d+\.\d+(?:\.\d+)?)$/)
  return match ? match[1] : null
}

const validateReleasePayload = (payload) => {
  if (!payload || typeof payload !== 'object') return null
  if (payload.draft === true || payload.prerelease === true) return null

  const version = normalizeTag(payload.tag_name)
  if (!version) return null

  const publishedAt = payload.published_at
  if (typeof publishedAt !== 'string') return null
  if (isNaN(new Date(publishedAt).getTime())) return null

  return { version, publishedAt }
}

const fetchLatestRelease = async () => {
  const controller = new AbortController()
  const timeoutId = setTimeout(
    () => controller.abort(),
    VERSION_CHECK_CONFIG.FETCH_TIMEOUT_MS
  )

  try {
    const response = await fetch(GITHUB_LATEST_RELEASE_URLS.MOBILE, {
      // GitHub's API rejects requests without a User-Agent.
      headers: {
        'User-Agent': VERSION_CHECK_CONFIG.USER_AGENT,
        Accept: 'application/vnd.github+json'
      },
      signal: controller.signal
    })

    if (!response.ok) return null
    return validateReleasePayload(await response.json())
  } catch (error) {
    logger.error('Version check: GitHub fetch failed', error)
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

const readCache = async () => {
  try {
    const raw = await AsyncStorage.getItem(VERSION_CHECK_CONFIG.CACHE_KEY)
    if (!raw) return null

    const { version, publishedAt, fetchedAt } = JSON.parse(raw)
    if (
      typeof version !== 'string' ||
      typeof publishedAt !== 'string' ||
      typeof fetchedAt !== 'number'
    ) {
      return null
    }

    const ageHours = (Date.now() - fetchedAt) / MS_PER_HOUR
    if (ageHours >= VERSION_CHECK_CONFIG.CACHE_TTL_HOURS) return null

    return { version, publishedAt }
  } catch {
    return null
  }
}

const writeCache = (record) =>
  AsyncStorage.setItem(
    VERSION_CHECK_CONFIG.CACHE_KEY,
    JSON.stringify({ ...record, fetchedAt: Date.now() })
  ).catch(() => {})

const evaluate = (record) => {
  const currentVersion =
    Constants.expoConfig?.version || Constants.expoConfig?.extra?.appVersion

  if (!currentVersion) return false
  if (!compareVersions(currentVersion, record.version)) return false
  return isPastGracePeriod(record.publishedAt)
}

// Returns whether the app should prompt the user to update.
// Any failure (network, malformed payload, timeout) resolves to needsUpdate=false
// so the user is never locked out by an internal error.
export const useVersionCheck = () => {
  const [needsUpdate, setNeedsUpdate] = useState(false)

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (Platform.OS === 'android' && isFdroid()) return

      let record = await readCache()
      if (!record) {
        record = await fetchLatestRelease()
        if (record) writeCache(record)
      }

      if (!isMounted || !record) return
      setNeedsUpdate(evaluate(record))
    }

    const timer = setTimeout(run, 1000)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  return { needsUpdate }
}
