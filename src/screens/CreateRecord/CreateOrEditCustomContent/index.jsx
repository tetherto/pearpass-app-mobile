import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { DeleteIcon } from 'pearpass-lib-ui-react-native-components'
import { RECORD_TYPES, useCreateRecord, useRecords } from 'pearpass-lib-vault'
import Toast from 'react-native-toast-message'

import { CreateCustomField } from '../../../components/CreateCustomField'
import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { AttachmentField } from '../../../containers/AttachmentField'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { ButtonLittle, InputField } from '../../../libComponents'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from '../ScrollViewFormWrapper/styles'

export const CreateOrEditCustomContent = ({
  initialRecord,
  selectedFolder
}) => {
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

  const onError = (error) => {
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

  const { register, handleSubmit, registerArray, values, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title || '',
      customFields: initialRecord?.data?.customFields || [],
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
    value: list,
    addItem,
    registerItem,
    removeItem
  } = registerArray('customFields')

  const onSubmit = async (values) => {
    if (isLoading) {
      return
    }

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
    } catch (error) {
      logger.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (file) => {
    if (!file) {
      return
    }

    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentDelete = (index) => {
    const updatedAttachments = values.attachments.filter(
      (_, idx) => idx !== index
    )
    setValue('attachments', updatedAttachments)
  }

  return (
    <Wrapper>
      <Header>
        <ToolbarCreateOrEditCategory
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
            <FormGroup>
              <InputField
                label={t`Title`}
                placeholder={t`No title`}
                variant="outline"
                {...register('title')}
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

            <CustomFields
              removeItem={removeItem}
              customFields={list}
              register={registerItem}
            />

            <FormGroup>
              <CreateCustomField
                onCreateCustom={(type) => addItem({ type: type, name: type })}
              />
            </FormGroup>
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}
