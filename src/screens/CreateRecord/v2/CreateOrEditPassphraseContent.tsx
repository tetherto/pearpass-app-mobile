import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { VALID_WORD_COUNTS } from '@tetherto/pearpass-lib-constants'
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
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { FolderSelectField } from '../../../components/FolderSelectField'
import { PassPhraseV2 } from '../../../containers/PassPhrase/PassPhraseV2'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { Layout } from '../../../containers/Layout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { logger } from '../../../utils/logger'
import { Add, TrashOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'

type PassphraseRecord = {
  data?: {
    title?: string
    passPhrase?: string
    note?: string
    customFields?: Array<{ type: string; note?: string }>
  }
  folder?: string
  isFavorite?: boolean
}

type Props = {
  initialRecord?: PassphraseRecord
  selectedFolder?: string
}

type FormValues = {
  title: string
  passPhrase: string
  note: string
  customFields: Array<{ type: string; note?: string }>
  folder: string
}

const parsePassphraseText = (text: string) =>
  text
    .trim()
    .split(/[-\s]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)

export const CreateOrEditPassphraseContent = ({
  initialRecord,
  selectedFolder
}: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation()
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
    title: Validator.string().required(t`Title is required`),
    passPhrase: Validator.string().required(t`Recovery phrase is required`),
    note: Validator.string(),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Comment is required`)
      })
    ),
    folder: Validator.string()
  })

  const { handleSubmit, registerArray, values, setValue, errors } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      passPhrase: initialRecord?.data?.passPhrase ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder
    },
    validate: (formValues) => {
      const validationErrors =
        (schema.validate(formValues) as Record<string, string | undefined>) ??
        {}
      const passphraseWordCount = parsePassphraseText(
        formValues.passPhrase ?? ''
      ).length

      if (!passphraseWordCount) {
        validationErrors.passPhrase = t`Recovery phrase is required`
      } else if (!VALID_WORD_COUNTS.includes(passphraseWordCount)) {
        validationErrors.passPhrase = t`Recovery phrase must contain 12 or 24 words`
      }

      return validationErrors
    }
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
      type: RECORD_TYPES.PASS_PHRASE,
      folder: formValues.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: formValues.title,
        passPhrase: formValues.passPhrase,
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

  return (
    <Layout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={
            isEditing
              ? t`Edit Recovery Phrase Item`
              : t`New Recovery Phrase Item`
          }
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading || !values.title.trim() || !values.passPhrase.trim()}
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
          onChangeText={(val) => setValue('title', val)}
          testID="title-field-input"
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Details`}
        </Text>

        <PassPhraseV2
          isCreateOrEdit
          value={values.passPhrase}
          onChange={(val) => setValue('passPhrase', val)}
          error={(errors as Record<string, string | undefined>)?.passPhrase}
        />

        <FolderSelectField
          value={values.folder}
          onChange={(val) => setValue('folder', val)}
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Additional`}
        </Text>

        <InputField
          label={t`Comment`}
          value={values.note}
          placeholder={t`Enter Comment`}
          onChangeText={(val) => setValue('note', val)}
          testID="comment-input-field"
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
          {(values.customFields as Array<{ type: string; note?: string }>).length
            ? (values.customFields as Array<{ type: string; note?: string }>).map(
              (field, index) => (
                <PasswordField
                  key={`${field.type}-${index}`}
                  label={t`Hidden Message`}
                  value={field.note ?? ''}
                  placeholder={t`Enter Hidden Message`}
                  onChangeText={(val) =>
                    setValue(`customFields[${index}].note`, val)
                  }
                  isGrouped
                  testID={`hidden-messages-multi-slot-input-slot-${index}`}
                  rightSlot={
                    (values.customFields as Array<{ type: string; note?: string }>).length > 1 ? (
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
                onChangeText={(val) =>
                  setValue('customFields', [{ type: 'note', note: val }])
                }
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
