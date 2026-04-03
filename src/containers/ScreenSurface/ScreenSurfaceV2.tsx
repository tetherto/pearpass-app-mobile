import { useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styles } from './ScreenSurfaceV2Styles'

const KEYBOARD_SCROLL_RATIO = 0.05
const SCREEN_HEIGHT = Dimensions.get('window').height

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
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollViewHeight = useRef(0)
  const contentHeight = useRef(0)
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    if (!scrollable) return

    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSub = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true)
    )
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false)
    )

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [scrollable])

  useEffect(() => {
    if (!keyboardVisible || !scrollable) return

    const timer = setTimeout(
      () => {
        const overflow = contentHeight.current - scrollViewHeight.current
        if (overflow > 0) {
          scrollViewRef.current?.scrollTo({
            y: overflow,
            animated: Platform.OS !== 'android'
          })
        }
      },
      Platform.OS === 'android' ? 100 : 0
    )

    return () => clearTimeout(timer)
  }, [keyboardVisible, scrollable])

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    scrollViewHeight.current = e.nativeEvent.layout.height
  }, [])

  const handleContentSizeChange = useCallback((_w: number, h: number) => {
    contentHeight.current = h
  }, [])

  const keyboardPadding =
    keyboardVisible && Platform.OS === 'android'
      ? { paddingBottom: SCREEN_HEIGHT * KEYBOARD_SCROLL_RATIO }
      : undefined

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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -bottom : 0}
    >
      {scrollable ? (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            keyboardPadding,
            contentStyle
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onLayout={handleLayout}
          onContentSizeChange={handleContentSizeChange}
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
            styles.footerWithContent,
            {
              borderTopColor: theme.colors.colorSurfaceDisabled,
              backgroundColor: theme.colors.colorSurfacePrimary,
              paddingBottom: bottom + 16
            },
            footerStyle
          ]}
        >
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  )
}
