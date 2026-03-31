import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  CalendarIcon,
  CreditCardIcon,
  DeleteIcon,
  NineDotsIcon,
  UserIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import Toast from 'react-native-toast-message'

import { CreateCustomField } from '../../../components/CreateCustomField'
import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { AttachmentField } from '../../../containers/AttachmentField'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { ButtonLittle, InputField, PasswordField } from '../../../libComponents'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from './styles'

export const CreateOrEditCreditCardContent = ({
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
    name: Validator.string(),
    number: Validator.string(),
    expireDate: Validator.string(),
    securityCode: Validator.string().numeric(t`Should contain only numbers`),
    pinCode: Validator.string().numeric(t`Should contain only numbers`),
    note: Validator.string(),
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

  const { values, register, handleSubmit, registerArray, setValue } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      name: initialRecord?.data?.name ?? '',
      number: initialRecord?.data?.number ?? '',
      expireDate: initialRecord?.data?.expireDate ?? '',
      securityCode: initialRecord?.data?.securityCode ?? '',
      pinCode: initialRecord?.data?.pinCode ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields ?? [],
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
        customFields: values.customFields,
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

  const {
    value: list,
    addItem,
    registerItem,
    removeItem
  } = registerArray('customFields')

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
                accessibilityLabel="Title field"
                inputAccessibilityLabel="Title input field"
                testID="title-field-input"
                label={t`Title`}
                placeholder={t`No title`}
                variant="outline"
                {...register('title')}
              />
            </FormGroup>
            <FormGroup>
              <InputField
                accessibilityLabel="Name on card field"
                inputAccessibilityLabel="Name on card input field"
                testID="name-on-card-input-field"
                icon={UserIcon}
                label={t`Name on card`}
                placeholder={t`John Smith`}
                variant="outline"
                {...register('name')}
              />
              <InputField
                accessibilityLabel="Number on card field"
                inputAccessibilityLabel="Number on card input field"
                testID="number-on-card-input-field"
                icon={CreditCardIcon}
                type="numeric"
                label={t`Number on card`}
                placeholder={t`1234 1234 1234 1234 `}
                variant="outline"
                value={values.number}
                onChange={handleCardNumberChange}
              />

              <InputField
                accessibilityLabel="Date of expire field"
                inputAccessibilityLabel="Date of expire input field"
                testID="date-of-expire-input-field"
                icon={CalendarIcon}
                label={t`Date of expire`}
                type="numeric"
                placeholder={t`MM YY`}
                variant="outline"
                value={values.expireDate}
                onChange={handleExpireDateChange}
              />
              <PasswordField
                accessibilityLabel="Security code field"
                inputAccessibilityLabel="Security doe input field"
                testID="security-code-input-field"
                type="numeric"
                icon={CreditCardIcon}
                label={t`Security code`}
                placeholder={t`123`}
                variant="outline"
                {...register('securityCode')}
              />
              <PasswordField
                accessibilityLabel="Pin code field"
                inputAccessibilityLabel="Pin code input field"
                testID="pin-code-input-field"
                type="numeric"
                icon={NineDotsIcon}
                label={t`Pin code`}
                placeholder={t`1234`}
                variant="outline"
                {...register('pinCode')}
              />
            </FormGroup>

            <FormGroup>
              <AttachmentField
                onUpload={handleFileUpload}
                isLast
                label={'File'}
              />
              {values.attachments.map((attachment, index) => (
                <AttachmentField
                  key={attachment?.id || attachment.name}
                  attachment={attachment}
                  isLast
                  label={'File'}
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
                accessibilityLabel="Note field"
                inputAccessibilityLabel="Note input field"
                testID="note-input-field"
                {...register('note')}
              />
            </FormGroup>

            <CustomFields
              customFields={list}
              removeItem={removeItem}
              register={registerItem}
            />

            <FormGroup>
              <CreateCustomField
                onCreateCustom={(type) => addItem({ type: type, name: type })}
              />
            </FormGroup>
          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}
