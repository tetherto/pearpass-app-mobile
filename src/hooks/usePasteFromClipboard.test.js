import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { renderHook, act } from '@testing-library/react-native'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'

import { usePasteFromClipboard } from './usePasteFromClipboard'
import messages from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('expo-clipboard', () => ({
  getStringAsync: jest.fn()
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn()
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  PasteFromClipboardIcon: ({ color }) => `PasteFromClipboardIcon-${color}`
}))

jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    black: {
      mode1: '#000000'
    }
  }
}))

describe('usePasteFromClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Clipboard.getStringAsync.mockClear()
    Toast.show.mockClear()
  })

  const renderWithI18n = () =>
    renderHook(() => usePasteFromClipboard(), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

  describe('successful paste operations', () => {
    it('should paste text from clipboard and show success toast', async () => {
      const mockText = 'Hello, world!'
      Clipboard.getStringAsync.mockResolvedValue(mockText)

      const { result } = renderWithI18n()

      let pastedText
      await act(async () => {
        pastedText = await result.current.pasteFromClipboard()
      })

      expect(Clipboard.getStringAsync).toHaveBeenCalledTimes(1)
      expect(pastedText).toBe(mockText)
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'baseToast',
        text1: 'Pasted from clipboard!',
        renderLeadingIcon: expect.any(Function),
        position: 'bottom',
        bottomOffset: 100
      })
    })

    it('should render PasteFromClipboardIcon in success toast', async () => {
      const mockText = 'Test text'
      Clipboard.getStringAsync.mockResolvedValue(mockText)

      const { result } = renderWithI18n()

      await act(async () => {
        await result.current.pasteFromClipboard()
      })

      const toastCall = Toast.show.mock.calls[0][0]
      const iconComponent = toastCall.renderLeadingIcon()
      expect(iconComponent.type.name).toBe('PasteFromClipboardIcon')
      expect(iconComponent.props.color).toBe('#000000')
    })

    it('should handle text with special characters', async () => {
      const mockText = 'Special chars: @#$%^&*()_+-=[]{}|;:,.<>?'
      Clipboard.getStringAsync.mockResolvedValue(mockText)

      const { result } = renderWithI18n()

      let pastedText
      await act(async () => {
        pastedText = await result.current.pasteFromClipboard()
      })

      expect(pastedText).toBe(mockText)
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'baseToast',
          text1: 'Pasted from clipboard!'
        })
      )
    })

    it('should handle very long text', async () => {
      const mockText = 'a'.repeat(10000)
      Clipboard.getStringAsync.mockResolvedValue(mockText)

      const { result } = renderWithI18n()

      let pastedText
      await act(async () => {
        pastedText = await result.current.pasteFromClipboard()
      })

      expect(pastedText).toBe(mockText)
      expect(pastedText.length).toBe(10000)
    })
  })

  describe('empty clipboard handling', () => {
    it('should handle empty string from clipboard', async () => {
      Clipboard.getStringAsync.mockResolvedValue('')

      const { result } = renderWithI18n()

      let pastedText
      await act(async () => {
        pastedText = await result.current.pasteFromClipboard()
      })

      expect(pastedText).toBeNull()
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'No text found in clipboard',
        position: 'bottom',
        bottomOffset: 100
      })
    })

    it('should handle null from clipboard', async () => {
      Clipboard.getStringAsync.mockResolvedValue(null)

      const { result } = renderWithI18n()

      let pastedText
      await act(async () => {
        pastedText = await result.current.pasteFromClipboard()
      })

      expect(pastedText).toBeNull()
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'No text found in clipboard',
        position: 'bottom',
        bottomOffset: 100
      })
    })

    it('should handle undefined from clipboard', async () => {
      Clipboard.getStringAsync.mockResolvedValue(undefined)

      const { result } = renderWithI18n()

      let pastedText
      await act(async () => {
        pastedText = await result.current.pasteFromClipboard()
      })

      expect(pastedText).toBeNull()
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'No text found in clipboard',
        position: 'bottom',
        bottomOffset: 100
      })
    })

    it('should handle whitespace-only text', async () => {
      Clipboard.getStringAsync.mockResolvedValue('   \n\t   ')

      const { result } = renderWithI18n()

      let pastedText
      await act(async () => {
        pastedText = await result.current.pasteFromClipboard()
      })

      // Whitespace-only text should be considered valid (not empty)
      expect(pastedText).toBe('   \n\t   ')
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'baseToast',
          text1: 'Pasted from clipboard!'
        })
      )
    })
  })

  describe('error handling', () => {
    it('should handle clipboard access error', async () => {
      const mockError = new Error('Clipboard access denied')
      Clipboard.getStringAsync.mockRejectedValue(mockError)

      const { result } = renderWithI18n()

      let pastedText
      await act(async () => {
        pastedText = await result.current.pasteFromClipboard()
      })

      expect(pastedText).toBeNull()
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Failed to paste from clipboard',
        position: 'bottom',
        bottomOffset: 100
      })
    })
  })

  describe('hook behavior', () => {
    it('should return a stable pasteFromClipboard function', () => {
      const { result, rerender } = renderWithI18n()

      const firstFunction = result.current.pasteFromClipboard

      rerender()

      const secondFunction = result.current.pasteFromClipboard

      expect(firstFunction).toBe(secondFunction)
    })

    it('should handle multiple consecutive calls', async () => {
      Clipboard.getStringAsync
        .mockResolvedValueOnce('First call')
        .mockResolvedValueOnce('Second call')
        .mockResolvedValueOnce('Third call')

      const { result } = renderWithI18n()

      const results = []
      await act(async () => {
        results.push(await result.current.pasteFromClipboard())
        results.push(await result.current.pasteFromClipboard())
        results.push(await result.current.pasteFromClipboard())
      })

      expect(results).toEqual(['First call', 'Second call', 'Third call'])
      expect(Clipboard.getStringAsync).toHaveBeenCalledTimes(3)
      expect(Toast.show).toHaveBeenCalledTimes(3)
    })

    it('should handle mixed success and error calls', async () => {
      Clipboard.getStringAsync
        .mockResolvedValueOnce('Success')
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValueOnce('Success again')

      const { result } = renderWithI18n()

      const results = []
      await act(async () => {
        results.push(await result.current.pasteFromClipboard())
        results.push(await result.current.pasteFromClipboard())
        results.push(await result.current.pasteFromClipboard())
      })

      expect(results).toEqual(['Success', null, 'Success again'])
      expect(Toast.show).toHaveBeenCalledTimes(3)

      // Check toast types
      expect(Toast.show).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: 'baseToast' })
      )
      expect(Toast.show).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ type: 'error' })
      )
      expect(Toast.show).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ type: 'baseToast' })
      )
    })
  })
})
