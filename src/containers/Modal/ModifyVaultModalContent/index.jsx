import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { useVault } from 'pearpass-lib-vault'

import { InputPasswordPearPass } from '../../../libComponents'
import { ModifyVaultsModaContentWrapper } from '../ModifyVaultsModaContentWrapper'
import { InputLabel, InputWrapper } from './styles'
import { VAULT_ACTION } from '../../../constants/vaultActions'
import { useModal } from '../../../context/ModalContext'
import { logger } from '../../../utils/logger'

export const ModifyVaultModalContent = ({
  vaultId,
  vaultName,
  action = VAULT_ACTION.NAME
}) => {
  const { closeModal } = useModal()
  const { t } = useLingui()

  const isPasswordChangeAction = action === VAULT_ACTION.PASSWORD

  const {
    isVaultProtected,
    updateUnprotectedVault,
    updateProtectedVault,
    refetch: refetchVault
  } = useVault()

  const [isProtected, setIsProtected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const onSubmit = async (values) => {
    if (
      isPasswordChangeAction &&
      values.newPassword !== values.repeatPassword
    ) {
      setErrors({
        repeatPassword: t`Passwords do not match`
      })
      return
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
  }, [vaultId])

  useEffect(() => {
    refetchVault()
  }, [])

  const getTitle = () =>
    action === 'name' ? t`Change Vault Name` : t`Change Vault Password`

  return (
    <ModifyVaultsModaContentWrapper
      title={getTitle()}
      isLoading={isLoading}
      secondaryAction={closeModal}
      primaryAction={handleSubmit(onSubmit)}
    >
      {action === 'name' && (
        <>
          <InputWrapper>
            <InputLabel>{t`Vault name`}</InputLabel>
            <InputPasswordPearPass
              {...register('name')}
              testID="change-vault-name-input"
              accessibilityLabel={t`Vault name`}
            />
          </InputWrapper>

          {isProtected && (
            <InputWrapper>
              <InputLabel>{t`Current password`}</InputLabel>
              <InputPasswordPearPass
                isPassword
                {...register('currentPassword')}
              />
            </InputWrapper>
          )}
        </>
      )}

      {action === 'password' && (
        <>
          {isProtected && (
            <InputWrapper>
              <InputLabel>{t`Current password`}</InputLabel>
              <InputPasswordPearPass
                isPassword
                {...register('currentPassword')}
              />
            </InputWrapper>
          )}

          <InputWrapper>
            <InputLabel>{t`New password`}</InputLabel>
            <InputPasswordPearPass isPassword {...register('newPassword')} />
          </InputWrapper>

          <InputWrapper>
            <InputLabel>{t`Repeat new password`}</InputLabel>
            <InputPasswordPearPass isPassword {...register('repeatPassword')} />
          </InputWrapper>
        </>
      )}
    </ModifyVaultsModaContentWrapper>
  )
}
