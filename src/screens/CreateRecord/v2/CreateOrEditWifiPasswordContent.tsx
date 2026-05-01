import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import {
  Button,
  InputField,
  MultiSlotInput,
  PasswordField,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Add, SyncLock, TrashOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Keyboard, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { FolderSelectField } from '../../../components/FolderSelectField'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { Layout } from '../../../containers/Layout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { logger } from '../../../utils/logger'
import { getPasswordIndicatorVariant } from '../../../utils/passwordPolicy'

type WifiRecord = {
  data?: {
    title?: string
    password?: string
    note?: string
    customFields?: Array<{ type: string; note: string }>
  }
  folder?: string
  isFavorite?: boolean
}

type Props = {
  initialRecord?: WifiRecord
  selectedFolder?: string
}

type CreatePasswordItemNavigation = {
  navigate: (
    screen: 'CreatePasswordItem',
    params: { onPasswordInsert: (value: string) => void }
  ) => void
  goBack: () => void
}

type FormValues = {
  title: string
  password: string
  note: string
  customFields: Array<{ type: string; note: string }>
  folder: string
}

export const CreateOrEditWifiPasswordContent = ({
  initialRecord,
  selectedFolder
}: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation<CreatePasswordItemNavigation>()
  const { setIsLoading, isLoading } = useLoadingContext()
  const { theme } = useTheme()
  const isEditing = !!initialRecord
  const actionLabel = isEditing ? t`Save Changes` : t`Add Item`

  const { createRecord } = useCreateRecord({
    onCompleted: () => navigation.goBack()
  })

  const { updateRecords } = useRecords({
    onCompleted: () => navigation.goBack()
  })

  const schema = Validator.object({
    title: Validator.string().required(t`Name is required`),
    password: Validator.string().required(t`Password is required`),
    note: Validator.string(),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Comment is required`)
      })
    ),
    folder: Validator.string()
  })

  const { handleSubmit, registerArray, values, setValue, errors } =
    useForm({
      initialValues: {
        title: initialRecord?.data?.title ?? '',
        password: initialRecord?.data?.password ?? '',
        note: initialRecord?.data?.note ?? '',
        customFields: initialRecord?.data?.customFields ?? [],
        folder: selectedFolder ?? initialRecord?.folder
      },
      validate: (formValues) => schema.validate(formValues)
    })

  const onError = (error: Error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const onSubmit = async (formValues: FormValues) => {
    if (isLoading) {
      return
    }

    const data = {
      type: RECORD_TYPES.WIFI_PASSWORD,
      folder: formValues.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: formValues.title,
        password: formValues.password,
        note: formValues.note,
        customFields: formValues.customFields
      }
    }

    try {
      setIsLoading(true)

      if (initialRecord) {
        await updateRecords([{ ...initialRecord, ...data }], onError)
      } else {
        await createRecord(data, onError)
      }

      setIsLoading(false)
    } catch (error: unknown) {
      logger.error(error)
      setIsLoading(false)
    }
  }

  const {
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  const handleFirstHiddenMessageChange = (value: string) => {
    setValue('customFields', [{ type: 'note', note: value }])
  }

  const openPasswordGenerator = () => {
    Keyboard.dismiss()
    navigation.navigate('CreatePasswordItem', {
      onPasswordInsert: (value: string) => setValue('password', value)
    })
  }

  return (
    <Layout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={isEditing ? t`Edit Wi-Fi Item` : t`New Wi-Fi Item`}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading || !values.title.trim() || !values.password.trim()}
          onClick={handleSubmit(onSubmit)}
        >
          {actionLabel}
        </Button>
      }
    >
      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Details`}
        </Text>

        <MultiSlotInput
          actions={
            <Button
              variant="tertiaryAccent"
              iconBefore={<SyncLock />}
              onClick={openPasswordGenerator}
            >
              {t`Generate Password`}
            </Button>
          }
          testID="credentials-multi-slot-input"
        >
          <InputField
            label={t`Wi-Fi Name`}
            value={values.title}
            placeholder={t`Enter Name of Network`}
            onChangeText={(val) => setValue('title', val)}
            testID="wifi-name-input-field"
          />
          <PasswordField
            label={t`Password`}
            placeholder={t`Enter Password`}
            value={values.password}
            onChangeText={(val) => setValue('password', val)}
            passwordIndicator={getPasswordIndicatorVariant(values.password)}
            testID="wifi-password-input-field"
          />
        </MultiSlotInput>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Additional`}
        </Text>

        <FolderSelectField
          value={values.folder}
          onChange={(val) => setValue('folder', val)}
        />

        <InputField
          label={t`Comment`}
          value={values.note}
          placeholder={t`Enter Comment`}
          onChangeText={(val) => setValue('note', val)}
          testID="comments-multi-slot-input-slot-0"
        />

        <MultiSlotInput
          actions={
            <Button
              size="small"
              variant="tertiaryAccent"
              iconBefore={<Add />}
              onClick={() => addCustomField({ type: 'note', note: '' })}
            >
              {t`Add Another Message`}
            </Button>
          }
          errorMessage={
            (
              errors as Record<string, { error?: { note?: string } }[]>
            )?.customFields?.find(Boolean)?.error?.note
          }
          testID="hidden-messages-multi-slot-input"
        >
          {(values.customFields as Array<{ type: string; note: string }>).length
            ? (values.customFields as Array<{ type: string; note: string }>).map(
              (field, index) => (
                <PasswordField
                  key={index}
                  label={t`Hidden Message`}
                  value={field.note ?? ''}
                  placeholder={t`Enter Hidden Message`}
                  onChangeText={(val) =>
                    setValue(`customFields[${index}].note`, val)
                  }
                  isGrouped
                  testID={`hidden-messages-multi-slot-input-slot-${index}`}
                  rightSlot={
                    (values.customFields as Array<{ type: string; note: string }>)
                      .length > 1 ? (
                      <Button
                        size="small"
                        variant="tertiary"
                        aria-label="Delete hidden message"
                        iconBefore={
                          <TrashOutlined color={theme.colors.colorTextPrimary} />
                        }
                        onClick={() => removeCustomField(index)}
                      />
                    ) : undefined
                  }
                />
              )
            )
            : (
              <PasswordField
                label={t`Hidden Message`}
                value=""
                placeholder={t`Enter Hidden Message`}
                onChangeText={handleFirstHiddenMessageChange}
                isGrouped
                testID="hidden-messages-multi-slot-input-slot-0"
              />
            )}
        </MultiSlotInput>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing24,
    paddingBottom: rawTokens.spacing24
  },
  section: {
    gap: rawTokens.spacing12
  }
})
