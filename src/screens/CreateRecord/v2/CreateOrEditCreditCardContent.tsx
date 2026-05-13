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
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { DateField } from '../../../components/DateField'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { Layout } from '../../../containers/Layout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import { AttachmentFieldsV2 } from '../../../components/AttachmentFieldsV2'
import { FolderSelectField } from '../../../components/FolderSelectField'
import { adaptRegister } from './CreateOrEditLoginContent'
import { Add, TrashOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'

type CreditCardAttachment = {
  base64?: string
  id?: string | number
  name: string
}

type UploadedCreditCardAttachment = CreditCardAttachment & {
  base64: string
}

type CreditCardCustomField = {
  type: string
  note: string
}

type CreditCardRecord = {
  data?: {
    title?: string
    name?: string
    number?: string
    expireDate?: string
    securityCode?: string
    pinCode?: string
    note?: string
    customFields?: CreditCardCustomField[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: CreditCardAttachment[]
}

type Props = {
  initialRecord?: CreditCardRecord
  selectedFolder?: string
}

type FormValues = {
  title: string
  name: string
  number: string
  expireDate: string
  securityCode: string
  pinCode: string
  note: string
  customFields: CreditCardCustomField[]
  folder: string
  attachments: CreditCardAttachment[]
}

const isUploadedCreditCardAttachment = (
  attachment: CreditCardAttachment
): attachment is UploadedCreditCardAttachment => typeof attachment.base64 === 'string'

export const CreateOrEditCreditCardContent = ({
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
    name: Validator.string(),
    number: Validator.string(),
    expireDate: Validator.string(),
    securityCode: Validator.string().numeric(t`Should contain only numbers`),
    pinCode: Validator.string().numeric(t`Should contain only numbers`),
    note: Validator.string(),
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

  const { values, register, handleSubmit, setValue, registerArray, errors } =
    useForm<FormValues>({
      initialValues: {
        title: initialRecord?.data?.title ?? '',
        name: initialRecord?.data?.name ?? '',
        number: initialRecord?.data?.number ?? '',
        expireDate: initialRecord?.data?.expireDate ?? '',
        securityCode: initialRecord?.data?.securityCode ?? '',
        pinCode: initialRecord?.data?.pinCode ?? '',
        note: initialRecord?.data?.note ?? '',
        customFields: initialRecord?.data?.customFields ?? [],
        folder: selectedFolder ?? initialRecord?.folder,
        attachments: initialRecord?.attachments ?? []
      },
      validate: (formValues) => schema.validate(formValues)
    })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
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
      type: RECORD_TYPES.CREDIT_CARD,
      folder: formValues.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: formValues.title,
        name: formValues.name,
        number: formValues.number,
        expireDate: formValues.expireDate,
        securityCode: formValues.securityCode,
        pinCode: formValues.pinCode,
        note: formValues.note,
        customFields: formValues.customFields.filter((f) => f.note?.trim().length),
        attachments: convertBase64FilesToUint8(
          formValues.attachments.filter(isUploadedCreditCardAttachment)
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

  const {
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  const handleFirstHiddenMessageChange = (value: string) => {
    setValue('customFields', value ? [{ type: 'note', note: value }] : [])
  }

  const handleExpireDateChange = (inputValue: string) => {
    let value = inputValue.replace(/\D/g, '')

    if (value.length > 4) {
      value = value.slice(0, 4)
    }

    if (value.length > 2) {
      value = `${value.slice(0, 2)} ${value.slice(2)}`
    }

    setValue('expireDate', value)
  }

  const handleCardNumberChange = (inputValue: string) => {
    let value = inputValue.replace(/\D/g, '')

    if (value.length > 16) {
      value = value.slice(0, 16)
    }

    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(' ') ?? value
    }

    setValue('number', value)
  }

  const handleFileUpload = (file: CreditCardAttachment | null) => {
    if (!file) {
      return
    }

    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentReplace = (
    index: number,
    file: CreditCardAttachment | null
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
          title={isEditing ? t`Edit Credit Card Item` : t`New Credit Card Item`}
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
          placeholder={t`Enter Title`}
          testID="title-field-input"
          {...adaptRegister(register('title'))}
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Details`}
        </Text>

        <MultiSlotInput testID="card-details-multi-slot-input">
          <InputField
            label={t`Cardholder Name`}
            value={values.name}
            placeholder={t`Enter Name`}
            onChangeText={(val) => setValue('name', val)}
            testID="name-on-card-input-field"
          />
          <InputField
            label={t`Card Number`}
            value={values.number}
            placeholder={t`Enter Card Number`}
            onChangeText={handleCardNumberChange}
            testID="number-on-card-input-field"
          />
          <DateField
            label={t`Expiration Date`}
            value={values.expireDate}
            placeholder={t`Enter Expire Date`}
            onChangeText={handleExpireDateChange}
            pickerMode="month-year"
            testID="date-of-expire-input-field"
          />
          <PasswordField
            label={t`Security Code`}
            placeholder={t`Enter Security Code`}
            testID="security-code-input-field"
            {...adaptRegister(register('securityCode'))}
          />
          <PasswordField
            label={t`PIN`}
            placeholder={t`Enter PIN`}
            testID="pin-code-input-field"
            {...adaptRegister(register('pinCode'))}
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

        <AttachmentFieldsV2
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
          {values.customFields.length
            ? values.customFields.map(
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
                    values.customFields.length > 1 ? (
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
