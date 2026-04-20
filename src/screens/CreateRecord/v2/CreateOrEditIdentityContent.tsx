import { useMemo } from 'react'

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
  DateField,
  MultiSlotInput,
  PasswordField,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Add, TrashOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { Layout } from '../../../containers/Layout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import { AttachmentFieldsV2 } from '../../../components/AttachmentFieldsV2'

type AttachmentFile = {
  base64: string
  id?: string | number
  name: string
}

type IdentityRecord = {
  data?: {
    title?: string
    fullName?: string
    email?: string
    phoneNumber?: string
    address?: string
    zip?: string
    city?: string
    region?: string
    country?: string
    note?: string
    customFields?: Array<{ type: string; note?: string }>
    passportFullName?: string
    passportNumber?: string
    passportIssuingCountry?: string
    passportDateOfIssue?: string
    passportExpiryDate?: string
    passportNationality?: string
    passportDob?: string
    passportGender?: string
    passportPicture?: AttachmentFile[]
    idCardNumber?: string
    idCardDateOfIssue?: string
    idCardExpiryDate?: string
    idCardIssuingCountry?: string
    idCardPicture?: AttachmentFile[]
    drivingLicenseNumber?: string
    drivingLicenseDateOfIssue?: string
    drivingLicenseExpiryDate?: string
    drivingLicenseIssuingCountry?: string
    drivingLicensePicture?: AttachmentFile[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: AttachmentFile[]
}

type Props = {
  initialRecord?: IdentityRecord
  selectedFolder?: string
}

type FileFieldName =
  | 'attachments'
  | 'passportPicture'
  | 'idCardPicture'
  | 'drivingLicensePicture'

type AttachmentSource = {
  attachment: AttachmentFile
  fieldName: FileFieldName
  index: number
}

type FormValues = {
  title: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  zip: string
  city: string
  region: string
  country: string
  note: string
  customFields: Array<{ type: string; note?: string }>
  folder: string
  passportFullName: string
  passportNumber: string
  passportIssuingCountry: string
  passportDateOfIssue: string
  passportExpiryDate: string
  passportNationality: string
  passportDob: string
  passportGender: string
  passportPicture: AttachmentFile[]
  idCardNumber: string
  idCardDateOfIssue: string
  idCardExpiryDate: string
  idCardIssuingCountry: string
  idCardPicture: AttachmentFile[]
  drivingLicenseNumber: string
  drivingLicenseDateOfIssue: string
  drivingLicenseExpiryDate: string
  drivingLicenseIssuingCountry: string
  drivingLicensePicture: AttachmentFile[]
  attachments: AttachmentFile[]
}

const getAttachmentKey = (
  attachment: Pick<AttachmentFile, 'id' | 'name'>,
  fieldName: FileFieldName,
  index: number
) => {
  if (attachment.id) {
    return `id:${attachment.id}`
  }

  if (attachment.name) {
    return `name:${attachment.name}`
  }

  return `${fieldName}:${index}`
}

const buildIdentityAttachmentSources = (
  values: Pick<FormValues, FileFieldName>
): AttachmentSource[] => {
  const sources: AttachmentSource[] = []
  const sourceIndexByKey = new Map<string, number>()
  const attachmentGroups: Array<{ fieldName: FileFieldName; items: AttachmentFile[] }> = [
    { fieldName: 'attachments', items: values.attachments ?? [] },
    { fieldName: 'passportPicture', items: values.passportPicture ?? [] },
    { fieldName: 'idCardPicture', items: values.idCardPicture ?? [] },
    { fieldName: 'drivingLicensePicture', items: values.drivingLicensePicture ?? [] }
  ]

  attachmentGroups.forEach(({ fieldName, items }) => {
    items.forEach((attachment, index) => {
      const key = getAttachmentKey(attachment, fieldName, index)
      const existingIndex = sourceIndexByKey.get(key)

      if (existingIndex === undefined) {
        sourceIndexByKey.set(key, sources.length)
        sources.push({ attachment, fieldName, index })
        return
      }

      const existingSource = sources[existingIndex]

      if (!existingSource.attachment.base64 && attachment.base64) {
        sources[existingIndex] = {
          ...existingSource,
          attachment: {
            ...existingSource.attachment,
            ...attachment
          }
        }
      }
    })
  })

  return sources
}

export const CreateOrEditIdentityContent = ({
  initialRecord,
  selectedFolder
}: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation<{ goBack: () => void }>()
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
    fullName: Validator.string(),
    email: Validator.string().email(t`Invalid email format`),
    phoneNumber: Validator.string(),
    address: Validator.string(),
    zip: Validator.string(),
    city: Validator.string(),
    region: Validator.string(),
    country: Validator.string(),
    note: Validator.string(),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Comment is required`)
      })
    ),
    folder: Validator.string(),
    passportFullName: Validator.string(),
    passportNumber: Validator.string(),
    passportIssuingCountry: Validator.string(),
    passportDateOfIssue: Validator.string(),
    passportExpiryDate: Validator.string(),
    passportNationality: Validator.string(),
    passportDob: Validator.string(),
    passportGender: Validator.string(),
    passportPicture: Validator.array().items(
      Validator.object({ id: Validator.string(), name: Validator.string().required() })
    ),
    idCardNumber: Validator.string(),
    idCardDateOfIssue: Validator.string(),
    idCardExpiryDate: Validator.string(),
    idCardIssuingCountry: Validator.string(),
    idCardPicture: Validator.array().items(
      Validator.object({ id: Validator.string(), name: Validator.string().required() })
    ),
    drivingLicenseNumber: Validator.string(),
    drivingLicenseDateOfIssue: Validator.string(),
    drivingLicenseExpiryDate: Validator.string(),
    drivingLicenseIssuingCountry: Validator.string(),
    drivingLicensePicture: Validator.array().items(
      Validator.object({ id: Validator.string(), name: Validator.string().required() })
    ),
    attachments: Validator.array().items(
      Validator.object({ id: Validator.string(), name: Validator.string().required() })
    )
  })

  const initialValues = useMemo<FormValues>(
    () => ({
      title: initialRecord?.data?.title ?? '',
      fullName: initialRecord?.data?.fullName ?? '',
      email: initialRecord?.data?.email ?? '',
      phoneNumber: initialRecord?.data?.phoneNumber ?? '',
      address: initialRecord?.data?.address ?? '',
      zip: initialRecord?.data?.zip ?? '',
      city: initialRecord?.data?.city ?? '',
      region: initialRecord?.data?.region ?? '',
      country: initialRecord?.data?.country ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder ?? '',
      passportFullName: initialRecord?.data?.passportFullName ?? '',
      passportNumber: initialRecord?.data?.passportNumber ?? '',
      passportIssuingCountry: initialRecord?.data?.passportIssuingCountry ?? '',
      passportDateOfIssue: initialRecord?.data?.passportDateOfIssue ?? '',
      passportExpiryDate: initialRecord?.data?.passportExpiryDate ?? '',
      passportNationality: initialRecord?.data?.passportNationality ?? '',
      passportDob: initialRecord?.data?.passportDob ?? '',
      passportGender: initialRecord?.data?.passportGender ?? '',
      passportPicture: initialRecord?.data?.passportPicture ?? [],
      idCardNumber: initialRecord?.data?.idCardNumber ?? '',
      idCardDateOfIssue: initialRecord?.data?.idCardDateOfIssue ?? '',
      idCardExpiryDate: initialRecord?.data?.idCardExpiryDate ?? '',
      idCardIssuingCountry: initialRecord?.data?.idCardIssuingCountry ?? '',
      idCardPicture: initialRecord?.data?.idCardPicture ?? [],
      drivingLicenseNumber: initialRecord?.data?.drivingLicenseNumber ?? '',
      drivingLicenseDateOfIssue:
        initialRecord?.data?.drivingLicenseDateOfIssue ?? '',
      drivingLicenseExpiryDate:
        initialRecord?.data?.drivingLicenseExpiryDate ?? '',
      drivingLicenseIssuingCountry:
        initialRecord?.data?.drivingLicenseIssuingCountry ?? '',
      drivingLicensePicture: initialRecord?.data?.drivingLicensePicture ?? [],
      attachments: initialRecord?.attachments ?? []
    }),
    [initialRecord, selectedFolder]
  )

  const { values, handleSubmit, setValue, errors, registerArray } = useForm({
    initialValues,
    validate: (formValues: Record<string, unknown>) => schema.validate(formValues)
  })

  useGetMultipleFiles({
    fieldNames: ['attachments', 'passportPicture', 'idCardPicture', 'drivingLicensePicture'],
    updateValues: setValue,
    initialRecord,
    currentValues: values
  })

  const onError = (error: Error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const {
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  const handleFirstHiddenMessageChange = (value: string) => {
    setValue('customFields', [{ type: 'note', note: value }])
  }

  const identityAttachmentSources = useMemo(
    () =>
      buildIdentityAttachmentSources({
        attachments: values.attachments,
        passportPicture: values.passportPicture,
        idCardPicture: values.idCardPicture,
        drivingLicensePicture: values.drivingLicensePicture
      }),
    [
      values.attachments,
      values.passportPicture,
      values.idCardPicture,
      values.drivingLicensePicture
    ]
  )

  const handleFileUpload = (file: AttachmentFile | null) => {
    if (!file) {
      return
    }

    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentReplace = (index: number, file: AttachmentFile | null) => {
    if (!file) {
      return
    }

    const source = identityAttachmentSources[index]

    if (!source) {
      return
    }

    setValue(
      source.fieldName,
      values[source.fieldName].map((attachment, currentIndex) =>
        currentIndex === source.index ? file : attachment
      )
    )
  }

  const handleAttachmentDelete = (index: number) => {
    const source = identityAttachmentSources[index]

    if (!source) {
      return
    }

    setValue(
      source.fieldName,
      values[source.fieldName].filter(
        (_, currentIndex) => currentIndex !== source.index
      )
    )
  }

  const onSubmit = async (formValues: FormValues) => {
    if (isLoading) {
      return
    }

    const attachments = buildIdentityAttachmentSources({
      attachments: formValues.attachments,
      passportPicture: formValues.passportPicture,
      idCardPicture: formValues.idCardPicture,
      drivingLicensePicture: formValues.drivingLicensePicture
    }).map(({ attachment }) => attachment)

    const data = {
      type: RECORD_TYPES.IDENTITY,
      folder: formValues.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: formValues.title,
        fullName: formValues.fullName,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        address: formValues.address,
        zip: formValues.zip,
        city: formValues.city,
        region: formValues.region,
        country: formValues.country,
        note: formValues.note,
        customFields: formValues.customFields,
        passportFullName: formValues.passportFullName,
        passportNumber: formValues.passportNumber,
        passportIssuingCountry: formValues.passportIssuingCountry,
        passportDateOfIssue: formValues.passportDateOfIssue,
        passportExpiryDate: formValues.passportExpiryDate,
        passportNationality: formValues.passportNationality,
        passportDob: formValues.passportDob,
        passportGender: formValues.passportGender,
        idCardNumber: formValues.idCardNumber,
        idCardDateOfIssue: formValues.idCardDateOfIssue,
        idCardExpiryDate: formValues.idCardExpiryDate,
        idCardIssuingCountry: formValues.idCardIssuingCountry,
        drivingLicenseNumber: formValues.drivingLicenseNumber,
        drivingLicenseDateOfIssue: formValues.drivingLicenseDateOfIssue,
        drivingLicenseExpiryDate: formValues.drivingLicenseExpiryDate,
        drivingLicenseIssuingCountry: formValues.drivingLicenseIssuingCountry,
        attachments: convertBase64FilesToUint8(attachments)
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

  return (
    <Layout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={isEditing ? t`Edit Identity Item` : t`New Identity Item`}
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
          testID="title-field-input"
          onChangeText={(val) => setValue('title', val)}
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Personal Information`}
        </Text>

        <MultiSlotInput testID="personal-information-multi-slot-input">
          <InputField
            label={t`Fullname`}
            value={values.fullName}
            placeholder={t`Enter Name`}
            onChangeText={(val) => setValue('fullName', val)}
            testID="full-name-input-field"
          />
          <InputField
            label={t`Email`}
            value={values.email}
            placeholder={t`Enter Email Address`}
            onChangeText={(val) => setValue('email', val)}
            error={(errors as Record<string, string | undefined>)?.email}
            testID="email-input-field"
          />
          <InputField
            label={t`Phone Number`}
            value={values.phoneNumber}
            placeholder={t`Enter Phone Number`}
            onChangeText={(val) => setValue('phoneNumber', val)}
            testID="phone-number-input-field"
          />
        </MultiSlotInput>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Address Details`}
        </Text>

        <MultiSlotInput testID="address-multi-slot-input">
          <InputField
            label={t`Street Address`}
            value={values.address}
            placeholder={t`Enter Street Name With Number`}
            onChangeText={(val) => setValue('address', val)}
            testID="address-input-field"
          />
          <InputField
            label={t`Country`}
            value={values.country}
            placeholder={t`Enter Country`}
            onChangeText={(val) => setValue('country', val)}
            testID="country-input-field"
          />
          <InputField
            label={t`City`}
            value={values.city}
            placeholder={t`Enter City`}
            onChangeText={(val) => setValue('city', val)}
            testID="city-input-field"
          />
          <InputField
            label={t`Region / State / Province`}
            value={values.region}
            placeholder={t`Enter Region, State or Province`}
            onChangeText={(val) => setValue('region', val)}
            testID="region-input-field"
          />
          <InputField
            label={t`ZIP / Postal code`}
            value={values.zip}
            placeholder={t`Enter ZIP, or Postal Code`}
            onChangeText={(val) => setValue('zip', val)}
            testID="zip-input-field"
          />
        </MultiSlotInput>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Passport Details`}
        </Text>

        <MultiSlotInput testID="passport-multi-slot-input">
          <InputField
            label={t`Fullname`}
            value={values.passportFullName}
            placeholder={t`Enter Name as Shown on Passport`}
            onChangeText={(val) => setValue('passportFullName', val)}
            testID="passport-full-name-input-field"
          />
          <InputField
            label={t`Passport Number`}
            value={values.passportNumber}
            placeholder={t`Enter Passport Number`}
            onChangeText={(val) => setValue('passportNumber', val)}
            testID="passport-number-input-field"
          />
          <InputField
            label={t`Issuing Country`}
            value={values.passportIssuingCountry}
            placeholder={t`Enter Issuing Country`}
            onChangeText={(val) => setValue('passportIssuingCountry', val)}
            testID="passport-issuing-country-input-field"
          />
          <DateField
            label={t`Date of Birth`}
            value={values.passportDob}
            placeholder={t`Enter DD/MM/YYYY`}
            onChangeText={(val) => setValue('passportDob', val)}
            testID="passport-date-of-birth-input-field"
          />
          <DateField
            label={t`Date of Issue`}
            value={values.passportDateOfIssue}
            placeholder={t`Enter DD/MM/YYYY`}
            onChangeText={(val) => setValue('passportDateOfIssue', val)}
            testID="passport-date-of-issue-input-field"
          />
          <DateField
            label={t`Expiry Date`}
            value={values.passportExpiryDate}
            placeholder={t`Enter DD/MM/YYYY`}
            onChangeText={(val) => setValue('passportExpiryDate', val)}
            testID="passport-expiry-date-input-field"
          />
          <InputField
            label={t`Nationality`}
            value={values.passportNationality}
            placeholder={t`Enter Nationality`}
            onChangeText={(val) => setValue('passportNationality', val)}
            testID="passport-nationality-input-field"
          />
          <InputField
            label={t`Gender`}
            value={values.passportGender}
            placeholder={t`Enter Gender`}
            onChangeText={(val) => setValue('passportGender', val)}
            testID="passport-gender-input-field"
          />
        </MultiSlotInput>

      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Identity Card Details`}
        </Text>

        <MultiSlotInput testID="identity-card-multi-slot-input">
          <InputField
            label={t`ID Number`}
            value={values.idCardNumber}
            placeholder={t`Enter Your ID Number`}
            onChangeText={(val) => setValue('idCardNumber', val)}
            testID="id-number-input-field"
          />
          <DateField
            label={t`Date of Issue`}
            value={values.idCardDateOfIssue}
            placeholder={t`Enter DD/MM/YYYY`}
            onChangeText={(val) => setValue('idCardDateOfIssue', val)}
            testID="identity-card-creation-date-input-field"
          />
          <DateField
            label={t`Expiry Date`}
            value={values.idCardExpiryDate}
            placeholder={t`Enter DD/MM/YYYY`}
            onChangeText={(val) => setValue('idCardExpiryDate', val)}
            testID="identity-card-expiry-date-input-field"
          />
          <InputField
            label={t`Issuing Country`}
            value={values.idCardIssuingCountry}
            placeholder={t`Enter Issuing Country`}
            onChangeText={(val) => setValue('idCardIssuingCountry', val)}
            testID="identity-card-issuing-country-input-field"
          />
        </MultiSlotInput>

      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Driving License Details`}
        </Text>

        <MultiSlotInput testID="driving-license-multi-slot-input">
          <InputField
            label={t`ID Number`}
            value={values.drivingLicenseNumber}
            placeholder={t`Enter Your ID Number`}
            onChangeText={(val) => setValue('drivingLicenseNumber', val)}
            testID="driving-license-id-number-input-field"
          />
          <DateField
            label={t`Date of Issue`}
            value={values.drivingLicenseDateOfIssue}
            placeholder={t`Enter DD/MM/YYYY`}
            onChangeText={(val) => setValue('drivingLicenseDateOfIssue', val)}
            testID="driving-license-creation-date-input-field"
          />
          <DateField
            label={t`Expiry Date`}
            value={values.drivingLicenseExpiryDate}
            placeholder={t`Enter DD/MM/YYYY`}
            onChangeText={(val) => setValue('drivingLicenseExpiryDate', val)}
            testID="driving-license-expiry-date-input-field"
          />
          <InputField
            label={t`Issuing Country`}
            value={values.drivingLicenseIssuingCountry}
            placeholder={t`Enter Issuing Country`}
            onChangeText={(val) => setValue('drivingLicenseIssuingCountry', val)}
            testID="driving-license-issuing-country-input-field"
          />
        </MultiSlotInput>

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
          testID="comments-multi-slot-input-slot-0"
        />

        <MultiSlotInput
          actions={
            <Button
              size="small"
              variant="tertiary"
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
                onChangeText={handleFirstHiddenMessageChange}
                isGrouped
                testID="hidden-messages-multi-slot-input-slot-0"
              />
            )}
        </MultiSlotInput>

        <AttachmentFieldsV2<AttachmentFile>
          attachments={identityAttachmentSources.map(({ attachment }) => attachment)}
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
  },
  subsection: {
    gap: rawTokens.spacing12
  }
})
