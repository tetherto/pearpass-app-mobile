import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { RECORD_TYPES, useCreateRecord, useRecords } from '@tetherto/pearpass-lib-vault'
import {
  Button,
  InputField,
  MultiSlotInput,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Add, TrashOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from '../../../containers/ScreenLayout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import { AttachmentFieldsV2 } from '../../../components/AttachmentFieldsV2'

type UploadedCustomAttachment = {
  base64: string
  id?: string | number
  name: string
}

type CustomAttachment = {
  base64?: string
  id?: string | number
  name: string
}

type CustomFieldValue = {
  type: string
  note?: string
}

type CustomContentRecord = {
  data?: {
    title?: string
    customFields?: CustomFieldValue[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: CustomAttachment[]
}

type Props = {
  initialRecord?: CustomContentRecord
  selectedFolder?: string
}

type FormValues = {
  title: string
  folder: string
  customFields: CustomFieldValue[]
  attachments: CustomAttachment[]
}

const isUploadedCustomAttachment = (
  attachment: CustomAttachment
): attachment is UploadedCustomAttachment => typeof attachment.base64 === 'string'

export const CreateOrEditCustomContent = ({
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

  const onError = (error: Error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Comment is required`)
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
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder ?? '',
      attachments: initialRecord?.attachments ?? []
    },
    validate: (formValues) => schema.validate(formValues)
  })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  const {
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  const onSubmit = async (formValues: FormValues) => {
    if (isLoading) {
      return
    }

    const data = {
      type: RECORD_TYPES.CUSTOM,
      folder: formValues.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: formValues.title,
        customFields: formValues.customFields,
        attachments: convertBase64FilesToUint8(
          formValues.attachments.filter(isUploadedCustomAttachment)
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

  const handleFirstCustomFieldChange = (value: string) => {
    setValue('customFields', [{ type: 'note', note: value }])
  }

  const handleFileUpload = (file?: CustomAttachment | null) => {
    if (!file) {
      return
    }

    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentReplace = (
    index: number,
    file?: CustomAttachment | null
  ) => {
    if (!file) {
      return
    }

    const updatedAttachments = values.attachments.map((attachment, idx) =>
      idx === index ? file : attachment
    )

    setValue('attachments', updatedAttachments)
  }

  const handleAttachmentDelete = (index: number) => {
    setValue(
      'attachments',
      values.attachments.filter((_, idx) => idx !== index)
    )
  }

  return (
    <ScreenLayout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.content}
      containerStyle={{
        flex: 1,
        backgroundColor: theme.colors.colorBackground
      }}
      header={
        <BackScreenHeader
          title={isEditing ? t`Edit Other Item` : t`New Other Item`}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
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
          testID="title-field"
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Details`}
        </Text>

        <MultiSlotInput
          actions={
            <Button
              size="small"
              variant="tertiary"
              iconBefore={<Add />}
              onClick={() => addCustomField({ type: 'note', note: '' })}
            >
              {t`Add Another Field`}
            </Button>
          }
          errorMessage={
            (
              errors as Record<string, { error?: { note?: string } }[]>
            )?.customFields?.find(Boolean)?.error?.note
          }
          testID="custom-fields-multi-slot-input"
        >
          {values.customFields.length
            ? values.customFields.map(
                (field, index) => (
                  <InputField
                    key={`${field.type}-${index}`}
                    label={t`Other Field`}
                    value={field.note ?? ''}
                    placeholder={t`Enter Value`}
                    onChangeText={(value) =>
                      setValue(`customFields[${index}].note`, value)
                    }
                    isGrouped
                    testID={`custom-fields-multi-slot-input-slot-${index}`}
                    rightSlot={
                      values.customFields.length > 1 ? (
                        <Button
                          size="small"
                          variant="tertiary"
                          aria-label="Delete custom field"
                          iconBefore={
                            <TrashOutlined
                              color={theme.colors.colorTextPrimary}
                            />
                          }
                          onClick={() => removeCustomField(index)}
                        />
                      ) : undefined
                    }
                  />
                )
              )
            : (
                <InputField
                  label={t`Other Field`}
                  value=""
                  placeholder={t`Enter Value`}
                  onChangeText={handleFirstCustomFieldChange}
                  isGrouped
                  testID="custom-fields-multi-slot-input-slot-0"
                />
              )}
        </MultiSlotInput>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Additional`}
        </Text>

        <AttachmentFieldsV2<CustomAttachment>
          attachments={values.attachments}
          isEditing={isEditing}
          onAdd={handleFileUpload}
          onReplace={handleAttachmentReplace}
          onDelete={handleAttachmentDelete}
        />
      </View>
    </ScreenLayout>
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
