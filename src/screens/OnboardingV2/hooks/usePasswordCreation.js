import { useEffect, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import {
  useCreateVault,
  useUserData,
  useVault,
  useVaults
} from 'pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from 'pearpass-lib-vault/src/utils/buffer'
import { checkPasswordStrength } from 'pearpass-utils-password-check'
import { Platform } from 'react-native'

import { logger } from '../../../utils/logger'

const STRENGTH_TO_INDICATOR = {
  vulnerable: 'vulnerable',
  weak: 'decent',
  safe: 'strong'
}

export const usePasswordCreation = () => {
  const { t } = useLingui()
  const { createMasterPassword, logIn } = useUserData()
  const { initVaults } = useVaults()
  const { createVault } = useCreateVault()
  const { addDevice } = useVault()

  const mountedRef = useRef(true)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordIndicatorVariant, setPasswordIndicatorVariant] = useState(null)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  useEffect(
    () => () => {
      mountedRef.current = false
    },
    []
  )

  const errors = {
    minLength: t`Password must be at least 8 characters long`,
    hasLowerCase: t`Password must contain at least one lowercase letter`,
    hasUpperCase: t`Password must contain at least one uppercase letter`,
    hasNumbers: t`Password must contain at least one number`,
    hasSymbols: t`Password must contain at least one special character`
  }

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`),
    passwordConfirm: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors, setValue, values } = useForm({
    initialValues: {
      password: '',
      passwordConfirm: ''
    },
    validate: (formValues) => schema.validate(formValues)
  })

  const { onChange: onPasswordChange, ...passwordRegisterProps } =
    register('password')

  const { ...passwordConfirmRegisterProps } = register('passwordConfirm')

  const validateMasterPassword = (password) => {
    const result = checkPasswordStrength(password, { errors })

    if (!result.success) {
      setErrors((prev) => ({ ...prev, password: result.errors[0] }))
      setPasswordIndicatorVariant(
        STRENGTH_TO_INDICATOR[result.type] || 'vulnerable'
      )
      return false
    }

    setPasswordIndicatorVariant('strong')
    setErrors((prev) => ({ ...prev, password: null }))
    return true
  }

  const handlePasswordChange = (val) => {
    onPasswordChange(val)

    if (!val) {
      setErrors((prev) => ({ ...prev, password: null }))
      setPasswordIndicatorVariant(null)
      setPasswordsMatch(false)
      return
    }

    validateMasterPassword(val)

    if (values.passwordConfirm) {
      setPasswordsMatch(val === values.passwordConfirm)
    }
  }

  const handlePasswordConfirmChange = (val) => {
    setValue('passwordConfirm', val)

    if (values.password && val) {
      const match = values.password === val
      setPasswordsMatch(match)

      if (match) {
        setErrors((prev) => ({ ...prev, passwordConfirm: null }))
      } else {
        setErrors((prev) => ({
          ...prev,
          passwordConfirm: t`Passwords do not match`
        }))
      }
    } else {
      setPasswordsMatch(false)
      setErrors((prev) => ({ ...prev, passwordConfirm: null }))
    }
  }

  const isValid = passwordIndicatorVariant === 'strong'

  const canSubmit = isValid && passwordsMatch

  const submit = async (onSuccess) => {
    const password = values.password
    const passwordConfirm = values.passwordConfirm

    const isPasswordValid = validateMasterPassword(password)
    if (!isPasswordValid) {
      setValue('passwordConfirm', '')
      return
    }

    if (password !== passwordConfirm) {
      setErrors({ passwordConfirm: t`Passwords do not match` })
      return
    }

    const passwordBuffer = stringToBuffer(password)

    try {
      setIsLoading(true)
      await createMasterPassword(passwordBuffer)

      // Create the default "Personal vault" right after master password setup
      const loginBuffer = stringToBuffer(password)
      await logIn({ password: loginBuffer })
      await initVaults({ password: loginBuffer })
      await createVault({ name: t`Personal vault` })
      await addDevice(Platform.OS + ' ' + Platform.Version)
      clearBuffer(loginBuffer)

      clearBuffer(passwordBuffer)
      if (mountedRef.current) {
        setIsLoading(false)
      }
      onSuccess?.(password)
    } catch (error) {
      logger.error(error)
      clearBuffer(passwordBuffer)
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  return {
    passwordRegisterProps,
    passwordConfirmRegisterProps,
    handlePasswordChange,
    handlePasswordConfirmChange,
    passwordIndicatorVariant,
    passwordsMatch,
    isValid,
    canSubmit,
    isLoading,
    submit,
    handleSubmit,
    values,
    setErrors
  }
}
