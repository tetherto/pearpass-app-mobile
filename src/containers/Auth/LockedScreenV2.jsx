import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useCountDown } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  rawTokens,
  Text,
  PageHeader,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { WatchLater } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useUserData } from '@tetherto/pearpass-lib-vault'
import { AppState, ScrollView, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { NAVIGATION_ROUTES } from '../../constants/navigation'
import { useKeyboardVisibility } from '../../hooks/useKeyboardVisibility'
import { OnboardingLayout } from '../../screens/OnboardingV2/components/OnboardingLayout'

export const LockedScreenV2 = () => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboardVisibility()
  const navigation = useNavigation()
  const { t } = useLingui()
  const { theme } = useTheme()
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
        text1: t`Now you can enter your master password once again!`,
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
    <OnboardingLayout
      topGradient
      avoidBottomInset={isKeyboardVisible}
      showLogo={!isKeyboardVisible}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          {
            paddingBottom:
              keyboardHeight > 0
                ? keyboardHeight + rawTokens.spacing20
                : rawTokens.spacing40
          }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
      >
        <View style={styles.topSection}>
          <PageHeader title={t`PearPass locked`} style={styles.header} />

          <View style={styles.descriptionBlock}>
            <Text
              variant="body"
              color={theme.colors.colorTextSecondary}
              style={styles.descriptionLine}
            >
              {t`Too many failed attempts.`}
            </Text>
            <Text
              variant="body"
              color={theme.colors.colorTextSecondary}
              style={styles.descriptionLine}
            >
              {t`For your security, access is temporarily locked.`}
            </Text>
          </View>

          <View
            style={[
              styles.timerStrip,
              { borderColor: theme.colors.colorBorderPrimary }
            ]}
          >
            <View style={styles.timerLeft}>
              <WatchLater
                width={20}
                height={20}
                style={{ color: theme.colors.colorTextSecondary }}
              />
              <Text variant="body" color={theme.colors.colorTextSecondary}>
                {t`Try again in`}
              </Text>
            </View>
            <Text
              variant="body"
              style={[styles.timerDigits, { color: theme.colors.colorPrimary }]}
            >
              {timeRemaining}
            </Text>
          </View>
        </View>
      </ScrollView>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  header: {
    textAlign: 'center',
    marginBottom: rawTokens.spacing6
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: rawTokens.spacing16
  },
  topSection: {
    paddingTop: rawTokens.spacing60,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  descriptionBlock: {
    width: '100%',
    gap: rawTokens.spacing4,
    alignItems: 'center'
  },
  descriptionLine: {
    textAlign: 'center',
    width: '100%'
  },
  timerStrip: {
    marginTop: rawTokens.spacing24,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: rawTokens.spacing10,
    borderWidth: 1,
    paddingVertical: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing10,
    backgroundColor: 'transparent'
  },
  timerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8,
    flexShrink: 1
  },
  timerDigits: {
    fontSize: rawTokens.fontSize14,
    fontFamily: rawTokens.fontPrimary,
    fontWeight: rawTokens.weightMedium,
    fontVariant: ['tabular-nums']
  }
})
