import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { PasswordField } from '@tetherto/pearpass-lib-ui-kit'
import { useUserData } from '@tetherto/pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from '@tetherto/pearpass-lib-vault/src/utils/buffer'
import { validatePasswordChange } from '@tetherto/pearpass-utils-password-check'

import { useModal } from '../../../context/ModalContext'
import { logger } from '../../../utils/logger'
import { ModifyVaultsModaContentWrapper } from '../ModifyVaultsModaContentWrapper'

/**
 * @param {Object} props
 * @param {Function} [props.onPasswordChange]
 */
export const ModifyMasterVaultModalContent = ({ onPasswordChange }) => {
  const { closeModal } = useModal()
  const { t } = useLingui()

  const { updateMasterPassword } = useUserData()

  const [isLoading, setIsLoading] = useState(false)

  const errors = {
    minLength: t`Password must be at least 8 characters long`,
    hasLowerCase: t`Password must contain at least one lowercase letter`,
    hasUpperCase: t`Password must contain at least one uppercase letter`,
    hasNumbers: t`Password must contain at least one number`,
    hasSymbols: t`Password must contain at least one special character`
  }

  const schema = Validator.object({
    currentPassword: Validator.string().required(t`Invalid password`),
    newPassword: Validator.string().required(t`Password is required`),
    repeatPassword: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors, setValue } = useForm({
    initialValues: { currentPassword: '', newPassword: '', repeatPassword: '' },
    validate: (values) => schema.validate(values)
  })

  const { onChange: onCurrentPasswordChange, ...currentPasswordField } =
    register('currentPassword')
  const { onChange: onNewPasswordChange, ...newPasswordField } =
    register('newPassword')
  const { onChange: onRepeatPasswordChange, ...repeatPasswordField } =
    register('repeatPassword')

  const onSubmit = async (values) => {
    const { currentPassword, newPassword, repeatPassword } = values
    const result = validatePasswordChange({
      currentPassword,
      newPassword,
      repeatPassword,
      messages: {
        newPasswordMustDiffer: t`New password must be different from the current password`,
        passwordsDontMatch: t`Passwords do not match`
      },
      config: { errors }
    })

    if (!result.success) {
      setErrors({
        [result.field]: result.error
      })

      if (result.field === 'newPassword') {
        setValue('repeatPassword', '')
      }
      return
    }

    const newPasswordBuffer = stringToBuffer(values.newPassword)
    const currentPasswordBuffer = stringToBuffer(values.currentPassword)

    try {
      setIsLoading(true)
      await updateMasterPassword({
        newPassword: newPasswordBuffer,
        currentPassword: currentPasswordBuffer
      })

      setIsLoading(false)
      onPasswordChange?.()
      closeModal()
    } catch (error) {
      setIsLoading(false)
      logger.error('Error updating master password:', error)
      setErrors({
        currentPassword: t`Invalid password`
      })
    } finally {
      clearBuffer(newPasswordBuffer)
      clearBuffer(currentPasswordBuffer)
    }
  }

  return (
    <ModifyVaultsModaContentWrapper
      title={t`Update master password`}
      secondaryAction={closeModal}
      primaryAction={handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <PasswordField
        label={t`Insert old password`}
        value={currentPasswordField.value || ''}
        onChangeText={onCurrentPasswordChange}
        variant={currentPasswordField.error ? 'error' : 'default'}
        errorMessage={currentPasswordField.error}
        testID="insert-old-password-input"
      />

      <PasswordField
        label={t`Create new password`}
        value={newPasswordField.value || ''}
        onChangeText={onNewPasswordChange}
        variant={newPasswordField.error ? 'error' : 'default'}
        errorMessage={newPasswordField.error}
        testID="create-new-password-input"
      />

      <PasswordField
        label={t`Repeat new password`}
        value={repeatPasswordField.value || ''}
        onChangeText={onRepeatPasswordChange}
        variant={repeatPasswordField.error ? 'error' : 'default'}
        errorMessage={repeatPasswordField.error}
        testID="repeat-new-password-input"
      />
    </ModifyVaultsModaContentWrapper>
  )
}
