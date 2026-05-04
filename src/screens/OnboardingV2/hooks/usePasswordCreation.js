import { useEffect, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
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
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../../constants/toast'
import { clearStaleVaultsDir } from '../../../utils/clearStaleVaultsDir'
import { logger } from '../../../utils/logger'
import {
  getPasswordIndicatorVariant,
  getPasswordValidationMessages,
  getPasswordsMatch,
  getPasswordStrengthMeta
} from '../../../utils/passwordPolicy'

export const usePasswordCreation = () => {
  const { t } = useLingui()
  const { createMasterPassword, logIn } = useUserData()
  const { initVaults } = useVaults()
  const { createVault } = useCreateVault()
  const { addDevice } = useVault()

  const mountedRef = useRef(true)
  const submitInFlightRef = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordIndicatorVariant, setPasswordIndicatorVariant] = useState(null)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  useEffect(
    () => () => {
      mountedRef.current = false
    },
    []
  )

  const errors = getPasswordValidationMessages(t)

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
    const result = getPasswordStrengthMeta(password, errors).result

    if (!result.success) {
      setErrors((prev) => ({ ...prev, password: result.errors[0] }))
      setPasswordIndicatorVariant(getPasswordIndicatorVariant(password, errors))
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
      const match = getPasswordsMatch(val, values.passwordConfirm)
      setPasswordsMatch(match)
      if (match) {
        setErrors((prev) => ({ ...prev, passwordConfirm: null }))
      }
    }
  }

  const handlePasswordConfirmChange = (val) => {
    setValue('passwordConfirm', val)

    if (values.password && val) {
      const match = getPasswordsMatch(values.password, val)
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
    if (submitInFlightRef.current) {
      return
    }

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
      submitInFlightRef.current = true
      setIsLoading(true)
      // If a previous attempt was killed mid-flow, the vaults dir on disk
      // is blind-encrypted with the old hashed password and would refuse
      // to open with the new one we're about to derive.
      await clearStaleVaultsDir()
      await createMasterPassword(passwordBuffer)

      // Create the default "Personal" vault right after master password setup
      const loginBuffer = stringToBuffer(password)
      await logIn({ password: loginBuffer })
      await initVaults({ password: loginBuffer })
      await createVault({ name: t`Personal` })
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
      Toast.show({
        type: 'baseToast',
        text1: t`Couldn't create your Master password. Please try again.`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
    } finally {
      submitInFlightRef.current = false
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
