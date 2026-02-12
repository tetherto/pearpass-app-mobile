import { Button, ButtonText } from './styles'
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
export const ButtonSecondary = ({
  children,
  onPress,
  size = 'md',
  stretch,
  disabled = false,
  testID,
  textTestID
}) => {
  const { hapticButtonSecondary } = useHapticFeedback()

  const handlePress = () => {
    hapticButtonSecondary()
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
