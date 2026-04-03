import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { PasswordIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
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
    note?: string
    customFields?: Array<{ type: string; note: string }>
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
      password: initialRecord?.data?.password ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
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
    registerItem: registerCustomFieldItem,
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
              label={t`Wi-Fi Name`}
              placeholder={t`Insert Wi-Fi Name`}
              testID="wifi-name-input-field"
              {...adaptRegister(register('title'))}
            />

            <PasswordField
              label={t`Wi-Fi Password`}
              placeholder={t`Insert Wi-Fi Password`}
              testID="wifi-password-input-field"
              rightSlot={
                <ButtonLittle
                  startIcon={PasswordIcon}
                  variant="secondary"
                  borderRadius="md"
                  testID="password-generator-button"
                  accessibilityLabel={t`Password generator button`}
                  onPress={() =>
                    expand({
                      children: (
                        <BottomSheetPassGeneratorContent
                          onPasswordInsert={(value: string) =>
                            setValue('password', value)
                          }
                        />
                      ),
                      snapPoints: ['10%', '75%', '75%']
                    })
                  }
                />
              }
              {...adaptRegister(register('password'))}
            />

            <InputField
              label={t`Comment`}
              placeholder={t`Add comment`}
              testID="add-note-field"
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