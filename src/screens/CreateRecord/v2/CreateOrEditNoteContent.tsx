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
import {
  Add,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { Layout } from '../../../containers/Layout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import { AttachmentFieldsV2 } from '../../../components/AttachmentFieldsV2'
import { FolderSelectField } from '../../../components/FolderSelectField'

type UploadedNoteAttachment = {
  base64: string
  id?: string | number
  name: string
}

type NoteAttachment = {
  base64?: string
  id?: string | number
  name: string
}

type NoteCustomField = {
  type: string
  note?: string
}

type NoteRecord = {
  data?: {
    title?: string
    note?: string
    customFields?: NoteCustomField[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: NoteAttachment[]
}

type Props = {
  initialRecord?: NoteRecord
  selectedFolder?: string
}

type FormValues = {
  title: string
  note: string
  customFields: NoteCustomField[]
  folder: string
  attachments: NoteAttachment[]
}

const isUploadedNoteAttachment = (
  attachment: NoteAttachment
): attachment is UploadedNoteAttachment => typeof attachment.base64 === 'string'

export const CreateOrEditNoteContent = ({
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
    note: Validator.string(),
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
      note: initialRecord?.data?.note ?? '',
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
    if (isLoading) {
      return
    }

    const data = {
      type: RECORD_TYPES.NOTE,
      folder: formValues.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: formValues.title,
        note: formValues.note,
        customFields: formValues.customFields,
        attachments: convertBase64FilesToUint8(
          formValues.attachments.filter(isUploadedNoteAttachment)
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

  const handleFileUpload = (file?: NoteAttachment | null) => {
    if (!file) {
      return
    }

    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentReplace = (index: number, file?: NoteAttachment | null) => {
    if (!file) {
      return
    }

    const updatedAttachments = values.attachments.map((attachment, idx) =>
      idx === index ? file : attachment
    )

    setValue('attachments', updatedAttachments)
  }

  const handleAttachmentDelete = (index: number) => {
    const updatedAttachments = values.attachments.filter(
      (_, idx) => idx !== index
    )
    setValue('attachments', updatedAttachments)
  }

  return (
    <Layout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={isEditing ? t`Edit Note Item` : t`New Note Item`}
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
          testID="title-field"
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Details`}
        </Text>

        <InputField
          label={t`Note`}
          value={values.note}
          placeholder={t`Enter Note`}
          onChangeText={(value) => setValue('note', value)}
          testID="note-field"
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Additional`}
        </Text>

        <FolderSelectField
          value={values.folder}
          onChange={(val) => setValue('folder', val)}
        />

        <AttachmentFieldsV2<NoteAttachment>
          attachments={values.attachments}
          isEditing={isEditing}
          onAdd={handleFileUpload}
          onReplace={handleAttachmentReplace}
          onDelete={handleAttachmentDelete}
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
          {customFieldsList.length ? (
            customFieldsList.map(
              (field, index) => (
                <PasswordField
                  key={`${field.type}-${index}`}
                  label={t`Hidden Message`}
                  value={field.note ?? ''}
                  placeholder={t`Enter Hidden Message`}
                  onChangeText={(value) =>
                    setValue(`customFields[${index}].note`, value)
                  }
                  isGrouped
                  testID={`hidden-messages-multi-slot-input-slot-${index}`}
                  rightSlot={
                    customFieldsList.length > 1 ? (
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
          ) : (
            <PasswordField
              label={t`Hidden Message`}
              value=""
              placeholder={t`Enter Hidden Message`}
              onChangeText={handleFirstCustomFieldChange}
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
