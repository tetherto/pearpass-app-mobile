import { ButtonText, Button } from './styles'

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
}) => (
  <Button
    size={size}
    onPress={disabled ? undefined : onPress}
    stretch={stretch}
    disabled={disabled}
    testID={testID}
  >
    <ButtonText size={size} testID={textTestID}>
      {children}
    </ButtonText>
  </Button>
)
