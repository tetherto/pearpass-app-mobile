import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { CommonFileIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { InputField, MultiSlotInput } from '@tetherto/pearpass-lib-ui-kit'
import { CopyButton } from '../../../libComponents/CopyButton'

import { FormGroup } from '../../../components/FormGroup'
import { PassPhrase } from '../../../containers/PassPhrase'

interface PassPhraseRecordDetailsFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialRecord?: any
  selectedFolder?: string
}

const toDisabledRegister = (registerResult: {
  name: string; value: string; error?: string; onChange: (e: unknown) => void
}) => ({
  name: registerResult.name,
  value: registerResult.value,
})

export const PassPhraseRecordDetailsForm = ({ initialRecord, selectedFolder }: PassPhraseRecordDetailsFormProps) => {
  const { t } = useLingui()

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
    initialValues: initialValues
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasPassPhrase = !!values?.passPhrase?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!(values?.customFields as unknown[])?.length

  return (
    <>
      {hasPassPhrase && (
        <FormGroup>
          <PassPhrase {...register('passPhrase')} />
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