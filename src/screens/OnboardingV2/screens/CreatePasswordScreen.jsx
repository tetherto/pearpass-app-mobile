import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { TERMS_OF_USE } from '@tetherto/pearpass-lib-constants'
import { Button, Text } from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightFilled } from '@tetherto/pearpass-lib-ui-kit/icons'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { Keyboard, Linking, Pressable, StyleSheet } from 'react-native'

import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { AuthFlowFormLayout } from '../../../containers/Auth/shared/AuthFlowFormLayout'
import { ConfirmablePasswordFields } from '../../../containers/Auth/shared/ConfirmablePasswordFields'
import { useKeyboardVisibility } from '../../../hooks/useKeyboardVisibility'
import { usePasswordCreation } from '../hooks/usePasswordCreation'

export const CreatePasswordScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { isKeyboardVisible } = useKeyboardVisibility()

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
    <AuthFlowFormLayout
      title={t`Create Master password`}
      titleTestID="onboarding-v2-create-password-title"
      subtitleTestID="onboarding-v2-create-password-subtitle"
      subtitle={
        <>
          {t`This is the key to access PearPass. Already using PearPass?`}{' '}
          <Pressable onPress={handleTransferData} style={styles.inlineLink}>
            <Text
              style={styles.linkText}
              data-testid="onboarding-v2-transfer-data-link"
            >
              {t`Transfer Data`}
            </Text>
          </Pressable>
        </>
      }
      avoidBottomInset={isKeyboardVisible}
      footer={
        <>
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
        </>
      }
    >
      <ConfirmablePasswordFields
        testID="onboarding-v2-password-form"
        passwordField={{
          label: t`Password`,
          placeholderText: t`Enter Master Password`,
          value: passwordRegisterProps.value,
          onChangeText: handlePasswordChange,
          passwordIndicator: passwordIndicatorVariant,
          infoBox: t`Strong passwords are usually at least 8 characters long, hard to guess, use a mix of letters, numbers, and symbols, and aren't based on personal information.`,
          testID: 'onboarding-v2-password-input'
        }}
        confirmPasswordField={{
          label: t`Repeat Password`,
          placeholderText: t`Repeat Master Password`,
          value: passwordConfirmRegisterProps.value,
          onChangeText: handlePasswordConfirmChange,
          passwordIndicator: passwordsMatch ? 'match' : undefined,
          variant: passwordConfirmRegisterProps.error ? 'error' : 'default',
          errorMessage: passwordConfirmRegisterProps.error,
          testID: 'onboarding-v2-password-confirm-input'
        }}
      />
    </AuthFlowFormLayout>
  )
}

const styles = StyleSheet.create({
  inlineLink: {
    transform: [{ translateY: 4 }]
  },
  linkText: {
    color: colors.primary400.option1,
    textDecorationLine: 'underline'
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
