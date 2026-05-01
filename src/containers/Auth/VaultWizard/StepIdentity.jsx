import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  Button,
  InputField,
  PageHeader,
  ToggleSwitch,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { Keyboard, StyleSheet, View } from 'react-native'

import {
  getPasswordIndicatorVariant,
  getPasswordStrengthMeta,
  getPasswordValidationMessages,
  getPasswordsMatch
} from '../../../utils/passwordPolicy'
import { unsupportedFeaturesEnabled } from '../../../utils/unsupportedFeatures'
import { Layout } from '../../Layout'
import { BackScreenHeader } from '../../ScreenHeader/BackScreenHeader'
import { ConfirmablePasswordFields } from '../shared/ConfirmablePasswordFields'

export const StepIdentity = ({ initialData, onSubmit, onBack }) => {
  const { t } = useLingui()
  const isVaultPasswordEnabled = unsupportedFeaturesEnabled()

  const [name, setName] = useState(initialData?.name ?? '')
  const [usePassword, setUsePassword] = useState(
    initialData?.usePassword ?? false
  )
  const [password, setPassword] = useState(initialData?.password ?? '')
  const [passwordConfirm, setPasswordConfirm] = useState(
    initialData?.passwordConfirm ?? ''
  )

  const trimmedName = name.trim()
  const passwordErrors = useMemo(() => getPasswordValidationMessages(t), [t])
  const passwordStrengthMeta = useMemo(
    () => getPasswordStrengthMeta(password, passwordErrors),
    [password, passwordErrors]
  )
  const passwordsMatch = getPasswordsMatch(password, passwordConfirm)
  const passwordError =
    usePassword &&
    password.length > 0 &&
    !passwordStrengthMeta.result?.success &&
    passwordStrengthMeta.result?.errors?.[0]
  const passwordConfirmError =
    usePassword &&
    passwordConfirm.length > 0 &&
    !passwordsMatch &&
    t`Passwords do not match`
  const canSubmit =
    trimmedName.length > 0 &&
    (!usePassword || (passwordStrengthMeta.result?.success && passwordsMatch))

  const handleTogglePassword = (checked) => {
    setUsePassword(checked)

    if (!checked) {
      setPassword('')
      setPasswordConfirm('')
    }
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      return
    }

    Keyboard.dismiss()
    onSubmit({
      name: trimmedName,
      usePassword,
      password: usePassword ? password : '',
      passwordConfirm: usePassword ? passwordConfirm : ''
    })
  }

  return (
    <Layout
      scrollable
      header={<BackScreenHeader title={t`Create New Vault`} onBack={onBack} />}
      contentStyle={styles.content}
      footer={
        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={!canSubmit}
          data-testid="new-vault-submit-button"
        >
          {t`Create New Vault`}
        </Button>
      }
    >
      <PageHeader
        title={t`Create New Vault`}
        subtitle={
          isVaultPasswordEnabled
            ? t`Create your vault by giving it a name. Add an optional vault password if you want an extra layer of protection on top of your master password.`
            : t`Create your vault by giving it a name.`
        }
        subtitleTestID="new-vault-subtitle"
      />

      <View style={styles.fields}>
        <InputField
          label={t`Vault Name`}
          placeholder={t`Enter Name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          testID="new-vault-name-input"
        />

        {isVaultPasswordEnabled ? (
          <>
            <ToggleSwitch
              checked={usePassword}
              onChange={handleTogglePassword}
              label={t`Set Vault Password`}
              description={t`Add extra password on top of your master password`}
              aria-label={t`Set Vault Password`}
              data-testid="new-vault-password-toggle"
            />

            {usePassword ? (
              <ConfirmablePasswordFields
                testID="new-vault-password-form"
                passwordField={{
                  label: t`Password`,
                  placeholderText: t`Enter vault password`,
                  value: password,
                  onChangeText: setPassword,
                  passwordIndicator: getPasswordIndicatorVariant(
                    password,
                    passwordErrors
                  ),
                  variant: passwordError ? 'error' : 'default',
                  errorMessage: passwordError,
                  testID: 'new-vault-password-input'
                }}
                confirmPasswordField={{
                  label: t`Repeat Password`,
                  placeholderText: t`Repeat vault password`,
                  value: passwordConfirm,
                  onChangeText: setPasswordConfirm,
                  passwordIndicator: passwordsMatch ? 'match' : undefined,
                  variant: passwordConfirmError ? 'error' : 'default',
                  errorMessage: passwordConfirmError,
                  testID: 'new-vault-password-confirm-input'
                }}
              />
            ) : null}
          </>
        ) : null}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: rawTokens.spacing24,
    gap: rawTokens.spacing20,
    flexGrow: 1
  },
  fields: {
    gap: rawTokens.spacing16
  }
})
