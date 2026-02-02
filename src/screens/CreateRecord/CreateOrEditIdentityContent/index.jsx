import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { DATE_FORMAT } from 'pearpass-lib-constants'
import {
  CalendarIcon,
  DeleteIcon,
  EmailIcon,
  GenderIcon,
  GroupIcon,
  NationalityIcon,
  PhoneIcon,
  UserIcon
} from 'pearpass-lib-ui-react-native-components'
import { RECORD_TYPES, useCreateRecord, useRecords } from 'pearpass-lib-vault'
import Toast from 'react-native-toast-message'

import { CreateCustomField } from '../../../components/CreateCustomField'
import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { AttachmentField } from '../../../containers/AttachmentField'
import { ImagesField } from '../../../containers/ImagesField'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { ButtonLittle, InputField } from '../../../libComponents'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from '../ScrollViewFormWrapper/styles'

export const CreateOrEditIdentityContent = ({
  initialRecord,
  selectedFolder
}) => {
  const hasPassportFullName = !!initialRecord?.data?.passportFullName?.length
  const hasPassportNumber = !!initialRecord?.data?.passportNumber?.length
  const hasPassportIssuingCountry =
    !!initialRecord?.data?.passportIssuingCountry?.length
  const hasPassportDateOfIssue =
    !!initialRecord?.data?.passportDateOfIssue?.length
  const hasPassportExpiryDate =
    !!initialRecord?.data?.passportExpiryDate?.length
  const hasPassportNationality =
    !!initialRecord?.data?.passportNationality?.length
  const hasPassportDob = !!initialRecord?.data?.passportDob?.length
  const hasPassportGender = !!initialRecord?.data?.passportGender?.length
  const hasPassportPicture = !!initialRecord?.data.passportPicture?.length
  const hasIdCardNumber = !!initialRecord?.data?.idCardNumber?.length
  const hasIdCardDateOfIssue = !!initialRecord?.data?.idCardDateOfIssue?.length
  const hasIdCardExpiryDate = !!initialRecord?.data?.idCardExpiryDate?.length
  const hasIdCardIssuingCountry =
    !!initialRecord?.data?.idCardIssuingCountry?.length
  const hasIdCardPicture = !!initialRecord?.data.idCardPicture?.length
  const hasDrivingLicenseNumber =
    !!initialRecord?.data?.drivingLicenseNumber?.length
  const hasDrivingLicenseDateOfIssue =
    !!initialRecord?.data?.drivingLicenseDateOfIssue?.length
  const hasDrivingLicenseExpiryDate =
    !!initialRecord?.data?.drivingLicenseExpiryDate?.length
  const hasDrivingLicenseIssuingCountry =
    !!initialRecord?.data?.drivingLicenseIssuingCountry?.length
  const hasDrivingLicensePicture =
    !!initialRecord?.data.drivingLicensePicture?.length

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
  const [isDrivingLicenseOpen, setIsDrivingLicenseOpen] =
    useState(hasDrivingLicense)

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
    fullName: Validator.string(),
    email: Validator.string().email(t`Invalid email format`),
    phoneNumber: Validator.string(),
    address: Validator.string(),
    zip: Validator.string(),
    city: Validator.string(),
    region: Validator.string(),
    country: Validator.string(),
    comment: Validator.string(),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string().required(t`Note is required`)
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
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    ),
    idCardNumber: Validator.string(),
    idCardDateOfIssue: Validator.string(),
    idCardExpiryDate: Validator.string(),
    idCardIssuingCountry: Validator.string(),
    idCardPicture: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    ),
    drivingLicenseNumber: Validator.string(),
    drivingLicenseDateOfIssue: Validator.string(),
    drivingLicenseExpiryDate: Validator.string(),
    drivingLicenseIssuingCountry: Validator.string(),
    drivingLicensePicture: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    ),
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
      fullName: initialRecord?.data?.fullName ?? '',
      email: initialRecord?.data?.email ?? '',
      phoneNumber: initialRecord?.data?.phoneNumber ?? '',
      address: initialRecord?.data?.address ?? '',
      zip: initialRecord?.data?.zip ?? '',
      city: initialRecord?.data?.city ?? '',
      region: initialRecord?.data?.region ?? '',
      country: initialRecord?.data?.country ?? '',
      comment: initialRecord?.data?.comment ?? '',
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
      drivingLicenseDateOfIssue:
        initialRecord?.data?.drivingLicenseDateOfIssue ?? '',
      drivingLicenseExpiryDate:
        initialRecord?.data?.drivingLicenseExpiryDate ?? '',
      drivingLicenseIssuingCountry:
        initialRecord?.data?.drivingLicenseIssuingCountry ?? '',
      drivingLicensePicture: initialRecord?.data?.drivingLicensePicture || [],
      attachments: initialRecord?.attachments ?? []
    },
    validate: (values) => schema.validate(values)
  })
  useGetMultipleFiles({
    fieldNames: [
      'attachments',
      'passportPicture',
      'idCardPicture',
      'drivingLicensePicture'
    ],
    updateValues: setValue,
    initialRecord,
    currentValues: values
  })

  const {
    value: list,
    addItem,
    registerItem,
    removeItem
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
    if (isLoading) {
      return
    }

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
        comment: values.comment,
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
        drivingLicensePicture: convertBase64FilesToUint8(
          values.drivingLicensePicture
        ),
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
      logger.error('Error creating or updating identity record:', error)

      setIsLoading(false)
    }
  }

  const handleFileUpload = (file, fieldName) => {
    if (!file) {
      return
    }

    setValue(fieldName, [...values[fieldName], file])
  }

  const handleAttachmentDelete = (index, fieldName) => {
    const updatedAttachments = values[fieldName].filter(
      (_, idx) => idx !== index
    )
    setValue(fieldName, updatedAttachments)
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
                variant="outline"
                {...register('title')}
              />
            </FormGroup>
            <FormGroup title={t`Personal information`} isCollapse>
              <InputField
                icon={UserIcon}
                label={t`Full name`}
                placeholder={t`John Smith`}
                variant="outline"
                {...register('fullName')}
              />
              <InputField
                type="email-address"
                icon={EmailIcon}
                label={t`Email`}
                placeholder={t`Insert email`}
                variant="outline"
                {...register('email')}
              />

              <InputField
                type="numeric"
                icon={PhoneIcon}
                label={t`Phone number`}
                placeholder={t`Insert phone number`}
                variant="outline"
                {...register('phoneNumber')}
              />
            </FormGroup>
            <FormGroup title={t`Detail of address`} isCollapse>
              <InputField
                label={t`Address`}
                placeholder={t`Insert address`}
                variant="outline"
                {...register('address')}
              />
              <InputField
                label={t`ZIP`}
                placeholder={t`Insert ZIP`}
                variant="outline"
                {...register('zip')}
              />

              <InputField
                label={t`City`}
                placeholder={t`Insert city`}
                variant="outline"
                {...register('city')}
              />
              <InputField
                label={t`Region`}
                placeholder={t`Insert region`}
                variant="outline"
                {...register('region')}
              />
              <InputField
                label={t`Country`}
                placeholder={t`Insert country`}
                variant="outline"
                {...register('country')}
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
                variant="outline"
                icon={UserIcon}
                {...register('passportFullName')}
              />
              <InputField
                label={t`Passport number`}
                placeholder={t`Insert numbers`}
                variant="outline"
                icon={GroupIcon}
                {...register('passportNumber')}
              />
              <InputField
                label={t`Issuing country`}
                placeholder={t`Insert country`}
                variant="outline"
                icon={NationalityIcon}
                {...register('passportIssuingCountry')}
              />
              <InputField
                label={t`Date of issue`}
                placeholder={DATE_FORMAT}
                variant="outline"
                icon={CalendarIcon}
                {...register('passportDateOfIssue')}
              />
              <InputField
                label={t`Expiry date`}
                placeholder={DATE_FORMAT}
                variant="outline"
                icon={CalendarIcon}
                {...register('passportExpiryDate')}
              />
              <InputField
                label={t`Nationality`}
                placeholder={t`Insert your nationality`}
                variant="outline"
                icon={NationalityIcon}
                {...register('passportNationality')}
              />
              <InputField
                label={t`Date of birth`}
                placeholder={DATE_FORMAT}
                variant="outline"
                icon={CalendarIcon}
                {...register('passportDob')}
              />
              <InputField
                label={t`Gender`}
                placeholder={t`M/F`}
                variant="outline"
                icon={GenderIcon}
                {...register('passportGender')}
              />
            </FormGroup>

            {isPassportOpen && (
              <ImagesField
                onAdd={(file) => handleFileUpload(file, 'passportPicture')}
                onRemove={(index) =>
                  handleAttachmentDelete(index, 'passportPicture')
                }
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
                placeholder={'123456789'}
                variant="outline"
                icon={GroupIcon}
                {...register('idCardNumber')}
              />
              <InputField
                label={t`Creation date`}
                placeholder={DATE_FORMAT}
                variant="outline"
                icon={CalendarIcon}
                {...register('idCardDateOfIssue')}
              />
              <InputField
                label={t`Expiry date`}
                placeholder={DATE_FORMAT}
                variant="outline"
                icon={CalendarIcon}
                {...register('idCardExpiryDate')}
              />
              <InputField
                label={t`Issuing country`}
                placeholder={t`Insert country`}
                variant="outline"
                icon={NationalityIcon}
                {...register('idCardIssuingCountry')}
              />
            </FormGroup>
            {isIdCardOpen && (
              <ImagesField
                onAdd={(file) => handleFileUpload(file, 'idCardPicture')}
                onRemove={(index) =>
                  handleAttachmentDelete(index, 'idCardPicture')
                }
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
                variant="outline"
                icon={GroupIcon}
                {...register('drivingLicenseNumber')}
              />
              <InputField
                label={t`Creation date`}
                placeholder={DATE_FORMAT}
                variant="outline"
                icon={CalendarIcon}
                {...register('drivingLicenseDateOfIssue')}
              />
              <InputField
                label={t`Expiry date`}
                placeholder={DATE_FORMAT}
                variant="outline"
                icon={CalendarIcon}
                {...register('drivingLicenseExpiryDate')}
              />
              <InputField
                label={t`Issuing country`}
                placeholder={t`Insert country`}
                variant="outline"
                icon={NationalityIcon}
                {...register('drivingLicenseIssuingCountry')}
              />
            </FormGroup>

            {isDrivingLicenseOpen && (
              <ImagesField
                onAdd={(file) =>
                  handleFileUpload(file, 'drivingLicensePicture')
                }
                onRemove={(index) =>
                  handleAttachmentDelete(index, 'drivingLicensePicture')
                }
                title={t`Driving license picture`}
                pictures={values.drivingLicensePicture}
              />
            )}

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
                      onPress={() =>
                        handleAttachmentDelete(index, 'attachments')
                      }
                    />
                  }
                />
              ))}
            </FormGroup>

            <FormGroup>
              <InputFieldNote {...register('comment')} />
            </FormGroup>

            <CustomFields
              removeItem={removeItem}
              customFields={list}
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
