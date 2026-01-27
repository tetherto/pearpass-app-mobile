import { useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { AUTO_LOCK_ENABLED } from 'pearpass-lib-constants'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ListItem } from '../../../components/ListItem'
import { IOS_APP_GROUP_ID } from '../../../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../../../constants/secureStorageKeys'
import { AutoLockSettings } from '../../../containers/AutoLockSettings'
import { RuleSelector } from '../../../containers/BottomSheetPassGeneratorContent/RuleSelector'
import { ModifyMasterVaultModalContent } from '../../../containers/Modal/ModifyMasterVaultModalContent'
import { useModal } from '../../../context/ModalContext'
import { useBiometricsAuthentication } from '../../../hooks/useBiometricsAuthentication'
import { usePasswordChangeReminder } from '../../../hooks/usePasswordChangeReminder'
import { ButtonLittle } from '../../../libComponents'

export const Security = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { openModal } = useModal()
  const { isPasswordChangeReminderEnabled } = usePasswordChangeReminder()
  const { isBiometricsSupported, isBiometricsEnabled, toggleBiometrics } =
    useBiometricsAuthentication()

  const [selectedRules, setSelectedRules] = useState({
    biometrics: false,
    copyToClipboard: true,
    passwordChangeReminder: true
  })

  const ruleOptions = useMemo(() => {
    const options = [
      {
        name: 'passwordChangeReminder',
        label: t`Reminders`,
        description: t`Get alerts when it's time to update your passwords.`,
        testIDOn: 'reminders-toggle-on',
        testIDOff: 'reminders-toggle-off',
        accessibilityLabelOn: t`Reminders enabled`,
        accessibilityLabelOff: t`Reminders disabled`
      },
      {
        name: 'copyToClipboard',
        label: t`Copy to clipboard`,
        description: t`Copy any password instantly with one tap.`,
        testIDOn: 'copy-to-clipboard-toggle-on',
        testIDOff: 'copy-to-clipboard-toggle-off',
        accessibilityLabelOn: t`Copy to clipboard enabled`,
        accessibilityLabelOff: t`Copy to clipboard disabled`
      }
    ]

    if (isBiometricsSupported) {
      options.push({
        name: 'biometrics',
        label: t`Unlock with biometrics`,
        description: t`Use Face ID or fingerprint for faster, secure access.`,
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
        passwordChangeReminder: isPasswordChangeReminderEnabled
      })
    }

    getInitialSettings()
  }, [isBiometricsEnabled, isPasswordChangeReminderEnabled])

  const handleMasterEditClick = () => {
    openModal(<ModifyMasterVaultModalContent />)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.screenTitle}>{t`Security`}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CardSingleSetting title={t`Master Password`}>
          <View style={styles.sectionContent}>
            <Text style={styles.description}>
              {t`Manage the password that protects your app.`}
            </Text>
            <ListItem
              name={t`Master Vault`}
              onEditClick={handleMasterEditClick}
            />
          </View>
        </CardSingleSetting>

        <CardSingleSetting title={t`PearPass functions`}>
          <View style={styles.sectionContent}>
            <Text style={styles.description}>
              {t`Control how PearPass works and keep your vault secure.`}
            </Text>
            <RuleSelector
              rules={ruleOptions}
              selectedRules={selectedRules}
              setRules={handleSetRules}
            />
            {AUTO_LOCK_ENABLED && <AutoLockSettings />}
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
