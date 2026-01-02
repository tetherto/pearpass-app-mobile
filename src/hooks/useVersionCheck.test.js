import { renderHook, waitFor } from '@testing-library/react-native'
import { Platform } from 'react-native'

import { compareVersions, useVersionCheck } from './useVersionCheck'

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
