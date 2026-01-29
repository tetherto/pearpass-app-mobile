import { useState, useRef, useCallback, useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import * as Clipboard from 'expo-clipboard'
import * as SecureStore from 'expo-secure-store'
import { CLIPBOARD_CLEAR_TIMEOUT } from 'pearpass-lib-constants'
import { CopyIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import Toast from 'react-native-toast-message'

import { useHapticFeedback } from './useHapticFeedback'
import { IOS_APP_GROUP_ID } from '../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../constants/secureStorageKeys'
import NativeClipboard from '../native-modules/NativeClipboard'

let globalClearTimer = null
let globalLastCopiedText = null

export const useCopyToClipboard = () => {
  const [isCopyToClipboardEnabled, setIsCopyToClipboardEnabled] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef(null)
  const clearClipboardTimeoutRef = useRef(null)
  const lastCopiedTextRef = useRef(null)
  const { t } = useLingui()
  const { hapticSuccess } = useHapticFeedback()

  useEffect(() => {
    const checkCopyToClipboardOptIn = async () => {
      const optIn = await SecureStore.getItemAsync(
        SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD,
        {
          accessGroup: IOS_APP_GROUP_ID
        }
      )
      setIsCopyToClipboardEnabled(optIn !== 'false')
    }

    checkCopyToClipboardOptIn()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (clearClipboardTimeoutRef.current) {
        clearTimeout(clearClipboardTimeoutRef.current)
      }
      if (globalClearTimer) {
        clearTimeout(globalClearTimer)
      }

      if (globalLastCopiedText) {
        globalLastCopiedText = null
        lastCopiedTextRef.current = null
      }
    }
  }, [])

  const copyToClipboard = useCallback(
    async (text) => {
      if (!isCopyToClipboardEnabled) {
        return false
      }

      if (!text?.length) {
        return false
      }

      try {
        lastCopiedTextRef.current = text
        globalLastCopiedText = text

        if (clearClipboardTimeoutRef.current) {
          clearTimeout(clearClipboardTimeoutRef.current)
        }
        if (globalClearTimer) {
          clearTimeout(globalClearTimer)
        }

        const nativeAvailable = await NativeClipboard.isAvailable()

        if (nativeAvailable) {
          await NativeClipboard.setStringWithExpiration(
            text,
            CLIPBOARD_CLEAR_TIMEOUT / 1000
          )
        } else {
          await Clipboard.setStringAsync(text)

          const timerId = setTimeout(async () => {
            try {
              const currentClipboardText = await Clipboard.getStringAsync()

              if (
                currentClipboardText === lastCopiedTextRef.current ||
                currentClipboardText === globalLastCopiedText
              ) {
                await Clipboard.setStringAsync('')
                lastCopiedTextRef.current = null
                globalLastCopiedText = null
              }
            } catch {}
          }, CLIPBOARD_CLEAR_TIMEOUT)

          clearClipboardTimeoutRef.current = timerId
          globalClearTimer = timerId
        }

        setIsCopied(true)
        hapticSuccess()

        Toast.show({
          type: 'baseToast',
          text1: t`Copied!`,
          renderLeadingIcon: () => <CopyIcon color={colors.black.mode1} />,
          position: 'bottom',
          bottomOffset: 100
        })

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => setIsCopied(false), 2000)

        return true
      } catch {
        return false
      }
    },
    [isCopyToClipboardEnabled, t, hapticSuccess]
  )

  return { copyToClipboard, isCopied }
}
