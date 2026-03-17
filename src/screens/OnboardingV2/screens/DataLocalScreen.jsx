import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button } from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightFilled } from '@tetherto/pearpass-lib-ui-kit/icons'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'

// TODO: restore InitialVideo when the new video asset is available
// import { InitialVideo } from '../../../containers/InitialVideo'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { RadialGradientBackground } from '../components/RadialGradientBackground'

const GRADIENT_COLORS = [
  { color: '#3A4A1A', offset: '0%' },
  { color: '#15180E', offset: '100%', opacity: 0 }
]

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export const DataLocalScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()

  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <RadialGradientBackground
            colors={GRADIENT_COLORS}
            style={styles.mediaContainer}
          >
            <Image
              source={require('../../../../assets/images/lock.png')}
              style={styles.lockImage}
              resizeMode="contain"
              testID="onboarding-v2-data-local-media"
            />
          </RadialGradientBackground>

          {/* TODO: restore video when the new asset is available
          <View
            style={styles.mediaContainer}
            testID="onboarding-v2-data-local-media"
          >
            <InitialVideo
              onStart={() => buttonFadeAnim.setValue(0)}
              onEnded={() => {
                Animated.timing(buttonFadeAnim, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true
                }).start()
              }}
            />
          </View>
          */}

          <Text style={styles.title} testID="onboarding-v2-data-local-title">
            {t`Your data stays on your devices`}
          </Text>

          <Text
            style={styles.description}
            testID="onboarding-v2-data-local-description"
          >
            {t`Your items are stored locally, not on our servers.\nOnly you have access to them.`}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigation.replace('OnboardingV2Sync')}
            iconAfter={<KeyboardArrowRightFilled />}
            data-testid="onboarding-v2-data-local-continue"
          >
            {t`Continue`}
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
    paddingHorizontal: 31,
    paddingTop: 64
  },
  mediaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH / 1.4,
    height: SCREEN_WIDTH / 1.4,
    marginTop: 64
  },
  lockImage: {
    width: SCREEN_WIDTH / 1.4,
    height: SCREEN_WIDTH / 1.4
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
    marginTop: 22,
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
