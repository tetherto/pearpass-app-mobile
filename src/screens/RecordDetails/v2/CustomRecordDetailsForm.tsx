import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  AttachmentField,
  InputField,
  MultiSlotInput,
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
import { Attachment, CustomField, CustomRecord } from './types'

type ImagePreviewNavigation = {
  navigate: (
    screen: 'ImagePreview',
    params: {
      imageUri: string
      imageName?: string
    }
  ) => void
}

interface CustomRecordDetailsFormProps {
  initialRecord?: CustomRecord
  selectedFolder?: string
}

interface CustomRecordDetailsFormValues {
  customFields: CustomField[]
  folder?: string
  attachments: Attachment[]
}

export const CustomRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}: CustomRecordDetailsFormProps) => {
  const { t } = useLingui()
  const navigation = useNavigation() as ImagePreviewNavigation
  const { theme } = useTheme()
  const { setShouldBypassAutoLock } = useAutoLockContext() as {
    setShouldBypassAutoLock: (value: boolean) => void
  }
  const { copyToClipboard } = useCopyToClipboard()

  const initialValues = useMemo<CustomRecordDetailsFormValues>(
    () => ({
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? []
    }),
    [initialRecord, selectedFolder]
  )

  const { setValues, values, setValue } = useForm<CustomRecordDetailsFormValues>({
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
        {hasCustomFields && (
          <View style={styles.section}>
            <Text variant="caption" color={theme.colors.colorTextSecondary}>
              {t`Details`}
            </Text>

            <MultiSlotInput testID="custom-fields-multi-slot-input">
              {values.customFields.map((field, index) => (
                <InputField
                  key={`${field.type}-${index}`}
                  label={t`Other Field`}
                  value={field.note ?? ''}
                  placeholder={t`Enter Value`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID={`custom-fields-multi-slot-input-slot-${index}`}
                />
              ))}
            </MultiSlotInput>
          </View>
        )}

        {hasAttachments && (
          <View style={styles.section}>
            <Text variant="caption" color={theme.colors.colorTextSecondary}>
              {t`Attachments`}
            </Text>

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
