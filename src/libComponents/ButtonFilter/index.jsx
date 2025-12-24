import { colors } from 'pearpass-lib-ui-theme-provider/native'

import { Button, ButtonText } from './styles'

/**
 * @param {{
 *  children?: ReactNode
 *  startIcon?: ElementType
 *  variant?: 'primary' | 'secondary'
 *  onPress: () => void
 *  testID?: string
 *  accessibilityLabel?: string
 *  nativeID?: string
 * }} props
 */
export const ButtonFilter = ({
  children,
  startIcon,
  variant = 'primary',
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
      variant={variant} 
      onPress={onPress}
    >
      {Icon && (
        <Icon
          size="21"
          color={
            variant === 'primary'
              ? colors.secondary400.mode1
              : colors.white.mode1
          }
        />
      )}
      {children && <ButtonText variant={variant}>{children}</ButtonText>}
    </Button>
  )
}
