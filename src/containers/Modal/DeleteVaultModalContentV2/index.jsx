import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  AlertMessage,
  Button,
  Link,
  PageHeader,
  PasswordField,
  rawTokens,
  Text,
  ToggleSwitch,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  useCreateVault,
  useUserData,
  useVault,
  useVaults
} from '@tetherto/pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from '@tetherto/pearpass-lib-vault/src/utils/buffer'
import { Platform, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../../constants/toast'
import { useModal } from '../../../context/ModalContext'
import { useVaultSwitch } from '../../../hooks/useVaultSwitch'
import { logger } from '../../../utils/logger'

/**
 * @param {{
 *   vaultId: string
 *   vaultName: string
 *   onDeviceCountPress?: () => void
 * }} props
 */
export const DeleteVaultModalContentV2 = ({
  vaultId,
  vaultName,
  onDeviceCountPress
}) => {
  const { closeModal } = useModal()
  const { t } = useLingui()
  const { theme } = useTheme()

  const { data: vaultData, deleteVaultLocal, addDevice } = useVault()
  const { data: allVaults } = useVaults()
  const { logIn } = useUserData()
  const { createVault } = useCreateVault()
  const { switchVault } = useVaultSwitch()

  const devices = vaultData?.devices
  const deviceCount = Array.isArray(devices) ? devices.length : 0

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
    if (isLoading) return

    if (!formValues.masterPassword) {
      setErrors({ masterPassword: t`Master password is required` })
      return
    }

    setSubmitError(null)
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

      // TODO: broadcast deleteVault action to other devices when toggle is on.

      try {
        await deleteVaultLocal(vaultId)
      } catch (error) {
        logger.error(
          'DeleteVaultModalContentV2',
          'deleteVaultLocal failed:',
          error
        )
        setSubmitError(t`Failed to delete vault`)
        return
      }

      closeModal()
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
          await addDevice(Platform.OS + ' ' + Platform.Version)
          Toast.show({
            type: 'baseToast',
            text1: t`A new "Personal" vault was created`,
            position: 'bottom',
            bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
          })
        } catch (error) {
          logger.error(
            'DeleteVaultModalContentV2',
            'failed to create fallback Personal vault:',
            error
          )
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isSubmitDisabled = !values.masterPassword || isLoading

  const styles = getStyles()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.colorSurfacePrimary,
          borderColor: theme.colors.colorBorderPrimary
        }
      ]}
      testID="delete-vault-modal-v2"
    >
      <View style={styles.content}>
        <PageHeader
          title={t`Delete ${vaultName}`}
          testID="delete-vault-modal-v2-header"
        />

        <View style={styles.fields}>
          <Text variant="label">
            {t`Are you sure you want to delete "${vaultName}"? All items in this vault will be permanently deleted. This cannot be undone.`}
          </Text>

          <PasswordField
            label={t`Confirm With Master Password`}
            placeholder={t`Enter Master Password to Confirm Deletion`}
            value={masterPasswordField.value || ''}
            onChangeText={onMasterPasswordChange}
            error={masterPasswordField.error}
            testID="delete-vault-modal-v2-password-input"
          />

          <View style={styles.eraseRow}>
            <View style={styles.eraseLabel}>
              <Text variant="label">{t`Erase Vault from all the`} </Text>
              <Link
                onClick={onDeviceCountPress}
                testID="delete-vault-modal-v2-eraseall-link"
              >
                {t`${deviceCount} devices`}
              </Link>
              <Text variant="label"> {t`with access`}</Text>
            </View>
            <ToggleSwitch
              checked={eraseFromAllDevices}
              onChange={setEraseFromAllDevices}
              testID="delete-vault-modal-v2-eraseall-toggle"
            />
          </View>

          {eraseFromAllDevices ? (
            <AlertMessage
              variant="warning"
              size="small"
              title=""
              description={t`The removal will take effect on all other devices the next time they access this vault.`}
              testID="delete-vault-modal-v2-eraseall-alert"
            />
          ) : null}

          {submitError ? (
            <AlertMessage
              variant="error"
              size="small"
              title=""
              description={submitError}
              testID="delete-vault-modal-v2-error-alert"
            />
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { borderTopColor: theme.colors.colorBorderPrimary }
        ]}
      >
        <Button
          variant="secondary"
          size="medium"
          fullWidth
          onClick={closeModal}
          disabled={isLoading}
          testID="delete-vault-modal-v2-discard-button"
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
          testID="delete-vault-modal-v2-submit-button"
        >
          {t`Delete`}
        </Button>
      </View>
    </View>
  )
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: 480,
      borderWidth: 1,
      borderRadius: rawTokens.spacing20,
      overflow: 'hidden'
    },
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
      padding: rawTokens.spacing16,
      gap: rawTokens.spacing12,
      borderTopWidth: 1
    }
  })
