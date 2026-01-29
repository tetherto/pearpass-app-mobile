import { useEffect, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  AppState,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ButtonCreate, ButtonLittle } from '../../../libComponents'
import {
  isAutofillEnabled,
  openAutofillSettings,
  requestToEnableAutofill
} from '../../../utils/AutofillModule'

const IOS_VERSION_WITH_AUTOFILL_ENABLE = 18

const getIosMajorVersion = () => {
  if (Platform.OS !== 'ios') return 0
  return typeof Platform.Version === 'string'
    ? Number(String(Platform.Version).split('.')[0])
    : Number(Platform.Version)
}

export const Autofill = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const [autofillEnabled, setAutofillEnabled] = useState(false)
  const appState = useRef(AppState.currentState)

  const checkAutofillStatus = async () => {
    const isEnabled = await isAutofillEnabled()
    setAutofillEnabled(isEnabled)
  }

  useEffect(() => {
    checkAutofillStatus()
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkAutofillStatus()
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const redirectUserToAutofillSettings = async () => {
    try {
      const result = await openAutofillSettings()

      if (!result?.success) {
        Toast.show({
          type: 'baseToast',
          text1: t`Could not open settings`,
          text2: t`Please check your device settings manually`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    } catch (error) {
      Toast.show({
        type: 'baseToast',
        text1: t`Error opening settings`,
        text2: error.message || 'Unknown error',
        position: 'bottom',
        bottomOffset: 100
      })
    }
  }

  const renderAutofillEnabled = () => (
    <TouchableOpacity onPress={redirectUserToAutofillSettings}>
      <Text
        style={{
          textDecorationLine: 'underline',
          color: colors.primary200.mode1
        }}
      >
        {t`Manage autofill settings`}
      </Text>
    </TouchableOpacity>
  )

  const renderAndroidAutofill = () => {
    if (autofillEnabled) {
      return renderAutofillEnabled()
    }

    return (
      <ButtonCreate onPress={redirectUserToAutofillSettings}>
        {t`Set as Default`}
      </ButtonCreate>
    )
  }

  const renderIOS18Autofill = () => {
    if (autofillEnabled) {
      return renderAutofillEnabled()
    }

    return (
      <ButtonCreate onPress={requestToEnableAutofill}>
        {t`Turn On Autofill`}
      </ButtonCreate>
    )
  }

  const renderIOSLegacyAutofill = () =>
    autofillEnabled ? (
      renderAutofillEnabled()
    ) : (
      <ButtonCreate onPress={redirectUserToAutofillSettings}>
        {t`Enable Autofill`}
      </ButtonCreate>
    )

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.screenTitle}>{t`Autofill`}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CardSingleSetting title={t`Autofill`}>
          <View style={styles.sectionContent}>
            <Text style={styles.description}>
              {t`Set your Autofill for your entire account`}
            </Text>
            {Platform.OS === 'android' && renderAndroidAutofill()}
            {Platform.OS === 'ios' &&
              (getIosMajorVersion() >= IOS_VERSION_WITH_AUTOFILL_ENABLE
                ? renderIOS18Autofill()
                : renderIOSLegacyAutofill())}
          </View>
        </CardSingleSetting>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 20,
    paddingBottom: 0,
    height: '100%',
    gap: 20,
    backgroundColor: colors.grey500.mode1
  },
  header: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  screenTitle: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700'
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 40
  },
  sectionContent: {
    gap: 15
  },
  description: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  }
})
