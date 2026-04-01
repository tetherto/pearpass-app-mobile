import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { PasswordIcon, WifiIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { RECORD_TYPES, useCreateRecord, useRecords } from '@tetherto/pearpass-lib-vault'
import { InputField, MultiSlotInput, PasswordField } from '@tetherto/pearpass-lib-ui-kit'

import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { BottomSheetPassGeneratorContent } from '../../../containers/BottomSheetPassGeneratorContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useLoadingContext } from '../../../context/LoadingContext'
import { ButtonLittle } from '../../../libComponents'
import { logger } from '../../../utils/logger'
import { adaptRegister } from './CreateOrEditLoginContent'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from './styles'

type WifiRecord = {
  data?: {
    title?: string
    password?: string
    customFields?: unknown[]
  }
  folder?: string
  isFavorite?: boolean
}

type Props = {
  initialRecord?: WifiRecord
  selectedFolder?: string
}

export const CreateOrEditWifiPasswordContent = ({ initialRecord, selectedFolder }: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { expand } = useBottomSheet()
  const { setIsLoading, isLoading } = useLoadingContext()

  const { createRecord } = useCreateRecord({
    onCompleted: () => navigation.goBack()
  })

  const { updateRecords } = useRecords({
    onCompleted: () => navigation.goBack()
  })

  const schema = Validator.object({
    title: Validator.string().required(t`Name is required`),
    password: Validator.string().required(t`Password is required`),
    notes: Validator.array().items(Validator.string()),
    folder: Validator.string()
  })

  const { register, handleSubmit, values, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      password: initialRecord?.data?.password ?? '',
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
      type: RECORD_TYPES.WIFI_PASSWORD,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: values.title,
        password: values.password,
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
              label={t`Wi-Fi Name`}
              placeholderText={t`Insert Wi-Fi Name`}
              testID="wifi-name-input-field"
              {...adaptRegister(register('title'))}
            />

            <PasswordField
              label={t`Wi-Fi Password`}
              placeholderText={t`Insert Wi-Fi Password`}
              testID="wifi-password-input-field"
              // rightSlot={
              //   <ButtonLittle
              //     startIcon={PasswordIcon}
              //     variant="secondary"
              //     borderRadius="md"
              //     testID="password-generator-button"
              //     accessibilityLabel={t`Password generator button`}
              //     onPress={() =>
              //       expand({
              //         children: (
              //           <BottomSheetPassGeneratorContent
              //             onPasswordInsert={(value: string) =>
              //               setValue('password', value)
              //             }
              //           />
              //         ),
              //         snapPoints: ['10%', '75%', '75%']
              //       })
              //     }
              //   />
              // }
              {...adaptRegister(register('password'))}
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
