import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { isBefore, subtractDateUnits } from '@tetherto/pear-apps-utils-date'
import {
  AlertMessage,
  AttachmentField,
  Button,
  InputField,
  MultiSlotInput,
  PasswordField,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { OpenInNew } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Linking, StyleSheet, View } from 'react-native'

import { OtpCodeField } from '../../../components/OtpCodeField'
import { FormGroup } from '../../../components/FormGroup'
import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { usePasswordChangeReminder } from '../../../hooks/usePasswordChangeReminder'
import { addHttps } from '../../../utils/addHttps'
import { formatPasskeyDate } from '../../../utils/formatPasskeyDate'
import { getMimeType } from '../../../utils/getMimeType'
import { handleDownloadFile } from '../../../utils/handleDownloadFile'
import { Attachment, LoginRecord } from './types'
import { toReadOnlyFieldProps } from './utils'

interface LoginRecordDetailsFormProps {
  initialRecord?: LoginRecord
  selectedFolder?: string
}

type ImagePreviewNavigation = {
  navigate: (
    screen: 'ImagePreview',
    params: {
      imageUri: string
      imageName?: string
    }
  ) => void
}

export const LoginRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}: LoginRecordDetailsFormProps) => {
  const { t } = useLingui()
  const navigation = useNavigation() as ImagePreviewNavigation
  const { theme } = useTheme()
  const { setShouldBypassAutoLock } = useAutoLockContext() as {
    setShouldBypassAutoLock: (value: boolean) => void
  }
  const { copyToClipboard } = useCopyToClipboard()
  const { isPasswordChangeReminderEnabled } = usePasswordChangeReminder()

  const initialValues = useMemo(
    () => ({
      username: initialRecord?.data?.username ?? '',
      password: initialRecord?.data?.password ?? '',
      note: initialRecord?.data?.note ?? '',
      websites: initialRecord?.data?.websites ?? [],
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? [],
      credential: initialRecord?.data?.credential?.id ?? '',
      passkeyCreatedAt: initialRecord?.data?.passkeyCreatedAt ?? null
    }),
    [initialRecord, selectedFolder]
  )

  const { register, setValues, values, setValue } = useForm({
    initialValues: initialValues
  })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasUsername = !!values?.username?.length
  const hasPassword = !!values?.password?.length
  const hasPasskey = !!values?.credential
  const hasWebsites = !!(values?.websites as string[])?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!(values?.customFields as unknown[])?.length
  const hasAttachments = !!values?.attachments?.length

  const isPasswordSixMonthsOld = () => {
    const { passwordUpdatedAt } = initialRecord?.data || {}

    return (
      !!passwordUpdatedAt &&
      isBefore(passwordUpdatedAt, subtractDateUnits(6, 'month'))
    )
  }

  const shouldShowSecurityWarning =
    isPasswordChangeReminderEnabled && isPasswordSixMonthsOld()

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
        {(hasUsername || hasPassword) && (
          <MultiSlotInput testID="credentials-multi-slot-input">
            {hasUsername && (
              <InputField
                label={t`Email / Username`}
                placeholder={t`Email / Username`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID="credentials-multi-slot-input-slot-0"
                {...toReadOnlyFieldProps(register('username'))}
              />
            )}

            {hasPassword && (
              <PasswordField
                label={t`Password`}
                placeholder={t`Password`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID="credentials-multi-slot-input-slot-1"
                {...toReadOnlyFieldProps(register('password'))}
              />
            )}
          </MultiSlotInput>
        )}

        {hasWebsites && (
          <MultiSlotInput testID="website-multi-slot-input">
            {(values.websites as string[]).map((website, index) => (
              <InputField
                key={`${website}-${index}`}
                label={t`Website`}
                value={website}
                placeholder={t`Enter Website`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID={`website-multi-slot-input-slot-${index}`}
                rightSlot={
                  website?.length ? (
                    <Button
                      variant="tertiary"
                      size="small"
                      aria-label="Open website"
                      iconBefore={
                        <OpenInNew color={theme.colors.colorTextPrimary} />
                      }
                      onClick={() => Linking.openURL(addHttps(website))}
                    />
                  ) : undefined
                }
              />
            ))}
          </MultiSlotInput>
        )}

        {!!initialRecord?.otpPublic && initialRecord?.id && (
          <FormGroup>
            <OtpCodeField
              key={initialRecord.id}
              recordId={initialRecord.id}
              otpPublic={initialRecord.otpPublic}
            />
          </FormGroup>
        )}

        {hasPasskey && (
          <InputField
            label={t`Passkey`}
            placeholder={t`Passkey`}
            value={formatPasskeyDate(values.passkeyCreatedAt) || t`Passkey Stored`}
            readOnly
          />
        )}

        {hasAttachments && (
          <MultiSlotInput testID="attachments-multi-slot-input">
            {(values.attachments as Attachment[]).map((attachment, index) => (
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
            {(values.customFields as Array<{ type: string; note: string }>).map(
              (field, index) => (
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
              )
            )}
          </MultiSlotInput>
        )}
      </View>

      {shouldShowSecurityWarning && (
        <AlertMessage
          variant="error"
          size="big"
          title={t`Password Warning`}
          description={t`It's been 6 months since you last updated this password. Consider changing it to keep your account secure.`}
        />
      )}
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
  }
})
