import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import {
  InputField,
  MultiSlotInput,
  UploadField
} from '@tetherto/pearpass-lib-ui-kit'
import type { UploadedFile } from '@tetherto/pearpass-lib-ui-kit'
import Toast from 'react-native-toast-message'

import { FormGroup } from '../../../components/FormGroup'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { adaptRegister } from './CreateOrEditLoginContent'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { handleChooseFile } from '../../../utils/handleChooseFile'
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
    customFields: Validator.array().items(Validator.string()),
    folder: Validator.string(),
    attachments: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    )
  })

  const { register, handleSubmit, values, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title || '',
      customFields: initialRecord?.data?.customFields
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
        customFields: (values.customFields as string[])
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
      logger.error(error)
      setIsLoading(false)
    }
  }

  const MAX_ATTACHMENTS = 5

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
            <FormGroup>
              <InputField
                label={t`Title`}
                placeholderText={t`No title`}
                testID="title-input-field"
                {...adaptRegister(register('title'))}
              />
            </FormGroup>

            <UploadField
              files={values.attachments as UploadedFile[]}
              onFilesChange={handleFilesChange}
              onPress={handleUploadPress}
              uploadLinkText={t`Click to upload`}
              uploadSuffixText={t`or drag and drop`}
              maxFiles={MAX_ATTACHMENTS}
              testID="attachments-upload-field"
            />

            <MultiSlotInput
              label={t`Notes`}
              placeholderText={t`Add note`}
              addButtonLabel={t`Add another note`}
              values={values.customFields as string[]}
              onChange={(updated: string[]) => setValue('customFields', updated)}
              testID="notes-multi-slot-input"
            />
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}