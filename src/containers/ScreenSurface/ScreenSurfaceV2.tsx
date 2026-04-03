import { useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styles } from './ScreenSurfaceV2Styles'

type ScreenSurfaceProps = {
  children: ReactNode
  footer?: ReactNode
  scrollable?: boolean
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  footerStyle?: StyleProp<ViewStyle>
}

export const ScreenSurface = ({
  children,
  footer,
  scrollable = false,
  style,
  contentStyle,
  footerStyle
}: ScreenSurfaceProps) => {
  const { theme } = useTheme()

  const { bottom } = useSafeAreaInsets()

  return (
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

      <View
        style={[
          styles.footer,
          {
            borderTopColor: theme.colors.colorSurfaceDisabled,
            paddingBottom: bottom
          },
          footer && styles.footerWithContent,
          footerStyle
        ]}
      >
        {footer}
      </View>
    </KeyboardAvoidingView>
  )
}
