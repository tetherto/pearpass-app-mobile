import { useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  AlertMessage,
  Button,
  InputField,
  PageHeader,
  PasswordField,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { ReportProblem } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { validatePasswordChange } from '@tetherto/pearpass-utils-password-check'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../../constants/toast'
import { VAULT_ACTION } from '../../../constants/vaultActions'
import { useModal } from '../../../context/ModalContext'
import { logger } from '../../../utils/logger'
import {
  getPasswordIndicatorVariant,
  getPasswordsMatch
} from '../../../utils/passwordPolicy'

/**
 * @param {{
 *   vaultId: string
 *   vaultName: string
 *   action?: 'name' | 'password'
 *   onSuccess?: () => void
 * }} props
 */
export const ModifyVaultModalContentV2 = ({
  vaultId,
  vaultName,
  action = VAULT_ACTION.NAME,
  onSuccess
}) => {
  const { closeModal } = useModal()
  const { t } = useLingui()
  const { theme } = useTheme()

  const isPasswordChangeAction = action === VAULT_ACTION.PASSWORD

  const {
    isVaultProtected,
    updateUnprotectedVault,
    updateProtectedVault,
    refetch: refetchVault
  } = useVault()

  const [isProtected, setIsProtected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const passwordErrors = useMemo(
    () => ({
      minLength: t`Password must be at least 8 characters long`,
      hasLowerCase: t`Password must contain at least one lowercase letter`,
      hasUpperCase: t`Password must contain at least one uppercase letter`,
      hasNumbers: t`Password must contain at least one number`,
      hasSymbols: t`Password must contain at least one special character`
    }),
    [t]
  )

  const schema = useMemo(() => {
    if (isPasswordChangeAction) {
      return Validator.object({
        currentPassword: isProtected
          ? Validator.string().required(t`Current password is required`)
          : Validator.string(),
        newPassword: Validator.string().required(t`New password is required`),
        repeatPassword: Validator.string().required(t`Please repeat password`)
      })
    }

    return Validator.object({
      name: Validator.string().required(t`Name is required`),
      currentPassword: isProtected
        ? Validator.string().required(t`Current password is required`)
        : Validator.string()
    })
  }, [isPasswordChangeAction, isProtected, t])

  const initialValues = useMemo(
    () =>
      isPasswordChangeAction
        ? {
            currentPassword: '',
            newPassword: '',
            repeatPassword: ''
          }
        : {
            name: vaultName,
            currentPassword: ''
          },
    [isPasswordChangeAction, vaultName]
  )

  const { register, handleSubmit, setErrors } = useForm({
    initialValues,
    validate: (values) => schema.validate(values)
  })

  const { onChange: onNameChange, ...nameField } = register('name')
  const { onChange: onCurrentPasswordChange, ...currentPasswordField } =
    register('currentPassword')
  const { onChange: onNewPasswordChange, ...newPasswordField } =
    register('newPassword')
  const { onChange: onRepeatPasswordChange, ...repeatPasswordField } =
    register('repeatPassword')

  useEffect(() => {
    const checkProtection = async () => {
      const result = await isVaultProtected(vaultId)
      setIsProtected(result)
    }

    checkProtection()
  }, [isVaultProtected, vaultId])

  const pageTitle = isPasswordChangeAction
    ? isProtected
      ? t`Update Vault Password`
      : t`Set Vault Password`
    : t`Rename Vault`

  const pageSubtitle = isPasswordChangeAction
    ? isProtected
      ? t`Change the extra password that protects this vault when it is reopened or shared.`
      : t`Add a dedicated password when this vault needs an extra encryption layer.`
    : t`Update the identity shown across your devices, in sharing, and inside settings.`

  const handleSave = async (values) => {
    if (isPasswordChangeAction) {
      const validation = validatePasswordChange({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        repeatPassword: values.repeatPassword,
        messages: {
          newPasswordMustDiffer: t`New password must be different from the current password`,
          passwordsDontMatch: t`Passwords do not match`
        },
        config: {
          errors: passwordErrors
        }
      })

      if (!validation.success) {
        setErrors({
          [validation.field || 'newPassword']:
            validation.error || t`Password is invalid`
        })
        return
      }
    }

    try {
      setIsLoading(true)

      const name = isPasswordChangeAction ? vaultName : values.name
      const password = isPasswordChangeAction ? values.newPassword : undefined

      if (isProtected) {
        await updateProtectedVault(vaultId, {
          name,
          password,
          currentPassword: values.currentPassword
        })
      } else {
        await updateUnprotectedVault(vaultId, {
          name,
          password
        })
      }

      await refetchVault?.(vaultId)

      Toast.show({
        type: 'baseToast',
        text1:
          action === VAULT_ACTION.NAME
            ? t`Vault renamed`
            : t`Vault password updated`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })

      onSuccess?.()
      closeModal()
    } catch (error) {
      logger.error('Error updating vault:', error)
      setErrors({
        currentPassword: t`Invalid password`
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.colorSurfacePrimary,
          borderColor: theme.colors.colorBorderPrimary
        }
      ]}
      testID="modify-vault-modal-v2"
    >
      <View style={styles.content}>
        <PageHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          testID="modify-vault-modal-v2-header"
        />

        <View style={styles.fields}>
          {!isPasswordChangeAction ? (
            <InputField
              label={t`Vault Name`}
              placeholder={t`Enter Vault Name`}
              value={nameField.value || ''}
              onChangeText={onNameChange}
              error={nameField.error}
              testID="modify-vault-modal-v2-name-input"
            />
          ) : null}

          {isProtected ? (
            <PasswordField
              label={t`Current Password`}
              placeholder={t`Enter Current Password`}
              value={currentPasswordField.value || ''}
              onChangeText={onCurrentPasswordChange}
              error={currentPasswordField.error}
              testID="modify-vault-modal-v2-current-password-input"
            />
          ) : null}

          {isPasswordChangeAction ? (
            <>
              <PasswordField
                label={t`New Password`}
                placeholder={t`Enter New Password`}
                value={newPasswordField.value || ''}
                onChangeText={onNewPasswordChange}
                error={newPasswordField.error}
                passwordIndicator={getPasswordIndicatorVariant(
                  newPasswordField.value,
                  passwordErrors
                )}
                testID="modify-vault-modal-v2-new-password-input"
              />

              <PasswordField
                label={t`Repeat New Password`}
                placeholder={t`Repeat New Password`}
                value={repeatPasswordField.value || ''}
                onChangeText={onRepeatPasswordChange}
                error={repeatPasswordField.error}
                passwordIndicator={
                  getPasswordsMatch(
                    newPasswordField.value,
                    repeatPasswordField.value
                  )
                    ? 'match'
                    : undefined
                }
                testID="modify-vault-modal-v2-repeat-password-input"
              />

              <AlertMessage
                variant="warning"
                size="small"
                title={t`Important`}
                description={t`Vault passwords are separate from the master password. Keep them stored safely because they are required when reopening or sharing this vault.`}
                icon={<ReportProblem />}
                testID="modify-vault-modal-v2-password-warning"
              />
            </>
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
          testID="modify-vault-modal-v2-cancel-button"
        >
          {t`Cancel`}
        </Button>

        <Button
          variant="primary"
          size="medium"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
          onClick={handleSubmit(handleSave)}
          testID="modify-vault-modal-v2-save-button"
        >
          {t`Save`}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  footer: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing12,
    borderTopWidth: 1
  }
})
