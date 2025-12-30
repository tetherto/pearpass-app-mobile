import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { renderHook, act } from '@testing-library/react-native'
import * as Clipboard from 'expo-clipboard'
import * as SecureStore from 'expo-secure-store'
import Toast from 'react-native-toast-message'

import { useCopyToClipboard } from './useCopyToClipboard'
import messages from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('pearpass-lib-constants', () => ({
  CLIPBOARD_CLEAR_TIMEOUT: 30000
}))

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
  getStringAsync: jest.fn()
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn()
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn()
}))

jest.mock('pearpass-lib-ui-react-native-components', () => ({
  CopyIcon: jest.fn(() => null)
}))

jest.mock('pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    black: {
      mode1: '#000000'
    }
  }
}))

jest.mock('react-native', () => ({
  NativeModules: {
    NativeClipboard: null
  }
}))

jest.mock('../native-modules/NativeClipboard', () => ({
  __esModule: true,
  default: {
    isAvailable: jest.fn().mockResolvedValue(false),
    setStringWithExpiration: jest.fn(),
    clearClipboard: jest.fn(),
    clearIfCurrentMatches: jest.fn()
  }
}))

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  const renderWithI18n = () =>
    renderHook(() => useCopyToClipboard(), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

  it('should not copy if opt-in is disabled', async () => {
    SecureStore.getItemAsync.mockResolvedValue('false')

    const { result } = renderWithI18n()

    await act(async () => {})

    const returnValue = await act(
      async () => await result.current.copyToClipboard('test text')
    )

    expect(returnValue).toBe(false)
    expect(Clipboard.setStringAsync).not.toHaveBeenCalled()
    expect(Toast.show).not.toHaveBeenCalled()
    expect(result.current.isCopied).toBe(false)
  })

  it('should copy text to clipboard when opt-in is enabled', async () => {
    SecureStore.getItemAsync.mockResolvedValue('true')

    const { result } = renderWithI18n()

    await act(async () => {})

    await act(async () => {
      await result.current.copyToClipboard('test text')
    })

    expect(Clipboard.setStringAsync).toHaveBeenCalledWith('test text')
    expect(Toast.show).toHaveBeenCalled()
    expect(result.current.isCopied).toBe(true)
  })

  it('should set isCopied back to false after timeout', async () => {
    SecureStore.getItemAsync.mockResolvedValue('true')

    const { result } = renderWithI18n()

    await act(async () => {})
    await act(async () => {
      await result.current.copyToClipboard('test text')
    })

    expect(result.current.isCopied).toBe(true)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(result.current.isCopied).toBe(false)
  })

  it('should not copy if text is empty, null or undefined', async () => {
    SecureStore.getItemAsync.mockResolvedValue('true')

    const { result } = renderWithI18n()
    await act(async () => {})

    await act(async () => {
      const returnValue = await result.current.copyToClipboard('')
      expect(returnValue).toBe(false)
    })
    await act(async () => {
      const returnValue = await result.current.copyToClipboard(null)
      expect(returnValue).toBe(false)
    })
    await act(async () => {
      const returnValue = await result.current.copyToClipboard(undefined)
      expect(returnValue).toBe(false)
    })

    expect(Clipboard.setStringAsync).not.toHaveBeenCalled()
    expect(Toast.show).not.toHaveBeenCalled()
  })

  it('should clear previous timeout when copying again', async () => {
    SecureStore.getItemAsync.mockResolvedValue('true')

    const { result } = renderWithI18n()
    await act(async () => {})
    await act(async () => {
      await result.current.copyToClipboard('first')
    })
    await act(async () => {
      await result.current.copyToClipboard('second')
    })

    expect(Clipboard.setStringAsync).toHaveBeenCalledTimes(2)
    expect(result.current.isCopied).toBe(true)
  })

  it('should return true when copy is successful', async () => {
    SecureStore.getItemAsync.mockResolvedValue('true')

    const { result } = renderWithI18n()
    await act(async () => {})
    let returnValue
    await act(async () => {
      returnValue = await result.current.copyToClipboard('test text')
    })

    expect(returnValue).toBe(true)
  })

  describe('auto-clear clipboard', () => {
    it('should clear clipboard after 30 seconds if it still contains the same value', async () => {
      SecureStore.getItemAsync.mockResolvedValue('true')
      Clipboard.getStringAsync.mockResolvedValue('sensitive password')

      const { result } = renderWithI18n()
      await act(async () => {})

      await act(async () => {
        await result.current.copyToClipboard('sensitive password')
      })

      expect(Clipboard.setStringAsync).toHaveBeenCalledWith(
        'sensitive password'
      )
      expect(Clipboard.setStringAsync).toHaveBeenCalledTimes(1)

      await act(async () => {
        jest.advanceTimersByTime(30000)
      })

      expect(Clipboard.getStringAsync).toHaveBeenCalled()
      expect(Clipboard.setStringAsync).toHaveBeenCalledWith('')
      expect(Clipboard.setStringAsync).toHaveBeenCalledTimes(2)
    })

    it('should not clear clipboard if value has changed', async () => {
      SecureStore.getItemAsync.mockResolvedValue('true')
      Clipboard.getStringAsync.mockResolvedValue('different value')

      const { result } = renderWithI18n()
      await act(async () => {})

      await act(async () => {
        await result.current.copyToClipboard('sensitive password')
      })

      expect(Clipboard.setStringAsync).toHaveBeenCalledWith(
        'sensitive password'
      )
      expect(Clipboard.setStringAsync).toHaveBeenCalledTimes(1)

      await act(async () => {
        jest.advanceTimersByTime(30000)
      })

      expect(Clipboard.getStringAsync).toHaveBeenCalled()
      expect(Clipboard.setStringAsync).toHaveBeenCalledTimes(1)
      expect(Clipboard.setStringAsync).not.toHaveBeenCalledWith('')
    })

    it('should cancel previous clear timeout when copying again', async () => {
      SecureStore.getItemAsync.mockResolvedValue('true')
      Clipboard.getStringAsync.mockResolvedValue('second password')

      const { result } = renderWithI18n()
      await act(async () => {})

      await act(async () => {
        await result.current.copyToClipboard('first password')
      })

      await act(async () => {
        jest.advanceTimersByTime(15000)
      })

      await act(async () => {
        await result.current.copyToClipboard('second password')
      })

      await act(async () => {
        jest.advanceTimersByTime(20000)
      })

      expect(Clipboard.getStringAsync).not.toHaveBeenCalled()

      await act(async () => {
        jest.advanceTimersByTime(10000)
      })

      expect(Clipboard.getStringAsync).toHaveBeenCalled()
      expect(Clipboard.setStringAsync).toHaveBeenCalledWith('')
      expect(Clipboard.setStringAsync).toHaveBeenCalledTimes(3)
    })

    it('should handle errors during clipboard clearing gracefully', async () => {
      SecureStore.getItemAsync.mockResolvedValue('true')
      Clipboard.getStringAsync.mockRejectedValue(
        new Error('Clipboard access failed')
      )

      const { result } = renderWithI18n()
      await act(async () => {})

      await act(async () => {
        await result.current.copyToClipboard('sensitive password')
      })

      await act(async () => {
        jest.advanceTimersByTime(30000)
      })

      expect(Clipboard.getStringAsync).toHaveBeenCalled()
      expect(Clipboard.setStringAsync).toHaveBeenCalledTimes(1)
    })

    it('should cancel clipboard clear timer on unmount', async () => {
      SecureStore.getItemAsync.mockResolvedValue('true')
      Clipboard.getStringAsync.mockResolvedValue('sensitive password')

      const { result, unmount } = renderWithI18n()
      await act(async () => {})

      await act(async () => {
        await result.current.copyToClipboard('sensitive password')
      })

      unmount()

      await act(async () => {
        jest.advanceTimersByTime(30000)
      })

      // Timer is cancelled on unmount, so clipboard should NOT be cleared
      expect(Clipboard.getStringAsync).not.toHaveBeenCalled()
      expect(Clipboard.setStringAsync).toHaveBeenCalledTimes(1) // Only the initial copy
    })
  })
})
