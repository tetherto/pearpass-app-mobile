import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useUserData, useVaults } from 'pearpass-lib-vault'
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  StyleSheet
} from 'react-native'
import Toast from 'react-native-toast-message'

import { AppWarning } from '../../components/AppWarning'
import { ButtonBiometricLogin } from '../../components/ButtonBiometricLogin'
import { NAVIGATION_ROUTES } from '../../constants/navigation'
import { PASSWORDLESS_AUTHENTICATION_TYPES } from '../../constants/passwordlessAuthenticationTypes'
import { useKeyboardVisibility } from '../../hooks/useKeyboardVisibility'
import { ButtonPrimary, InputPasswordPearPass } from '../../libComponents'
import { LogoTextWithLock } from '../../svgs/LogoTextWithLock'

export const EnterPassword = () => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboardVisibility()

  const navigation = useNavigation()
  const { t } = useLingui()

  const [isLoading, setIsLoading] = useState(false)

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors } = useForm({
    initialValues: { password: '' },
    validate: (values) => schema.validate(values)
  })

  const { logIn, refreshMasterPasswordStatus } = useUserData()

  const { initVaults } = useVaults()

  const onSubmit = async (value) => {
    try {
      setIsLoading(true)
      await logIn({ password: value.password })
      await initVaults({ password: value.password })
      navigation.replace('Welcome', { state: NAVIGATION_ROUTES.SELECT_OR_LOAD })
      setIsLoading(false)
    } catch (error) {
      const status = await refreshMasterPasswordStatus()

      if (status?.isLocked) {
        navigation.replace('Welcome', {
          state: NAVIGATION_ROUTES.SCREEN_LOCKED
        })
        return
      }

      setErrors({
        password:
          typeof error === 'string'
            ? error
            : t`Incorrect password. You have ${status?.remainingAttempts} attempts before the app locks for 5 minutes.`
      })
      setIsLoading(false)
    }
  }

  const onPasswordlessLogin = async (encryptionData) => {
    setIsLoading(true)
    try {
      if (!encryptionData) {
        Toast.show({
          type: 'baseToast',
          text1: t`ERROR: No encryption data found`,
          position: 'bottom',
          bottomOffset: 100
        })
        setIsLoading(false)
        return
      }

      const { ciphertext, nonce, hashedPassword } = encryptionData
      await initVaults({ ciphertext, nonce, hashedPassword })

      navigation.replace('Welcome', { state: 'selectOrLoad' })
      setIsLoading(false)
    } catch (error) {
      Toast.show({
        type: 'baseToast',
        text1: error.toString(),
        position: 'bottom',
        bottomOffset: 100
      })
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container} testID="enter-password-screen">
      {!isKeyboardVisible && (
        <View style={styles.logoContainer} testID="enter-password-logo">
          <LogoTextWithLock width={170} height={50} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 40 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text
              style={styles.headerText}
              testID="enter-password-title"
            >{t`Enter Master Password`}</Text>
          </View>

          <View style={styles.inputContainer}>
            <InputPasswordPearPass
              testID="enter-password-input"
              errorTestID="enter-password-input-error"
              placeholder={t`Master password`}
              {...register('password')}
              isPassword
            />
          </View>

          <AppWarning
            testID="enter-password-warning"
            warning={t`Don't forget your master password. It's the only way to access your vault. We can't help recover it. Back it up securely.`}
          />

          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary400.mode1} />
            ) : (
              <>
                <ButtonPrimary
                  testID="enter-password-continue-button"
                  stretch
                  onPress={handleSubmit(onSubmit)}
                >
                  {t`Continue`}
                </ButtonPrimary>

                <ButtonBiometricLogin
                  onBiometricLogin={(encryptionData) =>
                    onPasswordlessLogin(
                      encryptionData,
                      PASSWORDLESS_AUTHENTICATION_TYPES.BIOMETRIC
                    )
                  }
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000
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
  buttonContainer: {
    width: '100%',
    gap: 10
  }
})
