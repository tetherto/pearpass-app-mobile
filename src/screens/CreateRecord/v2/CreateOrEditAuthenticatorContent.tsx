import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { RECORD_TYPES, useCreateRecord, useRecords } from '@tetherto/pearpass-lib-vault'
import {
  Button,
  InputField,
  MultiSlotInput,
  PasswordField,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Add, TrashOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { AttachmentFieldsV2 } from '../../../components/AttachmentFieldsV2'
import { OtpSecretScanButton } from './OtpSecretScanButton'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { Layout } from '../../../containers/Layout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'

type AuthenticatorAttachment = {
  base64?: string
  id?: string | number
  name: string
}

type UploadedAuthenticatorAttachment = AuthenticatorAttachment & {
  base64: string
}

type CustomField = {
  type: string
  note: string
}

type AuthenticatorRecord = {
  data?: {
    title?: string
    otpInput?: string
    otp?: { secret?: string }
    customFields?: CustomField[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: AuthenticatorAttachment[]
}

type Props = {
  initialRecord?: AuthenticatorRecord
  selectedFolder?: string
}

type FormValues = {
  title: string
  otpSecret: string
  customFields: CustomField[]
  folder: string
  attachments: AuthenticatorAttachment[]
}

const isUploadedAttachment = (
  a: AuthenticatorAttachment
): a is UploadedAuthenticatorAttachment => typeof a.base64 === 'string'

export const CreateOrEditAuthenticatorContent = ({
  initialRecord,
  selectedFolder
}: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { setIsLoading, isLoading } = useLoadingContext()
  const isEditing = !!initialRecord
  const actionLabel = isEditing ? t`Save Changes` : t`Add Item`

  const { createRecord } = useCreateRecord({
    onCompleted: () => navigation.goBack()
  })

  const { updateRecords } = useRecords({
    onCompleted: () => navigation.goBack()
  })

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`),
    otpSecret: Validator.string(),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string()
      })
    ),
    folder: Validator.string(),
    attachments: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    )
  })

  const { handleSubmit, registerArray, values, setValue, errors } =
    useForm<FormValues>({
      initialValues: {
        title: initialRecord?.data?.title ?? '',
        otpSecret:
          initialRecord?.data?.otpInput ??
          initialRecord?.data?.otp?.secret ??
          '',
        customFields: initialRecord?.data?.customFields ?? [],
        folder: selectedFolder ?? initialRecord?.folder ?? '',
        attachments: initialRecord?.attachments ?? []
      },
      validate: (formValues) => schema.validate(formValues) as Record<string, unknown>
    })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord: initialRecord as object
  })

  const {
    value: customFieldsList,
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  const handleFirstCustomFieldChange = (value: string) => {
    setValue('customFields', [{ type: 'note', note: value }])
  }

  const onError = (error: Error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const onSubmit = async (formValues: FormValues) => {
    if (isLoading) return

    const data = {
      type: RECORD_TYPES.LOGIN,
      folder: formValues.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        ...(initialRecord?.data ? initialRecord.data : {}),
        title: formValues.title,
        otpInput: formValues.otpSecret?.trim() || undefined,
        customFields: formValues.customFields,
        attachments: convertBase64FilesToUint8(
          formValues.attachments.filter(isUploadedAttachment)
        )
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

  const handleFileUpload = (file?: AuthenticatorAttachment | null) => {
    if (!file) return
    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentReplace = (index: number, file?: AuthenticatorAttachment | null) => {
    if (!file) return
    const updated = values.attachments.map((a: AuthenticatorAttachment, i: number) => (i === index ? file : a))
    setValue('attachments', updated)
  }

  const handleAttachmentDelete = (index: number) => {
    setValue('attachments', values.attachments.filter((_: AuthenticatorAttachment, i: number) => i !== index))
  }

  return (
    <Layout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={isEditing ? t`Edit Authenticator Code Item` : t`New Authenticator Code Item`}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading || !values.title.trim()}
          onClick={handleSubmit(onSubmit)}
        >
          {actionLabel}
        </Button>
      }
    >
      <View>
        <InputField
          label={t`Title`}
          value={values.title}
          placeholder={t`Enter Title`}
          onChangeText={(value) => setValue('title', value)}
          error={errors.title as string | undefined}
          testID="title-field"
        />
      </View>

      <View style={styles.section}>
        <PasswordField
          label={t`Authenticator Secret Key`}
          value={values.otpSecret}
          placeholder={t`Enter Secret Key (TOTP)`}
          onChangeText={(value) => setValue('otpSecret', value)}
          rightSlot={
            <OtpSecretScanButton onScanned={(secret) => setValue('otpSecret', secret)} />
          }
          testID="otp-secret-field"
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Additional`}
        </Text>

        <MultiSlotInput
          actions={
            <Button
              size="small"
              variant="tertiaryAccent"
              iconBefore={<Add />}
              onClick={() => addCustomField({ type: 'note', note: '' })}
            >
              {t`Add Another Note`}
            </Button>
          }
          errorMessage={
            (errors as Record<string, { error?: { note?: string } }[]>)?.customFields?.find(Boolean)?.error?.note
          }
          testID="notes-multi-slot-input"
        >
          {customFieldsList.length ? (
            customFieldsList.map((field, index) => (
              <InputField
                key={`${field.type}-${index}`}
                label={t`Comment`}
                value={field.note ?? ''}
                placeholder={t`Enter Comment`}
                onChangeText={(value) => setValue(`customFields[${index}].note`, value)}
                isGrouped
                testID={`notes-multi-slot-input-slot-${index}`}
                rightSlot={
                  customFieldsList.length > 1 ? (
                    <Button
                      size="small"
                      variant="tertiary"
                      aria-label={t`Delete note`}
                      iconBefore={<TrashOutlined color={theme.colors.colorTextPrimary} />}
                      onClick={() => removeCustomField(index)}
                    />
                  ) : undefined
                }
              />
            ))
          ) : (
            <InputField
              label={t`Comment`}
              value=""
              placeholder={t`Enter Comment`}
              onChangeText={handleFirstCustomFieldChange}
              isGrouped
              testID="notes-multi-slot-input-slot-0"
            />
          )}
        </MultiSlotInput>

        <AttachmentFieldsV2
          attachments={values.attachments}
          isEditing={isEditing}
          onAdd={handleFileUpload}
          onReplace={handleAttachmentReplace}
          onDelete={handleAttachmentDelete}
        />
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
