import { useCallback } from 'react'

import { useLingui } from '@lingui/react/macro'
import { PasteFromClipboardIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'
/**
 * Hook for pasting text from clipboard with toast notifications
 * @returns {{
 *   pasteFromClipboard: () => Promise<string|null>
 * }}
 */

export const usePasteFromClipboard = () => {
  const { t } = useLingui()

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await Clipboard.getStringAsync()

      if (!text?.length) {
        Toast.show({
          type: 'error',
          text1: t`No text found in clipboard`,
          position: 'bottom',
          bottomOffset: 100
        })
        return null
      }

      Toast.show({
        type: 'baseToast',
        text1: t`Pasted from clipboard!`,
        renderLeadingIcon: () => (
          <PasteFromClipboardIcon color={colors.black.mode1} />
        ),
        position: 'bottom',
        bottomOffset: 100
      })

      return text
    } catch {
      Toast.show({
        type: 'error',
        text1: t`Failed to paste from clipboard`,
        position: 'bottom',
        bottomOffset: 100
      })
      return null
    }
  }, [t])

  return { pasteFromClipboard }
}
