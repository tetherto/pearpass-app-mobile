import { ButtonText, Button } from './styles'

/**
 * @param {{
 *  children: ReactNode
 *  startIcon?: ElementType
 *  size?: 'sm' | 'md'
 *  stretch: boolean
 *  onPress: () => void
 *  testID?: string
 *  accessibilityLabel?: string
 *  nativeID?: string
 * }} props
 */
export const ButtonPrimary = ({
  children,
  onPress,
  size = 'md',
  stretch,
  disabled,
  testID,
  accessibilityLabel,
  nativeID
}) => (
  <Button
    testID={testID}
    nativeID={nativeID ?? testID}
    accessibilityLabel={accessibilityLabel ?? testID}
    accessibilityRole="button"
    size={size}
    onPress={disabled ? undefined : onPress}
    stretch={stretch}
    disabled={disabled}
  >
    <ButtonText size={size}>{children}</ButtonText>
  </Button>
)
