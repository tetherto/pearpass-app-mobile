import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { View } from 'react-native'

import { Button, ButtonText } from './styles'

/**
 * @param {{
 *  children: ReactNode
 *  startIcon?: ElementType
 *  onPress: () => void
 *  testID?: string
 *  accessibilityLabel?: string
 *  nativeID?: string
 * }} props
 */
export const ButtonCreate = ({ children, startIcon, onPress, testID, accessibilityLabel, nativeID }) => {
  const Icon = startIcon
  return (
    <Button
      testID={testID}
      nativeID={nativeID ?? testID}
      accessibilityLabel={accessibilityLabel ?? testID}
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
    >
      {Icon && <Icon size="21" color={colors.black.mode1} />}
      {children && <ButtonText>{children}</ButtonText>}
      <View />
    </Button>
  )
}
