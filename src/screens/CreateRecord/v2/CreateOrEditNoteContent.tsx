import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { DeleteIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { InputField, MultiSlotInput, TextArea } from '@tetherto/pearpass-lib-ui-kit'
import { RECORD_TYPES, useCreateRecord, useRecords } from '@tetherto/pearpass-lib-vault'
import Toast from 'react-native-toast-message'

import { AttachmentField } from '../../../containers/AttachmentField'
import { FormGroup } from '../../../components/FormGroup'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { ButtonLittle } from '../../../libComponents'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import { adaptRegister } from './CreateOrEditLoginContent'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from './styles'

type NoteRecord = {
  data?: {
    title?: string
    note?: string
    customFields?: unknown[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: any[]
}

type Props = {
  initialRecord?: NoteRecord
  selectedFolder?: string
}

export const CreateOrEditNoteContent = ({ initialRecord, selectedFolder }: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { setIsLoading, isLoading } = useLoadingContext()

  const { createRecord } = useCreateRecord({
    onCompleted: () => {
      navigation.goBack()
    }
  })

  const { updateRecords } = useRecords({
    onCompleted: () => {
      navigation.goBack()
    }
  })

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`),
    note: Validator.string(),
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
      title: initialRecord?.data?.title ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? []
    },
    validate: (values) => schema.validate(values)
  })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  const {
    value: customFieldsList,
    addItem: addCustomField,
    registerItem: registerCustomFieldItem,
    removeItem: removeCustomField
  } = registerArray('customFields')

  const onError = (error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const onSubmit = async (values) => {
    if (isLoading) {
      return
    }

    const data = {
      type: RECORD_TYPES.NOTE,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: values.title,
        note: values.note,
        customFields: values.customFields,
        attachments: convertBase64FilesToUint8(values.attachments)
      }
    }

    try {
      setIsLoading(true)

      if (initialRecord) {
        await updateRecords(
          [
            {
              ...initialRecord,
              ...data
            }
          ],
          onError
        )
      } else {
        await createRecord(data, onError)
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      logger.error(error)
    }
  }

  const handleFileUpload = (file) => {
    if (!file) {
      return
    }

    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentDelete = (index) => {
    const updatedAttachments = values.attachments.filter((_, idx) => idx !== index)
    setValue('attachments', updatedAttachments)
  }

  return (
    <Wrapper>
      <Header>
        <ToolbarCreateOrEditCategory
          isLoading={isLoading}
          selectedFolder={values.folder}
          onFolderSelect={(folder) =>
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
              placeholderText={t`No title`}
              testID="title-input-field"
              {...adaptRegister(register('title'))}
            />

            <FormGroup>
              <TextArea
                label={t`Note`}
                placeholder={t`Write a comment...`}
                testID="add-note"
                {...adaptRegister(register('note'))}
              />
            </FormGroup>

            <FormGroup>
              <AttachmentField
                onUpload={handleFileUpload}
                isLast
                label={'File'}
              />
              {values.attachments.map((attachment, index) => (
                <AttachmentField
                  key={attachment?.id || attachment.name}
                  attachment={attachment}
                  isLast
                  label={'File'}
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
              label={t`Notes`}
              placeholder={t`Add note`}
              addButtonLabel={t`Add another note`}
              values={(customFieldsList as Array<{ type: string; note: string }>).map((f) => f.note ?? '')}
              onAdd={() => addCustomField({ type: 'note', note: '' })}
              onChangeItem={(index: number, val: string) => {
                setValue(`customFields[${index}].note`, val)
              }}
              onRemove={(index: number) => removeCustomField(index)}
              errorMessage={(errors as any)?.customFields?.find(Boolean)?.error?.note}
              testID="notes-multi-slot-input"
            />
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}