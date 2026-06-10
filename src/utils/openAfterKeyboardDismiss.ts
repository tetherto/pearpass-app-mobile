import { Keyboard } from 'react-native'

const FALLBACK_DELAY_MS = 350

/**
 * Dismisses the keyboard and invokes callback only after the keyboard is fully
 * hidden. Falls back to a timeout when the keyboard is not currently visible.
 */
export const openAfterKeyboardDismiss = (callback: () => void): void => {
  let called = false

  const invoke = () => {
    if (called) return
    called = true
    subscription.remove()
    clearTimeout(fallback)
    callback()
  }

  const subscription = Keyboard.addListener('keyboardDidHide', invoke)
  Keyboard.dismiss()
  const fallback = setTimeout(invoke, FALLBACK_DELAY_MS)
}
