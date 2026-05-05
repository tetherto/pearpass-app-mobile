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
  showLogo,
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

  const resolvedShowLogo = showLogo ?? !onBack

  return (
    <OnboardingLayout
      showLogo={resolvedShowLogo}
      avoidBottomInset={avoidBottomInset}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 50 : 0}
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
            <View
              style={[
                styles.content,
                avoidBottomInset && styles.contentKeyboardOpen,
                contentStyle
              ]}
            >
              {showTitle || subtitle ? (
                <View style={styles.headerBlock}>
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
                        color={theme.colors.colorTextPrimary}
                        style={styles.subtitleText}
                        data-testid={subtitleTestID}
                      >
                        {subtitle}
                      </Text>
                    </View>
                  ) : null}
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
                  paddingBottom: !avoidBottomInset
                    ? rawTokens.spacing24
                    : Math.max(insets.bottom, rawTokens.spacing24),
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
    paddingTop: rawTokens.spacing60,
    paddingBottom: rawTokens.spacing60,
    gap: rawTokens.spacing32
  },
  contentKeyboardOpen: {
    paddingTop: rawTokens.spacing40,
    paddingBottom: rawTokens.spacing40
  },
  headerBlock: {
    gap: rawTokens.spacing12
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
  subtitleText: {
    textAlign: 'center'
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
