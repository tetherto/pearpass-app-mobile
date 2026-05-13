import { t } from '@lingui/core/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  ContextMenu,
  PasswordField,
  Radio,
  RadioOption,
  Text as TextComponent,
  ToggleSwitch,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  getVaultById,
  getMasterEncryption,
  listRecords,
  useVault
} from '@tetherto/pearpass-lib-vault'
import { useCallback, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { useAutoLockContext } from 'src/context/AutoLockContext'
import { styles } from './styles'
import { Layout } from 'src/containers/Layout'
import { BottomSheetReauthContent } from 'src/containers/BottomSheetReauthContent'
import {
  handleExportCSVPerVault,
  handleExportJsonPerVault
} from '../Settings/TabExport/utils/exportVaults'

export const ExportItems = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { data: currentVault, refetch: refetchVault } = useVault()
  const { setShouldBypassAutoLock } = useAutoLockContext() as {
    setShouldBypassAutoLock: (value: boolean) => void
  }

  const [selectedFormat, setSelectedFormat] = useState('json')
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)

  const formMaxHeight = useSharedValue(0)
  const formOpacity = useSharedValue(0)

  useEffect(() => {
    const timing = { duration: 300, easing: Easing.inOut(Easing.ease) }
    formMaxHeight.value = withTiming(isPasswordProtected ? 300 : 0, timing)
    formOpacity.value = withTiming(isPasswordProtected ? 1 : 0, timing)
    if (!isPasswordProtected) {
      resetForm()
    }
  }, [isPasswordProtected])

  const animatedFormStyle = useAnimatedStyle(() => ({
    maxHeight: formMaxHeight.value,
    opacity: formOpacity.value,
    overflow: 'hidden'
  }))

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`),
    passwordConfirm: Validator.string().required(t`Password is required`)
  })

  const { register, setErrors, setValue, values } = useForm({
    initialValues: {
      password: '',
      passwordConfirm: ''
    },
    validate: (values) => schema.validate(values)
  })

  const resetForm = () => {
    setValue('password', '')
    setValue('passwordConfirm', '')
    setErrors({})
  }

  useEffect(() => {
    refetchVault()
  }, [])

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

  const fetchUnprotectedVault = async (vaultId: string) => {
    const vault = await getVaultById(vaultId)
    const records = (await listRecords()) ?? []
    return { ...vault, records }
  }

  const handleSubmitExport = useCallback(
    async (
      vaultsToExport: unknown[],
      encryptionPassword: string | null = null
    ) => {
      try {
        let isSuccess = false

        if (selectedFormat === 'json') {
          isSuccess = await handleExportJsonPerVault(
            vaultsToExport,
            encryptionPassword
          )
        } else if (selectedFormat === 'csv') {
          isSuccess = await handleExportCSVPerVault(vaultsToExport)
        }

        if (isSuccess) {
          resetForm()
          Toast.show({
            type: 'success',
            text1: t`Export successful`,
            text2: t`Vault is ready to be exported`,
            position: 'bottom',
            bottomOffset: 100
          })
        } else {
          Toast.show({
            type: 'info',
            text1: t`No data to export`,
            text2: t`The selected vault contain no records to export`,
            position: 'bottom',
            bottomOffset: 100
          })
        }
      } catch (error: unknown) {
        Toast.show({
          type: 'error',
          text1: t`Export failed`,
          text2:
            (error instanceof Error && error.message) ||
            t`An error occurred while exporting your data`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    },
    [selectedFormat]
  )

  const handleExport = useCallback(async () => {
    try {
      setShouldBypassAutoLock(true)
      const currentVaultId = currentVault?.id
      const currentEncryption = await getMasterEncryption()
      const vaultData = await fetchUnprotectedVault(currentVaultId)

      refetchVault(currentVaultId, currentEncryption)

      const encryptionPassword = isPasswordProtected ? values.password : null
      await handleSubmitExport([vaultData], encryptionPassword)
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: t`Export failed`,
        text2:
          (error instanceof Error && error.message) ||
          t`An error occurred while exporting your data`,
        position: 'bottom',
        bottomOffset: 100
      })
    } finally {
      setShouldBypassAutoLock(false)
    }
  }, [
    currentVault,
    isPasswordProtected,
    values.password,
    handleSubmitExport,
    setShouldBypassAutoLock,
    refetchVault
  ])

  const options: RadioOption[] = [
    {
      value: 'json',
      label: 'JSON (Recommended)',
      description:
        'JSON preserves all data, including custom fields and metadata, ensuring a complete export'
    },
    {
      value: 'csv',
      label: 'CSV',
      description:
        'CSV exports basic item data for spreadsheets, without custom fields, attachments, or metadata.'
    }
  ]

  const handleOptionSelect = (value: string) => {
    resetForm()
    setIsPasswordProtected(false)
    setSelectedFormat(value)
  }

  const { error: passwordError, ...passwordRegisterProps } =
    register('password')
  const { error: passwordConfirmError, ...passwordConfirmRegisterProps } =
    register('passwordConfirm')

  return (
    <Layout
      header={
        <BackScreenHeader title={t`Settings`} onBack={navigation.goBack} />
      }
      footer={
        <ContextMenu
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          trigger={
            <Button
              disabled={
                isPasswordProtected &&
                (!values.password ||
                  !values.passwordConfirm ||
                  values.password !== values.passwordConfirm)
              }
            >{t`Export`}</Button>
          }
        >
          <BottomSheetReauthContent
            onConfirm={async () => {
              handleExport()
            }}
          />
        </ContextMenu>
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
            {t`Download the data in the desired format and optionally protect the file with a password for securely backing up or transferring your data.`}
          </TextComponent>
        </View>
        <Radio
          options={options}
          value={selectedFormat}
          onChange={handleOptionSelect}
        />
        {selectedFormat === 'json' && (
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
  )
}
