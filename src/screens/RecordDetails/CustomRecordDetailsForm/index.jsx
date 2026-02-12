import { useEffect, useMemo } from 'react'

import { useForm } from 'pear-apps-lib-ui-react-hooks'

import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { AttachmentField } from '../../../containers/AttachmentField'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'

export const CustomRecordDetailsForm = ({ initialRecord, selectedFolder }) => {
  const initialValues = useMemo(
    () => ({
      customFields: initialRecord?.data?.customFields || [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? []
    }),
    [initialRecord, selectedFolder]
  )

  const { registerArray, setValues, values, setValue } = useForm({
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

  return (
    <>
      {!!list?.length && (
        <CustomFields
          areInputsDisabled
          customFields={list}
          register={registerItem}
        />
      )}

      {!!values?.attachments?.length && (
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
    </>
  )
}
