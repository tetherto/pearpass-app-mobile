import { useState, useCallback, useEffect, useRef, createRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  InputField,
  Text,
  Title,
  useTheme,
  Link
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Backspace,
  FaceId,
  Fingerprint
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useVaults } from '@tetherto/pearpass-lib-vault'
import * as SecureStore from 'expo-secure-store'
import { Pressable, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useAutoSelectVault } from './hooks/useAutoSelectVault'
import { IOS_APP_GROUP_ID } from '../../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../../constants/secureStorageKeys'
import { useBiometricsAuthentication } from '../../hooks/useBiometricsAuthentication'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'
import {
  isFacialRecognitionSupported,
  isFingerprintSupported as getIsFingerprintSupported
} from '../../utils/biometricLogin'
import { logger } from '../../utils/logger'
import { OnboardingLayout } from '../OnboardingV2/components/OnboardingLayout'

const PIN_LENGTH = 6

export const PinScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { hapticSuccess, hapticError, hapticButtonSecondary } =
    useHapticFeedback()

  const { initVaults } = useVaults()
  const { autoSelectVault } = useAutoSelectVault()

  const [pin, setPin] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const inputRefs = useRef(
    Array.from({ length: PIN_LENGTH }, () => createRef())
  ).current

  const { isBiometricsEnabled, isBiometricsSupported, biometricTypes } =
    useBiometricsAuthentication()

  const isBiometricAvailable =
    isBiometricsEnabled && isBiometricsSupported && biometricTypes?.length > 0

  const isFaceID =
    isBiometricAvailable && isFacialRecognitionSupported(biometricTypes)
  const isFingerprint =
    isBiometricAvailable && getIsFingerprintSupported(biometricTypes)

  const handleBiometricAuth = useCallback(async () => {
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

      if (!parsedEncryptionData) {
        Toast.show({
          type: 'baseToast',
          text1: t`ERROR: No encryption data found`,
          position: 'bottom',
          bottomOffset: 100
        })
        setIsAuthenticating(false)
        return
      }

      const { ciphertext, nonce, hashedPassword } = parsedEncryptionData
      await initVaults({ ciphertext, nonce, hashedPassword })

      hapticSuccess()
      await autoSelectVault()
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
  }, [isAuthenticating, hapticSuccess, hapticError, navigation, t])

  // Auto-trigger biometric auth on mount
  useEffect(() => {
    if (isBiometricAvailable) {
      const timer = setTimeout(() => {
        handleBiometricAuth()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isBiometricAvailable])

  useEffect(() => {
    inputRefs.forEach((ref) => {
      ref.current?.setNativeProps?.({
        showSoftInputOnFocus: false,
        style: { textAlign: 'center', marginTop: -8, marginBottom: 8 }
      })
    })
  }, [])

  useEffect(() => {
    const activeIndex = pin.length < PIN_LENGTH ? pin.length : PIN_LENGTH - 1
    inputRefs[activeIndex]?.current?.focus()
  }, [pin])

  const handlePadPress = useCallback(
    (digit) => {
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

  const handleMasterPassword = useCallback(() => {
    navigation.navigate('AuthV2MasterPassword')
  }, [navigation])

  const renderPinSlots = () => (
    <View style={styles.pinSlotsContainer}>
      {Array.from({ length: PIN_LENGTH }).map((_, index) => {
        const isFilled = index < pin.length

        return (
          <View key={index} style={styles.pinSlotWrapper}>
            <InputField
              label=""
              value={isFilled ? '\u2022' : ''}
              placeholder="0"
              inputRef={inputRefs[index]}
              testID={`pin-slot-${index}`}
            />
          </View>
        )
      })}
    </View>
  )

  const renderNumpad = () => {
    const rows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      ['biometric', 0, 'backspace']
    ]

    return (
      <View style={styles.numpadContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numpadRow}>
            {row.map((item) => {
              if (item === 'biometric') {
                if (!isBiometricAvailable) {
                  return <View key="biometric" style={styles.numpadButton} />
                }
                return (
                  <Pressable
                    key="biometric"
                    style={styles.numpadButton}
                    onPress={handleBiometricAuth}
                    testID="pin-biometric-button"
                  >
                    {isFaceID && !isFingerprint ? (
                      <FaceId color={colors.white.mode1} />
                    ) : (
                      <Fingerprint color={colors.white.mode1} />
                    )}
                  </Pressable>
                )
              }

              if (item === 'backspace') {
                return (
                  <Pressable
                    key="backspace"
                    style={styles.numpadButton}
                    onPress={handleBackspace}
                    testID="pin-backspace-button"
                  >
                    <Backspace color={colors.white.mode1} />
                  </Pressable>
                )
              }

              return (
                <Pressable
                  key={item}
                  style={({ pressed }) => [
                    styles.numpadButton,
                    pressed && styles.numpadButtonPressed
                  ]}
                  onPress={() => handlePadPress(String(item))}
                  testID={`pin-pad-${item}`}
                >
                  <Title>{item}</Title>
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>
    )
  }

  return (
    <OnboardingLayout topGradient>
      <View style={styles.content}>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <Title>{t`Enter Your PIN`}</Title>
            <Text color={theme.colors.colorTextSecondary}>
              {t`Please enter your 6-digit PIN to continue`}
            </Text>
          </View>

          {renderPinSlots()}
        </View>

        <View style={styles.footer}>
          {renderNumpad()}

          <Text style={styles.masterPasswordText}>
            {t`Forgot PIN?`}{' '}
            <Link
              data-testid="pin-master-password-link"
              onClick={handleMasterPassword}
              style={styles.masterPasswordHighlight}
            >
              {t`Proceed with Master Password`}
            </Link>
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between'
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 48
  },
  titleContainer: {
    alignItems: 'center',
    gap: 12
  },
  pinSlotsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  pinSlotWrapper: {
    flex: 1
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 48
  },
  numpadContainer: {
    gap: 10
  },
  numpadRow: {
    flexDirection: 'row',
    gap: 10
  },
  numpadButton: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden'
  },
  numpadButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  masterPasswordLink: {
    alignItems: 'center'
  },
  masterPasswordText: {
    textAlign: 'center'
  },
  masterPasswordHighlight: {
    color: colors.primary400.mode1,
    textDecorationLine: 'underline'
  }
})
