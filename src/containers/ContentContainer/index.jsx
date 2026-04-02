import { useContext } from 'react'

import { useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { ScrollView, View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { styles } from './styles'

export const ContentContainer = ({
  children,
  footer,
  scrollable = false,
  style,
  contentStyle,
  footerStyle
}) => {
  const { theme } = useTheme()
  const insets = useContext(SafeAreaInsetsContext)
  const bottom = insets?.bottom ?? 0

  return (
    <View
      style={[
        styles.surface,
        {
          borderColor: theme.colors.colorSurfaceDisabled,
          backgroundColor: theme.colors.colorSurfacePrimary
        },
        style
      ]}
    >
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}

      {footer && (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: theme.colors.colorSurfaceDisabled,
              paddingBottom: bottom
            },
            footerStyle
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  )
}
