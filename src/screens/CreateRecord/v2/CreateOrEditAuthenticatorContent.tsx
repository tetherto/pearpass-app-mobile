import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  RECORD_TYPES,
  matchLoginRecords,
  parseOtpInput,
  useCreateRecord,
  useRecords,
  validateOtpInput
} from '@tetherto/pearpass-lib-vault'
import {
  Button,
  Combobox,
  InputField,
  PasswordField,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { OtpSecretScanButton } from './OtpSecretScanButton'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { Layout } from '../../../containers/Layout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { logger } from '../../../utils/logger'
import { RecordItemIcon } from '../../../components/RecordItemIcon'

type LoginRecord = {
  id: string
  type?: string
  data?: Record<string, unknown>
}

type Props = {
  selectedFolder?: string
}

type FormValues = {
  title: string
  otpSecret: string
  linkedRecordId: string
}

export const CreateOrEditAuthenticatorContent = ({
  selectedFolder
}: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { setIsLoading, isLoading } = useLoadingContext()

  const { createRecord } = useCreateRecord({
    onCompleted: () => navigation.goBack()
  })

  const { updateRecords } = useRecords({
    onCompleted: () => navigation.goBack()
  })

  const { data: loginRecords } = useRecords({
    variables: { filters: { type: RECORD_TYPES.LOGIN } }
  }) as unknown as { data: LoginRecord[] | undefined }

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`),
    otpSecret: Validator.string().refine(validateOtpInput)
  })

  const { handleSubmit, register, values, setValue, errors } =
    useForm<FormValues>({
      initialValues: {
        title: '',
        otpSecret: '',
        linkedRecordId: ''
      },
      validate: (formValues) =>
        schema.validate(formValues) as Record<string, unknown>
    })

  const parsedOtp = useMemo(
    () => parseOtpInput(values.otpSecret),
    [values.otpSecret]
  )

  const matchedRecords = useMemo(
    () => matchLoginRecords(parsedOtp, loginRecords ?? []),
    [parsedOtp, loginRecords]
  )

  const linkedRecord = useMemo(
    () =>
      values.linkedRecordId
        ? (loginRecords ?? []).find((r) => r.id === values.linkedRecordId)
        : undefined,
    [values.linkedRecordId, loginRecords]
  )

  const parsedEmail =
    typeof parsedOtp?.label === 'string' ? parsedOtp.label : ''

  const [searchQuery, setSearchQuery] = useState('')

  const dropdownRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      return (loginRecords ?? []).filter((r) => {
        const title = ((r.data?.title as string) ?? '').toLowerCase()
        const username = ((r.data?.username as string) ?? '').toLowerCase()
        return title.includes(q) || username.includes(q)
      })
    }
    return matchedRecords.map(({ record }) => record)
  }, [searchQuery, loginRecords, matchedRecords])

  const onError = (error: Error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const onSubmit = async (formValues: FormValues) => {
    if (isLoading) return

    const otpInput = formValues.otpSecret?.trim() || undefined
    const selectedLinkedRecord = formValues.linkedRecordId
      ? (loginRecords ?? []).find((r) => r.id === formValues.linkedRecordId)
      : undefined

    try {
      setIsLoading(true)

      if (selectedLinkedRecord) {
        await updateRecords(
          [
            {
              ...selectedLinkedRecord,
              data: {
                ...(selectedLinkedRecord.data ?? {}),
                otpInput
              }
            }
          ],
          onError
        )
      } else {
        await createRecord(
          {
            type: RECORD_TYPES.LOGIN,
            folder: selectedFolder,
            data: {
              title: formValues.title,
              otpInput,
              ...(parsedEmail ? { username: parsedEmail } : {})
            }
          },
          onError
        )
      }

      setIsLoading(false)
    } catch (error: unknown) {
      logger.error(error)
      setIsLoading(false)
    }
  }

  const titleField = register('title')
  const otpSecretField = register('otpSecret')

  return (
    <Layout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={t`New Authenticator Code Item`}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={
            isLoading ||
            (!linkedRecord && !values.title.trim()) ||
            !!otpSecretField.error
          }
          onClick={handleSubmit(onSubmit)}
        >
          {t`Add Item`}
        </Button>
      }
    >
      <View>
        <InputField
          label={t`Title`}
          value={
            linkedRecord
              ? ((linkedRecord.data?.title as string) ?? '')
              : titleField.value
          }
          placeholder={t`Enter Title`}
          onChangeText={(value) => setValue('title', value)}
          error={errors.title as string | undefined}
          disabled={!!linkedRecord}
          testID="title-field"
        />
      </View>

      <View style={styles.section}>
        <PasswordField
          label={t`Authenticator Secret Key`}
          value={otpSecretField.value}
          placeholder={t`Enter your key or URI`}
          onChangeText={(value) => setValue('otpSecret', value)}
          error={errors.otpSecret as string | undefined}
          rightSlot={
            <OtpSecretScanButton onScanned={(secret) => setValue('otpSecret', secret)} />
          }
          testID="otp-secret-field"
        />
      </View>

      <View>
        <Combobox
          label={t`Link to Existing Login`}
          title={t`Change Login Match`}
          value={(linkedRecord?.data?.title as string) ?? ''}
          placeholder={t`No record linked`}
          onClear={() => setValue('linkedRecordId', '')}
          onOpenChange={(open) => {
            if (!open) setSearchQuery('')
          }}
          items={dropdownRecords.map((record) => ({
            id: record.id,
            title: (record.data?.title as string) ?? t`Untitled`,
            subtitle: record.data?.username as string | undefined,
            icon: (
              <RecordItemIcon record={{ ...record, type: RECORD_TYPES.LOGIN }} />
            )
          }))}
          selectedId={values.linkedRecordId}
          onSelect={(id) => {
            setValue('linkedRecordId', id)
            const rec = (loginRecords ?? []).find((r) => r.id === id)
            setValue('title', (rec?.data?.title as string) ?? '')
          }}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t`Search...`}
          emptyText={
            searchQuery.trim()
              ? t`No login items found`
              : t`No matching login items`
          }
          testID="authenticator-link-combobox"
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
  }
})
