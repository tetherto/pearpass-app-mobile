import { t } from '@lingui/core/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { MOBILE_2FA_IMPORTS_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  Button,
  PasswordField,
  Radio,
  RadioOption,
  Text as TextComponent,
  ToggleSwitch,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { Layout } from 'src/containers/Layout'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { styles } from './styles'
import { ExportCodesFormat } from './types'

type FormValues = {
  password: string
  passwordConfirm: string
}

export const ExportCodes = () => {
  const navigation = useNavigation() as {
    navigate: (screen: string, params?: object) => void
    goBack: () => void
  }
  const { theme } = useTheme()

  const [selectedFormat, setSelectedFormat] = useState<ExportCodesFormat>(
    ExportCodesFormat.JSON
  )
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)

  const formMaxHeight = useSharedValue(0)
  const formOpacity = useSharedValue(0)

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`),
    passwordConfirm: Validator.string().required(t`Password is required`)
  })

  const { register, setErrors, setValue, values } = useForm({
    initialValues: { password: '', passwordConfirm: '' },
    validate: (vals: FormValues) => schema.validate(vals)
  })

  const resetForm = () => {
    setValue('password', '')
    setValue('passwordConfirm', '')
    setErrors({})
  }

  useEffect(() => {
    if (!MOBILE_2FA_IMPORTS_ENABLED) {
      navigation.goBack()
    }
  }, [navigation])

  useEffect(() => {
    const timing = { duration: 300, easing: Easing.inOut(Easing.ease) }
    formMaxHeight.value = withTiming(isPasswordProtected ? 300 : 0, timing)
    formOpacity.value = withTiming(isPasswordProtected ? 1 : 0, timing)
    if (!isPasswordProtected) {
      resetForm()
    }
  }, [isPasswordProtected])

  useEffect(() => {
    const { password, passwordConfirm } = values

    if (
      isPasswordProtected &&
      password &&
      passwordConfirm &&
      password !== passwordConfirm
    ) {
      setErrors({ passwordConfirm: t`Passwords do not match` })
    } else if (
      isPasswordProtected &&
      password &&
      passwordConfirm &&
      password === passwordConfirm
    ) {
      setErrors({})
    }
  }, [values, isPasswordProtected])

  const animatedFormStyle = useAnimatedStyle(() => ({
    maxHeight: formMaxHeight.value,
    opacity: formOpacity.value,
    overflow: 'hidden'
  }))

  if (!MOBILE_2FA_IMPORTS_ENABLED) return null

  const options: RadioOption[] = [
    {
      value: ExportCodesFormat.JSON,
      label: t`JSON (Recommended)`,
      description: t`JSON preserves all data, including custom fields, attachments, and metadata, ensuring a complete export`
    },
    {
      value: ExportCodesFormat.CSV,
      label: t`CSV`,
      description: t`CSV exports basic item data for spreadsheets, without custom fields, attachments, or metadata.`
    },
    {
      value: ExportCodesFormat.QR_CODE,
      label: t`QR Code`,
      description: t`Generate one or more QR codes that can be scanned by another authenticator app. Ideal for quick transfers, especially on mobile.`
    }
  ]

  const handleOptionSelect = (value: string) => {
    resetForm()
    setIsPasswordProtected(false)
    setSelectedFormat(value as ExportCodesFormat)
  }

  const isExportDisabled =
    isPasswordProtected &&
    (!values.password ||
      !values.passwordConfirm ||
      values.password !== values.passwordConfirm)

  const { error: passwordError, ...passwordRegisterProps } =
    register('password')
  const { error: passwordConfirmError, ...passwordConfirmRegisterProps } =
    register('passwordConfirm')

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Layout
        scrollable
        disableKeyboardAvoidance
        header={
          <BackScreenHeader title={t`Settings`} onBack={navigation.goBack} />
        }
        footer={
          <Button
            disabled={isExportDisabled}
            data-testid="export-codes-button"
          >
            {t`Export`}
          </Button>
        }
        contentStyle={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.captions}>
            <Text
              style={[styles.label, { color: theme.colors.colorTextPrimary }]}
            >
              {t`Export`}
            </Text>
            <TextComponent
              color={theme.colors.colorTextSecondary}
              variant="caption"
            >
              {t`Export your authenticator codes in a format you can back up or move to another app. You can optionally protect the export with a password for extra security.`}
            </TextComponent>
          </View>
          <Radio
            options={options}
            value={selectedFormat}
            onChange={handleOptionSelect}
          />
          {selectedFormat === ExportCodesFormat.JSON && (
            <View
              style={[
                styles.protectionWrapper,
                { borderColor: theme.colors.colorSurfaceDisabled }
              ]}
            >
              <ToggleSwitch
                checked={isPasswordProtected}
                onChange={setIsPasswordProtected}
                label={t`Protect with Password`}
                description={t`Protect your exported file so it can only be opened with the password you set`}
              />
              <Animated.View style={animatedFormStyle}>
                <View style={styles.formWrapper}>
                  <PasswordField
                    label={t`Password`}
                    placeholder={t`Enter file password`}
                    {...passwordRegisterProps}
                    error={passwordError ?? undefined}
                  />
                  <PasswordField
                    label={t`Repeat Password`}
                    placeholder={t`Repeat file password`}
                    {...passwordConfirmRegisterProps}
                    error={passwordConfirmError ?? undefined}
                  />
                </View>
              </Animated.View>
            </View>
          )}
        </View>
      </Layout>
    </KeyboardAvoidingView>
  )
}
