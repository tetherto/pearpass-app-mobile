import { renderHook, act, waitFor } from '@testing-library/react-native'
import { DEFAULT_AUTO_LOCK_TIMEOUT } from 'pearpass-lib-constants'

import { AutoLockProvider, useAutoLockContext } from './AutoLockContext'

jest.mock('pearpass-lib-constants', () => ({
  DEFAULT_AUTO_LOCK_TIMEOUT: 15 * 60 * 1000
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve())
}))

describe('AutoLockContext', () => {
  it('provides default values when used without provider', () => {
    const { result } = renderHook(() => useAutoLockContext())

    expect(result.current.shouldBypassAutoLock).toBe(false)
    expect(typeof result.current.setShouldBypassAutoLock).toBe('function')
  })

  it('initially sets shouldBypassAutoLock to false within provider', async () => {
    const wrapper = ({ children }) => (
      <AutoLockProvider>{children}</AutoLockProvider>
    )

    const { result } = renderHook(() => useAutoLockContext(), { wrapper })

    await waitFor(() => {
      expect(result.current.shouldBypassAutoLock).toBe(false)
    })
  })

  it('updates shouldBypassAutoLock when setter is called', async () => {
    const wrapper = ({ children }) => (
      <AutoLockProvider>{children}</AutoLockProvider>
    )

    const { result } = renderHook(() => useAutoLockContext(), { wrapper })

    await waitFor(() => {
      expect(result.current.shouldBypassAutoLock).toBe(false)
    })

    act(() => {
      result.current.setShouldBypassAutoLock(true)
    })

    expect(result.current.shouldBypassAutoLock).toBe(true)

    act(() => {
      result.current.setShouldBypassAutoLock(false)
    })

    expect(result.current.shouldBypassAutoLock).toBe(false)
  })

  it('provides default auto-lock timeout', async () => {
    const wrapper = ({ children }) => (
      <AutoLockProvider>{children}</AutoLockProvider>
    )

    const { result } = renderHook(() => useAutoLockContext(), { wrapper })

    await waitFor(() => {
      expect(result.current.autoLockTimeout).toBe(DEFAULT_AUTO_LOCK_TIMEOUT)
    })

    expect(result.current.isAutoLockEnabled).toBe(true)
  })

  it('updates auto-lock timeout when setter is called', async () => {
    const wrapper = ({ children }) => (
      <AutoLockProvider>{children}</AutoLockProvider>
    )

    const { result } = renderHook(() => useAutoLockContext(), { wrapper })

    await waitFor(() => {
      expect(result.current.autoLockTimeout).toBe(DEFAULT_AUTO_LOCK_TIMEOUT)
    })

    await act(async () => {
      await result.current.setAutoLockTimeout(60000)
    })

    expect(result.current.autoLockTimeout).toBe(60000)
  })

  it('disables auto-lock when timeout is set to null', async () => {
    const wrapper = ({ children }) => (
      <AutoLockProvider>{children}</AutoLockProvider>
    )

    const { result } = renderHook(() => useAutoLockContext(), { wrapper })

    await waitFor(() => {
      expect(result.current.isAutoLockEnabled).toBe(true)
    })

    await act(async () => {
      await result.current.setAutoLockTimeout(null)
    })

    expect(result.current.isAutoLockEnabled).toBe(false)
    expect(result.current.autoLockTimeout).toBe(null)
  })
})
