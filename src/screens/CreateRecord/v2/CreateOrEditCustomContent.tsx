import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { DeleteIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import { InputField, MultiSlotInput } from '@tetherto/pearpass-lib-ui-kit'
import Toast from 'react-native-toast-message'

import { AttachmentField } from '../../../containers/AttachmentField'
import { FormGroup } from '../../../components/FormGroup'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { adaptRegister } from './CreateOrEditLoginContent'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { ButtonLittle } from '../../../libComponents'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from './styles'

type CustomContentRecord = {
  data?: {
    title?: string
    customFields?: unknown[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: unknown[]
}

type Props = {
  initialRecord?: CustomContentRecord
  selectedFolder?: string
}

export const CreateOrEditCustomContent = ({
  initialRecord,
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

  const onError = (error: Error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Comment is required`)
      })
    ),
    folder: Validator.string(),
    attachments: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    )
  })

  const { register, handleSubmit, registerArray, values, setValue, errors } = useForm({
    initialValues: {
      title: initialRecord?.data?.title || '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? []
    },
    validate: (values: Record<string, unknown>) => schema.validate(values)
  })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  const {
    value: customFieldsList,
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  type FormValues = { title: string; folder: string; customFields: unknown[]; attachments: { base64: string; id?: string | number; name: string }[] }
  const onSubmit = async (values: FormValues) => {
    if (isLoading) return

    const data = {
      type: RECORD_TYPES.CUSTOM,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: values.title,
        customFields: values.customFields,
        attachments: convertBase64FilesToUint8(values.attachments)
      }
    }

    try {
      setIsLoading(true)

      if (initialRecord) {
        await updateRecords([{ ...initialRecord, ...data }], onError)
      } else {
        await createRecord(data, onError)
      }

      setIsLoading(false)
    } catch (error: unknown) {
      logger.error(error)
      setIsLoading(false)
    }
  }

  const handleFileUpload = (file: { base64: string; id?: string | number; name: string } | null) => {
    if (!file) return
    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentDelete = (index: number) => {
    setValue('attachments', values.attachments.filter((_, idx) => idx !== index))
  }

  return (
    <Wrapper>
      <Header>
        <ToolbarCreateOrEditCategory
          isLoading={isLoading}
          selectedFolder={values.folder}
          onFolderSelect={(folder: { name: string }) =>
            setValue('folder', folder.name === values.folder ? '' : folder.name)
          }
          onSave={handleSubmit(onSubmit)}
        />
      </Header>
      <ScrollContainer>
        <ScrollView>
          <FormWrapper>
            <InputField
              label={t`Title`}
              placeholder={t`No title`}
              testID="title-input-field"
              {...adaptRegister(register('title'))}
            />

            <FormGroup>
              <AttachmentField
                onUpload={handleFileUpload}
                isLast
                label={'File'}
                testID="file-field"
                accessibilityLabel={t`File field`}
                inputTestID="file-input-field"
                inputAccessibilityLabel={t`File input field`}
                addButtonTestID="add-file-button"
                addButtonAccessibilityLabel={t`Add file button`}
              />
              {values.attachments.map((attachment: { id?: string; name?: string }, index: number) => (
                <AttachmentField
                  key={attachment?.id || attachment.name}
                  attachment={attachment}
                  isLast
                  label={'File'}
                  testID="file-field"
                  accessibilityLabel={t`File field`}
                  inputTestID="file-input-field"
                  inputAccessibilityLabel={t`File input field`}
                  additionalItems={
                    <ButtonLittle
                      startIcon={DeleteIcon}
                      variant="secondary"
                      borderRadius="md"
                      onPress={() => handleAttachmentDelete(index)}
                    />
                  }
                />
              ))}
            </FormGroup>

            <MultiSlotInput
              label={t`Custom fields`}
              placeholder={t`Add comment`}
              addButtonLabel={t`Add another comment`}
              values={(customFieldsList as Array<{ type: string; note: string }>).map((f) => f.note ?? '')}
              onAdd={() => addCustomField({ type: 'note', note: '' })}
              onChangeItem={(index: number, val: string) => {
                setValue(`customFields[${index}].note`, val)
              }}
              onRemove={(index: number) => removeCustomField(index)}
              errorMessage={(errors as Record<string, {error?: {note?: string}}[]>)?.customFields?.find(Boolean)?.error?.note}
              testID="custom-fields-multi-slot-input"
            />
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}