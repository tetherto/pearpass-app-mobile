import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { AUTHENTICATOR_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  KeyIcon,
  LockIcon,
  PasswordIcon,
  UserIcon,
  DeleteIcon,
  WebsiteIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import {
  InputField,
  MultiSlotInput,
  UploadField,
  PasswordField
} from '@tetherto/pearpass-lib-ui-kit'
import type { UploadedFile } from '@tetherto/pearpass-lib-ui-kit'
import Toast from 'react-native-toast-message'
import { AttachmentField } from '../../../containers/AttachmentField'
import { FormGroup } from '../../../components/FormGroup'


import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { BottomSheetPassGeneratorContent } from '../../../containers/BottomSheetPassGeneratorContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { ButtonLittle } from '../../../libComponents'
import { addHttps } from '../../../utils/addHttps'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { formatPasskeyDate } from '../../../utils/formatPasskeyDate'
import { handleChooseFile } from '../../../utils/handleChooseFile'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from './styles'

interface Props {
  initialRecord?: any
  selectedFolder?: string
}

// todo: do we even need it? if it is al lthe same?
export function adaptRegister(reg: {
  value: string
  name: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void
}) {
  return {
    value: reg.value,
    error: reg.error,
    name: reg.name,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => reg.onChange(e),
  }
}

export const CreateOrEditLoginContent = ({
  initialRecord,
  selectedFolder
}: Props) => {
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
    title: Validator.string().required(t`Title is required`),
    username: Validator.string(),
    password: Validator.string(),
    otpSecret: Validator.string(),
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

  const { register, handleSubmit, registerArray, values, setValue, errors } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      username: initialRecord?.data?.username ?? '',
      password: initialRecord?.data?.password ?? '',
      otpSecret:
        initialRecord?.data?.otpInput ??
        initialRecord?.data?.otp?.secret ??
        '',
      note: initialRecord?.data?.note ?? '',
      websites: initialRecord?.data?.websites?.length
        ? initialRecord.data.websites.map((website) => ({ website }))
        : [{ name: 'website' }],
      customFields: initialRecord?.data?.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? [],
      credential: initialRecord?.data?.credential?.id ?? '',
      passkeyCreatedAt: initialRecord?.data?.passkeyCreatedAt ?? null
    },
    validate: (values: any) => schema.validate(values)
  })

  


  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  const onError = (error: Error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const onSubmit = async (values: any) => {
    if (isLoading) return

    const otpInput = values.otpSecret?.trim() || undefined

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
        otpInput,
        websites: (values.websites as Array<{ website: string }>)
          .map((item) => {
            if (!!item?.website?.trim().length) {
              return addHttps(item.website)
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
          [{ ...initialRecord, ...data }],
          onError
        )
      } else {
        await createRecord(data, onError)
      }

      setIsLoading(false)
    } catch (error: any) {
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
          isLoading={isLoading}
          selectedFolder={values.folder}
          onFolderSelect={(folder: any) =>
            setValue(
              'folder',
              folder.name === values.folder ? '' : folder.name
            )
          }
          onSave={handleSubmit(onSubmit)}
        />
      </Header>

      <ScrollContainer>
        <ScrollView>
          <FormWrapper>

            <InputField
              label={t`Title`}
              placeholder={t`No title`}
              testID="title-field"
              {...adaptRegister(register('title'))}
            />

            <InputField
              label={t`Email or username`}
              placeholder={t`Email or username`}
              leftSlot={<UserIcon />}
              testID="email-username-field"
              {...adaptRegister(register('username'))}
            />

            <PasswordField
              label={t`Password`}
              placeholder={t`Insert password`}
              leftSlot={<KeyIcon />}
              testID="password-field"
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

            {AUTHENTICATOR_ENABLED && (
              <InputField
                label={t`Authenticator Secret Key`}
                placeholder={t`Enter Secret Key or otpauth:// URI`}
                inputType="password"
                leftSlot={<LockIcon />}
                testID="otp-secret-field"
                {...adaptRegister(register('otpSecret'))}
              />
            )}

            {!!values?.credential && (
              <InputField
                label={t`Passkey`}
                placeholder={t`Passkey`}
                leftSlot={<KeyIcon />}
                value={
                  formatPasskeyDate(values.passkeyCreatedAt) ||
                  t`Passkey Stored`
                }
                onChange={() => { }}
              />
            )}

            <MultiSlotInput
              label={t`Website`}
              placeholder="https://"
              leftSlot={<WebsiteIcon />}
              addButtonLabel={t`Add another website`}
              values={(websitesList as Array<{ website?: string }>).map((w) => w?.website ?? '')}
              onAdd={() => addItem({ name: 'website' })}
              onChangeItem={(index: number, val: string) => {
                setValue(`websites[${index}].website`, val)
              }}
              onRemove={(index: number) => removeItem(index)}
              errorMessage={(errors as any)?.websites?.find(Boolean)?.error?.website}
              testID="website-multi-slot-input"
            />

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
              values={(values.customFields as Array<{ type: string; note: string }>).map((f) => f.note ?? '')}
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
