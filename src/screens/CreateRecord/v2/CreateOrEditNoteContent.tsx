import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { InputField, MultiSlotInput, TextArea, UploadField } from '@tetherto/pearpass-lib-ui-kit'
import type { UploadedFile } from '@tetherto/pearpass-lib-ui-kit'
import { RECORD_TYPES, useCreateRecord, useRecords } from '@tetherto/pearpass-lib-vault'
import Toast from 'react-native-toast-message'
import { handleChooseFile } from '../../../utils/handleChooseFile'

import { FormGroup } from '../../../components/FormGroup'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
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
  attachments?: UploadedFile[]
}

type Props = {
  initialRecord?: NoteRecord
  selectedFolder?: string
}

const MAX_ATTACHMENTS = 5

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
    notes: Validator.array().items(Validator.string()),
    folder: Validator.string(),
    attachments: Validator.array().items(Validator.object({
      name: Validator.string().required()
    }))
  })

  const { register, handleSubmit, values, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      note: initialRecord?.data?.note ?? '',
      notes: initialRecord?.data?.customFields
        ?.filter((f: any) => f.type === 'note')
        ?.map((f: any) => f.note ?? '') ?? [''],
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
        customFields: (values.notes as string[])
          .filter((n: string) => !!n?.trim().length)
          .map((n: string) => ({ type: 'note', note: n })),
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

  const handleFilesChange = (files: UploadedFile[]) => {
    setValue('attachments', files)
  }

  const handleUploadPress = () => {
    const currentFiles = values.attachments as UploadedFile[]
    if (currentFiles.length >= MAX_ATTACHMENTS) return

    handleChooseFile(
      ({ base64, name }: { base64: string; name: string }) => {
        const newFile: UploadedFile = {
          file: null as unknown as File,
          name,
          size: Math.round((base64.length * 3) / 4),
          type: 'application/octet-stream',
          // @ts-ignore
          base64
        }
        setValue('attachments', [...currentFiles, newFile])
      },
      () => {
        Toast.show({
          type: 'baseToast',
          text1: t`File is too large`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    )
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
              <UploadField
                files={values.attachments as UploadedFile[]}
                onFilesChange={handleFilesChange}
                onPress={handleUploadPress}
                uploadLinkText={t`Click to upload`}
                uploadSuffixText={t`or drag and drop`}
                maxFiles={MAX_ATTACHMENTS}
                testID="attachments-upload-field"
              />
            </FormGroup>

            <MultiSlotInput
              label={t`Notes`}
              placeholderText={t`Add note`}
              addButtonLabel={t`Add another note`}
              values={values.notes as string[]}
              onChange={(updated: string[]) => setValue('notes', updated)}
              testID="notes-multi-slot-input"
            />
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}
