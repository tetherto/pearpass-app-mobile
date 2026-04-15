import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  AlertMessage,
  Button,
  PageHeader,
  PasswordField,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { ReportProblem } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useUserData } from '@tetherto/pearpass-lib-vault'
import {
  clearBuffer,
  stringToBuffer
} from '@tetherto/pearpass-lib-vault/src/utils/buffer'
import {
  checkPasswordStrength,
  validatePasswordChange
} from '@tetherto/pearpass-utils-password-check'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { Layout } from 'src/containers/Layout'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'

import { logger } from '../../../utils/logger'

const STRENGTH_TO_INDICATOR = {
  vulnerable: 'vulnerable',
  weak: 'decent',
  safe: 'strong'
}

const getPasswordStrength = (value) => {
  if (!value?.length) {
    return undefined
  }

  const { type } = checkPasswordStrength(value)
  return STRENGTH_TO_INDICATOR[type] ?? undefined
}

const getRepeatIndicator = (newPassword, repeatPassword) => {
  if (!repeatPassword) return undefined
  return newPassword === repeatPassword ? 'match' : 'vulnerable'
}

export const MasterPassword = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
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

  const { values, register, handleSubmit, setErrors, setValue } = useForm({
    initialValues: { currentPassword: '', newPassword: '', repeatPassword: '' },
    validate: (values) => schema.validate(values)
  })

  const currentPasswordField = register('currentPassword')
  const newPasswordField = register('newPassword')
  const repeatPasswordField = register('repeatPassword')

  const isDisabled =
    !values.currentPassword ||
    !values.newPassword ||
    !values.repeatPassword ||
    values.newPassword !== values.repeatPassword

  const onSubmit = async ({ currentPassword, newPassword, repeatPassword }) => {
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
      setErrors({ [result.field]: result.error })
      if (result.field === 'newPassword') {
        setValue('repeatPassword', '')
      }
      return
    }

    const newPasswordBuffer = stringToBuffer(newPassword)
    const currentPasswordBuffer = stringToBuffer(currentPassword)

    try {
      setIsLoading(true)
      await updateMasterPassword({
        newPassword: newPasswordBuffer,
        currentPassword: currentPasswordBuffer
      })

      setValue('currentPassword', '')
      setValue('newPassword', '')
      setValue('repeatPassword', '')

      Toast.show({
        type: 'baseToast',
        text1: t`Master password updated successfully`,
        position: 'bottom',
        bottomOffset: 100
      })
    } catch (error) {
      logger.error('Error updating master password:', error)
      setErrors({ currentPassword: t`Invalid password` })
    } finally {
      setIsLoading(false)
      clearBuffer(newPasswordBuffer)
      clearBuffer(currentPasswordBuffer)
    }
  }

  return (
    <Layout
      scrollable
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.scrollContent}
      footer={
        <Button
          variant="primary"
          fullWidth
          disabled={isDisabled || isLoading}
          isLoading={isLoading}
          onClick={handleSubmit(onSubmit)}
        >
          {t`Change Password`}
        </Button>
      }
    >
      <PageHeader
        title={t`Master Password`}
        subtitle={t`Manage the password that protects your app.`}
      />

      <View style={styles.fieldsContainer}>
        <PasswordField
          label={t`Current Password`}
          value={currentPasswordField.value}
          placeholderText={t`Enter Current Password`}
          onChangeText={currentPasswordField.onChange}
          variant={currentPasswordField.error ? 'error' : 'default'}
          errorMessage={currentPasswordField.error}
          passwordIndicator={getPasswordStrength(currentPasswordField.value)}
        />

        <PasswordField
          label={t`New Password`}
          value={newPasswordField.value}
          placeholderText={t`Enter New Password`}
          onChangeText={newPasswordField.onChange}
          variant={newPasswordField.error ? 'error' : 'default'}
          errorMessage={newPasswordField.error}
          passwordIndicator={getPasswordStrength(newPasswordField.value)}
        />

        <PasswordField
          label={t`Repeat New Password`}
          value={repeatPasswordField.value}
          placeholderText={t`Repeat New Password`}
          onChangeText={repeatPasswordField.onChange}
          variant={repeatPasswordField.error ? 'error' : 'default'}
          errorMessage={repeatPasswordField.error}
          passwordIndicator={getRepeatIndicator(
            newPasswordField.value,
            repeatPasswordField.value
          )}
        />

        <AlertMessage
          variant="warning"
          size="small"
          description={t`Don't forget your Master password. It's the only way to access your vault. We can't help recover it. Back it up securely.`}
          icon={<ReportProblem />}
        />
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: rawTokens.spacing24,
    gap: rawTokens.spacing20,
    flexGrow: 1
  },
  fieldsContainer: {
    gap: rawTokens.spacing16
  }
})
