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
    customFields?: unknown[]
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
    notes: Validator.array().items(Validator.string()),
    folder: Validator.string()
  })

  const { register, handleSubmit, values, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      passPhrase: initialRecord?.data?.passPhrase ?? '',
      notes: initialRecord?.data?.customFields
        ?.filter((f: any) => f.type === 'note')
        ?.map((f: any) => f.note ?? '') ?? [''],
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
        customFields: (values.notes as string[])
          .filter((n: string) => !!n?.trim().length)
          .map((n: string) => ({ type: 'note', note: n }))
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
