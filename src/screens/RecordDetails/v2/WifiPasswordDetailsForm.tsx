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

import { WifiPasswordQRCodeV2 } from '../../../components/WifiPasswordQRCode/WifiPasswordQRCodeV2'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { CustomField, WifiPasswordRecord } from './types'
import { toReadOnlyFieldProps } from './utils'

interface WifiPasswordDetailsFormProps {
  initialRecord?: WifiPasswordRecord
  selectedFolder?: string
}

interface WifiPasswordDetailsFormValues {
  title: string
  password: string
  note: string
  customFields: CustomField[]
  folder?: string
}

export const WifiPasswordDetailsForm = ({
  initialRecord,
  selectedFolder
}: WifiPasswordDetailsFormProps) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { copyToClipboard } = useCopyToClipboard()

  const initialValues = useMemo<WifiPasswordDetailsFormValues>(
    () => ({
      title: initialRecord?.data?.title ?? '',
      password: initialRecord?.data?.password ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder
    }),
    [initialRecord, selectedFolder]
  )

  const { register, setValues, values } = useForm<WifiPasswordDetailsFormValues>({
    initialValues
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasPassword = !!values.password.length
  const hasNote = !!values.note.length
  const hasCustomFields = !!values.customFields.length

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        {hasPassword && (
          <View style={styles.section}>
            <Text variant="caption" color={theme.colors.colorTextSecondary}>
              {t`Credentials`}
            </Text>

            <MultiSlotInput testID="credentials-multi-slot-input">
              <PasswordField
                label={t`Wi-Fi Password`}
                placeholder={t`Insert Wi-Fi Password`}
                readOnly
                copyable
                onCopy={copyToClipboard}
                isGrouped
                testID="credentials-multi-slot-input-slot-0"
                {...toReadOnlyFieldProps(register('password'))}
              />
            </MultiSlotInput>

            <WifiPasswordQRCodeV2
              ssid={values.title}
              password={values.password}
            />
          </View>
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
