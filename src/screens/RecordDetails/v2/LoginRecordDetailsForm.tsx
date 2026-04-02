import { useCallback, useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useFocusEffect } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { isBefore, subtractDateUnits } from '@tetherto/pear-apps-utils-date'
import {
  KeyIcon,
  UserIcon,
  WebsiteIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { 
  InputField, 
  PasswordField, 
  MultiSlotInput, 
  UploadField } from '@tetherto/pearpass-lib-ui-kit'

import { AppWarning } from '../../../components/AppWarning'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { OtpCodeField } from '../../../components/OtpCodeField'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { usePasswordChangeReminder } from '../../../hooks/usePasswordChangeReminder'
import { formatPasskeyDate } from '../../../utils/formatPasskeyDate'

interface LoginRecordDetailsFormProps {
  initialRecord?: any
  selectedFolder?: any
}

const toDisabledRegister = (registerResult: {
  name: string; value: string; error?: string; onChange: (e: any) => void }) => ({
  name: registerResult.name,
  value: registerResult.value,
})

export const LoginRecordDetailsForm = ({ initialRecord, selectedFolder }: LoginRecordDetailsFormProps) => {
  const { t } = useLingui()
  const { isPasswordChangeReminderEnabled } = usePasswordChangeReminder()

  const initialValues = useMemo(
    () => ({
      username: initialRecord?.data?.username ?? '',
      password: initialRecord?.data?.password ?? '',
      note: initialRecord?.data?.note ?? '',
      websites: initialRecord?.data?.websites?.length
        ? initialRecord.data.websites
        : [],
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.data?.attachments ?? [],
      credential: initialRecord?.data?.credential?.id ?? '',
      passkeyCreatedAt: initialRecord?.data?.passkeyCreatedAt ?? null
    }),
    [initialRecord, selectedFolder]
  )

  const { register, registerArray, setValues, values, setValue } = useForm({
    initialValues: initialValues
  })



  const { refetch } = useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasUsername = !!values?.username?.length
  const hasPassword = !!values?.password?.length
  const hasPasskey = !!values?.credential
  const hasWebsites = !!(values?.websites as string[])?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!(values?.customFields as any[])?.length
  const hasAttachments = !!values?.attachments?.length

  const isPasswordSixMonthsOld = () => {
    const { passwordUpdatedAt } = initialRecord?.data || {}
    return (
      !!passwordUpdatedAt &&
      isBefore(passwordUpdatedAt, subtractDateUnits(6, 'month'))
    )
  }

  return (
    <>
      {(hasUsername || hasPassword) && (
        <FormGroup>
          {isPasswordSixMonthsOld() && isPasswordChangeReminderEnabled && (
            <AppWarning
              warning={t`It's been 6 months since you last updated this password. 
Consider changing it to keep your account secure.`}
              containerStyles={{ marginBottom: 15 }}
            />
          )}
          {hasUsername && (
            <InputField
              testID="username-field"
              disabled
              leftSlot={<UserIcon />}
              label={t`Email or username`}
              placeholder={t`Email or username`}
              {...toDisabledRegister(register('username'))}
            />
          )}

          {hasPassword && (
            <PasswordField
              leftSlot={<KeyIcon />}
              label={t`Password`}
              placeholder={t`Insert password`}
              disabled
              {...toDisabledRegister(register('password'))}
            />
          )}
        </FormGroup>
      )}

      {hasPasskey && (
        <FormGroup>
          <InputField
            leftSlot={<KeyIcon />}
            label={t`Passkey`}
            placeholder={t`Passkey`}
            disabled
            value={formatPasskeyDate(values.passkeyCreatedAt) || t`Passkey Stored`}
          />
        </FormGroup>
      )}

      {/* TODO: implement: under the hood it is using OLD inputfield */}
      {!!initialRecord?.otpPublic && (
        <FormGroup>
          <OtpCodeField
            key={initialRecord.id}
            recordId={initialRecord.id}
            otpPublic={initialRecord.otpPublic}
          />
        </FormGroup>
      )}

      {hasWebsites && (
          <MultiSlotInput
            label={t`Website`}
            values={values.websites as string[]}
            onChange={() => {}}
            testID="website-multi-slot-input"
            disabled
            leftSlot={<WebsiteIcon />}
          />
      )}

      {/* TODO implement */}

      {/* {hasAttachments && (
        <UploadField
          files={values.attachments}
          onFilesChange={() => {}}
          maxFiles={values.attachments.length}

        />
      )} */}

      {/* TODO: implement */}

      {/* {hasNote && (
        <FormGroup>
          <InputFieldNote disabled {...toDisabledRegister(register('note'))} />
        </FormGroup>
      )}

      {hasCustomFields && (
          <MultiSlotInput
            label={t`Custom fields`}
            values={values.customFields as any[]}
            onChange={() => {}}
            testID="custom-fields-multi-slot-input"
          />
      )} */}
    </>
  )
}
