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
  PasswordField,
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

type CreditCardRecord = {
  data?: {
    title?: string
    name?: string
    number?: string
    expireDate?: string
    securityCode?: string
    pinCode?: string
    note?: string
    customFields?: unknown[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: unknown[]
}

type Props = {
  initialRecord?: CreditCardRecord
  selectedFolder?: string
}

export const CreateOrEditCreditCardContent = ({ initialRecord, selectedFolder }: Props) => {
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
    name: Validator.string(),
    number: Validator.string(),
    expireDate: Validator.string(),
    securityCode: Validator.string().numeric(t`Should contain only numbers`),
    pinCode: Validator.string().numeric(t`Should contain only numbers`),
    note: Validator.string(),
    notes: Validator.array().items(Validator.string()),
    folder: Validator.string(),
    attachments: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    )
  })

  const { values, register, handleSubmit, registerArray, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      name: initialRecord?.data?.name ?? '',
      number: initialRecord?.data?.number ?? '',
      expireDate: initialRecord?.data?.expireDate ?? '',
      securityCode: initialRecord?.data?.securityCode ?? '',
      pinCode: initialRecord?.data?.pinCode ?? '',
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
      type: RECORD_TYPES.CREDIT_CARD,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: values.title,
        name: values.name,
        number: values.number,
        expireDate: values.expireDate,
        securityCode: values.securityCode,
        pinCode: values.pinCode,
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

  const handleExpireDateChange = (inputValue) => {
    let value = inputValue.replace(/\D/g, '')

    if (value.length > 4) {
      value = value.slice(0, 4)
    }

    if (value.length > 2) {
      value = `${value.slice(0, 2)} ${value.slice(2)}`
    }

    setValue('expireDate', value)
  }
  const handleCardNumberChange = (inputValue) => {
    let value = inputValue.replace(/\D/g, '')

    if (value.length > 16) {
      value = value.slice(0, 16)
    }

    if (value.length > 0) {
      value = value.match(/.{1,4}/g).join(' ')
    }

    setValue('number', value)
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
                testID="title-field-input"
                {...adaptRegister(register('title'))}
              />
            </FormGroup>
            <FormGroup>
              <InputField
                label={t`Name on card`}
                placeholderText={t`John Smith`}
                testID="name-on-card-input-field"
                {...adaptRegister(register('name'))}
              />
              <InputField
                label={t`Number on card`}
                placeholderText={t`1234 1234 1234 1234`}
                testID="number-on-card-input-field"
                value={values.number}
                onChangeText={handleCardNumberChange}
              />

              <InputField
                label={t`Date of expire`}
                placeholderText={t`MM YY`}
                testID="date-of-expire-input-field"
                value={values.expireDate}
                onChangeText={handleExpireDateChange}
              />
              <PasswordField
                testID="security-code-input-field"
                label={t`Security code`}
                placeholderText={t`123`}
                {...adaptRegister(register('securityCode'))}
              />
              <PasswordField
                testID="pin-code-input-field"
                label={t`Pin code`}
                placeholderText={t`1234`}
                {...adaptRegister(register('pinCode'))}
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
