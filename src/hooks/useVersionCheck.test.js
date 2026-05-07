import AsyncStorage from '@react-native-async-storage/async-storage'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { VERSION_CHECK_CONFIG } from '@tetherto/pearpass-lib-constants'
import { Platform } from 'react-native'

import {
  compareVersions,
  isPastGracePeriod,
  parseParts,
  useVersionCheck
} from './useVersionCheck'

jest.mock('expo-constants', () => ({
  expoConfig: {
    version: '1.0.0',
    extra: { distribution: 'standard' }
  }
}))

jest.mock('../utils/logger', () => ({
  logger: { error: jest.fn() }
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}))

const buildPayload = (overrides = {}) => ({
  tag_name: 'v2.0.0',
  published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  draft: false,
  prerelease: false,
  ...overrides
})

const mockFetchOk = (payload) =>
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(payload)
  })

describe('parseParts', () => {
  it('parses valid version strings', () => {
    expect(parseParts('1.0.0')).toEqual([1, 0, 0])
    expect(parseParts('10.20.30')).toEqual([10, 20, 30])
  })

  it('parses single and two-part versions', () => {
    expect(parseParts('1')).toEqual([1])
    expect(parseParts('1.0')).toEqual([1, 0])
  })

  it('strips a leading "v"', () => {
    expect(parseParts('v1.0.0')).toEqual([1, 0, 0])
    expect(parseParts('V2.0.0')).toEqual([2, 0, 0])
  })

  it('returns null for empty or non-numeric input', () => {
    expect(parseParts('')).toBeNull()
    expect(parseParts('abc')).toBeNull()
    expect(parseParts('-beta')).toBeNull()
  })

  it('returns null for non-string inputs', () => {
    expect(parseParts(null)).toBeNull()
    expect(parseParts(undefined)).toBeNull()
    expect(parseParts(123)).toBeNull()
  })
})

describe('compareVersions', () => {
  it('returns true when latest is greater', () => {
    expect(compareVersions('1.0.0', '2.0.0')).toBe(true)
    expect(compareVersions('1.0.0', '1.1.0')).toBe(true)
    expect(compareVersions('1.0.0', '1.0.1')).toBe(true)
  })

  it('returns false when versions are equal or current is greater', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(false)
    expect(compareVersions('2.0.0', '1.0.0')).toBe(false)
  })

  it('handles different version lengths', () => {
    expect(compareVersions('1.0', '1.0.1')).toBe(true)
    expect(compareVersions('1.0.0', '1.1')).toBe(true)
  })

  it('handles double-digit segments numerically', () => {
    expect(compareVersions('1.9.0', '1.10.0')).toBe(true)
    expect(compareVersions('1.10.0', '1.9.0')).toBe(false)
  })
})

describe('isPastGracePeriod', () => {
  const days = (n) => n * 24 * 60 * 60 * 1000

  it('returns true when older than the grace period', () => {
    const old = new Date(
      Date.now() - days(VERSION_CHECK_CONFIG.GRACE_PERIOD_DAYS + 1)
    ).toISOString()
    expect(isPastGracePeriod(old)).toBe(true)
  })

  it('returns false when within the grace period', () => {
    expect(
      isPastGracePeriod(new Date(Date.now() - days(1)).toISOString())
    ).toBe(false)
  })

  it('returns true at the exact grace period boundary', () => {
    const boundary = new Date(
      Date.now() - days(VERSION_CHECK_CONFIG.GRACE_PERIOD_DAYS)
    ).toISOString()
    expect(isPastGracePeriod(boundary)).toBe(true)
  })

  it('returns false for invalid input', () => {
    expect(isPastGracePeriod(null)).toBe(false)
    expect(isPastGracePeriod('not-a-date')).toBe(false)
    expect(isPastGracePeriod('')).toBe(false)
  })
})

