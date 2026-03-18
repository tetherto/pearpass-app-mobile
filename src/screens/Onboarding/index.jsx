import { useEffect, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Text, View, StyleSheet, Animated, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ButtonSecondary } from '../../libComponents'
import { LogoTextWithLock } from '../../svgs/LogoTextWithLock'

export const Onboarding = () => {
  const navigation = useNavigation()
  const { t } = useLingui()
  const insets = useSafeAreaInsets()
  const buttonFadeAnim = useRef(new Animated.Value(0)).current

  const player = useVideoPlayer(
    require('../../../assets/videos/first_lock.mp4'),
    (player) => {
      player.loop = false
      player.muted = false
      player.volume = 1.0
      player.play()
    }
  )

  useEffect(() => {
    Animated.timing(buttonFadeAnim, {
      toValue: 1,
      duration: 1500,
      delay: 300,
      useNativeDriver: true
    }).start(() => {})
  }, [])

  const handleGetStarted = () => {
    navigation.navigate('Intro')
  }

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
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>{t`Welcome to`}</Text>
        <View style={styles.logoContainer}>
          <LogoTextWithLock />
          <VideoView
            style={styles.logoVideo}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={false}
          />
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Text
          style={styles.descriptionText}
        >{t`Fully local, open-source password manager`}</Text>

        <Animated.View style={{ opacity: buttonFadeAnim }}>
          <ButtonSecondary stretch onPress={handleGetStarted}>
            {t`Continue`}
          </ButtonSecondary>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black.mode1,
    justifyContent: 'space-between'
  },
  topSection: {
    paddingHorizontal: 32,
    alignItems: 'center'
  },
  welcomeText: {
    color: colors.white.mode1,
    fontSize: 36,
    fontFamily:
      Platform.OS === 'android' ? 'humble-nostalgia' : 'Humble Nostalgia',
    textAlign: 'center'
  },
  logoContainer: {
    alignSelf: 'center',
    marginTop: 10
  },
  logoVideo: {
    width: 282,
    height: 282
  },
  bottomSection: {
    paddingHorizontal: 31
  },
  descriptionText: {
    fontFamily:
      Platform.OS === 'android' ? 'humble-nostalgia' : 'Humble Nostalgia',
    fontSize: 48,
    fontWeight: '400',
    color: colors.white.mode1,
    textAlign: 'center',
    marginBottom: 40
  }
})
