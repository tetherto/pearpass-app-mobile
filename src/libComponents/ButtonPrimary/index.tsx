import { ReactNode } from 'react'
import { ButtonText, Button } from './styles'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

interface ButtonPrimaryProps {
  children: ReactNode
  onPress?: () => void
  size?: 'sm' | 'md'
  stretch?: boolean
  disabled?: boolean
  testID?: string
  textTestID?: string
}

export const ButtonPrimary = ({
  children,
  onPress,
  size = 'md',
  stretch = false,
  disabled = false,
  testID,
  textTestID
}: ButtonPrimaryProps) => {
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
