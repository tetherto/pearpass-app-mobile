import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { View } from 'react-native'

import { Button, ButtonText } from './styles'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

/**
 * @param {{
 *  children: ReactNode
 *  startIcon?: ElementType
 *  onPress: () => void
 *  testID?: string
 *  textTestID?: string
 * }} props
 */
export const ButtonCreate = ({
  children,
  startIcon,
  onPress,
  testID,
  textTestID
}) => {
  const Icon = startIcon
  const { hapticButtonPrimary } = useHapticFeedback()

  const handlePress = () => {
    hapticButtonPrimary()
    onPress?.()
  }

  return (
    <Button activeOpacity={0.8} onPress={handlePress} testID={testID}>
      {Icon && <Icon size="21" color={colors.black.mode1} />}
      {children && <ButtonText testID={textTestID}>{children}</ButtonText>}
      <View></View>
    </Button>
  )
}
