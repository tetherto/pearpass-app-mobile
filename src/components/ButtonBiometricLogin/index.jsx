import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import Toast from 'react-native-toast-message'

import { IOS_APP_GROUP_ID } from '../../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../../constants/secureStorageKeys'
import { useBiometricsAuthentication } from '../../hooks/useBiometricsAuthentication'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'
import {
  isFacialRecognitionSupported,
  isFingerprintSupported as getIsFingerprintSupported
} from '../../utils/biometricLogin'
import { logger } from '../../utils/logger'
import { BiometricWithIconAndText } from '../BiometricWithIconAndText'
const { FACIAL_RECOGNITION, FINGERPRINT } =
  LocalAuthentication.AuthenticationType
/**
 *
 * @param {{
 *   onBiometricLogin (encryptionData?: {ciphertext: string, nonce: string, hashedPassword: string}) => Promise<void>
 *   biometricType: 'facialRecognition' | 'fingerprint'
 * }} param0
 * @returns
 */
export const ButtonBiometricLogin = ({ onBiometricLogin }) => {
  const { t } = useLingui()

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { isBiometricsEnabled, isBiometricsSupported, biometricTypes } =
    useBiometricsAuthentication()
  const { hapticSuccess, hapticError } = useHapticFeedback()

  const handlePressBiometric = async () => {
    if (isAuthenticating) return
    setIsAuthenticating(true)

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

      hapticSuccess()
      await onBiometricLogin(parsedEncryptionData)
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
      setIsAuthenticating(false)
    }
  }

  if (
    !biometricTypes?.length ||
    !isBiometricsSupported ||
    !isBiometricsEnabled
  ) {
    return null
  }

  const getBiometricButton = () => {
    const isFaceIDSupported = isFacialRecognitionSupported(biometricTypes)
    const isFingerprintSupported = getIsFingerprintSupported(biometricTypes)

    if (isFaceIDSupported && isFingerprintSupported) {
      const bothBiometrics = `${FINGERPRINT}-${FACIAL_RECOGNITION}`
      return (
        <BiometricWithIconAndText
          key={bothBiometrics}
          biometricType={bothBiometrics}
          onPress={handlePressBiometric}
        />
      )
    } else if (isFaceIDSupported) {
      return (
        <BiometricWithIconAndText
          key={FACIAL_RECOGNITION}
          biometricType={FACIAL_RECOGNITION}
          onPress={handlePressBiometric}
        />
      )
    } else if (isFingerprintSupported) {
      return (
        <BiometricWithIconAndText
          key={FINGERPRINT}
          biometricType={FINGERPRINT}
          onPress={handlePressBiometric}
        />
      )
    }
    return null
  }

  return getBiometricButton()
}
