import { useEffect, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button } from '@tetherto/pearpass-lib-ui-kit'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  AppState,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Rive from 'rive-react-native'

import { OpenInNew } from '@tetherto/pearpass-lib-ui-kit/icons'
import {
  isAutofillEnabled,
  openAutofillSettings,
  requestToEnableAutofill
} from '../../../utils/AutofillModule'
import { logger } from '../../../utils/logger'
import { OnboardingLayout } from '../components/OnboardingLayout'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export const AutofillScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const route = useRoute()
  const password = route.params?.password

  const waitingForSettings = useRef(false)

  useEffect(() => {
    isAutofillEnabled().then((enabled) => {
      if (enabled) goToNext()
    })
  }, [])

  const goToNext = () => {
    navigation.navigate('OnboardingV2Biometrics', { password })
  }

  // Navigate to next screen when user returns from system settings
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (waitingForSettings.current && nextAppState === 'active') {
        waitingForSettings.current = false
        goToNext()
      }
    })

    return () => subscription.remove()
  }, [])

  const handleEnableAutofill = () => {
    console.log('[AutofillScreen] handleEnableAutofill called')
    console.log(
      '[AutofillScreen] Platform:',
      Platform.OS,
      'Version:',
      Platform.Version
    )
    waitingForSettings.current = true

    const useSystemPrompt =
      Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 18
    const openSettings = useSystemPrompt
      ? requestToEnableAutofill
      : openAutofillSettings

    console.log(
      '[AutofillScreen] Using:',
      useSystemPrompt ? 'requestToEnableAutofill' : 'openAutofillSettings'
    )

    openSettings()
      .then((result) => {
        console.log('[AutofillScreen] Settings result:', result)
        // If the system prompt resolved without leaving the app
        // (iOS 18+ in-app prompt, or already enabled), navigate directly
        if (!waitingForSettings.current) return
        if (AppState.currentState === 'active') {
          waitingForSettings.current = false
          goToNext()
        }
      })
      .catch((error) => {
        console.log('[AutofillScreen] Settings error:', error)
        logger.error('Failed to enable autofill:', error)
        waitingForSettings.current = false
      })
  }

  return (
    <OnboardingLayout
      showLogo={false}
      rightAction={{ label: t`Not now`, onPress: goToNext }}
      topGradient
    >
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.riveContainer}>
            <Rive
              resourceName="autofill"
              autoplay
              style={styles.riveAnimation}
              testID="onboarding-v2-autofill-media"
            />
          </View>

          <Text style={styles.title} testID="onboarding-v2-autofill-title">
            {t`Faster, safer sign-ins`}
          </Text>

          <Text
            style={styles.description}
            testID="onboarding-v2-autofill-description"
          >
            {t`Allow autofill to sign in instantly on apps and websites. PearPass fills your credentials securely, so you don't need to remember, copy, or retype passwords.`}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            fullWidth
            onClick={handleEnableAutofill}
            iconBefore={<OpenInNew width={16} height={16} />}
            data-testid="onboarding-v2-autofill-enable"
          >
            {t`Turn on Autofill`}
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
    marginBottom: 14
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
