import { ContentCopy } from '@tetherto/pearpass-lib-ui-kit/icons'
import { TouchableOpacity } from 'react-native'
import { colors } from 'src/utils/colors'

import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

/**
 * @param {{
 *  value?: string
 * }} props
 */
export const CopyButton = ({ value }) => {
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
      <ContentCopy width="20" height="20" color={colors.white.mode1} />
    </TouchableOpacity>
  )
}
