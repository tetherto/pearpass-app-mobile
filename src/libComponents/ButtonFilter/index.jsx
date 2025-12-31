import { colors } from 'pearpass-lib-ui-theme-provider/native'

import { Button, ButtonText } from './styles'

/**
 * @param {{
 *  children?: ReactNode
 *  startIcon?: ElementType
 *  variant?: 'primary' | 'secondary'
 *  onPress: () => void
 *  testID?: string
 *  textTestID?: string
 * }} props
 */
export const ButtonFilter = ({
  children,
  startIcon,
  variant = 'primary',
  onPress,
  testID,
  textTestID
}) => {
  const Icon = startIcon
  return (
    <Button
      activeOpacity={0.8}
      variant={variant}
      onPress={onPress}
      testID={testID}
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
      {children && (
        <ButtonText variant={variant} testID={textTestID}>
          {children}
        </ButtonText>
      )}
    </Button>
  )
}
