import { renderHook, waitFor } from '@testing-library/react-native'
import { Platform } from 'react-native'

import { compareVersions, parseParts, useVersionCheck } from './useVersionCheck'

jest.mock('expo-constants', () => ({
  expoConfig: {
    version: '1.0.0'
  }
}))

jest.mock('../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

describe('parseParts', () => {
  it('should parse valid version strings', () => {
    expect(parseParts('1.0.0')).toEqual([1, 0, 0])
    expect(parseParts('2.3.4')).toEqual([2, 3, 4])
    expect(parseParts('10.20.30')).toEqual([10, 20, 30])
  })

  it('should parse single number versions', () => {
    expect(parseParts('1')).toEqual([1])
    expect(parseParts('42')).toEqual([42])
  })

  it('should parse two-part versions', () => {
    expect(parseParts('1.0')).toEqual([1, 0])
    expect(parseParts('2.3')).toEqual([2, 3])
  })

  it('should handle version strings with prefixes', () => {
    expect(parseParts('v1.0.0')).toEqual([1, 0, 0])
    expect(parseParts('version-1.2.3')).toEqual([1, 2, 3])
    expect(parseParts('V2.0.0')).toEqual([2, 0, 0])
  })

  it('should handle version strings with suffixes', () => {
    expect(parseParts('1.0.0-beta')).toEqual([1, 0, 0])
    expect(parseParts('1.0.0-alpha')).toEqual([1, 0, 0])
    // Note: '1.2.3-rc1' becomes '1.2.31' after removing non-digit characters
    expect(parseParts('1.2.3-rc1')).toEqual([1, 2, 31])
  })

  it('should handle version strings with both prefix and suffix', () => {
    expect(parseParts('v1.0.0-beta')).toEqual([1, 0, 0])
    expect(parseParts('version-1.2.3-alpha')).toEqual([1, 2, 3])
  })

  it('should handle versions with spaces', () => {
    expect(parseParts('1.0.0 ')).toEqual([1, 0, 0])
    expect(parseParts(' 2.3.4')).toEqual([2, 3, 4])
    expect(parseParts(' 1.0.0 ')).toEqual([1, 0, 0])
  })

  it('should return empty array for empty string', () => {
    expect(parseParts('')).toEqual([])
  })

  it('should return empty array for string with no digits', () => {
    expect(parseParts('abc')).toEqual([])
    expect(parseParts('version')).toEqual([])
    expect(parseParts('-beta')).toEqual([])
  })

  it('should handle edge cases with empty segments', () => {
    // Note: The function strips non-digit characters and empty segments become 0
    expect(parseParts('1.0.a')).toEqual([1, 0, 0]) // 'a' is removed, empty segment becomes 0
    expect(parseParts('1..0')).toEqual([1, 0, 0]) // empty segment between dots becomes 0
    expect(parseParts('1.0.')).toEqual([1, 0, 0]) // trailing empty segment becomes 0
    expect(parseParts('.1.0')).toEqual([0, 1, 0]) // leading empty segment becomes 0
  })

  it('should handle strings with only dots', () => {
    // Only dots result in empty segments which become 0
    expect(parseParts('...')).toEqual([0, 0, 0, 0])
    expect(parseParts('..')).toEqual([0, 0, 0])
  })

  it('should return null for non-string inputs', () => {
    expect(parseParts(null)).toBeNull()
    expect(parseParts(undefined)).toBeNull()
    expect(parseParts(123)).toBeNull()
    expect(parseParts({})).toBeNull()
    expect(parseParts([])).toBeNull()
    expect(parseParts(true)).toBeNull()
  })

  it('should handle zero values', () => {
    expect(parseParts('0.0.0')).toEqual([0, 0, 0])
    expect(parseParts('0.1.0')).toEqual([0, 1, 0])
  })
})

describe('compareVersions', () => {
  it('should return true when latest is greater (major)', () => {
    expect(compareVersions('1.0.0', '2.0.0')).toBe(true)
  })

  it('should return true when latest is greater (minor)', () => {
    expect(compareVersions('1.0.0', '1.1.1')).toBe(true)
  })

  it('should return true when latest is greater (patch)', () => {
    expect(compareVersions('1.0.0', '1.0.1')).toBe(true)
  })

  it('should return false when versions are equal', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(false)
  })

  it('should return false when current is greater', () => {
    expect(compareVersions('2.0.0', '1.0.0')).toBe(false)
  })

  it('should handle different version lengths', () => {
    expect(compareVersions('1.0', '1.0.1')).toBe(true)
    expect(compareVersions('1.0.0', '1.1')).toBe(true)
  })

  it('should handle two digit versions', () => {
    expect(compareVersions('1.9.0', '1.10.0')).toBe(true)
    expect(compareVersions('1.10.0', '1.9.0')).toBe(false)
  })

  it('should handle non-numeric characters in current version', () => {
    expect(compareVersions('v1.0.0', '1.0.1')).toBe(true)
    expect(compareVersions('1.0.0-beta', '1.0.1')).toBe(true)
    expect(compareVersions('v1.2.3', '1.2.4')).toBe(true)
    expect(compareVersions('v1.2.3', '1.3.0')).toBe(true)
    expect(compareVersions('1.2.3-beta', '1.2.4')).toBe(true)
    expect(compareVersions('1.2.3-beta', '1.3.0')).toBe(true)
    expect(compareVersions('v1.2.3-beta', '1.2.4')).toBe(true)
    expect(compareVersions('v1.2.3-alpha', '1.2.3')).toBe(false)
  })
})

describe('useVersionCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return initial state', () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ resultCount: 0 })
    })

    const { result } = renderHook(() => useVersionCheck())

    expect(result.current.needsUpdate).toBe(false)
    expect(result.current.isChecking).toBe(true)
  })

  it('should set needsUpdate to true when store version is higher (iOS)', async () => {
    Platform.OS = 'ios'
    global.fetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          resultCount: 1,
          results: [{ version: '2.0.0' }]
        })
    })

    const { result } = renderHook(() => useVersionCheck())

    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(result.current.needsUpdate).toBe(true)
      expect(result.current.isChecking).toBe(false)
    })
  })

  it('should set needsUpdate to false when versions match', async () => {
    Platform.OS = 'ios'
    global.fetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          resultCount: 1,
          results: [{ version: '1.0.0' }]
        })
    })

    const { result } = renderHook(() => useVersionCheck())

    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(result.current.needsUpdate).toBe(false)
      expect(result.current.isChecking).toBe(false)
    })
  })

  it('should handle Android version check', async () => {
    Platform.OS = 'android'
    global.fetch.mockResolvedValue({
      text: () => Promise.resolve('some html [[["2.0.0"]]] more html')
    })

    const { result } = renderHook(() => useVersionCheck())

    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(result.current.needsUpdate).toBe(true)
    })
  })

  it('should cleanup timers on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    const { unmount } = renderHook(() => useVersionCheck())

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
