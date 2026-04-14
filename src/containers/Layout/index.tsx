import React, { ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  View,
  ViewStyle
} from 'react-native'
import { useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import { styles } from './styles'

type LayoutProps = {
  /**
   * `'screen'` (default): renders the header *outside* the card surface, above it.
   * `'sheet'`: renders the header *inside* the card (drag handle + title row).
   * Pass a `<SheetHeader>` or equivalent when using `mode="sheet"`.
   */
  mode?: 'screen' | 'sheet'
  header?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  hideFooter?: boolean
  scrollable?: boolean
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  footerStyle?: StyleProp<ViewStyle>
}

export const Layout = ({
  mode = 'screen',
  header,
  children,
  scrollable = false,
  style,
  contentStyle,
  footerStyle,
  footer,
  hideFooter = false
}: LayoutProps) => {
  const { theme } = useTheme()
  const { bottom } = useSafeAreaInsets()

  const isSheetMode = mode === 'sheet'

  const CardWrapper = isSheetMode ? View : KeyboardAvoidingView
  const cardWrapperProps = isSheetMode
    ? {}
    : { behavior: Platform.OS === 'ios' ? ('padding' as const) : ('height' as const) }

  const showFooter = !!footer && !hideFooter

  const card = (
    <CardWrapper
      style={[
        isSheetMode ? styles.sheetSurface : styles.surface,
        {
          borderColor: theme.colors.colorSurfaceDisabled,
          backgroundColor: theme.colors.colorSurfacePrimary
        },
        style
      ]}
      {...cardWrapperProps}
    >
      {isSheetMode && header}

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

      {showFooter && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.colorSurfacePrimary,
              borderTopColor: theme.colors.colorSurfaceDisabled,
              paddingBottom: bottom
            },
            footerStyle
          ]}
        >
          {footer}
        </View>
      )}
    </CardWrapper>
  )

  if (isSheetMode) return card

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.colorBackground }]}
    >
      {header}
      {card}
    </View>
  )
}
