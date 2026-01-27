import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { useUserData } from 'pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from 'pearpass-lib-vault/src/utils/buffer'
import { validatePasswordChange } from 'pearpass-utils-password-check'

import { InputLabel, InputWrapper } from './styles'
import { useModal } from '../../../context/ModalContext'
import { InputPasswordPearPass } from '../../../libComponents'
import { logger } from '../../../utils/logger'
import { ModifyVaultsModaContentWrapper } from '../ModifyVaultsModaContentWrapper'

export const ModifyMasterVaultModalContent = () => {
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
      <InputWrapper>
        <InputLabel>{t`Insert old password`}</InputLabel>
        <InputPasswordPearPass
          isPassword
          {...register('currentPassword')}
          testID="insert-old-password-input"
          accessibilityLabel={t`Insert old password`}
        />
      </InputWrapper>

      <InputWrapper>
        <InputLabel>{t`Create new password`}</InputLabel>
        <InputPasswordPearPass
          isPassword
          {...register('newPassword')}
          testID="create-new-password-input"
          accessibilityLabel={t`Create new password`}
        />
      </InputWrapper>

      <InputWrapper>
        <InputLabel>{t`Repeat new password`}</InputLabel>
        <InputPasswordPearPass
          isPassword
          {...register('repeatPassword')}
          testID="repeat-new-password-input"
          accessibilityLabel={t`Repeat new password`}
        />
      </InputWrapper>
    </ModifyVaultsModaContentWrapper>
  )
}
