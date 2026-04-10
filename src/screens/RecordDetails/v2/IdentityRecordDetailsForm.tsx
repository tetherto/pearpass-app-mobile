import { useCallback, useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { DATE_FORMAT } from '@tetherto/pearpass-lib-constants'
import {
  AttachmentField,
  InputField,
  MultiSlotInput,
  Text,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'

import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { getMimeType } from '../../../utils/getMimeType'
import { handleDownloadFile } from '../../../utils/handleDownloadFile'
import { Attachment, IdentityRecord } from './types'
import { toReadOnlyFieldProps } from './utils'

type ImagePreviewNavigation = {
  navigate: (
    screen: 'ImagePreview',
    params: {
      imageUri: string
      imageName?: string
    }
  ) => void
}

type FileFieldName =
  | 'attachments'
  | 'passportPicture'
  | 'idCardPicture'
  | 'drivingLicensePicture'

type AttachmentSource = {
  attachment: Attachment
  fieldName: FileFieldName
  index: number
}

const getAttachmentKey = (
  attachment: Pick<Attachment, 'id' | 'name'>,
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

const buildIdentityAttachmentSources = (values: {
  attachments?: Attachment[]
  passportPicture?: Attachment[]
  idCardPicture?: Attachment[]
  drivingLicensePicture?: Attachment[]
}): AttachmentSource[] => {
  const sources: AttachmentSource[] = []
  const sourceIndexByKey = new Map<string, number>()
  const attachmentGroups: Array<{ fieldName: FileFieldName; items: Attachment[] }> = [
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

export const IdentityRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}: {
  initialRecord?: IdentityRecord
  selectedFolder?: string
}) => {
  const { t } = useLingui()
  const navigation = useNavigation() as ImagePreviewNavigation
  const { setShouldBypassAutoLock } = useAutoLockContext() as {
    setShouldBypassAutoLock: (value: boolean) => void
  }
  const { copyToClipboard } = useCopyToClipboard()

  const initialValues = useMemo(
    () => ({
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
      folder: selectedFolder ?? initialRecord?.folder,
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
      drivingLicenseDateOfIssue: initialRecord?.data?.drivingLicenseDateOfIssue ?? '',
      drivingLicenseExpiryDate: initialRecord?.data?.drivingLicenseExpiryDate ?? '',
      drivingLicenseIssuingCountry: initialRecord?.data?.drivingLicenseIssuingCountry ?? '',
      drivingLicensePicture: initialRecord?.data?.drivingLicensePicture ?? [],
      attachments: initialRecord?.attachments ?? []
    }),
    [initialRecord, selectedFolder]
  )

  const { register, setValues, values, setValue } = useForm({
    initialValues
  })

  const { refetch } = useGetMultipleFiles({
    fieldNames: [
      'attachments',
      'passportPicture',
      'idCardPicture',
      'drivingLicensePicture'
    ],
    updateValues: setValue,
    initialRecord,
    currentValues: values
  })

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  useEffect(() => {
    const imageFields: FileFieldName[] = [
      'attachments',
      'passportPicture',
      'idCardPicture',
      'drivingLicensePicture'
    ]
    const preservedValues = { ...initialValues }

    imageFields.forEach((fieldName) => {
      const currentValue = values[fieldName]

      if (
        currentValue &&
        Array.isArray(currentValue) &&
        currentValue.length > 0 &&
        currentValue.some((item) => item.base64)
      ) {
        const initialValue = initialValues[fieldName]
        const currentIds = currentValue.map((item) => item.id).sort()
        const initialIds = (initialValue || []).map((item) => item.id).sort()

        if (JSON.stringify(currentIds) === JSON.stringify(initialIds)) {
          preservedValues[fieldName] = currentValue
        }
      }
    })

    setValues(preservedValues)
  }, [initialValues, setValues])

  const hasPersonalInformation =
    !!values?.fullName?.length ||
    !!values?.email?.length ||
    !!values?.phoneNumber?.length
  const hasAddress =
    !!values?.address?.length ||
    !!values?.zip?.length ||
    !!values?.city?.length ||
    !!values?.region?.length ||
    !!values?.country?.length
  const hasPassport =
    !!values?.passportFullName?.length ||
    !!values?.passportNumber?.length ||
    !!values?.passportIssuingCountry?.length ||
    !!values?.passportDateOfIssue?.length ||
    !!values?.passportExpiryDate?.length ||
    !!values?.passportNationality?.length ||
    !!values?.passportDob?.length ||
    !!values?.passportGender?.length
  const hasIdCard =
    !!values?.idCardNumber?.length ||
    !!values?.idCardDateOfIssue?.length ||
    !!values?.idCardExpiryDate?.length ||
    !!values?.idCardIssuingCountry?.length
  const hasDrivingLicense =
    !!values?.drivingLicenseNumber?.length ||
    !!values?.drivingLicenseDateOfIssue?.length ||
    !!values?.drivingLicenseExpiryDate?.length ||
    !!values?.drivingLicenseIssuingCountry?.length

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
  const hasAttachments = identityAttachmentSources.length > 0

  const commentValues = [
    ...(values?.note?.length ? [values.note] : []),
    ...((values?.customFields as Array<{ type: string; note: string }>) ?? [])
      .map((field) => field.note ?? '')
      .filter(Boolean)
  ]

  const handleAttachmentPress = async (attachment: Attachment) => {
    if (getMimeType(attachment.name).startsWith('image/')) {
      const imageUri = attachment.base64
        ? `data:image/jpeg;base64,${attachment.base64}`
        : ''

      navigation.navigate('ImagePreview', {
        imageUri,
        imageName: attachment.name
      })

      return
    }

    try {
      setShouldBypassAutoLock(true)
      await handleDownloadFile({
        base64: attachment.base64 ?? '',
        name: attachment.name ?? ''
      })
    } finally {
      setShouldBypassAutoLock(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        {hasPersonalInformation && (
          <View style={styles.section}>
            <Text variant="caption">{t`Personal Information`}</Text>

            <MultiSlotInput testID="personal-information-multi-slot-input">
              {!!values.fullName?.length && (
                <InputField
                  label={t`Full Name`}
                  placeholder={t`John Smith`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="personal-information-multi-slot-input-slot-0"
                  {...toReadOnlyFieldProps(register('fullName'))}
                />
              )}

              {!!values.email?.length && (
                <InputField
                  label={t`Email`}
                  placeholder={t`Insert email`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="personal-information-multi-slot-input-slot-1"
                  {...toReadOnlyFieldProps(register('email'))}
                />
              )}

              {!!values.phoneNumber?.length && (
                <InputField
                  label={t`Phone Number`}
                  placeholder={t`Insert phone number`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="personal-information-multi-slot-input-slot-2"
                  {...toReadOnlyFieldProps(register('phoneNumber'))}
                />
              )}
            </MultiSlotInput>
          </View>
        )}

        {hasAddress && (
          <View style={styles.section}>
            <Text variant="caption">{t`Address`}</Text>

            <MultiSlotInput testID="address-multi-slot-input">
              {!!values.address?.length && (
                <InputField
                  label={t`Address`}
                  placeholder={t`Insert address`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="address-multi-slot-input-slot-0"
                  {...toReadOnlyFieldProps(register('address'))}
                />
              )}

              {!!values.zip?.length && (
                <InputField
                  label={t`ZIP`}
                  placeholder={t`Insert ZIP`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="address-multi-slot-input-slot-1"
                  {...toReadOnlyFieldProps(register('zip'))}
                />
              )}

              {!!values.city?.length && (
                <InputField
                  label={t`City`}
                  placeholder={t`Insert city`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="address-multi-slot-input-slot-2"
                  {...toReadOnlyFieldProps(register('city'))}
                />
              )}

              {!!values.region?.length && (
                <InputField
                  label={t`Region`}
                  placeholder={t`Insert region`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="address-multi-slot-input-slot-3"
                  {...toReadOnlyFieldProps(register('region'))}
                />
              )}

              {!!values.country?.length && (
                <InputField
                  label={t`Country`}
                  placeholder={t`Insert country`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="address-multi-slot-input-slot-4"
                  {...toReadOnlyFieldProps(register('country'))}
                />
              )}
            </MultiSlotInput>
          </View>
        )}

        {hasPassport && (
          <View style={styles.section}>
            <Text variant="caption">{t`Passport`}</Text>

            <MultiSlotInput testID="passport-multi-slot-input">
              {!!values.passportFullName?.length && (
                <InputField
                  label={t`Full Name`}
                  placeholder={t`John Smith`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="passport-multi-slot-input-slot-0"
                  {...toReadOnlyFieldProps(register('passportFullName'))}
                />
              )}

              {!!values.passportNumber?.length && (
                <InputField
                  label={t`Passport Number`}
                  placeholder={t`Insert numbers`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="passport-multi-slot-input-slot-1"
                  {...toReadOnlyFieldProps(register('passportNumber'))}
                />
              )}

              {!!values.passportIssuingCountry?.length && (
                <InputField
                  label={t`Issuing Country`}
                  placeholder={t`Insert country`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="passport-multi-slot-input-slot-2"
                  {...toReadOnlyFieldProps(register('passportIssuingCountry'))}
                />
              )}

              {!!values.passportDateOfIssue?.length && (
                <InputField
                  label={t`Date of Issue`}
                  placeholder={DATE_FORMAT}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="passport-multi-slot-input-slot-3"
                  {...toReadOnlyFieldProps(register('passportDateOfIssue'))}
                />
              )}

              {!!values.passportExpiryDate?.length && (
                <InputField
                  label={t`Expiry Date`}
                  placeholder={DATE_FORMAT}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="passport-multi-slot-input-slot-4"
                  {...toReadOnlyFieldProps(register('passportExpiryDate'))}
                />
              )}

              {!!values.passportNationality?.length && (
                <InputField
                  label={t`Nationality`}
                  placeholder={t`Insert your nationality`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="passport-multi-slot-input-slot-5"
                  {...toReadOnlyFieldProps(register('passportNationality'))}
                />
              )}

              {!!values.passportDob?.length && (
                <InputField
                  label={t`Date of Birth`}
                  placeholder={DATE_FORMAT}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="passport-multi-slot-input-slot-6"
                  {...toReadOnlyFieldProps(register('passportDob'))}
                />
              )}

              {!!values.passportGender?.length && (
                <InputField
                  label={t`Gender`}
                  placeholder={t`M/F`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="passport-multi-slot-input-slot-7"
                  {...toReadOnlyFieldProps(register('passportGender'))}
                />
              )}
            </MultiSlotInput>

          </View>
        )}

        {hasIdCard && (
          <View style={styles.section}>
            <Text variant="caption">{t`Identity Card`}</Text>

            <MultiSlotInput testID="identity-card-multi-slot-input">
              {!!values.idCardNumber?.length && (
                <InputField
                  label={t`ID Number`}
                  placeholder={t`123456789`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="identity-card-multi-slot-input-slot-0"
                  {...toReadOnlyFieldProps(register('idCardNumber'))}
                />
              )}

              {!!values.idCardDateOfIssue?.length && (
                <InputField
                  label={t`Creation Date`}
                  placeholder={DATE_FORMAT}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="identity-card-multi-slot-input-slot-1"
                  {...toReadOnlyFieldProps(register('idCardDateOfIssue'))}
                />
              )}

              {!!values.idCardExpiryDate?.length && (
                <InputField
                  label={t`Expiry Date`}
                  placeholder={DATE_FORMAT}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="identity-card-multi-slot-input-slot-2"
                  {...toReadOnlyFieldProps(register('idCardExpiryDate'))}
                />
              )}

              {!!values.idCardIssuingCountry?.length && (
                <InputField
                  label={t`Issuing Country`}
                  placeholder={t`Insert country`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="identity-card-multi-slot-input-slot-3"
                  {...toReadOnlyFieldProps(register('idCardIssuingCountry'))}
                />
              )}
            </MultiSlotInput>

          </View>
        )}

        {hasDrivingLicense && (
          <View style={styles.section}>
            <Text variant="caption">{t`Driving License`}</Text>

            <MultiSlotInput testID="driving-license-multi-slot-input">
              {!!values.drivingLicenseNumber?.length && (
                <InputField
                  label={t`ID Number`}
                  placeholder={t`123456789`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="driving-license-multi-slot-input-slot-0"
                  {...toReadOnlyFieldProps(register('drivingLicenseNumber'))}
                />
              )}

              {!!values.drivingLicenseDateOfIssue?.length && (
                <InputField
                  label={t`Creation Date`}
                  placeholder={DATE_FORMAT}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="driving-license-multi-slot-input-slot-1"
                  {...toReadOnlyFieldProps(register('drivingLicenseDateOfIssue'))}
                />
              )}

              {!!values.drivingLicenseExpiryDate?.length && (
                <InputField
                  label={t`Expiry Date`}
                  placeholder={DATE_FORMAT}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="driving-license-multi-slot-input-slot-2"
                  {...toReadOnlyFieldProps(register('drivingLicenseExpiryDate'))}
                />
              )}

              {!!values.drivingLicenseIssuingCountry?.length && (
                <InputField
                  label={t`Issuing Country`}
                  placeholder={t`Insert country`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="driving-license-multi-slot-input-slot-3"
                  {...toReadOnlyFieldProps(register('drivingLicenseIssuingCountry'))}
                />
              )}
            </MultiSlotInput>

          </View>
        )}

        {hasAttachments && (
          <View style={styles.section}>
            <Text variant="caption">{t`Attachments`}</Text>

            <MultiSlotInput testID="attachments-multi-slot-input">
              {identityAttachmentSources.map(({ attachment }, index) => (
                <AttachmentField
                  key={attachment?.id || attachment.name || `attachment-${index}`}
                  label={t`Attachment`}
                  value={attachment?.name ?? ''}
                  isGrouped
                  testID={`attachment-field-${index}`}
                  onClick={() => {
                    void handleAttachmentPress(attachment)
                  }}
                />
              ))}
            </MultiSlotInput>
          </View>
        )}

        {!!commentValues.length && (
          <View style={styles.section}>
            <Text variant="caption">{t`Additional`}</Text>

            <MultiSlotInput testID="comments-multi-slot-input">
              {commentValues.map((comment, index) => (
                <InputField
                  key={`comment-${index}`}
                  label={t`Comment`}
                  value={comment}
                  placeholder={t`Enter Comment`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID={`comments-multi-slot-input-slot-${index}`}
                />
              ))}
            </MultiSlotInput>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  topContent: {
    gap: rawTokens.spacing8
  },
  section: {
    gap: rawTokens.spacing12
  }
})
