import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import {
  DeleteIcon,
  KeyIcon,
  PasswordIcon,
  PlusIcon,
  UserIcon,
  WebsiteIcon
} from 'pearpass-lib-ui-react-native-components'
import { RECORD_TYPES, useCreateRecord, useRecords } from 'pearpass-lib-vault'
import Toast from 'react-native-toast-message'

import { CreateCustomField } from '../../../components/CreateCustomField'
import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { AttachmentField } from '../../../containers/AttachmentField'
import { BottomSheetPassGeneratorContent } from '../../../containers/BottomSheetPassGeneratorContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import {
  ButtonLittle,
  CompoundField,
  InputField,
  PasswordField
} from '../../../libComponents'
import { addHttps } from '../../../utils/addHttps'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { formatPasskeyDate } from '../../../utils/formatPasskeyDate'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from '../ScrollViewFormWrapper/styles'

export const CreateOrEditLoginContent = ({ initialRecord, selectedFolder }) => {
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
    title: Validator.string().required(t`Title is required`),
    username: Validator.string(),
    password: Validator.string(),
    note: Validator.string(),
    websites: Validator.array().items(
      Validator.object({
        website: Validator.string().website('Wrong format of website')
      })
    ),
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
      title: initialRecord?.data?.title ?? '',
      username: initialRecord?.data?.username ?? '',
      password: initialRecord?.data?.password ?? '',
      note: initialRecord?.data?.note ?? '',
      websites: initialRecord?.data?.websites?.length
        ? initialRecord?.data?.websites.map((website) => ({ website }))
        : [{ name: 'website' }],
      customFields: initialRecord?.data.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? [],
      credential: initialRecord?.data?.credential?.id ?? '',
      passkeyCreatedAt: initialRecord?.data?.passkeyCreatedAt ?? null
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
      type: RECORD_TYPES.LOGIN,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        ...(initialRecord?.data ? initialRecord.data : {}),
        title: values.title,
        username: values.username,
        password: values.password,
        note: values.note,
        websites: values.websites
          .map((website) => {
            if (!!website?.website?.trim().length) {
              return addHttps(website.website)
            }
          })
          .filter((website) => !!website?.trim().length),
        customFields: values.customFields,
        attachments: convertBase64FilesToUint8(values.attachments),
        passwordUpdatedAt: initialRecord?.data?.passwordUpdatedAt
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

  const {
    value: websitesList,
    addItem,
    registerItem,
    removeItem
  } = registerArray('websites')

  const {
    value: customFieldsList,
    addItem: addCustomField,
    registerItem: registerCustomFieldItem,
    removeItem: removeCustomField
  } = registerArray('customFields')

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
                isLast
                isFirst
                testID="title-field"
                accessibilityLabel={t`Title field`}
                inputAccessibilityLabel={t`Title input field`}
                {...register('title')}
              />
            </FormGroup>
            <FormGroup>
              <InputField
                icon={UserIcon}
                label={t`Email or username`}
                placeholder={t`Email or username`}
                isFirst
                variant="outline"
                testID="email-username-field"
                accessibilityLabel={t`Email or Username field`}
                inputAccessibilityLabel={t`Email or username input field`}
                {...register('username')}
              />

              <PasswordField
                icon={KeyIcon}
                label={t`Password`}
                placeholder={t`Insert password`}
                variant="outline"
                isLast
                hasStrongness
                testID="password-field"
                accessibilityLabel={t`Password input field`}
                inputAccessibilityLabel={t`Password input field`}
                toggleVisibilityTestID="toggle-password-visibility-button"
                toggleVisibilityAccessibilityLabel={t`Toggle password visibility`}
                {...register('password')}
                additionalItems={
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

            {!!values?.credential && (
              <FormGroup>
                <InputField
                  icon={KeyIcon}
                  label={t`Passkey`}
                  placeholder={t`Passkey`}
                  variant="outline"
                  value={
                    formatPasskeyDate(values.passkeyCreatedAt) ||
                    t`Passkey Stored`
                  }
                  isFirst
                  isLast
                  isDisabled
                  editable={false}
                />
              </FormGroup>
            )}

            <CompoundField>
              <FormGroup>
                {websitesList.map((website, index) => (
                  <InputField
                    key={website.id}
                    icon={WebsiteIcon}
                    label={t`Website`}
                    placeholder={t`https://`}
                    isFirst={index === 0}
                    testID="website-field"
                    accessibilityLabel={t`Website URL input field`}
                    inputAccessibilityLabel={t`Website URL input field`}
                    {...registerItem('website', index)}
                    additionalItems={
                      index === 0 ? (
                        <ButtonLittle
                          startIcon={PlusIcon}
                          variant="secondary"
                          borderRadius="md"
                          testID="add-website-field-button"
                          accessibilityLabel={t`Add another website field`}
                          onPress={() => addItem({ name: 'website' })}
                        />
                      ) : (
                        <ButtonLittle
                          startIcon={DeleteIcon}
                          variant="secondary"
                          borderRadius="md"
                          onPress={() => removeItem(index)}
                        />
                      )
                    }
                  />
                ))}
              </FormGroup>
            </CompoundField>

            <FormGroup>
              <AttachmentField
                onUpload={handleFileUpload}
                isLast
                label={'File'}
                testID="file-field"
                accessibilityLabel={t`File field`}
                inputTestID="file-input-field"
                inputAccessibilityLabel={t`File input field`}
                addButtonTestID="add-file-button"
                addButtonAccessibilityLabel={t`Add file button`}
              />
              {values.attachments.map((attachment, index) => (
                <AttachmentField
                  key={attachment?.id || attachment.name}
                  attachment={attachment}
                  isLast
                  label={'File'}
                  testID="file-field"
                  accessibilityLabel={t`File field`}
                  inputTestID="file-input-field"
                  inputAccessibilityLabel={t`File input field`}
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

            <FormGroup>
              <InputFieldNote
                isFirst
                isLast
                testID="add-note-field"
                accessibilityLabel={t`Add comment field`}
                inputAccessibilityLabel={t`Add comment input field`}
                {...register('note')}
              />
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
                testID="create-custom-field"
                accessibilityLabel={t`Create custom field`}
              />
            </FormGroup>
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}
