import React, { ReactNode } from 'react'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

type ScreenLayoutProps = {
  header?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  hideFooter?: boolean
  scrollable?: boolean
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  footerStyle?: StyleProp<ViewStyle>
}

export const ScreenLayout = ({
  header,
  children,
  scrollable = false,
  style,
  contentStyle,
  footerStyle,
  footer,
  hideFooter = false
}: ScreenLayoutProps) => {
  const { theme } = useTheme()
  const { bottom } = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.colorBackground }
      ]}
    >
      {header}

      <KeyboardAvoidingView
        style={[
          styles.surface,
          {
            borderColor: theme.colors.colorSurfaceDisabled,
            backgroundColor: theme.colors.colorSurfacePrimary
          },
          style
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

        {!hideFooter && (
          <View
            style={[
              styles.footer,
              {
                backgroundColor: theme.colors.colorSurfacePrimary,
                borderTopColor: theme.colors.colorSurfaceDisabled,
                paddingBottom: bottom
              },
              footer && styles.footerWithContent,
              footerStyle
            ]}
          >
            {footer}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingTop: rawTokens.spacing16,
    paddingHorizontal: rawTokens.spacing16
  },
  surface: {
    flex: 1,
    borderTopLeftRadius: rawTokens.spacing16,
    borderTopRightRadius: rawTokens.spacing16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  footer: {
    borderWidth: 1,
    paddingTop: rawTokens.spacing16,
    paddingHorizontal: rawTokens.spacing16
  },
  footerWithContent: {
    borderTopWidth: 1
  }
})
