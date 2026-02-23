import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useCountDown } from 'pear-apps-lib-ui-react-hooks'
import { LockIcon, TimeIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useUserData } from 'pearpass-lib-vault'
import { AppState, ScrollView, StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { NAVIGATION_ROUTES } from '../../constants/navigation'
import { useKeyboardVisibility } from '../../hooks/useKeyboardVisibility'
import { LogoTextWithLock } from '../../svgs/LogoTextWithLock'

export const LockedScreen = () => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboardVisibility()
  const navigation = useNavigation()
  const { t } = useLingui()
  const { masterPasswordStatus, refreshMasterPasswordStatus } = useUserData()

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        refreshMasterPasswordStatus()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [refreshMasterPasswordStatus])

  const onFinish = async () => {
    const status = await refreshMasterPasswordStatus()

    if (!status?.isLocked) {
      navigation.replace('Welcome', {
        state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD
      })

      Toast.show({
        type: 'baseToast',
        text1: t`Now you can enter you master password once again!`,
        position: 'bottom',
        bottomOffset: 100
      })
    }
  }

  const timeRemaining = useCountDown({
    initialSeconds: Math.ceil(masterPasswordStatus.lockoutRemainingMs / 1000),
    onFinish
  })

  return (
    <View style={styles.container}>
      {!isKeyboardVisible && (
        <View style={styles.logoContainer}>
          <LogoTextWithLock width={170} height={50} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 40 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.viewContainer}>
          <View style={styles.card}>
            <LockIcon
              width={80}
              height={80}
              color={colors.primary400.mode1}
              fill={colors.primary400.mode1}
            />

            <Text style={styles.title}>{t`PearPass locked`}</Text>

            <View>
              <Text style={styles.descriptionText}>
                {t`Too many failed attempts.`}
              </Text>
              <Text style={styles.descriptionText}>
                {t`For your security, access is temporarily locked.`}
              </Text>
            </View>
          </View>

          <View style={styles.timerCard}>
            <View style={styles.timerHeader}>
              <TimeIcon size={20} color={colors.white.mode1} />
              <Text style={styles.timerLabel}>{t`Try again`}</Text>
            </View>
            <Text style={styles.timerText}>{timeRemaining}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 140
  },
  viewContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center'
  },
  card: {
    gap: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white.mode1,
    textAlign: 'center'
  },
  descriptionContainer: {
    alignItems: 'center',
    gap: 0
  },
  descriptionText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#F6F6F6',
    textAlign: 'center',
    lineHeight: 20
  },
  timerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 50
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  timerLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: colors.white.mode1
  },
  timerText: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary400.mode1,
    textAlign: 'justify'
  }
})
