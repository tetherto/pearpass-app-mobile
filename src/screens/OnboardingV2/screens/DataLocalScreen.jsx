import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button, useTheme, Text, Title } from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightFilled } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Asset } from 'expo-asset'
import { useVideoPlayer as useExpoVideoPlayer, VideoView } from 'expo-video'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'

import { OnboardingLayout } from '../components/OnboardingLayout'
import { RadialGradientBackground } from '../components/RadialGradientBackground'

let TransparentVideoView, useTransparentVideoPlayer
if (Platform.OS === 'android') {
  const transparentVideo = require('expo-transparent-video')
  TransparentVideoView = transparentVideo.TransparentVideoView
  useTransparentVideoPlayer = transparentVideo.useVideoPlayer
}

const iosLoopSource = require('../../../../assets/videos/onboarding_lock_loop_ios.mov')
const iosStartSource = require('../../../../assets/videos/onboarding_lock_start_ios.mov')

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const IOSVideo = () => {
  const player = useExpoVideoPlayer(iosStartSource, (player) => {
    player.loop = false
    player.play()
  })

  useEffect(() => {
    if (!player) return

    let switchingToLoop = false

    const endSub = player.addListener('playToEnd', async () => {
      switchingToLoop = true
      player.loop = true
      await player.replaceAsync(iosLoopSource)
    })

    const statusSub = player.addListener('statusChange', ({ status }) => {
      if (switchingToLoop && status === 'readyToPlay') {
        switchingToLoop = false
        player.play()
      }
    })

    return () => {
      endSub.remove()
      statusSub.remove()
    }
  }, [player])

  return (
    <VideoView
      style={styles.video}
      player={player}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      nativeControls={false}
      testID="onboarding-v2-data-local-media"
    />
  )
}

const AndroidVideoPlayer = ({ startUri, loopUri }) => {
  const [source, setSource] = useState(startUri)
  const player = useTransparentVideoPlayer(source)

  useEffect(() => {
    if (!player) return
    player.loop = false
    player.play()
  }, [player])

  const handleEnd = () => {
    setSource(loopUri)
    player.replace(loopUri)
    player.loop = true
    player.play()
  }

  return (
    <TransparentVideoView
      style={styles.video}
      player={player}
      videoAspectRatio={1}
      onEnd={handleEnd}
      testID="onboarding-v2-data-local-media"
    />
  )
}

// expo-transparent-video only accepts URIs, not require()'d modules. In
// release builds the bundled mp4 lives inside the APK at file:///android_asset/
// which ExoPlayer's FileDataSource can't read, so we extract it via expo-asset
// to a regular file path before handing it to the player.
const AndroidVideo = () => {
  const [uris, setUris] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [start, loop] = await Promise.all([
        Asset.fromModule(
          require('../../../../assets/videos/onboarding_lock_start_android.mp4')
        ).downloadAsync(),
        Asset.fromModule(
          require('../../../../assets/videos/onboarding_lock_loop_android.mp4')
        ).downloadAsync()
      ])
      if (cancelled) return
      setUris({
        start: start.localUri ?? start.uri,
        loop: loop.localUri ?? loop.uri
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!uris) return <View style={styles.video} />
  return <AndroidVideoPlayer startUri={uris.start} loopUri={uris.loop} />
}

const OnboardingVideo = Platform.OS === 'ios' ? IOSVideo : AndroidVideo

export const DataLocalScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const gradientColors = [
    { color: '#3A4A1A', offset: '0%' },
    { color: theme.colors.colorSurfacePrimary, offset: '100%', opacity: 0 }
  ]

  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <RadialGradientBackground
            colors={gradientColors}
            style={styles.mediaContainer}
          >
            <OnboardingVideo />
          </RadialGradientBackground>

          <View style={styles.copyContainer}>
            <View style={styles.titleContainer}>
              <Title data-testid="onboarding-v2-data-local-title">
                {t`Your data stays on your devices`}
              </Title>
            </View>

            <View style={styles.descriptionContainer}>
              <Text
                as="p"
                color={theme.colors.colorTextPrimary}
                style={styles.description}
                data-testid="onboarding-v2-data-local-description"
              >
                {t`Your items are stored locally, not on our servers.\nOnly you have access to them.`}
              </Text>
            </View>
          </View>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 31
  },
  mediaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH / 1.4,
    height: SCREEN_WIDTH / 1.4
  },
  video: {
    width: SCREEN_WIDTH / 1.4,
    height: SCREEN_WIDTH / 1.4,
    aspectRatio: 1
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: '100%'
  },
  copyContainer: {
    alignItems: 'center'
  },
  titleContainer: {
    marginTop: 22,
    marginBottom: 14
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  description: {
    textAlign: 'center'
  }
})
