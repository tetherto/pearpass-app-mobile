import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  CommonFileIcon,
  PasswordIcon,
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { InputField, MultiSlotInput } from '@tetherto/pearpass-lib-ui-kit'
import { CopyButton } from '../../../libComponents/CopyButton'
import { PasswordField } from '../../../libComponents'

import { FormGroup } from '../../../components/FormGroup'
import { WifiPasswordQRCode } from '../../../components/WifiPasswordQRCode'

interface WifiPasswordDetailsFormProps {
  initialRecord?: any
  selectedFolder?: any
}

const toDisabledRegister = (registerResult: {
  name: string; value: string; error?: string; onChange: (e: any) => void
}) => ({
  name: registerResult.name,
  value: registerResult.value,
})

export const WifiPasswordDetailsForm = ({ initialRecord, selectedFolder }: WifiPasswordDetailsFormProps) => {
  const { t } = useLingui()

  const initialValues = useMemo(
    () => ({
      title: initialRecord?.data?.title ?? '',
      password: initialRecord?.data?.password ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder
    }),
    [initialRecord, selectedFolder]
  )

  const { register, setValues, values } = useForm({
    initialValues: initialValues
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasPassword = !!values?.password?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!(values?.customFields as any[])?.length

  return (
    <>
      {hasPassword && (
        <FormGroup>
          <PasswordField
            icon={PasswordIcon}
            label={t`Wi-Fi Password`}
            placeholder={t`Insert Wi-Fi Password`}
            variant="outline"
            isDisabled
            belowInputContent={
              <WifiPasswordQRCode
                ssid={values.title}
                password={values.password}
              />
            }
            {...register('password')}
          />
        </FormGroup>
      )}

      {hasNote && (
        <InputField
          label={t`Comment`}
          placeholder={t`Add comment`}
          leftSlot={<CommonFileIcon />}
          rightSlot={<CopyButton value={values.note} />}
          disabled
          {...toDisabledRegister(register('note'))}
        />
      )}

      {hasCustomFields && (
        <MultiSlotInput
          label={t`Custom fields`}
          placeholder={t`Add comment`}
          values={(values.customFields as Array<{ type: string; note: string }>).map((f) => f.note ?? '')}
          onAdd={() => { }}
          onChangeItem={() => { }}
          onRemove={() => { }}
          testID="custom-fields-multi-slot-input"
          disabled
          rightSlot={(index) => <CopyButton value={(values.customFields as Array<{ type: string; note: string }>)[index]?.note ?? ''} />}
        />
      )}
    </>
  )
}
