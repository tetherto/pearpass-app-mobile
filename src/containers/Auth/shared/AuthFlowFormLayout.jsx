import { useCallback, useRef, useState } from 'react'

import { Text, Title, rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { OnboardingLayout } from '../../../screens/OnboardingV2/components/OnboardingLayout'
import { BackScreenHeader } from '../../ScreenHeader/BackScreenHeader'

export const AuthFlowFormLayout = ({
  title,
  subtitle,
  children,
  footer,
  onBack,
  headerTitle,
  avoidBottomInset = false,
  showTitle = true,
  contentStyle,
  scrollContentStyle,
  titleTestID,
  subtitleTestID
}) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const [isScrollable, setIsScrollable] = useState(false)
  const scrollViewHeight = useRef(0)
  const contentHeight = useRef(0)

  const checkScrollable = useCallback(() => {
    setIsScrollable(contentHeight.current > scrollViewHeight.current)
  }, [])

  return (
    <OnboardingLayout showLogo={false} avoidBottomInset={avoidBottomInset}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 50 : 20}
      >
        <View style={styles.flex}>
          {onBack ? (
            <BackScreenHeader title={headerTitle || title} onBack={onBack} />
          ) : null}

          <ScrollView
            contentContainerStyle={[
              styles.scrollViewContent,
              scrollContentStyle
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onLayout={(event) => {
              scrollViewHeight.current = event.nativeEvent.layout.height
              checkScrollable()
            }}
            onContentSizeChange={(_, height) => {
              contentHeight.current = height
              checkScrollable()
            }}
          >
            <View style={[styles.content, contentStyle]}>
              {showTitle ? (
                <View style={styles.titleContainer}>
                  <Title data-testid={titleTestID}>{title}</Title>
                </View>
              ) : null}

              {subtitle ? (
                <View
                  style={[
                    styles.subtitleContainer,
                    onBack && styles.subtitleWithBackContainer
                  ]}
                >
                  <Text
                    as="p"
                    color={
                      onBack
                        ? theme.colors.colorTextSecondary
                        : theme.colors.colorTextPrimary
                    }
                    data-testid={subtitleTestID}
                  >
                    {subtitle}
                  </Text>
                </View>
              ) : null}

              {children}
            </View>
          </ScrollView>

          {footer ? (
            <View
              style={[
                styles.bottomSection,
                {
                  backgroundColor: theme.colors.colorSurfacePrimary,
                  paddingBottom: Math.max(insets.bottom, rawTokens.spacing16),
                  borderTopColor: theme.colors.colorBorderPrimary,
                  shadowColor: theme.colors.colorTextPrimary
                },
                isScrollable && styles.bottomSectionElevated
              ]}
              elevation={isScrollable ? 10 : 0}
            >
              {footer}
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: rawTokens.spacing16
  },
  content: {
    paddingTop: rawTokens.spacing20 * 2,
    gap: rawTokens.spacing20
  },
  titleContainer: {
    alignItems: 'center'
  },
  subtitleContainer: {
    alignItems: 'center'
  },
  subtitleWithBackContainer: {
    alignItems: 'flex-start'
  },
  bottomSection: {
    paddingHorizontal: rawTokens.spacing16,
    paddingTop: rawTokens.spacing16,
    gap: rawTokens.spacing16
  },
  bottomSectionElevated: {
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  }
})
