import { colors } from 'pearpass-lib-ui-theme-provider/native'

import { Button, ButtonText } from './styles'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

/**
 * @param {{
 *  children?: ReactNode
 *  startIcon?: ElementType
 *  variant?: 'primary' | 'secondary'
 *  borderRadius?: 'sm' | 'md' | 'lg'
 *  onPress: () => void
 *  testID?: string
 *  textTestID?: string
 * }} props
 */
export const ButtonLittle = ({
  children,
  startIcon,
  variant = 'primary',
  borderRadius = 'sm',
  onPress,
  testID,
  textTestID
}) => {
  const Icon = startIcon
  const { hapticButtonPrimary, hapticButtonSecondary } = useHapticFeedback()

  const handlePress = () => {
    if (variant === 'primary') {
      hapticButtonPrimary()
    } else {
      hapticButtonSecondary()
    }
    onPress?.()
  }

  return (
    <Button
      activeOpacity={0.8}
      variant={variant}
      onPress={handlePress}
      borderRadius={borderRadius}
      testID={testID}
    >
      {Icon && (
        <Icon
          size="21"
          color={
            variant === 'primary' ? colors.black.mode1 : colors.primary400.mode1
          }
        />
      )}
      {children && (
        <ButtonText variant={variant} testID={textTestID}>
          {children}
        </ButtonText>
      )}
    </Button>
  )
}
