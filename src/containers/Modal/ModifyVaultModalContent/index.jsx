import { useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  InputField,
  PasswordField,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { validatePasswordChange } from '@tetherto/pearpass-utils-password-check'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../../constants/toast'
import { VAULT_ACTION } from '../../../constants/vaultActions'
import { useModal } from '../../../context/ModalContext'
import { logger } from '../../../utils/logger'
import { getPasswordStrengthMeta } from '../../../utils/passwordPolicy'
import { ModifyVaultsModaContentWrapper } from '../ModifyVaultsModaContentWrapper'

export const ModifyVaultModalContent = ({
  vaultId,
  vaultName,
  action = VAULT_ACTION.NAME
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
  const [newPasswordValue, setNewPasswordValue] = useState('')

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

  const getSchema = () => {
    if (isPasswordChangeAction) {
      return Validator.object({
        currentPassword: isProtected
          ? Validator.string().required(t`Current password is required`)
          : Validator.string(),
        newPassword: Validator.string().required(t`New password is required`),
        repeatPassword: Validator.string().required(t`Please repeat password`)
      })
    } else {
      return Validator.object({
        name: Validator.string().required(t`Name is required`),
        currentPassword: isProtected
          ? Validator.string().required(t`Current password is required`)
          : Validator.string()
      })
    }
  }

  const getInitialValues = () => {
    if (isPasswordChangeAction) {
      return {
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
      }
    } else {
      return {
        name: vaultName,
        currentPassword: ''
      }
    }
  }

  const { register, handleSubmit, setErrors } = useForm({
    initialValues: getInitialValues(),
    validate: (values) => getSchema().validate(values)
  })

  const passwordStrengthMeta = useMemo(
    () => getPasswordStrengthMeta(newPasswordValue, passwordErrors),
    [newPasswordValue, passwordErrors]
  )

  const strengthText = passwordStrengthMeta.result?.strengthText
    ? t(passwordStrengthMeta.result.strengthText)
    : t`Not set`

  const strengthTextLabel =
    strengthText.charAt(0).toUpperCase() + strengthText.slice(1)

  const { onChange: onNameChange, ...nameField } = register('name')
  const { onChange: onCurrentPasswordChange, ...currentPasswordField } =
    register('currentPassword')
  const { onChange: onRepeatPasswordChange, ...repeatPasswordField } =
    register('repeatPassword')
  const { onChange: onNewPasswordChange, ...newPasswordField } =
    register('newPassword')

  const onSubmit = async (values) => {
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

      const name = !isPasswordChangeAction ? values.name : vaultName
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

      setIsLoading(false)
      Toast.show({
        type: 'baseToast',
        text1:
          action === VAULT_ACTION.NAME
            ? t`Vault renamed`
            : t`Vault password updated`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
      closeModal()
    } catch (error) {
      setIsLoading(false)
      logger.error('Error updating vault:', error)
      setErrors({
        currentPassword: t`Invalid password`
      })
    }
  }

  useEffect(() => {
    const checkProtection = async () => {
      const result = await isVaultProtected(vaultId)
      setIsProtected(result)
    }
    checkProtection()
  }, [isVaultProtected, vaultId])

  useEffect(() => {
    refetchVault()
  }, [refetchVault])

  const getTitle = () =>
    action === VAULT_ACTION.NAME ? t`Rename Vault` : t`Set Vault Password`

  return (
    <ModifyVaultsModaContentWrapper
      title={getTitle()}
      isLoading={isLoading}
      secondaryAction={closeModal}
      primaryAction={handleSubmit(onSubmit)}
    >
      {action === 'name' && (
        <>
          <View style={styles.copyBlock}>
            <Text variant="bodyEmphasized">{t`Vault identity`}</Text>
            <Text variant="caption" color={theme.colors.colorTextSecondary}>
              {t`The vault name appears in the selector, sharing flow, and settings hub.`}
            </Text>
          </View>

          <InputField
            label={t`Vault name`}
            value={nameField.value || ''}
            onChangeText={onNameChange}
            variant={nameField.error ? 'error' : 'default'}
            errorMessage={nameField.error}
            testID="change-vault-name-input"
          />

          {isProtected && (
            <PasswordField
              label={t`Current password`}
              value={currentPasswordField.value || ''}
              onChangeText={onCurrentPasswordChange}
              variant={currentPasswordField.error ? 'error' : 'default'}
              errorMessage={currentPasswordField.error}
            />
          )}
        </>
      )}

      {action === 'password' && (
        <>
          <View style={styles.copyBlock}>
            <Text variant="bodyEmphasized">{t`Extra encryption layer`}</Text>
            <Text variant="caption" color={theme.colors.colorTextSecondary}>
              {t`Vault passwords are separate from the master password and protect this vault when it is reopened or shared.`}
            </Text>
          </View>

          {isProtected && (
            <PasswordField
              label={t`Current password`}
              value={currentPasswordField.value || ''}
              onChangeText={onCurrentPasswordChange}
              variant={currentPasswordField.error ? 'error' : 'default'}
              errorMessage={currentPasswordField.error}
            />
          )}

          <PasswordField
            label={t`New password`}
            value={newPasswordField.value || ''}
            onChangeText={(value) => {
              setNewPasswordValue(value)
              onNewPasswordChange(value)
            }}
            variant={newPasswordField.error ? 'error' : 'default'}
            errorMessage={newPasswordField.error}
          />

          <View style={styles.strengthCard}>
            <View style={styles.strengthHeader}>
              <Text variant="caption" color={theme.colors.colorTextSecondary}>
                {t`Strength`}
              </Text>
              <Text variant="caption" color={passwordStrengthMeta.color}>
                {strengthTextLabel}
              </Text>
            </View>
            <View style={styles.strengthTrack}>
              <View
                style={[
                  styles.strengthFill,
                  {
                    width: `${passwordStrengthMeta.progress * 100}%`,
                    backgroundColor: passwordStrengthMeta.color
                  }
                ]}
              />
            </View>
            <View style={styles.ruleRow}>
              {[
                { key: 'minLength', label: t`8+ characters` },
                { key: 'hasLowerCase', label: t`Lowercase` },
                { key: 'hasUpperCase', label: t`Uppercase` },
                { key: 'hasNumbers', label: t`Number` },
                { key: 'hasSymbols', label: t`Symbol` }
              ].map((rule) => (
                <View
                  key={rule.key}
                  style={[
                    styles.ruleChip,
                    passwordStrengthMeta.result?.rules?.[rule.key] &&
                      styles.ruleChipActive
                  ]}
                >
                  <Text
                    variant="caption"
                    color={
                      passwordStrengthMeta.result?.rules?.[rule.key]
                        ? theme.colors.colorPrimary
                        : theme.colors.colorTextSecondary
                    }
                  >
                    {rule.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <PasswordField
            label={t`Repeat new password`}
            value={repeatPasswordField.value || ''}
            onChangeText={onRepeatPasswordChange}
            variant={repeatPasswordField.error ? 'error' : 'default'}
            errorMessage={repeatPasswordField.error}
          />
        </>
      )}
    </ModifyVaultsModaContentWrapper>
  )
}

const styles = StyleSheet.create({
  copyBlock: {
    gap: rawTokens.spacing8
  },
  strengthCard: {
    gap: rawTokens.spacing8,
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#0F130A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  strengthTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#202614',
    overflow: 'hidden'
  },
  strengthFill: {
    height: '100%',
    borderRadius: 999
  },
  ruleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rawTokens.spacing8
  },
  ruleChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#090B07',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  ruleChipActive: {
    backgroundColor: 'rgba(163,230,53,0.12)',
    borderColor: 'rgba(163,230,53,0.24)'
  }
})
