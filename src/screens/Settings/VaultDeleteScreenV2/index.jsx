import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  AlertMessage,
  Button,
  Link,
  PasswordField,
  rawTokens,
  Text,
  ToggleSwitch
} from '@tetherto/pearpass-lib-ui-kit'
import {
  broadcastDeleteVault,
  useCreateVault,
  useUserData,
  useVault,
  useVaults
} from '@tetherto/pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from '@tetherto/pearpass-lib-vault/src/utils/buffer'
import { Keyboard, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../../constants/toast'
import { BottomSheetPairedDevicesContent } from '../../../containers/BottomSheetPairedDevicesContent'
import { Layout } from '../../../containers/Layout'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { useVaultSwitch } from '../../../hooks/useVaultSwitch'
import { logger } from '../../../utils/logger'

export const VaultDeleteScreenV2 = ({ route }) => {
  const { t } = useLingui()
  const navigation = useNavigation()

  const vaultId = route?.params?.vaultId
  const vaultName = route?.params?.vaultName

  const { data: vaultData, deleteVaultLocal, addDevice } = useVault()
  const { data: allVaults } = useVaults()
  const { logIn } = useUserData()
  const { createVault } = useCreateVault()
  const { switchVault } = useVaultSwitch()

  const devices = vaultData?.devices
  const otherDeviceCount = Array.isArray(devices)
    ? Math.max(devices.length - 1, 0)
    : 0

  const [pairedDevicesOpen, setPairedDevicesOpen] = useState(false)
  const [eraseFromAllDevices, setEraseFromAllDevices] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const schema = Validator.object({
    masterPassword: Validator.string().required(t`Master password is required`)
  })

  const { register, handleSubmit, setErrors, values } = useForm({
    initialValues: { masterPassword: '' },
    validate: (formValues) => schema.validate(formValues)
  })

  const masterPasswordField = register('masterPassword')

  const onMasterPasswordChange = (value) => {
    masterPasswordField.onChange(value)
    if (submitError) setSubmitError(null)
  }

  const onSubmit = async (formValues) => {
    if (isLoading || !vaultId) return

    if (!formValues.masterPassword) {
      setErrors({ masterPassword: t`Master password is required` })
      return
    }

    setSubmitError(null)
    Keyboard.dismiss()
    const passwordBuffer = stringToBuffer(formValues.masterPassword)
    setIsLoading(true)

    try {
      try {
        await logIn({ password: passwordBuffer })
      } catch {
        setSubmitError(t`Invalid master password`)
        return
      } finally {
        clearBuffer(passwordBuffer)
      }

      let broadcastFailed = false
      if (eraseFromAllDevices) {
        try {
          const { failures } = await broadcastDeleteVault(vaultId)
          if (failures?.length) broadcastFailed = true
        } catch (error) {
          broadcastFailed = true
          logger.error(
            'VaultDeleteScreenV2',
            'broadcastDeleteVault failed:',
            error
          )
        }
      }

      try {
        await deleteVaultLocal(vaultId)
      } catch (error) {
        logger.error('VaultDeleteScreenV2', 'deleteVaultLocal failed:', error)
        setSubmitError(t`Failed to delete vault`)
        Toast.show({
          type: 'baseToast',
          text1: t`Couldn't delete vault files. Please try again.`,
          position: 'bottom',
          bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
        })
        return
      }

      if (broadcastFailed) {
        Toast.show({
          type: 'baseToast',
          text1: t`Couldn't reach other devices. They will sync next time they come online.`,
          position: 'bottom',
          bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
        })
      }

      Toast.show({
        type: 'baseToast',
        text1: t`"${vaultName}" was deleted from this device`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })

      const nextVault = (allVaults ?? []).find((v) => v.id !== vaultId)
      if (nextVault) {
        await switchVault(nextVault)
      } else {
        try {
          await createVault({ name: t`Personal` })
          await addDevice()
          Toast.show({
            type: 'baseToast',
            text1: t`A new "Personal" vault was created`,
            position: 'bottom',
            bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
          })
        } catch (error) {
          logger.error(
            'VaultDeleteScreenV2',
            'failed to create fallback Personal vault:',
            error
          )
        }
      }

      navigation.goBack()
    } finally {
      setIsLoading(false)
    }
  }

  const isSubmitDisabled = !values.masterPassword || isLoading

  return (
    <Layout
      scrollable
      header={
        <BackScreenHeader
          title={t`Delete ${vaultName ?? ''}`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.content}
      footer={
        <View style={styles.footer}>
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={() => navigation.goBack()}
            disabled={isLoading}
            testID="vault-delete-v2-discard-button"
          >
            {t`Discard`}
          </Button>

          <Button
            variant="destructive"
            size="medium"
            fullWidth
            isLoading={isLoading}
            disabled={isSubmitDisabled}
            onClick={handleSubmit(onSubmit)}
            testID="vault-delete-v2-submit-button"
          >
            {t`Delete`}
          </Button>
        </View>
      }
    >
      <BottomSheetPairedDevicesContent
        open={pairedDevicesOpen}
        onOpenChange={setPairedDevicesOpen}
      />

      <View style={styles.fields}>
        <Text variant="label">
          {t`Are you sure you want to delete "${vaultName ?? ''}"? All items in this vault will be permanently deleted. This cannot be undone.`}
        </Text>

        <PasswordField
          label={t`Confirm With Master Password`}
          placeholder={t`Enter Master Password to Confirm Deletion`}
          value={masterPasswordField.value || ''}
          onChangeText={onMasterPasswordChange}
          error={masterPasswordField.error}
          testID="vault-delete-v2-password-input"
        />

        <View style={styles.eraseRow}>
          <View style={styles.eraseLabel}>
            <Text variant="label">{t`Erase Vault from`} </Text>
            <Link
              onClick={() => setPairedDevicesOpen(true)}
              testID="vault-delete-v2-eraseall-link"
            >
              {otherDeviceCount === 1
                ? t`${otherDeviceCount} other device`
                : t`${otherDeviceCount} other devices`}
            </Link>
            <Text variant="label"> {t`with access`}</Text>
          </View>
          <ToggleSwitch
            checked={eraseFromAllDevices}
            onChange={setEraseFromAllDevices}
            testID="vault-delete-v2-eraseall-toggle"
          />
        </View>

        {eraseFromAllDevices ? (
          <AlertMessage
            variant="warning"
            size="small"
            title=""
            description={t`The removal will take effect on all other devices the next time they access this vault.`}
            testID="vault-delete-v2-eraseall-alert"
          />
        ) : null}

        {submitError ? (
          <AlertMessage
            variant="error"
            size="small"
            title=""
            description={submitError}
            testID="vault-delete-v2-error-alert"
          />
        ) : null}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing20
  },
  fields: {
    gap: rawTokens.spacing16
  },
  eraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: rawTokens.spacing12
  },
  eraseLabel: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  footer: {
    gap: rawTokens.spacing12
  }
})
