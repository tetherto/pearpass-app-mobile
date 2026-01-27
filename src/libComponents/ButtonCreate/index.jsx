import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { View } from 'react-native'

import { Button, ButtonText } from './styles'

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
  return (
    <Button
      activeOpacity={0.8}
      onPress={onPress}
      testID={testID}
      hasIcon={!!Icon}
    >
      {Icon && <Icon size="21" color={colors.black.mode1} />}
      {children && <ButtonText testID={textTestID}>{children}</ButtonText>}
      {Icon && <View />}
    </Button>
  )
}
