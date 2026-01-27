import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { PasswordIcon, WifiIcon } from 'pearpass-lib-ui-react-native-components'
import { RECORD_TYPES, useCreateRecord, useRecords } from 'pearpass-lib-vault'
import { Platform } from 'react-native'

import { CreateCustomField } from '../../../components/CreateCustomField'
import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { BottomSheetPassGeneratorContent } from '../../../containers/BottomSheetPassGeneratorContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useLoadingContext } from '../../../context/LoadingContext'
import { ButtonLittle, InputField, PasswordField } from '../../../libComponents'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from '../ScrollViewFormWrapper/styles'

/**
 *
 * @param {Object} [initialRecord] - Existing record data for editing
 * @param {Object} [initialRecord.data] - Record data containing title, password, note, customFields
 * @param {string} [initialRecord.data.title] - Wi-Fi network name
 * @param {string} [initialRecord.data.password] - Wi-Fi password
 * @param {string} [initialRecord.data.note] - Additional notes
 * @param {Array} [initialRecord.data.customFields] - Custom field objects
 * @param {boolean} [initialRecord.isFavorite] - Whether record is marked as favorite
 * @param {string} [initialRecord.folder] - Folder name where record is stored
 * @param {Object} [selectedFolder] - Pre-selected folder
 * @param {string} [selectedFolder.name] - Name of the selected folder
 * @returns {JSX.Element}
 */
export const CreateOrEditWifiPasswordContent = ({
  initialRecord,
  selectedFolder
}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { expand } = useBottomSheet()
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
    title: Validator.string().required(t`Name is required`),
    password: Validator.string().required(t`Password is required`),
    comment: Validator.string(),
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
      password: initialRecord?.data?.password ?? '',
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
      type: RECORD_TYPES.WIFI_PASSWORD,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: values.title,
        password: values.password,
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
                icon={WifiIcon}
                label={t`Wi-Fi Name`}
                placeholder={t`Insert Wi-Fi Name`}
                variant="outline"
                isLast
                isFirst
                {...register('title')}
              />
            </FormGroup>
            <FormGroup>
              <PasswordField
                icon={PasswordIcon}
                label={t`Wi-Fi Password`}
                placeholder={t`Insert Wi-Fi Password`}
                variant="outline"
                isLast
                hasStrongness
                shouldDisplayCustomPlaceholder={Platform.OS === 'android'}
                {...register('password')}
                additionalItems={
                  <ButtonLittle
                    startIcon={PasswordIcon}
                    variant="secondary"
                    borderRadius="md"
                    onPress={() =>
                      expand({
                        children: (
                          <BottomSheetPassGeneratorContent
                            onPasswordInsert={(value) =>
                              setValue('password', value)
                            }
                          />
                        ),
                        snapPoints: ['10%', '75%', '75%']
                      })
                    }
                  />
                }
              />
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
