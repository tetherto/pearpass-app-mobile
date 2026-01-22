import { ButtonText, Button } from './styles'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

/**
 * @param {{
 *  children: ReactNode
 *  startIcon?: ElementType
 *  size?: 'sm' | 'md'
 *  stretch: boolean
 *  onPress: () => void
 *  disabled?: boolean
 *  testID?: string
 *  textTestID?: string
 * }} props
 */
export const ButtonPrimary = ({
  children,
  onPress,
  size = 'md',
  stretch,
  disabled,
  testID,
  textTestID
}) => {
  const { hapticButtonPrimary } = useHapticFeedback()

  const handlePress = () => {
    hapticButtonPrimary()
    onPress?.()
  }

  return (
    <Button
      size={size}
      onPress={disabled ? undefined : handlePress}
      stretch={stretch}
      disabled={disabled}
      testID={testID}
    >
      <ButtonText size={size} testID={textTestID}>
        {children}
      </ButtonText>
    </Button>
  )
}
