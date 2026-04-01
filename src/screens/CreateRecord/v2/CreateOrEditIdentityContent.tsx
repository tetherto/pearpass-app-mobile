import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { DATE_FORMAT } from '@tetherto/pearpass-lib-constants'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import Toast from 'react-native-toast-message'
import { InputField, MultiSlotInput, UploadField } from '@tetherto/pearpass-lib-ui-kit'

import { FormGroup } from '../../../components/FormGroup'
import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { ImagesField } from '../../../containers/ImagesField'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { handleChooseFile } from '../../../utils/handleChooseFile'
import { logger } from '../../../utils/logger'
import type { UploadedFile } from '@tetherto/pearpass-lib-ui-kit'
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
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data?.customFields || [],
      comments: [],
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

  const MAX_ATTACHMENTS = 5

  const handleUploadPress = () => {
    const currentFiles = values.attachments as UploadedFile[]
    if (currentFiles.length >= MAX_ATTACHMENTS) return

    handleChooseFile(
      ({ base64, name }: { base64: string; name: string }) => {
        const newFile: UploadedFile = {
          file: null as unknown as File,
          name,
          size: Math.round((base64.length * 3) / 4),
          type: 'application/octet-stream',
          // @ts-ignore — base64 is a native-only extension of UploadedFile used by convertBase64FilesToUint8
          base64
        }
        setValue('attachments', [...currentFiles, newFile])
      },
      () => {
        Toast.show({
          type: 'baseToast',
          text1: t`File is too large`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    )
  }

  const handleFilesChange = (files: UploadedFile[], fieldName: string) => {
    setValue(fieldName, files)
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
                placeholderText={t`No title`}
                testID="title-input-field"
                {...adaptRegister(register('title'))}
              />
            </FormGroup>
            <FormGroup title={t`Personal information`} isCollapse>
              <InputField
                label={t`Full name`}
                placeholderText={t`John Smith`}
                testID="full-name-input-field"
                {...adaptRegister(register('fullName'))}
              />
              <InputField
                label={t`Email`}
                placeholderText={t`Insert email`}
                testID="email-input-field"
                {...adaptRegister(register('email'))}
              />
              <InputField
                label={t`Phone number`}
                placeholderText={t`Insert phone number`}
                testID="phone-number-input-field"
                {...adaptRegister(register('phoneNumber'))}
              />
            </FormGroup>
            <FormGroup title={t`Detail of address`} isCollapse>
              <InputField
                testID="address-input-field"
                label={t`Address`}
                placeholderText={t`Insert address`}
                {...adaptRegister(register('address'))}
              />
              <InputField
                testID="zip-input-field"
                label={t`ZIP`}
                placeholderText={t`Insert ZIP`}
                {...adaptRegister(register('zip'))}
              />

              <InputField
                testID="city-input-field"
                label={t`City`}
                placeholderText={t`Insert city`}
                {...adaptRegister(register('city'))}
              />
              <InputField
                testID="region-input-field"
                label={t`Region`}
                placeholderText={t`Insert region`}
                {...adaptRegister(register('region'))}
              />
              <InputField
                testID="country-input-field"
                label={t`Country`}
                placeholderText={t`Insert country`}
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
                testID="passport-full-name-input-field"
                label={t`Full name`}
                placeholderText={t`John Smith`}
                {...adaptRegister(register('passportFullName'))}
              />
              <InputField
                testID="passport-number-input-field"
                label={t`Passport number`}
                placeholderText={t`Insert numbers`}
                {...adaptRegister(register('passportNumber'))}
              />
              <InputField
                testID="passport-issuing-country-input-field"
                label={t`Issuing country`}
                placeholderText={t`Insert country`}
                {...adaptRegister(register('passportIssuingCountry'))}
              />
              <InputField
                testID="passport-date-of-issue-input-field"
                label={t`Date of issue`}
                placeholderText={DATE_FORMAT}
                {...adaptRegister(register('passportDateOfIssue'))}
              />
              <InputField
                testID="passport-expiry-date-input-field"
                label={t`Expiry date`}
                placeholderText={DATE_FORMAT}
                {...adaptRegister(register('passportExpiryDate'))}
              />
              <InputField
                testID="passport-nationality-input-field"
                label={t`Nationality`}
                placeholderText={t`Insert your nationality`}
                {...adaptRegister(register('passportNationality'))}
              />
              <InputField
                testID="passport-date-of-birth-input-field"
                label={t`Date of birth`}
                placeholderText={DATE_FORMAT}
                {...adaptRegister(register('passportDob'))}
              />
              <InputField
                testID="passport-gender-input-field"
                label={t`Gender`}
                placeholderText={t`M/F`}
                {...adaptRegister(register('passportGender'))}
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
                testID="id-number-input-field"
                label={t`ID number`}
                placeholderText="123456789"
                {...adaptRegister(register('idCardNumber'))}
              />
              <InputField
                testID="identity-card-creation-date-input-field"
                label={t`Creation date`}
                placeholderText={DATE_FORMAT}
                {...adaptRegister(register('idCardDateOfIssue'))}
              />
              <InputField
                testID="identity-card-expiry-date-input-field"
                label={t`Expiry date`}
                placeholderText={DATE_FORMAT}
                {...adaptRegister(register('idCardExpiryDate'))}
              />
              <InputField
                testID="identity-card-issuing-country-input-field"
                label={t`Issuing country`}
                placeholderText={t`Insert country`}
                {...adaptRegister(register('idCardIssuingCountry'))}
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
                testID="driving-license-id-number-input-field"
                label={t`ID number`}
                placeholderText={t`123456789`}
                {...adaptRegister(register('drivingLicenseNumber'))}
              />
              <InputField
                testID="driving-license-creation-date-input-field"
                label={t`Creation date`}
                placeholderText={DATE_FORMAT}
                {...adaptRegister(register('drivingLicenseDateOfIssue'))}
              />
              <InputField
                testID="driving-license-expiry-date-input-field"
                label={t`Expiry date`}
                placeholderText={DATE_FORMAT}
                {...adaptRegister(register('drivingLicenseExpiryDate'))}
              />
              <InputField
                testID="driving-license-issuing-country-input-field"
                label={t`Issuing country`}
                placeholderText={t`Insert country`}
                {...adaptRegister(register('drivingLicenseIssuingCountry'))}
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
              <UploadField
                files={values.attachments as UploadedFile[]}
                onFilesChange={(files) => handleFilesChange(files, 'attachments')}
                onPress={handleUploadPress}
                uploadLinkText={t`Click to upload`}
                uploadSuffixText={t`or drag and drop`}
                maxFiles={MAX_ATTACHMENTS}
                testID="attachments-upload-field"
              />
            </FormGroup>

            <MultiSlotInput
              label={t`Custom comments`}
              placeholderText={t`Add comment`}
              addButtonLabel={t`Add another comment`}
              values={values.comments as string[]}
              onChange={(updated: string[]) => setValue('comments', updated)}
              testID="custom-comments-multi-slot-input"
            />


          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}
