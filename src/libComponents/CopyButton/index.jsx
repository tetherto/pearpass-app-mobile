import { CopyIcon } from 'pearpass-lib-ui-react-native-components'
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
      <CopyIcon size="20" color={theme.colors.white.mode1} />
    </TouchableOpacity>
  )
}
