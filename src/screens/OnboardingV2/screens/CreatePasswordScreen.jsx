import { useCallback, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { TERMS_OF_USE } from '@tetherto/pearpass-lib-constants'
import {
  Button,
  Form,
  PasswordField,
  useTheme,
  Text,
  Title
} from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightFilled } from '@tetherto/pearpass-lib-ui-kit/icons'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { useKeyboardVisibility } from '../../../hooks/useKeyboardVisibility'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { usePasswordCreation } from '../hooks/usePasswordCreation'

export const CreatePasswordScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { isKeyboardVisible } = useKeyboardVisibility()
  const insets = useSafeAreaInsets()
  const [isScrollable, setIsScrollable] = useState(false)
  const scrollViewHeight = useRef(0)
  const contentHeight = useRef(0)

  const checkScrollable = useCallback(() => {
    setIsScrollable(contentHeight.current > scrollViewHeight.current)
  }, [])

  const {
    passwordRegisterProps,
    passwordConfirmRegisterProps,
    handlePasswordChange,
    handlePasswordConfirmChange,
    passwordIndicatorVariant,
    passwordsMatch,
    canSubmit,
    isLoading,
    submit
  } = usePasswordCreation()

  const handleTransferData = () => {
    navigation.navigate('Welcome', {
      state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD
    })
  }

  const handleTermsPress = () => {
    Keyboard.dismiss()
    Linking.openURL(TERMS_OF_USE)
  }

  const handleContinue = () => {
    submit((password) => {
      navigation.navigate('OnboardingV2Autofill', { password })
    })
  }

  return (
    <OnboardingLayout avoidBottomInset={isKeyboardVisible}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 50 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onLayout={(e) => {
            scrollViewHeight.current = e.nativeEvent.layout.height
            checkScrollable()
          }}
          onContentSizeChange={(_, h) => {
            contentHeight.current = h
            checkScrollable()
          }}
        >
          <View style={styles.topSection}>
            <Title
              style={styles.title}
              data-testid="onboarding-v2-create-password-title"
            >
              {t`Create Master password`}
            </Title>

            <Text
              style={styles.subtitle}
              data-testid="onboarding-v2-create-password-subtitle"
            >
              {t`This is the key to access PearPass. Already using PearPass?`}{' '}
              <Pressable onPress={handleTransferData} style={styles.inlineLink}>
                <Text
                  style={styles.linkText}
                  data-testid="onboarding-v2-transfer-data-link"
                >
                  {t`Transfer Data`}
                </Text>
              </Pressable>
            </Text>

            <Form>
              <PasswordField
                label={t`Password`}
                placeholderText={t`Enter Master Password`}
                value={passwordRegisterProps.value}
                onChangeText={handlePasswordChange}
                passwordIndicator={passwordIndicatorVariant}
                infoBox={t`Strong passwords are usually at least 8 characters long, hard to guess, use a mix of letters, numbers, and symbols, and aren't based on personal information.`}
                data-testid="onboarding-v2-password-input"
              />

              <Animated.View layout={LinearTransition.duration(200)}>
                <PasswordField
                  label={t`Repeat Password`}
                  placeholderText={t`Repeat Master Password`}
                  value={passwordConfirmRegisterProps.value}
                  onChangeText={handlePasswordConfirmChange}
                  passwordIndicator={passwordsMatch ? 'match' : undefined}
                  variant={
                    passwordConfirmRegisterProps.error ? 'error' : 'default'
                  }
                  errorMessage={passwordConfirmRegisterProps.error}
                  data-testid="onboarding-v2-password-confirm-input"
                />
              </Animated.View>
            </Form>
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomSection,
            { backgroundColor: theme.colors.colorSurfacePrimary },
            isScrollable && styles.bottomSectionElevated
          ]}
          elevation={isScrollable ? 10 : 0}
        >
          <Text style={styles.termsText} data-testid="onboarding-v2-terms-text">
            {t`By clicking Continue, you confirm that you have read and agree to the`}{' '}
            <Pressable onPress={handleTermsPress} style={styles.inlineLink}>
              <Text
                style={styles.termsLink}
                data-testid="onboarding-v2-terms-link"
              >
                {t`PearPass Application Terms of Use`}
              </Text>
            </Pressable>
            .
          </Text>

          <Button
            variant="primary"
            fullWidth
            onClick={handleContinue}
            disabled={!canSubmit}
            isLoading={isLoading}
            iconAfter={<KeyboardArrowRightFilled />}
            data-testid="onboarding-v2-create-password-continue"
          >
            {t`Continue`}
          </Button>
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
    paddingHorizontal: 16
  },
  topSection: {
    paddingTop: 40,
    gap: 20
  },
  title: {
    fontFamily:
      Platform.OS === 'android' ? 'humble-nostalgia' : 'Humble Nostalgia',
    color: colors.white.mode1,
    textAlign: 'center'
  },
  subtitle: {
    color: colors.white.mode1,
    textAlign: 'center'
  },
  inlineLink: {
    transform: [{ translateY: 4 }]
  },
  linkText: {
    color: colors.primary400.option1,
    textDecorationLine: 'underline'
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 16,
    gap: 16
  },
  bottomSectionElevated: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  termsText: {
    color: '#BDC3AC',
    textAlign: 'center'
  },
  termsLink: {
    color: colors.primary400.option1,
    textDecorationLine: 'underline'
  }
})
