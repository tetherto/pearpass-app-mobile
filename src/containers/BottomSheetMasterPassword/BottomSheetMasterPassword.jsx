import { BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import {
  ButtonPrimary,
  ButtonSecondary
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { useUserData, useVaults } from 'pearpass-lib-vault/src'
import { Text, View, StyleSheet } from 'react-native'

import { ButtonBiometricLogin } from '../../components/ButtonBiometricLogin'
import { InputPasswordPearPass } from '../../libComponents/InputPasswordPearPass'

/**
 * @component
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm - Callback that receives { password } or { encryptionData }
 */
export const BottomSheetMasterPassword = ({ onClose, onConfirm }) => {
  const { t } = useLingui()

  const { logIn } = useUserData()
  const { initVaults } = useVaults()

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors, values } = useForm({
    initialValues: {
      password: ''
    },
    validate: (values) => schema.validate(values)
  })

  const submit = async (values) => {
    try {
      await logIn({ password: values.password })

      await onConfirm()
    } catch (error) {
      setErrors({
        password: typeof error === 'string' ? error : t`Invalid password`
      })
    }
  }

  const handleBiometricLogin = async (encryptionData) => {
    if (!encryptionData) {
      return
    }

    try {
      const { ciphertext, nonce, hashedPassword } = encryptionData
      await initVaults({ ciphertext, nonce, hashedPassword })
    } catch {
      return
    }

    await onConfirm({ encryptionData })
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.wrapper}>
        <Text
          style={styles.title}
        >{t`Are you sure to export your Vault?`}</Text>

        <Text style={styles.description}>
          {t`Exporting your vault may expose sensitive data. Proceed only on trusted devices.`}
        </Text>

        <View style={styles.fullWidth}>
          <InputPasswordPearPass
            placeholder={t`Insert Master password`}
            isPassword
            as={BottomSheetTextInput}
            {...register('password')}
          />
        </View>

        <ButtonBiometricLogin onBiometricLogin={handleBiometricLogin} />

        <View style={styles.buttonContainer}>
          <ButtonPrimary
            disabled={!values.password}
            onPress={handleSubmit(submit)}
            stretch
          >
            {t`Export`}
          </ButtonPrimary>
          <ButtonSecondary onPress={handleCancel} stretch>
            {t`Cancel`}
          </ButtonSecondary>
        </View>
      </View>
    </BottomSheetView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  wrapper: {
    gap: 25,
    alignItems: 'center'
  },
  fullWidth: {
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white.mode1,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.grey100.mode1,
    textAlign: 'center',
    lineHeight: 20
  },
  buttonContainer: {
    width: '100%',
    gap: 15
  }
})
