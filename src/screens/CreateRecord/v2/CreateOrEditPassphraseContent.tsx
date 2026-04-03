import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { RECORD_TYPES, useCreateRecord, useRecords } from '@tetherto/pearpass-lib-vault'
import { InputField, MultiSlotInput } from '@tetherto/pearpass-lib-ui-kit'

import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { PassPhrase } from '../../../containers/PassPhrase'
import { useLoadingContext } from '../../../context/LoadingContext'
import { logger } from '../../../utils/logger'
import { adaptRegister } from './CreateOrEditLoginContent'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from './styles'

type PassphraseRecord = {
  data?: {
    title?: string
    passPhrase?: string
    note?: string
    customFields?: Array<{ type: string; note?: string }>
  }
  folder?: string
  isFavorite?: boolean
}

type Props = {
  initialRecord?: PassphraseRecord
  selectedFolder?: string
}

export const CreateOrEditPassphraseContent = ({ initialRecord, selectedFolder }: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { setIsLoading, isLoading } = useLoadingContext()

  const { createRecord } = useCreateRecord({
    onCompleted: () => navigation.goBack()
  })

  const { updateRecords } = useRecords({
    onCompleted: () => navigation.goBack()
  })

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`),
    passPhrase: Validator.string().required(t`Recovery phrase is required`),
    note: Validator.string(),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Comment is required`)
      })
    ),
    folder: Validator.string()
  })

  const { register, handleSubmit, registerArray, values, setValue, errors } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      passPhrase: initialRecord?.data?.passPhrase ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder
    },
    validate: (values) => schema.validate(values)
  })

  const onSubmit = async (values: any) => {
    if (isLoading) return

    const data = {
      type: RECORD_TYPES.PASS_PHRASE,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: values.title,
        passPhrase: values.passPhrase,
        note: values.note,
        customFields: values.customFields
      }
    }

    try {
      setIsLoading(true)

      if (initialRecord) {
        await updateRecords([{ ...initialRecord, ...data }])
      } else {
        await createRecord(data)
      }

      setIsLoading(false)
    } catch (error) {
      logger.error(error)
      setIsLoading(false)
    }
  }

  const {
    value: customFieldsList,
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  return (
    <Wrapper>
      <Header>
        <ToolbarCreateOrEditCategory
          isLoading={isLoading}
          selectedFolder={values.folder}
          onFolderSelect={(folder: any) =>
            setValue('folder', folder.name === values.folder ? '' : folder.name)
          }
          onSave={handleSubmit(onSubmit)}
        />
      </Header>

      <ScrollContainer>
        <ScrollView>
          <FormWrapper>
            <InputField
              label={t`Application`}
              placeholderText={t`Insert Application name`}
              testID="application-name-input-field"
              {...adaptRegister(register('title'))}
            />

            <PassPhrase isCreateOrEdit {...register('passPhrase')} />

            <InputField
              label={t`Note`}
              placeholderText={t`Add note`}
              testID="note-input-field"
              {...adaptRegister(register('note'))}
            />

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
              errorMessage={(errors as any)?.customFields?.find(Boolean)?.error?.note}
              testID="custom-fields-multi-slot-input"
            />
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}
