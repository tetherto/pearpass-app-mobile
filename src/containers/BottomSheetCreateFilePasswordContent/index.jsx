import { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  ButtonPrimary,
  ButtonSecondary
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider'
import { StyleSheet, Text, View } from 'react-native'

import { InputPasswordPearPass } from '../../libComponents/InputPasswordPearPass'

/**
 * @component
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 */
export const BottomSheetCreateFilePasswordContent = ({
  onClose,
  onConfirm
}) => {
  const { t } = useLingui()

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`),
    confirmPassword: Validator.string().required(
      t`Repeating password is required`
    )
  })

  const { register, handleSubmit, setErrors, values } = useForm({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validate: (values) => schema.validate(values)
  })

  const submit = async (values) => {
    if (values.password !== values.confirmPassword) {
      setErrors({
        confirmPassword: t`Passwords do not match`
      })
      return
    }

    try {
      await onConfirm(values.password)
    } catch (error) {
      setErrors({
        password: typeof error === 'string' ? error : t`Invalid password`
      })
    }
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.wrapper}>
        <Text
          style={styles.title}
        >{t`Are you sure to encrypt your Vault?`}</Text>

        <Text style={styles.description}>
          {t`This will create a password for your exported file.`}
        </Text>

        <View style={styles.fullWidth}>
          <InputPasswordPearPass
            placeholder={t`Set file password`}
            isPassword
            as={BottomSheetTextInput}
            testID="encrypt-file-modal-password-input"
            {...register('password')}
          />
          <InputPasswordPearPass
            placeholder={t`Repeat file password`}
            isPassword
            as={BottomSheetTextInput}
            testID="encrypt-file-modal-confirmPassword-input"
            {...register('confirmPassword')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonPrimary
            disabled={!values.password}
            onPress={handleSubmit(submit)}
            stretch
          >
            {t`Encrypt`}
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
    width: '100%',
    gap: 10
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
