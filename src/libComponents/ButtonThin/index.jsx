import { colors } from 'pearpass-lib-ui-theme-provider/native'

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
export const ButtonThin = ({ 
  children, 
  startIcon, 
  onPress,
  testID,
  accessibilityLabel,
  nativeID
}) => {
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
      {Icon && <Icon size="21" color={colors.primary400.mode1} />}
      {children && <ButtonText>{children}</ButtonText>}
    </Button>
  )
}
