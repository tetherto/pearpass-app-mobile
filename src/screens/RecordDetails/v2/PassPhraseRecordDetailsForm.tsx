import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  InputField,
  MultiSlotInput,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'

import { PassPhraseV2 } from '../../../containers/PassPhrase/PassPhraseV2'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { PassPhraseRecord } from './types'
import { toReadOnlyFieldProps } from './utils'

interface PassPhraseRecordDetailsFormProps {
  initialRecord?: PassPhraseRecord
  selectedFolder?: string
}

export const PassPhraseRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}: PassPhraseRecordDetailsFormProps) => {
  const { t } = useLingui()
  const { copyToClipboard } = useCopyToClipboard()

  const initialValues = useMemo(
    () => ({
      title: initialRecord?.data?.title ?? '',
      passPhrase: initialRecord?.data?.passPhrase ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder
    }),
    [initialRecord, selectedFolder]
  )

  const { register, setValues, values } = useForm({
    initialValues
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasPassPhrase = !!values?.passPhrase?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!(values?.customFields as unknown[])?.length

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        {hasPassPhrase && (
          <PassPhraseV2 value={values.passPhrase} />
        )}

        {(hasNote || hasCustomFields) && (
          <MultiSlotInput testID="comments-multi-slot-input">
            {hasNote && (
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
            )}

            {(values.customFields as Array<{ type: string; note: string }>).map(
              (field, index) => (
                <InputField
                  key={`${field.type}-${index}`}
                  label={t`Comment`}
                  value={field.note ?? ''}
                  placeholder={t`Enter Comment`}
                  readOnly
                  copyable
                  onCopy={copyToClipboard}
                  isGrouped
                  testID={`comments-multi-slot-input-slot-${hasNote ? index + 1 : index}`}
                />
              )
            )}
          </MultiSlotInput>
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
  }
})
