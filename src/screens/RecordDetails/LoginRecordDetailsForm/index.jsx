import { useCallback, useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useFocusEffect } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { isBefore, subtractDateUnits } from 'pear-apps-utils-date'
import { generateUniqueId } from 'pear-apps-utils-generate-unique-id'
import {
  KeyIcon,
  UserIcon,
  WebsiteIcon
} from 'pearpass-lib-ui-react-native-components'

import { AppWarning } from '../../../components/AppWarning'
import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { AttachmentField } from '../../../containers/AttachmentField'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { usePasswordChangeReminder } from '../../../hooks/usePasswordChangeReminder'
import {
  CompoundField,
  InputField,
  PasswordField
} from '../../../libComponents'

export const LoginRecordDetailsForm = ({ initialRecord, selectedFolder }) => {
  const { t } = useLingui()
  const { isPasswordChangeReminderEnabled } = usePasswordChangeReminder()

  const initialValues = useMemo(
    () => ({
      username: initialRecord?.data?.username ?? '',
      password: initialRecord?.data?.password ?? '',
      note: initialRecord?.data?.note ?? '',
      websites: initialRecord?.data?.websites?.length
        ? initialRecord?.data?.websites.map((website) => ({ website }))
        : [{ name: 'website', id: generateUniqueId() }],
      customFields: initialRecord?.data.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.data?.attachments ?? []
    }),
    [initialRecord, selectedFolder]
  )

  const { register, registerArray, setValues, values, setValue } = useForm({
    initialValues: initialValues
  })

  const { value: websitesList, registerItem } = registerArray('websites')

  const { value: customFieldsList, registerItem: registerCustomFieldItem } =
    registerArray('customFields')

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

  const { copyToClipboard } = useCopyToClipboard()

  const handleTapToCopy = (name) => {
    copyToClipboard(values[name])
  }

  const hasUsername = !!values?.username?.length
  const hasPassword = !!values?.password?.length
  const hasWebsites = !!websitesList?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!customFieldsList?.length
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
              warning={t`It’s been 6 months since you last updated this password. 
Consider changing it to keep your account secure.`}
              containerStyles={{ marginBottom: 15 }}
            />
          )}
          {hasUsername && (
            <InputField
              onClick={() => handleTapToCopy('username')}
              icon={UserIcon}
              label={t`Email or username`}
              placeholder={t`Email or username`}
              variant="outline"
              isDisabled
              {...register('username')}
            />
          )}

          {hasPassword && (
            <PasswordField
              onClick={() => handleTapToCopy('password')}
              icon={KeyIcon}
              label={t`Password`}
              placeholder={t`Insert password`}
              variant="outline"
              isDisabled
              {...register('password')}
            />
          )}
        </FormGroup>
      )}

      {hasWebsites && (
        <CompoundField>
          {websitesList.map((website, index) => (
            <InputField
              onClick={() => copyToClipboard(website.website)}
              key={index}
              icon={WebsiteIcon}
              label={t`Website`}
              isDisabled
              {...registerItem('website', index)}
            />
          ))}
        </CompoundField>
      )}

      {hasAttachments && (
        <FormGroup>
          {values.attachments.map((attachment) => (
            <AttachmentField
              key={attachment?.id || attachment.name}
              attachment={attachment}
              label={'File'}
            />
          ))}
        </FormGroup>
      )}

      {hasNote && (
        <FormGroup>
          <InputFieldNote
            onClick={() => handleTapToCopy('note')}
            isDisabled
            {...register('note')}
          />
        </FormGroup>
      )}

      {hasCustomFields && (
        <CustomFields
          onClick={copyToClipboard}
          areInputsDisabled
          customFields={customFieldsList}
          register={registerCustomFieldItem}
        />
      )}
    </>
  )
}
