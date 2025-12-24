import { colors } from 'pearpass-lib-ui-theme-provider/native'

import { Button, ButtonText } from './styles'

/**
 * @param {{
 *  children?: ReactNode
 *  startIcon?: ElementType
 *  variant?: 'primary' | 'secondary'
 *  borderRadius?: 'sm' | 'md' | 'lg'
 *  onPress: () => void
 *  testID?: string
 *  accessibilityLabel?: string
 *  nativeID?: string
 * }} props
 */
export const ButtonLittle = ({
  children,
  startIcon,
  variant = 'primary',
  borderRadius = 'sm',
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
      borderRadius={borderRadius}
    >
      {Icon && (
        <Icon
          size="21"
          color={
            variant === 'primary' ? colors.black.mode1 : colors.primary400.mode1
          }
        />
      )}
      {children && <ButtonText variant={variant}>{children}</ButtonText>}
    </Button>
  )
}
