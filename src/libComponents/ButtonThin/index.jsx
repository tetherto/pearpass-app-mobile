import { colors } from 'pearpass-lib-ui-theme-provider/native'

import { Button, ButtonText } from './styles'

/**
 * @param {{
 *  children: ReactNode
 *  startIcon?: ElementType
 *  onPress: () => void
 *  testID?: string
 *  textTestID?: string
 * }} props
 */
export const ButtonThin = ({
  children,
  startIcon,
  onPress,
  testID,
  textTestID
}) => {
  const Icon = startIcon
  return (
    <Button activeOpacity={0.8} onPress={onPress} testID={testID}>
      {Icon && <Icon size="21" color={colors.primary400.mode1} />}
      {children && <ButtonText testID={textTestID}>{children}</ButtonText>}
    </Button>
  )
}
