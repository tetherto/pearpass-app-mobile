import { useEffect, useState, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { OutsideLinkIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider'
import { AppState, Platform, Text, TouchableOpacity } from 'react-native'
import Toast from 'react-native-toast-message'

import { Container, Description } from './styles'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ButtonCreate } from '../../../libComponents/index.js'
import {
  isAutofillEnabled,
  openAutofillSettings,
  requestToEnableAutofill
} from '../../../utils/AutofillModule'

const IOS_VERSION_WITH_AUTOFILL_ENABLE = 18

export const AutofillSection = () => {
  const { t } = useLingui()
  const [autofillEnabled, setAutofillEnabled] = useState(false)
  const appState = useRef(AppState.currentState)

  // Check autofill status
  const checkAutofillStatus = async () => {
    const isEnabled = await isAutofillEnabled()
    setAutofillEnabled(isEnabled)
  }

  useEffect(() => {
    checkAutofillStatus()
  }, [])

  // Listen for app state changes to refresh autofill status
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        checkAutofillStatus()
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])

  // Main autofill settings handler
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

  // Render Android autofill UI
  const renderAndroidAutofill = () => {
    if (autofillEnabled) {
      return renderAutofillEnabled()
    }

    return (
      <>
        <Description>
          {t`Set PearPass as your default autofill provider for instant sign-ins.`}
        </Description>
        <ButtonCreate
          onPress={redirectUserToAutofillSettings}
          startIcon={OutsideLinkIcon}
        >
          {t`Set as Default`}
        </ButtonCreate>
      </>
    )
  }

  const renderAutofillEnabled = () => (
    <>
      <Description>{t`PearPass autofill is enabled.`}</Description>
      <TouchableOpacity onPress={redirectUserToAutofillSettings}>
        <Text
          as="Text"
          isActive={false}
          style={{
            textDecorationLine: 'underline',
            color: colors.primary200.mode1
          }}
        >
          {t`Manage autofill settings`}
        </Text>
      </TouchableOpacity>
    </>
  )

  // Render iOS 18+ autofill UI
  const renderIOS18Autofill = () => {
    if (autofillEnabled) {
      return renderAutofillEnabled()
    }

    return (
      <>
        <Description>
          {t`Enable PearPass as your autofill provider for instant sign-ins.`}
        </Description>
        <ButtonCreate
          onPress={requestToEnableAutofill}
          startIcon={OutsideLinkIcon}
        >
          {t`Turn On Autofill`}
        </ButtonCreate>
      </>
    )
  }

  // Render iOS 17 and below autofill UI
  const renderIOSLegacyAutofill = () =>
    autofillEnabled ? (
      renderAutofillEnabled()
    ) : (
      <>
        <Description>
          {t`Enable PearPass as your autofill provider for instant sign-ins.`}
        </Description>
        <ButtonCreate
          onPress={redirectUserToAutofillSettings}
          startIcon={OutsideLinkIcon}
        >
          {t`Enable Autofill`}
        </ButtonCreate>
      </>
    )

  return (
    <CardSingleSetting title={t`Autofill`}>
      <Container>
        {Platform.OS === 'android' && renderAndroidAutofill()}
        {Platform.OS === 'ios' &&
          (parseInt(Platform.Version, 10) >= IOS_VERSION_WITH_AUTOFILL_ENABLE
            ? renderIOS18Autofill()
            : renderIOSLegacyAutofill())}
      </Container>
    </CardSingleSetting>
  )
}
