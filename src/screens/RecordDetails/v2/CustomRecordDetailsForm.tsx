import { useEffect, useMemo } from 'react'

import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { MultiSlotInput } from '@tetherto/pearpass-lib-ui-kit'

import { FormGroup } from '../../../components/FormGroup'
import { AttachmentField } from '../../../containers/AttachmentField'
import { CopyButton } from '../../../libComponents/CopyButton'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomRecordDetailsForm = ({ initialRecord, selectedFolder }: { initialRecord?: any, selectedFolder?: string }) => {
  const initialValues = useMemo(
    () => ({
      customFields: initialRecord?.data?.customFields || [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? []
    }),
    [initialRecord, selectedFolder]
  )

  const { setValues, values, setValue } = useForm({
    initialValues: initialValues
  })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasCustomFields = !!(values?.customFields as unknown[])?.length
  const hasAttachments = !!values?.attachments?.length

  return (
    <>
      {hasCustomFields && (
        <MultiSlotInput
          label="Custom fields"
          values={(values.customFields as Array<{ type: string; note: string }>).map((f) => f.note ?? '')}
          onAdd={() => {}}
          onChangeItem={() => {}}
          onRemove={() => {}}
          testID="custom-fields-multi-slot-input"
          disabled
          rightSlot={(index) => <CopyButton value={(values.customFields as Array<{ type: string; note: string }>)[index]?.note ?? ''} />}
        />
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
    </>
  )
}