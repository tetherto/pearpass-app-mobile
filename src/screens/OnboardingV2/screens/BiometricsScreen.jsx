import { useEffect, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button } from '@tetherto/pearpass-lib-ui-kit'
import { FaceId, Fingerprint } from '@tetherto/pearpass-lib-ui-kit/icons'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { closeAllInstances, useUserData, useVaults } from 'pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from 'pearpass-lib-vault/src/utils/buffer'
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import Rive from 'rive-react-native'

import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { TOAST_CONFIG } from '../../../constants/toast'
import { useBiometricsAuthentication } from '../../../hooks/useBiometricsAuthentication'
import { logger } from '../../../utils/logger'
import { OnboardingLayout } from '../components/OnboardingLayout'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const isIOS = Platform.OS === 'ios'

export const BiometricsScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const route = useRoute()
  const { enableBiometrics, isBiometricsSupported, isBiometricsEnabled } =
    useBiometricsAuthentication()
  const { logIn } = useUserData()
  const { initVaults, resetState } = useVaults()
  const password = route.params?.password

  const biometricsChecked = useRef(false)

  // Skip this screen if biometrics is not supported or already enabled
  useEffect(() => {
    if (biometricsChecked.current) return
    const timer = setTimeout(() => {
      biometricsChecked.current = true
      if (!isBiometricsSupported || isBiometricsEnabled) {
        finishOnboarding()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isBiometricsSupported, isBiometricsEnabled])

  const title = isIOS
    ? t`Unlock faster with Face ID`
    : t`Unlock faster with biometrics`
  const buttonLabel = isIOS ? t`Enable Face ID` : t`Enable biometrics`

  const finishOnboarding = () => {
    navigation.replace('Welcome', {
      state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD
    })
  }

  const handleEnableBiometrics = async () => {
    console.log('[BiometricsScreen] password:', password ? 'present' : 'null')
    if (!password) {
      console.log('[BiometricsScreen] No password, finishing')
      finishOnboarding()
      return
    }

    const passwordBuffer = stringToBuffer(password)

    try {
      console.log('[BiometricsScreen] Logging in...')
      await logIn({ password: passwordBuffer })
      console.log('[BiometricsScreen] Initializing vaults...')
      await initVaults({ password: passwordBuffer })
      console.log('[BiometricsScreen] Enabling biometrics...')
      const result = await enableBiometrics()
      console.log('[BiometricsScreen] enableBiometrics result:', result)
      await closeAllInstances()
      resetState()

      if (result?.error) {
        logger.error('Failed to enable biometric authentication:', result.error)
        Toast.show({
          type: 'baseToast',
          text1: t`Failed to enable biometric authentication.`,
          position: 'bottom',
          bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
        })
      }

      finishOnboarding()
    } catch (error) {
      console.log('[BiometricsScreen] Error:', error)
      logger.error('Error while enabling biometric authentication:', error)
      finishOnboarding()
    } finally {
      clearBuffer(passwordBuffer)
    }
  }

  return (
    <OnboardingLayout
      showLogo={false}
      rightAction={{ label: t`Not now`, onPress: finishOnboarding }}
      topGradient
    >
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.riveContainer}>
            <Rive
              resourceName={isIOS ? 'face_id' : 'fingerprint'}
              autoplay
              style={styles.riveAnimation}
              testID="onboarding-v2-biometrics-media"
            />
          </View>

          <Text style={styles.title} testID="onboarding-v2-biometrics-title">
            {title}
          </Text>

          <Text
            style={styles.description}
            testID="onboarding-v2-biometrics-description"
          >
            {t`Use your fingerprint or face to securely unlock PearPass and confirm actions. It’s faster than entering your Master Password and works only with your approval.`}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            fullWidth
            onClick={handleEnableBiometrics}
            iconBefore={
              isIOS ? (
                <FaceId width={16} height={16} />
              ) : (
                <Fingerprint width={16} height={16} />
              )
            }
            data-testid="onboarding-v2-biometrics-enable"
          >
            {buttonLabel}
          </Button>
        </View>
      </View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 31
  },
  riveContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    overflow: 'hidden',
    marginTop: 108
  },
  riveAnimation: {
    width: '100%',
    height: '100%'
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: '100%'
  },
  title: {
    fontFamily:
      Platform.OS === 'android' ? 'humble-nostalgia' : 'Humble Nostalgia',
    fontSize: 28,
    fontWeight: '400',
    color: colors.white.mode1,
    textAlign: 'center',
    marginBottom: 14,
    marginTop: 16
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 30
  }
})
