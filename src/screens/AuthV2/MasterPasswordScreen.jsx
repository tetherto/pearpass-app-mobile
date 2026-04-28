import { useState, useCallback } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  AlertMessage,
  Button,
  Link,
  PasswordField,
  Text,
  Title,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightFilled } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useUserData, useVaults } from '@tetherto/pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from '@tetherto/pearpass-lib-vault/src/utils/buffer'
import * as SecureStore from 'expo-secure-store'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { useAutoSelectVault } from './hooks/useAutoSelectVault'
import { IOS_APP_GROUP_ID } from '../../constants/iosAppGroup'
import { NAVIGATION_ROUTES } from '../../constants/navigation'
import { SECURE_STORAGE_KEYS } from '../../constants/secureStorageKeys'
import { useBiometricsAuthentication } from '../../hooks/useBiometricsAuthentication'
import { useKeyboardVisibility } from '../../hooks/useKeyboardVisibility'
import {
  isFacialRecognitionSupported,
  isFingerprintSupported as getIsFingerprintSupported
} from '../../utils/biometricLogin'
import { logger } from '../../utils/logger'
import { unsupportedFeaturesEnabled } from '../../utils/unsupportedFeatures'
import { OnboardingLayout } from '../OnboardingV2/components/OnboardingLayout'

export const MasterPasswordScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { isKeyboardVisible } = useKeyboardVisibility()
  const insets = useSafeAreaInsets()
  const styles = getStyles(theme)

  const [isLoading, setIsLoading] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)

  const { logIn, refreshMasterPasswordStatus } = useUserData()
  const { initVaults } = useVaults()
  const { autoSelectVault } = useAutoSelectVault()

  const { isBiometricsEnabled, isBiometricsSupported, biometricTypes } =
    useBiometricsAuthentication()

  const isBiometricAvailable =
    isBiometricsEnabled && isBiometricsSupported && biometricTypes?.length > 0

  const isFaceID =
    isBiometricAvailable && isFacialRecognitionSupported(biometricTypes)
  const isFingerprint =
    isBiometricAvailable && getIsFingerprintSupported(biometricTypes)

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors, values } = useForm({
    initialValues: { password: '' },
    validate: (values) => schema.validate(values)
  })

  const passwordRegisterProps = register('password')

  const onSubmit = async (value) => {
    const passwordBuffer = stringToBuffer(value.password)

    try {
      setIsLoading(true)
      await logIn({ password: passwordBuffer })
      await initVaults({ password: passwordBuffer })
      await autoSelectVault()
    } catch (error) {
      const status = await refreshMasterPasswordStatus()

      if (status?.isLocked) {
        navigation.replace('Welcome', {
          state: NAVIGATION_ROUTES.SCREEN_LOCKED
        })
        return
      }

      const message =
        typeof error === 'string'
          ? error
          : t`Incorrect Master Password. ${status?.remainingAttempts} ${status?.remainingAttempts === 1 ? t`try` : t`tries`} left.`

      setErrors({ password: message })
      setFailedAttempts((prev) => prev + 1)
    } finally {
      clearBuffer(passwordBuffer)
      setIsLoading(false)
    }
  }

  const handleBiometricRetry = useCallback(async () => {
    try {
      setIsLoading(true)
      const encryptionData = await SecureStore.getItemAsync(
        SECURE_STORAGE_KEYS.ENCRYPTION_DATA,
        {
          requireAuthentication: true,
          accessGroup: IOS_APP_GROUP_ID
        }
      )

      const parsedEncryptionData = encryptionData
        ? JSON.parse(encryptionData)
        : undefined

      if (!parsedEncryptionData) {
        Toast.show({
          type: 'baseToast',
          text1: t`ERROR: No encryption data found`,
          position: 'bottom',
          bottomOffset: 100
        })
        setIsLoading(false)
        return
      }

      const { ciphertext, nonce, hashedPassword } = parsedEncryptionData
      await initVaults({ ciphertext, nonce, hashedPassword })

      await autoSelectVault()
    } catch (error) {
      logger.error('Biometric login error:', error)
      Toast.show({
        type: 'baseToast',
        text1: t`ERROR: Authentication failed`,
        position: 'bottom',
        bottomOffset: 100
      })
    } finally {
      setIsLoading(false)
    }
  }, [initVaults, navigation, t])

  const biometricLabel = isFaceID
    ? t`Try again with Face ID`
    : isFingerprint
      ? t`Try again with Fingerprint`
      : null

  return (
    <OnboardingLayout topGradient avoidBottomInset={isKeyboardVisible}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 50 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.topSection}>
            <View style={styles.titleContainer}>
              <Title>{t`Enter Your Master Password`}</Title>
              <Text
                color={theme.colors.colorTextSecondary}
              >{t`Please enter your master password to continue`}</Text>
            </View>

            <View style={styles.inputSection}>
              <PasswordField
                label={t`Password`}
                placeholder={t`Enter Master Password`}
                value={passwordRegisterProps.value}
                onChange={passwordRegisterProps.onChange}
                error={passwordRegisterProps.error}
                data-testid="auth-v2-master-password-input"
              />

              {failedAttempts >= 2 ? (
                <AlertMessage
                  variant="warning"
                  title={t`Forgot your Master Password?`}
                  description={
                    <Text>
                      <Link>{t`Use your Recovery Phrase`}</Link>
                      {` ${t`to reset it and restore access.`}`}
                    </Text>
                  }
                  testID="auth-v2-master-password-alert"
                />
              ) : null}
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomSection}>
          <View style={styles.linkContainer}>
            {isBiometricAvailable && biometricLabel ? (
              <Link
                onPress={handleBiometricRetry}
                data-testid="auth-v2-biometric-retry"
              >
                {biometricLabel}
              </Link>
            ) : unsupportedFeaturesEnabled() ? (
              <Link onClick={navigation.goBack} data-testid="auth-v2-pin-retry">
                {t`Try again with PIN`}
              </Link>
            ) : null}
          </View>

          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit(onSubmit)}
            disabled={!values.password}
            isLoading={isLoading}
            iconAfter={<KeyboardArrowRightFilled />}
            data-testid="auth-v2-master-password-continue"
          >
            {t`Continue`}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </OnboardingLayout>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingHorizontal: rawTokens.spacing16
    },
    topSection: {
      paddingTop: rawTokens.spacing60,
      gap: rawTokens.spacing48
    },
    titleContainer: {
      alignItems: 'center',
      gap: rawTokens.spacing12
    },
    inputSection: {
      gap: rawTokens.spacing16
    },
    bottomSection: {
      paddingHorizontal: rawTokens.spacing16,
      paddingBottom: rawTokens.spacing20,
      paddingTop: rawTokens.spacing16,
      gap: rawTokens.spacing16,
      backgroundColor: theme.colors.colorSurfacePrimary
    },
    linkContainer: {
      alignItems: 'center',
      gap: rawTokens.spacing16
    }
  })
