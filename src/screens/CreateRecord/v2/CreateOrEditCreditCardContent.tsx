import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import {
  CalendarIcon,
  CreditCardIcon,
  NineDotsIcon,
  UserIcon,
  DeleteIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import {
  InputField,
  MultiSlotInput,
  PasswordField,
} from '@tetherto/pearpass-lib-ui-kit'
import Toast from 'react-native-toast-message'

import { ButtonLittle } from 'src/libComponents'
import { AttachmentField } from '../../../containers/AttachmentField'
import { FormGroup } from '../../../components/FormGroup'

import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { adaptRegister } from './CreateOrEditLoginContent'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
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

  const { values, register, handleSubmit, setValue, registerArray, errors } = useForm({
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
    if (isLoading) return

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
        await updateRecords([{ ...initialRecord, ...data }], onError)
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
    value: customFieldsList,
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  const handleExpireDateChange = (inputValue) => {
    let value = inputValue.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length > 2) value = `${value.slice(0, 2)} ${value.slice(2)}`
    setValue('expireDate', value)
  }

  const handleCardNumberChange = (inputValue) => {
    let value = inputValue.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    if (value.length > 0) value = value.match(/.{1,4}/g).join(' ')
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
                placeholder={t`No title`}
                testID="title-field-input"
                {...adaptRegister(register('title'))}
              />
            </FormGroup>

            <FormGroup>
              <InputField
                label={t`Name on card`}
                placeholder={t`John Smith`}
                leftSlot={<UserIcon />}
                testID="name-on-card-input-field"
                {...adaptRegister(register('name'))}
              />
              <InputField
                label={t`Number on card`}
                placeholder={t`1234 1234 1234 1234`}
                leftSlot={<CreditCardIcon />}
                testID="number-on-card-input-field"
                value={values.number}
                onChange={handleCardNumberChange}
              />
              <InputField
                label={t`Date of expire`}
                placeholder={t`MM YY`}
                leftSlot={<CalendarIcon />}
                testID="date-of-expire-input-field"
                value={values.expireDate}
                onChange={handleExpireDateChange}
              />
              <PasswordField
                label={t`Security code`}
                placeholder={t`123`}
                leftSlot={<CreditCardIcon />}
                testID="security-code-input-field"
                {...adaptRegister(register('securityCode'))}
              />
              <PasswordField
                label={t`Pin code`}
                placeholder={t`1234`}
                leftSlot={<NineDotsIcon />}
                testID="pin-code-input-field"
                {...adaptRegister(register('pinCode'))}
              />
            </FormGroup>

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
              testID="note-input-field"
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
