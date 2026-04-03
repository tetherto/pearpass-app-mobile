import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { DATE_FORMAT } from '@tetherto/pearpass-lib-constants'
import {
  CalendarIcon,
  DeleteIcon,
  EmailIcon,
  GenderIcon,
  GroupIcon,
  NationalityIcon,
  PhoneIcon,
  UserIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import Toast from 'react-native-toast-message'
import { InputField, MultiSlotInput } from '@tetherto/pearpass-lib-ui-kit'

import { FormGroup } from '../../../components/FormGroup'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { AttachmentField } from '../../../containers/AttachmentField'
import { ImagesField } from '../../../containers/ImagesField'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { ButtonLittle } from '../../../libComponents'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import { adaptRegister } from './CreateOrEditLoginContent'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from './styles'

interface IdentityRecord {
  data?: {
    title?: string
    fullName?: string
    email?: string
    phoneNumber?: string
    address?: string
    zip?: string
    city?: string
    region?: string
    country?: string
    note?: string
    customFields?: unknown[]
    passportFullName?: string
    passportNumber?: string
    passportIssuingCountry?: string
    passportDateOfIssue?: string
    passportExpiryDate?: string
    passportNationality?: string
    passportDob?: string
    passportGender?: string
    passportPicture?: unknown[]
    idCardNumber?: string
    idCardDateOfIssue?: string
    idCardExpiryDate?: string
    idCardIssuingCountry?: string
    idCardPicture?: unknown[]
    drivingLicenseNumber?: string
    drivingLicenseDateOfIssue?: string
    drivingLicenseExpiryDate?: string
    drivingLicenseIssuingCountry?: string
    drivingLicensePicture?: unknown[]
  }
  folder?: string
  isFavorite?: boolean
  attachments?: unknown[]
}

interface Props {
  initialRecord?: IdentityRecord
  selectedFolder?: string
}

export const CreateOrEditIdentityContent = ({
  initialRecord,
  selectedFolder
}: Props) => {
  const hasPassportFullName = !!initialRecord?.data?.passportFullName?.length
  const hasPassportNumber = !!initialRecord?.data?.passportNumber?.length
  const hasPassportIssuingCountry = !!initialRecord?.data?.passportIssuingCountry?.length
  const hasPassportDateOfIssue = !!initialRecord?.data?.passportDateOfIssue?.length
  const hasPassportExpiryDate = !!initialRecord?.data?.passportExpiryDate?.length
  const hasPassportNationality = !!initialRecord?.data?.passportNationality?.length
  const hasPassportDob = !!initialRecord?.data?.passportDob?.length
  const hasPassportGender = !!initialRecord?.data?.passportGender?.length
  const hasPassportPicture = !!initialRecord?.data?.passportPicture?.length
  const hasIdCardNumber = !!initialRecord?.data?.idCardNumber?.length
  const hasIdCardDateOfIssue = !!initialRecord?.data?.idCardDateOfIssue?.length
  const hasIdCardExpiryDate = !!initialRecord?.data?.idCardExpiryDate?.length
  const hasIdCardIssuingCountry = !!initialRecord?.data?.idCardIssuingCountry?.length
  const hasIdCardPicture = !!initialRecord?.data?.idCardPicture?.length
  const hasDrivingLicenseNumber = !!initialRecord?.data?.drivingLicenseNumber?.length
  const hasDrivingLicenseDateOfIssue = !!initialRecord?.data?.drivingLicenseDateOfIssue?.length
  const hasDrivingLicenseExpiryDate = !!initialRecord?.data?.drivingLicenseExpiryDate?.length
  const hasDrivingLicenseIssuingCountry = !!initialRecord?.data?.drivingLicenseIssuingCountry?.length
  const hasDrivingLicensePicture = !!initialRecord?.data?.drivingLicensePicture?.length

  const hasPassport =
    hasPassportFullName ||
    hasPassportNumber ||
    hasPassportIssuingCountry ||
    hasPassportDateOfIssue ||
    hasPassportExpiryDate ||
    hasPassportNationality ||
    hasPassportDob ||
    hasPassportGender ||
    hasPassportPicture

  const hasIdCard =
    hasIdCardNumber ||
    hasIdCardDateOfIssue ||
    hasIdCardExpiryDate ||
    hasIdCardIssuingCountry ||
    hasIdCardPicture

  const hasDrivingLicense =
    hasDrivingLicenseNumber ||
    hasDrivingLicenseDateOfIssue ||
    hasDrivingLicenseExpiryDate ||
    hasDrivingLicenseIssuingCountry ||
    hasDrivingLicensePicture

  const [isPassportOpen, setIsPassportOpen] = useState(hasPassport)
  const [isIdCardOpen, setIsIdCardOpen] = useState(hasIdCard)
  const [isDrivingLicenseOpen, setIsDrivingLicenseOpen] = useState(hasDrivingLicense)

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
    fullName: Validator.string(),
    email: Validator.string().email(t`Invalid email format`),
    phoneNumber: Validator.string(),
    address: Validator.string(),
    zip: Validator.string(),
    city: Validator.string(),
    region: Validator.string(),
    country: Validator.string(),
    note: Validator.string(),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Comment is required`)
      })
    ),
    folder: Validator.string(),
    passportFullName: Validator.string(),
    passportNumber: Validator.string(),
    passportIssuingCountry: Validator.string(),
    passportDateOfIssue: Validator.string(),
    passportExpiryDate: Validator.string(),
    passportNationality: Validator.string(),
    passportDob: Validator.string(),
    passportGender: Validator.string(),
    passportPicture: Validator.array().items(
      Validator.object({ id: Validator.string(), name: Validator.string().required() })
    ),
    idCardNumber: Validator.string(),
    idCardDateOfIssue: Validator.string(),
    idCardExpiryDate: Validator.string(),
    idCardIssuingCountry: Validator.string(),
    idCardPicture: Validator.array().items(
      Validator.object({ id: Validator.string(), name: Validator.string().required() })
    ),
    drivingLicenseNumber: Validator.string(),
    drivingLicenseDateOfIssue: Validator.string(),
    drivingLicenseExpiryDate: Validator.string(),
    drivingLicenseIssuingCountry: Validator.string(),
    drivingLicensePicture: Validator.array().items(
      Validator.object({ id: Validator.string(), name: Validator.string().required() })
    ),
    attachments: Validator.array().items(
      Validator.object({ id: Validator.string(), name: Validator.string().required() })
    )
  })

  const { register, handleSubmit, registerArray, values, setValue, errors } = useForm({
    initialValues: {
      title: initialRecord?.data?.title ?? '',
      fullName: initialRecord?.data?.fullName ?? '',
      email: initialRecord?.data?.email ?? '',
      phoneNumber: initialRecord?.data?.phoneNumber ?? '',
      address: initialRecord?.data?.address ?? '',
      zip: initialRecord?.data?.zip ?? '',
      city: initialRecord?.data?.city ?? '',
      region: initialRecord?.data?.region ?? '',
      country: initialRecord?.data?.country ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields || [],
      folder: selectedFolder ?? initialRecord?.folder,
      passportFullName: initialRecord?.data?.passportFullName ?? '',
      passportNumber: initialRecord?.data?.passportNumber ?? '',
      passportIssuingCountry: initialRecord?.data?.passportIssuingCountry ?? '',
      passportDateOfIssue: initialRecord?.data?.passportDateOfIssue ?? '',
      passportExpiryDate: initialRecord?.data?.passportExpiryDate ?? '',
      passportNationality: initialRecord?.data?.passportNationality ?? '',
      passportDob: initialRecord?.data?.passportDob ?? '',
      passportGender: initialRecord?.data?.passportGender ?? '',
      passportPicture: [],
      idCardNumber: initialRecord?.data?.idCardNumber ?? '',
      idCardDateOfIssue: initialRecord?.data?.idCardDateOfIssue ?? '',
      idCardExpiryDate: initialRecord?.data?.idCardExpiryDate ?? '',
      idCardIssuingCountry: initialRecord?.data?.idCardIssuingCountry ?? '',
      idCardPicture: initialRecord?.data?.idCardPicture || [],
      drivingLicenseNumber: initialRecord?.data?.drivingLicenseNumber ?? '',
      drivingLicenseDateOfIssue: initialRecord?.data?.drivingLicenseDateOfIssue ?? '',
      drivingLicenseExpiryDate: initialRecord?.data?.drivingLicenseExpiryDate ?? '',
      drivingLicenseIssuingCountry: initialRecord?.data?.drivingLicenseIssuingCountry ?? '',
      drivingLicensePicture: initialRecord?.data?.drivingLicensePicture || [],
      attachments: initialRecord?.attachments ?? []
    },
    validate: (values) => schema.validate(values)
  })

  useGetMultipleFiles({
    fieldNames: ['attachments', 'passportPicture', 'idCardPicture', 'drivingLicensePicture'],
    updateValues: setValue,
    initialRecord,
    currentValues: values
  })

  const {
    value: customFieldsList,
    addItem: addCustomField,
    registerItem: registerCustomFieldItem,
    removeItem: removeCustomField
  } = registerArray('customFields')

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
      type: RECORD_TYPES.IDENTITY,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        title: values.title,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        zip: values.zip,
        city: values.city,
        region: values.region,
        country: values.country,
        note: values.note,
        customFields: values.customFields,
        passportFullName: values.passportFullName,
        passportNumber: values.passportNumber,
        passportIssuingCountry: values.passportIssuingCountry,
        passportDateOfIssue: values.passportDateOfIssue,
        passportExpiryDate: values.passportExpiryDate,
        passportNationality: values.passportNationality,
        passportDob: values.passportDob,
        passportGender: values.passportGender,
        passportPicture: convertBase64FilesToUint8(values.passportPicture),
        idCardNumber: values.idCardNumber,
        idCardDateOfIssue: values.idCardDateOfIssue,
        idCardExpiryDate: values.idCardExpiryDate,
        idCardIssuingCountry: values.idCardIssuingCountry,
        idCardPicture: convertBase64FilesToUint8(values.idCardPicture),
        drivingLicenseNumber: values.drivingLicenseNumber,
        drivingLicenseDateOfIssue: values.drivingLicenseDateOfIssue,
        drivingLicenseExpiryDate: values.drivingLicenseExpiryDate,
        drivingLicenseIssuingCountry: values.drivingLicenseIssuingCountry,
        drivingLicensePicture: convertBase64FilesToUint8(values.drivingLicensePicture),
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
      logger.error('Error creating or updating identity record:', error)
      setIsLoading(false)
    }
  }

  const handleFileUpload = (file, fieldName) => {
    if (!file) return
    setValue(fieldName, [...values[fieldName], file])
  }

  const handleAttachmentDelete = (index, fieldName) => {
    setValue(fieldName, values[fieldName].filter((_, idx) => idx !== index))
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
                testID="title-input-field"
                {...adaptRegister(register('title'))}
              />
            </FormGroup>

            <FormGroup title={t`Personal information`} isCollapse>
              <InputField
                label={t`Full name`}
                placeholder={t`John Smith`}
                leftSlot={<UserIcon />}
                testID="full-name-input-field"
                {...adaptRegister(register('fullName'))}
              />
              <InputField
                label={t`Email`}
                placeholder={t`Insert email`}
                leftSlot={<EmailIcon />}
                testID="email-input-field"
                {...adaptRegister(register('email'))}
              />
              <InputField
                label={t`Phone number`}
                placeholder={t`Insert phone number`}
                leftSlot={<PhoneIcon />}
                testID="phone-number-input-field"
                {...adaptRegister(register('phoneNumber'))}
              />
            </FormGroup>

            <FormGroup title={t`Detail of address`} isCollapse>
              <InputField
                label={t`Address`}
                placeholder={t`Insert address`}
                testID="address-input-field"
                {...adaptRegister(register('address'))}
              />
              <InputField
                label={t`ZIP`}
                placeholder={t`Insert ZIP`}
                testID="zip-input-field"
                {...adaptRegister(register('zip'))}
              />
              <InputField
                label={t`City`}
                placeholder={t`Insert city`}
                testID="city-input-field"
                {...adaptRegister(register('city'))}
              />
              <InputField
                label={t`Region`}
                placeholder={t`Insert region`}
                testID="region-input-field"
                {...adaptRegister(register('region'))}
              />
              <InputField
                label={t`Country`}
                placeholder={t`Insert country`}
                testID="country-input-field"
                {...adaptRegister(register('country'))}
              />
            </FormGroup>

            <FormGroup
              title={t`Passport`}
              isCollapse
              onToggle={setIsPassportOpen}
              isOpened={isPassportOpen}
            >
              <InputField
                label={t`Full name`}
                placeholder={t`John Smith`}
                leftSlot={<UserIcon />}
                testID="passport-full-name-input-field"
                {...adaptRegister(register('passportFullName'))}
              />
              <InputField
                label={t`Passport number`}
                placeholder={t`Insert numbers`}
                leftSlot={<GroupIcon />}
                testID="passport-number-input-field"
                {...adaptRegister(register('passportNumber'))}
              />
              <InputField
                label={t`Issuing country`}
                placeholder={t`Insert country`}
                leftSlot={<NationalityIcon />}
                testID="passport-issuing-country-input-field"
                {...adaptRegister(register('passportIssuingCountry'))}
              />
              <InputField
                label={t`Date of issue`}
                placeholder={DATE_FORMAT}
                leftSlot={<CalendarIcon />}
                testID="passport-date-of-issue-input-field"
                {...adaptRegister(register('passportDateOfIssue'))}
              />
              <InputField
                label={t`Expiry date`}
                placeholder={DATE_FORMAT}
                leftSlot={<CalendarIcon />}
                testID="passport-expiry-date-input-field"
                {...adaptRegister(register('passportExpiryDate'))}
              />
              <InputField
                label={t`Nationality`}
                placeholder={t`Insert your nationality`}
                leftSlot={<NationalityIcon />}
                testID="passport-nationality-input-field"
                {...adaptRegister(register('passportNationality'))}
              />
              <InputField
                label={t`Date of birth`}
                placeholder={DATE_FORMAT}
                leftSlot={<CalendarIcon />}
                testID="passport-date-of-birth-input-field"
                {...adaptRegister(register('passportDob'))}
              />
              <InputField
                label={t`Gender`}
                placeholder={t`M/F`}
                leftSlot={<GenderIcon />}
                testID="passport-gender-input-field"
                {...adaptRegister(register('passportGender'))}
              />
            </FormGroup>

            {isPassportOpen && (
              <ImagesField
                onAdd={(file) => handleFileUpload(file, 'passportPicture')}
                onRemove={(index) => handleAttachmentDelete(index, 'passportPicture')}
                title={t`Passport picture`}
                pictures={values.passportPicture}
              />
            )}

            <FormGroup
              title={t`Identity card`}
              isCollapse
              onToggle={setIsIdCardOpen}
              isOpened={isIdCardOpen}
            >
              <InputField
                label={t`ID number`}
                placeholder="123456789"
                leftSlot={<GroupIcon />}
                testID="id-number-input-field"
                {...adaptRegister(register('idCardNumber'))}
              />
              <InputField
                label={t`Creation date`}
                placeholder={DATE_FORMAT}
                leftSlot={<CalendarIcon />}
                testID="identity-card-creation-date-input-field"
                {...adaptRegister(register('idCardDateOfIssue'))}
              />
              <InputField
                label={t`Expiry date`}
                placeholder={DATE_FORMAT}
                leftSlot={<CalendarIcon />}
                testID="identity-card-expiry-date-input-field"
                {...adaptRegister(register('idCardExpiryDate'))}
              />
              <InputField
                label={t`Issuing country`}
                placeholder={t`Insert country`}
                leftSlot={<NationalityIcon />}
                testID="identity-card-issuing-country-input-field"
                {...adaptRegister(register('idCardIssuingCountry'))}
              />
            </FormGroup>

            {isIdCardOpen && (
              <ImagesField
                onAdd={(file) => handleFileUpload(file, 'idCardPicture')}
                onRemove={(index) => handleAttachmentDelete(index, 'idCardPicture')}
                title={t`ID card picture`}
                pictures={values.idCardPicture}
              />
            )}

            <FormGroup
              title={t`Driving license`}
              isCollapse
              onToggle={setIsDrivingLicenseOpen}
              isOpened={isDrivingLicenseOpen}
            >
              <InputField
                label={t`ID number`}
                placeholder={t`123456789`}
                leftSlot={<GroupIcon />}
                testID="driving-license-id-number-input-field"
                {...adaptRegister(register('drivingLicenseNumber'))}
              />
              <InputField
                label={t`Creation date`}
                placeholder={DATE_FORMAT}
                leftSlot={<CalendarIcon />}
                testID="driving-license-creation-date-input-field"
                {...adaptRegister(register('drivingLicenseDateOfIssue'))}
              />
              <InputField
                label={t`Expiry date`}
                placeholder={DATE_FORMAT}
                leftSlot={<CalendarIcon />}
                testID="driving-license-expiry-date-input-field"
                {...adaptRegister(register('drivingLicenseExpiryDate'))}
              />
              <InputField
                label={t`Issuing country`}
                placeholder={t`Insert country`}
                leftSlot={<NationalityIcon />}
                testID="driving-license-issuing-country-input-field"
                {...adaptRegister(register('drivingLicenseIssuingCountry'))}
              />
            </FormGroup>

            {isDrivingLicenseOpen && (
              <ImagesField
                onAdd={(file) => handleFileUpload(file, 'drivingLicensePicture')}
                onRemove={(index) => handleAttachmentDelete(index, 'drivingLicensePicture')}
                title={t`Driving license picture`}
                pictures={values.drivingLicensePicture}
              />
            )}

            <InputField
              label={t`Comment`}
              placeholder={t`Add comment`}
              testID="note-input-field"
              {...adaptRegister(register('note'))}
            />

            <FormGroup>
              <AttachmentField
                onUpload={(file) => handleFileUpload(file, 'attachments')}
                isLast
                label={'File'}
              />
              {values.attachments.map((attachment, index) => (
                <AttachmentField
                  key={attachment?.id || attachment.name}
                  attachment={attachment}
                  attachmentIndex={index}
                  onDelete={(idx) => handleAttachmentDelete(idx, 'attachments')}
                  isLast
                  label={'File'}
                  additionalItems={
                    <ButtonLittle
                      startIcon={DeleteIcon}
                      variant="secondary"
                      borderRadius="md"
                      onPress={() => handleAttachmentDelete(index, 'attachments')}
                    />
                  }
                />
              ))}
            </FormGroup>

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
