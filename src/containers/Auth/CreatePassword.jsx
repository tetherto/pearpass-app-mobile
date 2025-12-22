import { useEffect, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { TERMS_OF_USE } from 'pearpass-lib-constants'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { closeAllInstances, useUserData, useVaults } from 'pearpass-lib-vault'
import { checkPasswordStrength } from 'pearpass-utils-password-check'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Linking
} from 'react-native'
import Toast from 'react-native-toast-message'

import { AppWarning } from '../../components/AppWarning'
import { NAVIGATION_ROUTES } from '../../constants/navigation.js'
import { TOAST_CONFIG } from '../../constants/toast'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useBiometricsAuthentication } from '../../hooks/useBiometricsAuthentication.js'
import { useKeyboardVisibility } from '../../hooks/useKeyboardVisibility'
import { InputPasswordPearPass } from '../../libComponents'
import { ButtonPrimary } from '../../libComponents'
import { LogoTextWithLock } from '../../svgs/LogoTextWithLock'
import { logger } from '../../utils/logger'
import { BottomSheetBiometricsLoginPrompt } from '../BottomSheetBiometricsLoginPrompt/index.jsx'

const bulletUnicode = '\u2022'

export const CreatePassword = () => {
  const timeoutRef = useRef(null)

  const { isKeyboardVisible } = useKeyboardVisibility()

  const { isBiometricsSupported, enableBiometrics } =
    useBiometricsAuthentication()
  const { resetState } = useVaults()

  const navigation = useNavigation()
  const { t } = useLingui()
  const { expand } = useBottomSheet()

  const [isLoading, setIsLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const errors = {
    minLength: t`Password must be at least 8 characters long`,
    hasLowerCase: t`Password must contain at least one lowercase letter`,
    hasUpperCase: t`Password must contain at least one uppercase letter`,
    hasNumbers: t`Password must contain at least one number`,
    hasSymbols: t`Password must contain at least one special character`
  }

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`),
    passwordConfirm: Validator.string().required(t`Password is required`)
  })

  const { createMasterPassword, logIn } = useUserData()
  const { initVaults } = useVaults()

  const { register, handleSubmit, setErrors, setValue } = useForm({
    initialValues: {
      password: '',
      passwordConfirm: ''
    },
    validate: (values) => schema.validate(values)
  })

  const { onChange: onPasswordChange, ...passwordRegisterProps } =
    register('password')

  const handlePasswordChange = (val) => {
    onPasswordChange(val)

    if (!val) {
      setErrors({})
      return
    }

    validateMasterPassword(val)
  }

  const validateMasterPassword = (password) => {
    const result = checkPasswordStrength(password, { errors })

    if (!result.success) {
      setErrors({
        password: result.errors[0]
      })

      return false
    }

    setErrors({})
    return true
  }

  const handleTermsPress = () => {
    Keyboard.dismiss()
    Linking.openURL(TERMS_OF_USE)
  }

  const navigateToLogin = () => {
    navigation.replace('Welcome', {
      state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD
    })
  }

  const enableBiometricAuthentication = async (password) => {
    try {
      await logIn({ password })
      await initVaults({ password })
      const { error } = await enableBiometrics()
      await closeAllInstances()
      resetState()

      if (error) {
        logger.error('Failed to enable biometric authentication:', error)
        Toast.show({
          type: 'baseToast',
          text1: t`Failed to enable biometric authentication.`,
          position: 'bottom',
          bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
        })
      }

      navigateToLogin()
    } catch (error) {
      logger.error('Error while enabling biometric authentication:', error)
      navigateToLogin()
    }
  }

  const handleShowBiometricsLoginPrompt = (password) => {
    Keyboard.dismiss()

    timeoutRef.current = setTimeout(() => {
      expand({
        children: (
          <BottomSheetBiometricsLoginPrompt
            onConfirm={() => enableBiometricAuthentication(password)}
            onDismiss={navigateToLogin}
          />
        ),
        snapPoints: ['10%', '80%'],
        enableContentPanningGesture: false
      })
    }, TOAST_CONFIG.TIMEOUT_DELAY)
  }

  const onSubmit = async (values) => {
    const isValid = validateMasterPassword(values.password)

    if (!isValid) {
      setValue('passwordConfirm', '')
      return
    }

    if (values.password !== values.passwordConfirm) {
      setErrors({
        passwordConfirm: t`Passwords do not match`
      })

      return
    }

    try {
      setIsLoading(true)

      await createMasterPassword(values.password)

      setIsLoading(false)

      if (isBiometricsSupported) {
        handleShowBiometricsLoginPrompt(values.password)
      } else {
        navigateToLogin()
      }
    } catch (error) {
      logger.error(error)
      setIsLoading(false)
    }
  }

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current)
    },
    []
  )

  return (
    <View style={styles.container} testID="create-password-screen" accessibilityLabel="create-password-screen">
      {!isKeyboardVisible && (
        <View style={styles.logoContainer} testID="create-password-logo" accessibilityLabel="create-password-logo">
          <LogoTextWithLock width={170} height={50} />
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer} testID="create-password-form-container" accessibilityLabel="create-password-form-container">
            <View style={styles.headerContainer}>
              <Text style={styles.headerText} testID="create-password-title" accessibilityLabel="create-password-title">{t`Create Master Password`}</Text>
            </View>
            <Text
              style={styles.boldText} testID="create-password-description" accessibilityLabel="create-password-description"
            >{t`The first thing to do is create a Master password to secure your account.  You’ll use this password to access PearPass. `}</Text>
            <View style={styles.inputContainer} testID="create-password-inputs-container" accessibilityLabel="create-password-inputs-container">
              <InputPasswordPearPass
                testID="create-password-input"
                accessibilityLabel="create-password-input"
                placeholder={t`Enter Password`}
                {...passwordRegisterProps}
                onChange={handlePasswordChange}
                isPassword
              />

              <InputPasswordPearPass
                testID="create-password-confirm-input"
                accessibilityLabel="create-password-confirm-input"
                placeholder={t`Confirm Password`}
                {...register('passwordConfirm')}
                isPassword
              />
            </View>

            <View style={styles.requirementsContainer} testID="create-password-requirements-container" accessibilityLabel="create-password-requirements-container">
              <Text style={styles.requirementsText} testID="create-password-requirements-text" accessibilityLabel="create-password-requirements-text">
                {t`Your password must be at least 8 characters long and include at least one of each:`}
              </Text>
              <View style={styles.bulletList} testID="create-password-requirements-list" accessibilityLabel="create-password-requirements-list">
                <Text style={styles.bulletItem} testID="create-password-requirement-uppercase" accessibilityLabel="create-password-requirement-uppercase">
                  {`${bulletUnicode} ${t`Uppercase Letter (A-Z)`}`}
                </Text>
                <Text style={styles.bulletItem} testID="create-password-requirement-lowercase" accessibilityLabel="create-password-requirement-lowercase">
                  {`${bulletUnicode} ${t`Lowercase Letter (a-z)`}`}
                </Text>
                <Text style={styles.bulletItem} testID="create-password-requirement-number" accessibilityLabel="create-password-requirement-number">
                  {`${bulletUnicode} ${t`Number (0-9)`}`}
                </Text>
                <Text style={styles.bulletItem} testID="create-password-requirement-special" accessibilityLabel="create-password-requirement-special">
                  {`${bulletUnicode} ${t`Special Character (! @ # $...)`}`}
                </Text>
              </View>
              <Text style={styles.noteText} testID="create-password-requirement-note" accessibilityLabel="create-password-requirement-note">
                {t`Note: Avoid common words and personal information.`}
              </Text>
            </View>

            <View style={styles.termsContainer} testID="create-password-terms-container" accessibilityLabel="create-password-terms-container">
              <AppWarning testID="create-password-warning" accessibilityLabel="create-password-warning"
                warning={t`Don't forget your master password. It's the only way to access your vault. We can't help recover it. Back it up securely.`}
                textStyles={{ flex: 0 }}
              />
              <Text style={styles.termsTitle} testID="create-password-terms-title" accessibilityLabel="create-password-terms-title">{t`PearPass Terms of Use`}</Text>

              <View style={styles.checkboxContainer} testID="create-password-terms-checkbox-row" accessibilityLabel="create-password-terms-checkbox-row">
                <TouchableOpacity 
                testID="create-password-terms-checkbox"
                accessibilityLabel="create-password-terms-checkbox"
                onPress={() => setAccepted(!accepted)}>
                  {accepted ? (
                    <View style={styles.checkboxOuter} testID="create-password-terms-checkbox-checked" accessibilityLabel="create-password-terms-checkbox-checked">
                      <View style={styles.checkboxInner} />
                    </View>
                  ) : (
                    <View style={styles.checkboxEmpty} testID="create-password-terms-checkbox-unchecked" accessibilityLabel="create-password-terms-checkbox-unchecked" />
                  )}
                </TouchableOpacity>
                  <View style={styles.textContainer}>
                    <View
                      style={styles.termsTextRow}
                      testID="create-password-terms-text-row"
                      nativeID="create-password-terms-text-row"
                      accessibilityLabel="create-password-terms-text-row"
                    >
                    <Text
                      style={styles.bottomText}
                      testID="create-password-terms-text"
                      nativeID="create-password-terms-text"
                      accessibilityLabel="create-password-terms-text"
                    >
                      {t`I have read and agree to the`}{' '}
                    </Text>

                    <Text
                      style={[styles.bottomText, styles.linkText, { flexShrink: 1 }]}
                      onPress={handleTermsPress}
                      testID="create-password-terms-link"
                      nativeID="create-password-terms-link"
                      accessibilityLabel="create-password-terms-link"
                    >
                      {t`PearPass Application Terms of Use`}
                    </Text>

                    <Text style={styles.bottomText}>.</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.buttonContainer} testID="create-password-actions-container" accessibilityLabel="create-password-actions-container">
              {isLoading ? (
                <ActivityIndicator
                  testID="create-password-loading"
                  accessibilityLabel="create-password-loading"
                  size="small"
                  color={colors.primary400.mode1}
                />
              ) : (
                <ButtonPrimary
                  testID="create-password-continue-button"
                  accessibilityLabel="create-password-continue-button"
                  stretch
                  onPress={handleSubmit(onSubmit)}
                  disabled={!accepted}
                >
                  {t`Continue`}
                </ButtonPrimary>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000
  },
  keyboardAvoidingView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 140
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 20
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white.mode1
  },
  inputContainer: {
    width: '100%',
    gap: 15
  },
  termsContainer: {
    marginHorizontal: 10
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white.mode1,
    marginTop: 15
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10
  },
  checkboxOuter: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: colors.primary300.mode1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: colors.primary300.mode1
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: colors.primary300.mode1
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10
  },
  bottomText: {
    color: colors.white.mode1,
    fontSize: 16,
    fontFamily: 'Inter',
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: '400'
  },
  linkText: {
    color: colors.white.mode1,
    fontSize: 16,
    fontFamily: 'Inter',
    textDecorationLine: 'underline',
    textDecorationColor: colors.white.mode1,
    fontWeight: '400'
  },
  buttonContainer: {
    width: '100%'
  },
  boldText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    color: colors.white.mode1,
    textAlign: 'center',
    fontSize: 14
  },
  requirementsContainer: {
    width: '100%'
  },
  requirementsText: {
    color: colors.grey100.mode1,
    fontSize: 14,
    fontFamily: 'Inter'
  },
  bulletList: {
    marginLeft: 10
  },
  bulletItem: {
    color: colors.grey100.mode1,
    fontSize: 14,
    fontFamily: 'Inter',
    lineHeight: 20
  },
  noteText: {
    color: colors.grey100.mode1,
    fontSize: 14,
    fontFamily: 'Inter'
  },
  termsTextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }
})
