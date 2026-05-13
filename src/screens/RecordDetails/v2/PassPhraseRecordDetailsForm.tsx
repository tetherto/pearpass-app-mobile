import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  InputField,
  MultiSlotInput,
  PasswordField,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'

import { PassPhraseV2 } from '../../../containers/PassPhrase/PassPhraseV2'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { CustomField, PassPhraseRecord } from './types'
import { toReadOnlyFieldProps } from './utils'

interface PassPhraseRecordDetailsFormProps {
  initialRecord?: PassPhraseRecord
  selectedFolder?: string
}

interface PassPhraseRecordDetailsFormValues {
  title: string
  passPhrase: string
  note: string
  customFields: CustomField[]
  folder?: string
}

export const PassPhraseRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}: PassPhraseRecordDetailsFormProps) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { copyToClipboard } = useCopyToClipboard()

  const initialValues = useMemo<PassPhraseRecordDetailsFormValues>(
    () => ({
      title: initialRecord?.data?.title ?? '',
      passPhrase: initialRecord?.data?.passPhrase ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder
    }),
    [initialRecord, selectedFolder]
  )

  const { register, setValues, values } = useForm<PassPhraseRecordDetailsFormValues>({
    initialValues
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasPassPhrase = !!values.passPhrase.length
  const hasNote = !!values.note.length
  const hasCustomFields = !!values.customFields.length

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        {hasPassPhrase && (
          <PassPhraseV2 value={values.passPhrase} />
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
                  placeholder={t`Enter Comment`}
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
    backgroundColor: 'transparent'
  },
  topContent: {
    gap: rawTokens.spacing8
  },
  section: {
    gap: rawTokens.spacing12
  }
})
