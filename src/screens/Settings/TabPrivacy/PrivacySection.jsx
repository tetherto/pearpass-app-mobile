import { useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import * as SecureStore from 'expo-secure-store'
import { AUTO_LOCK_ENABLED } from 'pearpass-lib-constants'

import { Container, Description } from './styles'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { IOS_APP_GROUP_ID } from '../../../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../../../constants/secureStorageKeys'
import { AutoLockSettings } from '../../../containers/AutoLockSettings'
import { RuleSelector } from '../../../containers/BottomSheetPassGeneratorContent/RuleSelector'
import { useHapticsContext } from '../../../context/HapticsContext'
import { useBiometricsAuthentication } from '../../../hooks/useBiometricsAuthentication'
import { usePasswordChangeReminder } from '../../../hooks/usePasswordChangeReminder'

export const PrivacySection = () => {
  const { t } = useLingui()
  const { isPasswordChangeReminderEnabled } = usePasswordChangeReminder()
  const { isHapticsEnabled, setIsHapticsEnabled } = useHapticsContext()
  const [selectedRules, setSelectedRules] = useState({
    biometrics: false,
    copyToClipboard: true,
    passwordChangeReminder: true,
    haptics: true
  })

  const { isBiometricsSupported, isBiometricsEnabled, toggleBiometrics } =
    useBiometricsAuthentication()

  const ruleOptions = useMemo(() => {
    const options = [
      {
        name: 'passwordChangeReminder',
        label: t`Reminders`,
        description: t`Enable the reminders to change your passwords`,
        testIDOn: 'reminders-toggle-on',
        testIDOff: 'reminders-toggle-off',
        accessibilityLabelOn: t`Reminders enabled`,
        accessibilityLabelOff: t`Reminders disabled`
      },
      {
        name: 'copyToClipboard',
        label: t`Copy to clipboard`,
        description: t`When clicking a password you copy that into your clipboard`,
        testIDOn: 'copy-to-clipboard-toggle-on',
        testIDOff: 'copy-to-clipboard-toggle-off',
        accessibilityLabelOn: t`Copy to clipboard enabled`,
        accessibilityLabelOff: t`Copy to clipboard disabled`
      },
      {
        name: 'haptics',
        label: t`Haptic feedback`,
        description: t`Enable vibration feedback when interacting with the app`,
        testIDOn: 'haptics-toggle-on',
        testIDOff: 'haptics-toggle-off',
        accessibilityLabelOn: t`Haptic feedback enabled`,
        accessibilityLabelOff: t`Haptic feedback disabled`
      }
    ]

    if (isBiometricsSupported) {
      options.push({
        name: 'biometrics',
        label: t`Unlock with biometrics`,
        description: t`Unlock PearPass using the biometrics on your device`,
        testIDOn: 'biometrics-toggle-on',
        testIDOff: 'biometrics-toggle-off',
        accessibilityLabelOn: t`Unlock with biometrics enabled`,
        accessibilityLabelOff: t`Unlock with biometrics disabled`
      })
    }

    return options
  }, [isBiometricsSupported, t])

  const handleSetRules = async (newRules) => {
    if (newRules.biometrics !== selectedRules.biometrics) {
      const { success } = await toggleBiometrics(newRules.biometrics)

      if (!success) {
        return
      }
    }

    if (newRules.copyToClipboard !== selectedRules.copyToClipboard) {
      if (!newRules.copyToClipboard) {
        await SecureStore.setItemAsync(
          SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD,
          'false',
          {
            accessGroup: IOS_APP_GROUP_ID
          }
        )
      } else {
        await SecureStore.deleteItemAsync(SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD)
      }
    }

    if (
      newRules.passwordChangeReminder !== selectedRules.passwordChangeReminder
    ) {
      const isPasswordChangeReminderEnabled =
        SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED
      if (!newRules.passwordChangeReminder) {
        await SecureStore.setItemAsync(isPasswordChangeReminderEnabled, 'false')
      } else {
        await SecureStore.deleteItemAsync(isPasswordChangeReminderEnabled)
      }
    }

    if (newRules.haptics !== selectedRules.haptics) {
      await setIsHapticsEnabled(newRules.haptics)
    }

    setSelectedRules({ ...newRules })
  }

  useEffect(() => {
    const getInitialSettings = async () => {
      const copyToClipboard = await SecureStore.getItemAsync(
        SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD,
        {
          accessGroup: IOS_APP_GROUP_ID
        }
      )

      setSelectedRules({
        biometrics: isBiometricsEnabled,
        copyToClipboard: copyToClipboard !== 'false',
        passwordChangeReminder: isPasswordChangeReminderEnabled,
        haptics: isHapticsEnabled
      })
    }

    getInitialSettings()
  }, [isBiometricsEnabled, isPasswordChangeReminderEnabled, isHapticsEnabled])

  return (
    <CardSingleSetting title={t`Custom settings`}>
      <Container>
        <Description>
          {t`Here you can choose your privacy settings and personalize your experience.`}
        </Description>
        <RuleSelector
          rules={ruleOptions}
          selectedRules={selectedRules}
          setRules={handleSetRules}
        />
        {AUTO_LOCK_ENABLED && <AutoLockSettings />}
      </Container>
    </CardSingleSetting>
  )
}