describe('useVersionCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    global.fetch = jest.fn()
    Platform.OS = 'ios'
    const Constants = require('expo-constants')
    Constants.expoConfig.extra.distribution = 'standard'
    AsyncStorage.getItem.mockResolvedValue(null)
    AsyncStorage.setItem.mockResolvedValue()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const renderAndAdvance = () => {
    const result = renderHook(() => useVersionCheck())
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    return result
  }

  it('starts with needsUpdate=false', () => {
    mockFetchOk(buildPayload())
    const { result } = renderHook(() => useVersionCheck())
    expect(result.current.needsUpdate).toBe(false)
  })

  it('sets needsUpdate=true when GitHub release is newer and past grace period', async () => {
    mockFetchOk(buildPayload({ tag_name: 'v2.0.0' }))
    const { result } = renderAndAdvance()

    await waitFor(() => expect(result.current.needsUpdate).toBe(true))
  })

  it('sets needsUpdate=false when versions match', async () => {
    mockFetchOk(buildPayload({ tag_name: 'v1.0.0' }))
    const { result } = renderAndAdvance()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(result.current.needsUpdate).toBe(false)
  })

  it('sets needsUpdate=false when release is within grace period', async () => {
    mockFetchOk(
      buildPayload({
        tag_name: 'v2.0.0',
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      })
    )
    const { result } = renderAndAdvance()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(result.current.needsUpdate).toBe(false)
  })

  it('skips entirely on F-Droid distribution', async () => {
    Platform.OS = 'android'
    const Constants = require('expo-constants')
    Constants.expoConfig.extra.distribution = 'fdroid'

    const { result } = renderAndAdvance()

    await waitFor(() => expect(AsyncStorage.getItem).not.toHaveBeenCalled())
    expect(result.current.needsUpdate).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('uses cached release when cache is fresh', async () => {
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({
        version: '2.0.0',
        publishedAt: new Date(
          Date.now() - 8 * 24 * 60 * 60 * 1000
        ).toISOString(),
        fetchedAt: Date.now() - 60 * 60 * 1000
      })
    )

    const { result } = renderAndAdvance()

    await waitFor(() => expect(result.current.needsUpdate).toBe(true))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('refetches when cache is expired', async () => {
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({
        version: '2.0.0',
        publishedAt: new Date(
          Date.now() - 8 * 24 * 60 * 60 * 1000
        ).toISOString(),
        fetchedAt:
          Date.now() -
          (VERSION_CHECK_CONFIG.CACHE_TTL_HOURS + 1) * 60 * 60 * 1000
      })
    )
    mockFetchOk(buildPayload({ tag_name: 'v3.0.0' }))

    const { result } = renderAndAdvance()

    await waitFor(() => expect(result.current.needsUpdate).toBe(true))
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('does not show modal on fetch failure (fail-safe)', async () => {
    global.fetch.mockRejectedValue(new Error('network down'))

    const { result } = renderAndAdvance()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(result.current.needsUpdate).toBe(false)
  })

  it('does not show modal on non-OK HTTP response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({})
    })

    const { result } = renderAndAdvance()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(result.current.needsUpdate).toBe(false)
  })

  it('rejects pre-release payloads', async () => {
    mockFetchOk(buildPayload({ tag_name: 'v2.0.0', prerelease: true }))
    const { result } = renderAndAdvance()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(result.current.needsUpdate).toBe(false)
  })

  it('rejects draft payloads', async () => {
    mockFetchOk(buildPayload({ tag_name: 'v2.0.0', draft: true }))
    const { result } = renderAndAdvance()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(result.current.needsUpdate).toBe(false)
  })

  it('rejects malformed tag names', async () => {
    mockFetchOk(buildPayload({ tag_name: 'release-1.0' }))
    const { result } = renderAndAdvance()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(result.current.needsUpdate).toBe(false)
  })

  it('persists fetched payload to cache', async () => {
    mockFetchOk(buildPayload({ tag_name: 'v2.0.0' }))
    renderAndAdvance()

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        VERSION_CHECK_CONFIG.CACHE_KEY,
        expect.any(String)
      )
    )

    const stored = JSON.parse(AsyncStorage.setItem.mock.calls[0][1])
    expect(stored.version).toBe('2.0.0')
    expect(typeof stored.publishedAt).toBe('string')
    expect(typeof stored.fetchedAt).toBe('number')
  })

  it('cleans up timers on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    mockFetchOk(buildPayload())

    const { unmount } = renderHook(() => useVersionCheck())
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
