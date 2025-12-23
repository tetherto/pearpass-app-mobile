import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { APP_STORE_URL, PLAY_STORE_URL } from 'pearpass-lib-constants'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { View, Text, StyleSheet, Platform, Linking } from 'react-native'

import { VERSION_CHECK_CONFIG } from '../../../constants/versionCheck'
import { ButtonPrimary } from '../../../libComponents'

export const UpdateModalContent = ({}) => {
  const { t } = useLingui()
  const [timeLeft, setTimeLeft] = useState(
    VERSION_CHECK_CONFIG.REDIRECT_TIMER_SECONDS
  )

  const handleNavigation = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(APP_STORE_URL)
    } else {
      Linking.openURL(PLAY_STORE_URL)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleNavigation()
          setTimeLeft(VERSION_CHECK_CONFIG.REDIRECT_TIMER_SECONDS)
          return VERSION_CHECK_CONFIG.REDIRECT_TIMER_SECONDS
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t`Update required`}</Text>
      <Text style={[styles.text, styles.description]}>
        {t`Find out what exciting features and updates await you in this version.`}
      </Text>
      <View style={styles.timerContainer}>
        <Text style={[styles.text, styles.timerDescription]}>
          {t`App will restart in:`}
        </Text>
        <Text style={[styles.text, styles.timerText]}>
          {formatTime(timeLeft)}
        </Text>
      </View>
      <ButtonPrimary stretch onPress={handleNavigation}>
        {t`Update App`}
      </ButtonPrimary>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey400.mode1,
    padding: 20,
    borderRadius: 10,
    gap: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grey300.mode1
  },
  text: {
    color: colors.white.mode1,
    fontSize: 16,
    alignSelf: 'flex-start'
  },
  description: {
    color: colors.grey100.mode1
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timerDescription: {
    fontSize: 14
  },
  timerText: {
    color: colors.primary400.dark,
    fontWeight: 'bold'
  }
})
