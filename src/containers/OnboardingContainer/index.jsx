import { useEffect, useRef, useState } from 'react'

import { Trans, useLingui } from '@lingui/react/macro'
import {
  FaceIdIcon,
  TimeIcon,
  XIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Rive from 'rive-react-native'

import { LogoTextWithLock } from '../../svgs/LogoTextWithLock'
import { InitialVideo } from '../InitialVideo'

const { height: screenHeight } = Dimensions.get('window')
const isSmallDevice = screenHeight < 700

const SCREENS = [0, 1, 2, 3, 4, 5]

/**
 *
 * @param {Object} props - Component props.
 * @param {number} props.currentStep - The current onboarding step index.
 * @param {string} props.mainDescription - Main description text for the current step.
 * @param {function} props.onContinue - Callback invoked when the "Continue" button is pressed.
 * @param {function} props.onSkip - Callback invoked when the "Skip" button is pressed.
 * @param {function} props.onStepSelect - Callback invoked when a pagination dot is selected.
 * @param {function} props.onTimerExpired - Callback invoked when the timer expires on the final step.
 *
 */
export const OnboardingContainer = ({
  currentStep,
  mainDescription,
  onContinue,
  onSkip,
  onStepSelect,
  onTimerExpired
}) => {
  const { t } = useLingui()
  const insets = useSafeAreaInsets()
  const [timeLeft, setTimeLeft] = useState(90)
  const intervalRef = useRef(null)

  const floatAnim = useRef(new Animated.Value(0)).current
  const buttonFadeAnim = useRef(new Animated.Value(0)).current

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (currentStep === 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
            easing: (t) => t * (2 - t)
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
            easing: (t) => t * (2 - t)
          })
        ])
      ).start()

      return () => {
        floatAnim.setValue(0)
      }
    }
  }, [currentStep, floatAnim])

  useEffect(() => {
    if (currentStep === 5) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current)

            if (onTimerExpired) {
              setTimeout(() => {
                onTimerExpired()
              }, 0)
            }
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      setTimeLeft(90)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentStep, onTimerExpired])

  const renderCenterContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View
            testID="onboarding-media-step-0"
            accessibilityLabel="onboarding-media-step-0"
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
        )
      case 1:
        return (
          <View
            testID="onboarding-media-step-1"
            accessibilityLabel="onboarding-media-step-1"
          >
          <Animated.Image
            source={require('../../../assets/images/intro/closeLock.png')}
            style={[
              styles.centerImage,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20]
                    })
                  }
                ]
              }
            ]}
            resizeMode="contain"
          />
        </View>
        )
      case 2:
        return (
          <View
            testID="onboarding-media-step-2"
            accessibilityLabel="onboarding-media-step-2"
          >
            <Rive resourceName="password" style={styles.riveAnimation} />
          </View>
        )

      case 3:
        return (
          <View
            testID="onboarding-media-step-3"
            accessibilityLabel="onboarding-media-step-3"
          >
            <Rive resourceName="category" style={styles.riveAnimation} />
          </View>
  )

      case 4:
        return (
          <View
            testID="onboarding-media-step-4"
            accessibilityLabel="onboarding-media-step-4"
          >
            <Rive resourceName="form" style={styles.riveAnimationForm} />
          </View>
  )
      case 5:
        return (
          <View 
            testID="onboarding-media-step-5"
            accessibilityLabel="onboarding-media-step-5"
            style={styles.finalStepContainer}>
              <View style={styles.iconContainer}>
                <View style={styles.qrheaderContainer}>
                  <View style={styles.faceIdContainer}>
                    <FaceIdIcon size="21" />
                    <Text style={styles.faceIdText}>{t`Add a device`}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton}>
                  <XIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.qrCodeImageCotainer}>
                <Text style={styles.faceIdText}>{t`Scan this QR code`} </Text>
                <View style={styles.qrCodeImageWrapper}>
                  <Image
                    source={require('../../../assets/images/intro/qr.png')}
                    style={styles.finalIcon}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{t`Add a device`}</Text>
                <Text style={[styles.timerText, styles.timerTextPrimary]}>
                  {formatTime(timeLeft)}
                </Text>
                <TimeIcon
                  color={colors.primary400.option1}
                  width={18}
                  height={18}
                />
              </View>
            </View>
          </View>
        )
      default:
        return null
    }
  }

  const getSubDescriptionContent = () => {
    switch (currentStep) {
      case 0:
        return null
      case 1:
        return (
          <Trans>
            PearPass is the first truly local,{' '}
            <Text style={styles.boldText}>peer-to-peer password manager.</Text>{' '}
            Your data{' '}
            <Text style={styles.boldText}>never touches a server</Text> it lives
            with you, syncs between your devices, and{' '}
            <Text style={styles.boldText}>stays entirely in your control.</Text>
          </Trans>
        )
      case 2:
        return (
          <Trans>
            No one can unlock your data,{' '}
            <Text style={styles.boldText}>not even us.</Text> Your data stays{' '}
            <Text style={styles.boldText}>fully encrypted and local</Text> to
            your device.{' '}
            <Text style={styles.boldText}>Keep your master password safe,</Text>{' '}
            because if you lose it, it's gone forever.
          </Trans>
        )
      case 3:
        return (
          <Trans>
            <Text style={styles.boldText}>Your digital life. </Text>from
            passwords to payment cards, IDs and private notes{' '}
            <Text style={styles.boldText}>
              Grouped how you like. Accessible only to you.
            </Text>
          </Trans>
        )
      case 4:
        return (
          <Trans>
            <Text style={styles.boldText}>Store everything</Text> from passwords
            to payment cards, IDs and private notes
          </Trans>
        )
      case 5:
        return (
          <Trans>
            <Text style={styles.boldText}>No servers. No middlemen</Text>{' '}
            Pearpass syncs directly across your devices using{' '}
            <Text style={styles.boldText}>peer-to-peer technology,</Text>{' '}
            powered by Pear Runtime.
          </Trans>
        )
      default:
        return null
    }
  }

  const renderButtons = () => (
    <Animated.View
      style={[
        styles.buttonContainer,
        currentStep === 0 && {
          opacity: buttonFadeAnim
        }
      ]}
    >
      <View 
      testID="onboarding-progress-bar"
      accessibilityLabel="onboarding-progress-bar"
      style={styles.paginationContainer}>
        {SCREENS.map((step) => (
          <TouchableOpacity
            key={step}
            testID={`onboarding_progress_step_${step}`}
            accessibilityLabel={`onboarding_progress_step_${step}`}
            style={[
              styles.paginationDot,
              currentStep === step && styles.paginationDotActive
            ]}
            onPress={() => onStepSelect && onStepSelect(step)}
          />
        ))}
      </View>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
        testID="onboarding-continue-button"
        accessibilityLabel="onboarding-continue-button"
        onPress={onContinue} style={styles.continueButton}>
          <Text testID="onboarding-continue-text" style={styles.continueButtonText}>{t`Continue`}</Text>
        </TouchableOpacity>
        {currentStep !== SCREENS[SCREENS.length - 1] && (
          <TouchableOpacity 
          testID="onboarding-skip-button"
          accessibilityLabel="onboarding-skip-button"
          onPress={onSkip} style={styles.skipButton}>
            <Text testID="onboarding-skip-text" style={styles.skipButtonText}>{t`Skip`}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  )

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20
        }
      ]}
    >
      {currentStep !== 0 && (
        <Image
          source={require('../../../assets/images/intro/greenBlur.png')}
          style={styles.blurBackground}
          resizeMode="stretch"
        />
      )}

      <View style={styles.contentWrapper}>
        <View style={styles.topSection}>
          <View
          testID="onboarding-logo"
          accessibilityLabel="onboarding-logo" 
          style={styles.logoContainer}>
            <LogoTextWithLock width={170} height={50} />
          </View>
        </View>

        <View
        testID="onboarding-center-section"
        accessibilityLabel="onboarding-center-section"
        style={styles.centerSection}>{renderCenterContent()}</View>

        <View 
        testID="onboarding-bottom-section"
        accessibilityLabel="onboarding-bottom-section"
        style={styles.bottomSection}>
          <Text 
          testID="onboarding-main-description"
          accessibilityLabel="onboarding-main-description"
          style={styles.descriptionText}>{mainDescription}</Text>

          {getSubDescriptionContent() && (
            <View 
            testID="onboarding-sub-description"
            accessibilityLabel="onboarding-sub-description"   
            style={styles.subDescriptionWrapper}>
              <Text style={styles.subDescriptionText}>
                {getSubDescriptionContent()}
              </Text>
            </View>
          )}

          {renderButtons()}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black.mode1
  },
  bellBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1
  },
  blurBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 2
  },
  contentWrapper: {
    flex: 1,
    zIndex: 3
  },
  topSection: {
    paddingHorizontal: 32,
    alignItems: 'center'
  },
  welcomeText: {
    color: colors.white.mode1,
    fontSize: 26,
    fontFamily:
      Platform.OS === 'android' ? 'humble-nostalgia' : 'Humble Nostalgia',
    textAlign: 'center'
  },
  logoContainer: {
    alignSelf: 'center',
    marginTop: 10
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },
  centerImage: {
    width: '80%',
    maxWidth: 282,
    aspectRatio: 1,
    resizeMode: 'contain'
  },
  twoImagesContainerVertical: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  verticalImage: {
    width: 362,
    height: 55,
    resizeMode: 'contain'
  },
  finalStepContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    width: '85%',
    maxWidth: 290,
    height: 260,
    borderRadius: 6,
    backgroundColor: 'rgba(77, 77, 77, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(246, 246, 246, 1)',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.25)',
    shadowOffset: {
      width: 0,
      height: 0.3
    },
    shadowRadius: 4.79,
    shadowOpacity: 1,
    padding: 15,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
  },
  finalIcon: {
    width: 135,
    height: 135
  },
  finalStepTitle: {
    fontFamily:
      Platform.OS === 'android' ? 'humble-nostalgia' : 'Humble Nostalgia',
    fontSize: 32,
    fontWeight: '600',
    color: colors.white.mode1,
    marginBottom: 12
  },
  bottomSection: {
    paddingHorizontal: 31
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15
  },
  paginationDot: {
    width: 40,
    height: 5,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.grey100.option1
  },
  paginationDotActive: {
    backgroundColor: colors.primary400.option1
  },
  descriptionText: {
    fontFamily:
      Platform.OS === 'android' ? 'humble-nostalgia' : 'Humble Nostalgia',
    fontSize: isSmallDevice ? 32 : 40,
    fontWeight: '400',
    color: colors.white.mode1,
    textAlign: 'center',
    marginBottom: isSmallDevice ? 20 : 30
  },
  subDescriptionWrapper: {
    marginBottom: isSmallDevice ? 30 : 40
  },
  subDescriptionText: {
    fontFamily: 'Inter',
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: isSmallDevice ? 22 : 24
  },
  boldText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    color: colors.white.mode1
  },
  qrheaderContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  faceIdContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  faceIdText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(246, 246, 246, 1)',
    marginLeft: 5
  },
  closeButton: {
    backgroundColor: colors.black.mode1,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  qrCodeImageCotainer: {
    alignItems: 'center',
    gap: 5
  },
  qrCodeImageWrapper: {
    backgroundColor: colors.white.mode1,
    padding: 10,
    borderRadius: 6
  },
  timerContainer: {
    backgroundColor: colors.grey400.mode1,
    borderRadius: 6,
    flexDirection: 'row',
    padding: 6,
    gap: 5,
    alignItems: 'center'
  },
  timerText: {
    fontFamily: 'Inter',
    color: colors.white.mode1,
    fontSize: 10,
    fontWeight: '500'
  },
  timerTextPrimary: {
    color: colors.primary400.option1
  },
  buttonContainer: {
    gap: 16
  },
  actionButtonsContainer: {
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  continueButton: {
    width: '45%',
    backgroundColor: colors.primary400.option1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 39,
    borderRadius: 20
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black'
  },
  skipButton: {
    width: '45%',
    borderColor: colors.primary400.option1,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 39,
    borderRadius: 20,
    backgroundColor: colors.grey500.option1
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white'
  },
  riveAnimation: {
    width: '100%'
  },
  riveAnimationForm: { width: '80%' }
})
