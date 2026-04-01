import { useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { View } from 'react-native'

import { createStyles } from './styles'

export const ContentContainer = ({ children, style }) => {
  const { theme } = useTheme()
  const styles = createStyles(theme.colors)

  return <View style={[styles.container, style]}>{children}</View>
}
