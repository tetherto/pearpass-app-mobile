import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'

import { MultiSlotInput } from '@tetherto/pearpass-lib-ui-kit'
import { CopyButton } from '../../../libComponents/CopyButton'
import { FormGroup } from '../../../components/FormGroup'
import { PressableNote } from '../../../components/PressableNote'
import { AttachmentField } from '../../../containers/AttachmentField'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NoteRecordDetailsForm = ({ initialRecord, selectedFolder }: { initialRecord?: any, selectedFolder?: string }) => {
  const { t } = useLingui()

  const initialValues = useMemo(
    () => ({
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
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

  const hasAttachments = !!values?.attachments?.length
  const hasCustomFields = !!(values?.customFields as unknown[])?.length

  return (
    <>
      {!!values?.note.length && (
        <PressableNote label={t`Comment`} text={values.note} onPress={() => "todo: what should this component do?"} />
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

      {hasCustomFields && (
        <MultiSlotInput
          label={t`Custom fields`}
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
