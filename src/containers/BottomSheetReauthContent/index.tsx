import { useCallback, useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  Button,
  Link,
  PasswordField,
  Text,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightFilled } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useUserData, useVaults } from '@tetherto/pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from '@tetherto/pearpass-lib-vault/src/utils/buffer'
import * as SecureStore from 'expo-secure-store'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { BiometricType, Numpad } from '../../components/Numpad'
import { PinSlots } from '../../components/PinSlots'
import { IOS_APP_GROUP_ID } from '../../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../../constants/secureStorageKeys'
import { useBiometricsAuthentication } from '../../hooks/useBiometricsAuthentication'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'
import {
  isFingerprintSupported as getIsFingerprintSupported,
  isFacialRecognitionSupported
} from '../../utils/biometricLogin'
import { logger } from '../../utils/logger'
import { unsupportedFeaturesEnabled } from '../../utils/unsupportedFeatures'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { Layout } from '../Layout'
import { styles } from './styles'

const PIN_LENGTH = 6

type InputMode = 'pin' | 'password'

interface BottomSheetReauthContentProps {
  onConfirm: (data?: { encryptionData?: object }) => Promise<void>
}

export const BottomSheetReauthContent = ({
  onConfirm
}: BottomSheetReauthContentProps) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
  const { bottom } = useSafeAreaInsets()
  const { hapticSuccess, hapticError, hapticButtonSecondary } =
    useHapticFeedback()

  const { logIn } = useUserData()
  const { initVaults } = useVaults()

  const [mode, setMode] = useState<InputMode>(unsupportedFeaturesEnabled() ? 'pin' : 'password')
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { isBiometricsEnabled, isBiometricsSupported, biometricTypes } =
    useBiometricsAuthentication()

  const isBiometricAvailable =
    isBiometricsEnabled &&
    isBiometricsSupported &&
    (biometricTypes?.length ?? 0) > 0

  const isFaceID =
    isBiometricAvailable && isFacialRecognitionSupported(biometricTypes)
  const isFingerprint =
    isBiometricAvailable && getIsFingerprintSupported(biometricTypes)

  const biometricType =
    isFaceID && !isFingerprint
      ? BiometricType.Face
      : isFingerprint
        ? BiometricType.Fingerprint
        : null

  const handleBiometricAuth = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
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

      hapticSuccess()
      await onConfirm({ encryptionData: parsedEncryptionData })
      collapse()
    } catch (error) {
      logger.error('Biometric login error:', error)
      hapticError()
      Toast.show({
        type: 'baseToast',
        text1: t`ERROR: Authentication failed`,
        position: 'bottom',
        bottomOffset: 100
      })
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hapticSuccess, hapticError, initVaults, onConfirm, t])

  // Auto-trigger biometric auth on mount
  useEffect(() => {
    if (isBiometricAvailable) {
      const timer = setTimeout(() => {
        handleBiometricAuth()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isBiometricAvailable])

  const handlePadPress = useCallback(
    (digit: string) => {
      if (pin.length >= PIN_LENGTH) return
      hapticButtonSecondary()
      setPin((prev) => prev + digit)
    },
    [pin, hapticButtonSecondary]
  )

  const handleBackspace = useCallback(() => {
    hapticButtonSecondary()
    setPin((prev) => prev.slice(0, -1))
  }, [hapticButtonSecondary])

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors, values } = useForm({
    initialValues: { password: '' },
    validate: (values: { password: string }) => schema.validate(values)
  })

  const passwordRegisterProps = register('password')

  const handlePasswordSubmit = async (formValues: { password: string }) => {
    const passwordBuffer = stringToBuffer(formValues.password)

    try {
      setIsLoading(true)
      await logIn({ password: passwordBuffer })
      await onConfirm()
      collapse()
    } catch (error) {
      setErrors({
        password: typeof error === 'string' ? error : t`Invalid password`
      })
    } finally {
      clearBuffer(passwordBuffer)
      setIsLoading(false)
    }
  }

  const biometricLabel =
    biometricType === BiometricType.Face
      ? t`Try again with Face ID`
      : biometricType === BiometricType.Fingerprint
        ? t`Try again with Fingerprint`
        : null

  return (
    <Layout
      mode="sheet"
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={
        <SheetHeader title={t`Verification Required`} onClose={collapse} />
      }
    >
      {mode === 'pin' ? (
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text color={theme.colors.colorTextSecondary}>
              {t`Use your PIN or biometric ID to authorize this action.`}
            </Text>
          </View>

          <View style={styles.pinSlotsContainer}>
            <PinSlots pin={pin} pinLength={PIN_LENGTH} />
          </View>

          <View style={styles.numpadContainer}>
            <Numpad
              onDigitPress={handlePadPress}
              onBackspacePress={handleBackspace}
              onBiometricPress={
                isBiometricAvailable ? handleBiometricAuth : undefined
              }
              biometricType={isBiometricAvailable ? biometricType : null}
            />
          </View>

          <View style={styles.footerText}>
            <Text>
              {t`Forgot PIN?`}{' '}
              <Link
                onClick={() => setMode('password')}
                data-testid="reauth-master-password-link"
              >
                {t`Proceed with Master Password`}
              </Link>
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text color={theme.colors.colorTextSecondary}>
              {t`Use your Master Password or biometric ID to authorize this action.`}
            </Text>
          </View>

          <View style={styles.passwordContainer}>
            <PasswordField
              label={t`Password`}
              placeholder={t`Enter Master Password`}
              value={passwordRegisterProps.value}
              onChange={passwordRegisterProps.onChange}
              error={passwordRegisterProps.error ?? undefined}
              data-testid="reauth-master-password-input"
              as={BottomSheetTextInput}
            />
          </View>

          <View style={styles.buttonContainer}>
            {isBiometricAvailable && biometricLabel ? (
              <View style={styles.linkContainer}>
                <Link
                  onClick={handleBiometricAuth}
                  data-testid="reauth-biometric-retry"
                >
                  {biometricLabel}
                </Link>
              </View>
            ) : null}

            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmit(handlePasswordSubmit)}
              disabled={!values.password}
              isLoading={isLoading}
              iconAfter={<KeyboardArrowRightFilled />}
              data-testid="reauth-continue-button"
            >
              {t`Continue`}
            </Button>
          </View>
        </View>
      )}
    </Layout>
  )
}
