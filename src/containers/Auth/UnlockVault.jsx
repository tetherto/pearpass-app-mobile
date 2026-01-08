import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useVault, useVaults } from 'pearpass-lib-vault'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text
} from 'react-native'

import {
  ButtonPrimary,
  ButtonSecondary,
  InputPasswordPearPass
} from '../../libComponents'

export const UnlockVault = ({ vaultId }) => {
  const navigation = useNavigation()
  const { t } = useLingui()

  const [isLoading, setIsLoading] = useState(false)

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`)
  })

  const { refetch: refetchVault } = useVault()

  const { data } = useVaults()

  const selectedVault = useMemo(
    () => data.find((vault) => vault?.id === vaultId),
    [data, vaultId]
  )

  const { register, handleSubmit, setErrors } = useForm({
    initialValues: {
      password: ''
    },
    validate: (values) => schema.validate(values)
  })

  const onSubmit = async (values) => {
    if (!vaultId) {
      return
    }

    try {
      setIsLoading(true)

      await refetchVault(vaultId, { password: values.password })

      setIsLoading(false)
      navigation.replace('MainTabNavigator')
    } catch (error) {
      setIsLoading(false)
      setErrors({
        password: typeof error === 'string' ? error : t`Invalid password`
      })
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      testID="unlock-vault-screen"
      accessibilityLabel="unlock-vault-screen"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 40
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        testID="unlock-vault-scroll"
        accessibilityLabel="unlock-vault-scroll"
      >
        <View
          style={{
            width: '100%',
            maxWidth: 400,
            alignItems: 'center',
            gap: 20
          }}
          testID="unlock-vault-form-container"
          accessibilityLabel="unlock-vault-form-container"
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: colors.white.mode1,
              textAlign: 'center',
              marginBottom: 10,
              paddingHorizontal: 20
            }}
            testID="unlock-vault-title"
            accessibilityLabel="unlock-vault-title"
          >
            {t`Unlock with the ${selectedVault?.name ?? selectedVault?.id} Vault password`}
          </Text>

          <View style={{ width: '100%' }}>
              <InputPasswordPearPass
                testID="unlock-vault-password-input"
                accessibilityLabel="unlock-vault-password-input"
                placeholder={t`Vault password`}
                {...register('password')}
                isPassword
              />
          </View>

          <View style={{ width: '100%', gap: 10 }}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary400.mode1} testID="unlock-vault-loading" accessibilityLabel="unlock-vault-loading" />
            ) : (
              <>
                  <ButtonPrimary 
                    testID="unlock-vault-continue-button"
                    accessibilityLabel="Continue"
                    stretch 
                    onPress={handleSubmit(onSubmit)}>
                    {t`Continue`}
                  </ButtonPrimary>

                  <ButtonSecondary
                    testID="unlock-vault-select-vaults-button"
                    accessibilityLabel="Select Vaults"
                    stretch
                    onPress={() =>
                      navigation.navigate('Welcome', { state: 'selectOrLoad' })
                    }
                  >
                    {t`Select Vaults`}
                  </ButtonSecondary>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
