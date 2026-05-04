import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  AttachmentField,
  InputField,
  MultiSlotInput,
  PasswordField,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'

import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { getMimeType } from '../../../utils/getMimeType'
import { handleDownloadFile } from '../../../utils/handleDownloadFile'
import { Attachment, CreditCardRecord, CustomField } from './types'
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

interface CreditCardRecordDetailsFormProps {
  initialRecord?: CreditCardRecord
  selectedFolder?: string
}

interface CreditCardRecordDetailsFormValues {
  name: string
  number: string
  expireDate: string
  securityCode: string
  pinCode: string
  note: string
  customFields: CustomField[]
  folder?: string
  attachments: Attachment[]
}

export const CreditCardRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}: CreditCardRecordDetailsFormProps) => {
  const { t } = useLingui()
  const navigation = useNavigation() as ImagePreviewNavigation
  const { theme } = useTheme()
  const { setShouldBypassAutoLock } = useAutoLockContext() as {
    setShouldBypassAutoLock: (value: boolean) => void
  }
  const { copyToClipboard } = useCopyToClipboard()

  const initialValues = useMemo<CreditCardRecordDetailsFormValues>(
    () => ({
      name: initialRecord?.data?.name ?? '',
      number: initialRecord?.data?.number ?? '',
      expireDate: initialRecord?.data?.expireDate ?? '',
      securityCode: initialRecord?.data?.securityCode ?? '',
      pinCode: initialRecord?.data?.pinCode ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? []
    }),
    [initialRecord, selectedFolder]
  )

  const { register, setValues, values, setValue } =
    useForm<CreditCardRecordDetailsFormValues>({
      initialValues
    })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasName = !!values.name.length
  const hasNumber = !!values.number.length
  const hasExpireDate = !!values.expireDate.length
  const hasSecurityCode = !!values.securityCode.length
  const hasPinCode = !!values.pinCode.length
  const hasNote = !!values.note.length
  const hasCustomFields = !!values.customFields.length
  const hasAttachments = !!values.attachments.length

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
        {(hasName ||
          hasNumber ||
          hasExpireDate ||
          hasSecurityCode ||
          hasPinCode) && (
          <MultiSlotInput testID="card-details-multi-slot-input">
            {hasName && (
              <InputField
                label={t`Cardholder Name`}
                placeholder={t`John Smith`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID="card-details-multi-slot-input-slot-0"
                {...toReadOnlyFieldProps(register('name'))}
              />
            )}

            {hasNumber && (
              <InputField
                label={t`Card Number`}
                placeholder={t`1234 1234 1234 1234`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID="card-details-multi-slot-input-slot-1"
                {...toReadOnlyFieldProps(register('number'))}
              />
            )}

            {hasExpireDate && (
              <InputField
                label={t`Expiration Date`}
                placeholder={t`MM YY`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID="card-details-multi-slot-input-slot-2"
                {...toReadOnlyFieldProps(register('expireDate'))}
              />
            )}

            {hasSecurityCode && (
              <PasswordField
                label={t`Security Code`}
                placeholder={t`123`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID="card-details-multi-slot-input-slot-3"
                {...toReadOnlyFieldProps(register('securityCode'))}
              />
            )}

            {hasPinCode && (
              <PasswordField
                label={t`PIN`}
                placeholder={t`1234`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID="card-details-multi-slot-input-slot-4"
                {...toReadOnlyFieldProps(register('pinCode'))}
              />
            )}
          </MultiSlotInput>
        )}

        {hasAttachments && (
          <MultiSlotInput testID="attachments-multi-slot-input">
            {values.attachments.map((attachment, index) => (
              <AttachmentField
                key={attachment?.id || attachment.name}
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
        )}

        {(hasNote || hasCustomFields) && (
          <View style={styles.section}>
            <Text variant="caption" color={theme.colors.colorTextSecondary}>
              {t`Additional`}
            </Text>

            {hasNote && (
              <MultiSlotInput testID="comments-multi-slot-input">
                <InputField
                  label={t`Comment`}
                  placeholder={t`Add comment`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID="comments-multi-slot-input-slot-0"
                  {...toReadOnlyFieldProps(register('note'))}
                />
              </MultiSlotInput>
            )}

            {hasCustomFields && (
              <MultiSlotInput testID="hidden-messages-multi-slot-input">
                {values.customFields.map((field, index) => (
                  <PasswordField
                    key={`${field.type}-${index}`}
                    label={t`Hidden Message`}
                    value={field.note ?? ''}
                    placeholder={t`Enter Hidden Message`}
                    readOnly
                    copyable
                    onCopy={copyToClipboard}
                    isGrouped
                    testID={`hidden-messages-multi-slot-input-slot-${index}`}
                  />
                ))}
              </MultiSlotInput>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  topContent: {
    gap: rawTokens.spacing8
  },
  section: {
    gap: rawTokens.spacing12
  }
})
