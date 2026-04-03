import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  CalendarIcon,
  CreditCardIcon,
  CommonFileIcon,
  NineDotsIcon,
  UserIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  InputField,
  PasswordField,
  MultiSlotInput
} from '@tetherto/pearpass-lib-ui-kit'
import { CopyButton } from '../../../libComponents/CopyButton'

import { AttachmentField } from '../../../containers/AttachmentField'
import { FormGroup } from '../../../components/FormGroup'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { CreditCardRecord } from './types'

const toDisabledRegister = (registerResult: {
  name: string; value: string; error?: string; onChange: (e: unknown) => void
}) => ({
  name: registerResult.name,
  value: registerResult.value,
})

export const CreditCardRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}: {
  initialRecord?: CreditCardRecord
  selectedFolder?: string
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

  const { register, setValues, values, setValue } = useForm({
    initialValues: initialValues
  })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  useEffect(() => {
    setValues({ ...initialValues, attachments: values.attachments })
  }, [initialValues, setValues])

  const hasName = !!values?.name?.length
  const hasNumber = !!values?.number?.length
  const hasExpireDate = !!values?.expireDate?.length
  const hasSecurityCode = !!values?.securityCode?.length
  const hasPinCode = !!values?.pinCode?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!(values?.customFields as unknown[])?.length
  const hasAttachments = !!values?.attachments?.length

  return (
    <>
      {(hasName || hasNumber || hasExpireDate || hasSecurityCode || hasPinCode) && (
        <FormGroup>
          {hasName && (
            <InputField
              leftSlot={<UserIcon />}
              rightSlot={<CopyButton value={values.name} />}
              label={t`Name on card`}
              placeholder={t`John Smith`}
              disabled
              {...toDisabledRegister(register('name'))}
            />
          )}

          {hasNumber && (
            <InputField
              leftSlot={<CreditCardIcon />}
              rightSlot={<CopyButton value={values.number} />}
              label={t`Number on card`}
              placeholder={t`1234 1234 1234 1234`}
              disabled
              {...toDisabledRegister(register('number'))}
            />
          )}

          {hasExpireDate && (
            <InputField
              leftSlot={<CalendarIcon />}
              rightSlot={<CopyButton value={values.expireDate} />}
              label={t`Date of expire`}
              placeholder={t`MM YY`}
              disabled
              {...toDisabledRegister(register('expireDate'))}
            />
          )}

          {hasSecurityCode && (
            <PasswordField
              leftSlot={<CreditCardIcon />}
              rightSlot={<CopyButton value={values.securityCode} />}
              label={t`Security code`}
              placeholder={t`12C3`}
              disabled
              {...toDisabledRegister(register('securityCode'))}
            />
          )}

          {hasPinCode && (
            <PasswordField
              leftSlot={<NineDotsIcon />}
              rightSlot={<CopyButton value={values.pinCode} />}
              label={t`Pin code`}
              placeholder={t`1234`}
              disabled
              {...toDisabledRegister(register('pinCode'))}
            />
          )}
        </FormGroup>
      )}

      {hasAttachments && (
        <FormGroup>
          {(values.attachments as { id?: string; name?: string }[]).map((attachment) => (
            <AttachmentField
              key={attachment?.id || attachment.name}
              attachment={attachment}
              label={'File'}
            />
          ))}
        </FormGroup>
      )}

      {hasNote && (
        <InputField
          label={t`Note`}
          placeholder={t`Add note`}
          leftSlot={<CommonFileIcon />}
          rightSlot={<CopyButton value={values.note} />}
          disabled
          {...toDisabledRegister(register('note'))}
        />
      )}

      {hasCustomFields && (
        <MultiSlotInput
          label={t`Custom fields`}
          values={(values.customFields as Array<{ type: string; note: string }>).map((f) => f.note ?? '')}
          onAdd={() => {}}
          onChangeItem={() => {}}
          onRemove={() => {}}
          testID="custom-fields-multi-slot-input"
          disabled
          rightSlot={(index) => <CopyButton value={(values.customFields as Array<{ type: string; note: string }>)[index]?.note ?? ''} />}
        />
      )}
    </>
  )
}