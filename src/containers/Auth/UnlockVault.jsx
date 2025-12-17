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
      testID="unlock-vault-screen"
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        testID="unlock-vault-scroll"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 40
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          testID="unlock-vault-form-container"
          style={{
            width: '100%',
            maxWidth: 400,
            alignItems: 'center',
            gap: 20
          }}
        >
          <Text
            testID="unlock-vault-title"
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: colors.white.mode1,
              textAlign: 'center',
              marginBottom: 10,
              paddingHorizontal: 20
            }}
          >
            {t`Unlock with the ${selectedVault?.name ?? selectedVault?.id} Vault password`}
          </Text>

          <View style={{ width: '100%' }}>
            <InputPasswordPearPass
              testID="unlock-vault-password-input"
              placeholder={t`Vault password`}
              {...register('password')}
              isPassword
            />
          </View>

          <View
            testID="unlock-vault-actions-container" 
            style={{ width: '100%', gap: 10 }}>
            {isLoading ? (
              <ActivityIndicator testID="unlock-vault-loading" size="small" color={colors.primary400.mode1} />
            ) : (
              <>
                <ButtonPrimary testID="unlock-vault-continue-button" stretch onPress={handleSubmit(onSubmit)}>
                  {t`Continue`}
                </ButtonPrimary>

                <ButtonSecondary
                  testID="unlock-vault-select-vaults-button"
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
