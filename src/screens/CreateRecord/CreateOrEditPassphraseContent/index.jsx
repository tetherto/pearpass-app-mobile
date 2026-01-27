import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { ApplicationIcon } from 'pearpass-lib-ui-react-native-components'
import { RECORD_TYPES, useCreateRecord, useRecords } from 'pearpass-lib-vault'

import { CreateCustomField } from '../../../components/CreateCustomField'
import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { PassPhrase } from '../../../containers/PassPhrase'
import { useLoadingContext } from '../../../context/LoadingContext'
import { InputField } from '../../../libComponents'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from '../ScrollViewFormWrapper/styles'

/**
 * @param {{
 *   initialRecord?: {
 *     data: {
 *       title: string,
 *       passPhrase: string,
 *       note?: string,
 *       customFields?: Array<{note: string}>
 *     },
 *     folder?: string
 *   },
 *   selectedFolder?: string
 * }} props
 * @returns {JSX.Element}
 */

export const CreateOrEditPassphraseContent = ({
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

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`),
    passPhrase: Validator.string().required(t`Recovery phrase is required`),
    note: Validator.string(),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Note is required`)
      })
    ),
    folder: Validator.string()
  })

  const { register, handleSubmit, registerArray, values, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      passPhrase: initialRecord?.data?.passPhrase ?? '',
      comment: initialRecord?.data?.comment ?? '',
      customFields: initialRecord?.data.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder
    },
    validate: (values) => schema.validate(values)
  })

  const onSubmit = async (values) => {
    if (isLoading) {
      return
    }
    const data = {
      type: RECORD_TYPES.PASS_PHRASE,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: values.title,
        passPhrase: values.passPhrase,
        comment: values.comment,
        customFields: values.customFields
      }
    }

    try {
      setIsLoading(true)

      if (initialRecord) {
        await updateRecords([
          {
            ...initialRecord,
            ...data
          }
        ])
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
                label={t`Application`}
                placeholder={t`Insert Application name`}
                variant="outline"
                icon={ApplicationIcon}
                isLast
                isFirst
                {...register('title')}
              />
            </FormGroup>
            <FormGroup>
              <PassPhrase isCreateOrEdit {...register('passPhrase')} />
            </FormGroup>

            <FormGroup>
              <InputFieldNote isFirst isLast {...register('comment')} />
            </FormGroup>

            <CustomFields
              customFields={customFieldsList}
              register={registerCustomFieldItem}
              removeItem={removeCustomField}
            />

            <FormGroup>
              <CreateCustomField
                onCreateCustom={(type) =>
                  addCustomField({ type: type, name: type })
                }
              />
            </FormGroup>
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}
