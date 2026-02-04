import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import {
  CalendarIcon,
  CreditCardIcon,
  NineDotsIcon,
  UserIcon
} from 'pearpass-lib-ui-react-native-components'

import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { AttachmentField } from '../../../containers/AttachmentField'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { InputField, PasswordField } from '../../../libComponents'

export const CreditCardRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}) => {
  const { t } = useLingui()

  const initialValues = useMemo(
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

  const { register, registerArray, setValues, values, setValue } = useForm({
    initialValues: initialValues
  })

  const { value: list, registerItem } = registerArray('customFields')

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasName = !!values?.name?.length
  const hasNumber = !!values?.number?.length
  const hasExpireDate = !!values?.expireDate?.length
  const hasSecurityCode = !!values?.securityCode?.length
  const hasPinCode = !!values?.pinCode?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!list?.length
  const hasAttachments = !!values?.attachments?.length

  return (
    <>
      {(hasName ||
        hasNumber ||
        hasExpireDate ||
        hasSecurityCode ||
        hasPinCode) && (
        <FormGroup>
          {hasName && (
            <InputField
              icon={UserIcon}
              label={t`Name on card`}
              placeholder={t`John Smith`}
              isFirst
              variant="outline"
              isDisabled
              {...register('name')}
            />
          )}

          {hasNumber && (
            <InputField
              icon={CreditCardIcon}
              label={t`Number on card`}
              placeholder={t`1234 1234 1234 1234 `}
              variant="outline"
              isFirst={!hasName}
              isDisabled
              {...register('number')}
            />
          )}

          {hasExpireDate && (
            <InputField
              icon={CalendarIcon}
              label={t`Date of expire`}
              placeholder={t`MM YY`}
              variant="outline"
              isFirst={!hasName && !hasNumber}
              isDisabled
              {...register('expireDate')}
            />
          )}

          {hasSecurityCode && (
            <PasswordField
              icon={CreditCardIcon}
              label={t`Security code`}
              placeholder={t`12C3`}
              variant="outline"
              isFirst={!hasName && !hasNumber && !hasExpireDate}
              isDisabled
              {...register('securityCode')}
            />
          )}

          {hasPinCode && (
            <PasswordField
              icon={NineDotsIcon}
              label={t`Pin code`}
              placeholder={t`1234`}
              isLast
              variant="outline"
              isFirst={
                !hasName && !hasNumber && !hasExpireDate && !hasSecurityCode
              }
              isDisabled
              {...register('pinCode')}
            />
          )}
        </FormGroup>
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
          <InputFieldNote isDisabled isFirst isLast {...register('note')} />
        </FormGroup>
      )}

      {hasCustomFields && (
        <CustomFields
          areInputsDisabled
          customFields={list}
          register={registerItem}
        />
      )}
    </>
  )
}
