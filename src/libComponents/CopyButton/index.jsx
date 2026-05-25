import { ContentCopy } from '@tetherto/pearpass-lib-ui-kit/icons'
import { TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'

import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

/**
 * @param {{
 *  value?: string
 * }} props
 */
export const CopyButton = ({ value }) => {
  const theme = useTheme()
  const { copyToClipboard, isCopyToClipboardEnabled } = useCopyToClipboard()

  const handlePress = () => {
    if (value) {
      copyToClipboard(value)
    }
  }

  if (!isCopyToClipboardEnabled) {
    return null
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ContentCopy width="20" height="20" color={theme.colors.white.mode1} />
    </TouchableOpacity>
  )
}
