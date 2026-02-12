import { useCallback, useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useFocusEffect } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { DATE_FORMAT } from 'pearpass-lib-constants'
import {
  EmailIcon,
  PhoneIcon,
  UserIcon,
  NationalityIcon,
  CalendarIcon,
  GroupIcon,
  GenderIcon
} from 'pearpass-lib-ui-react-native-components'

import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { AttachmentField } from '../../../containers/AttachmentField'
import { ImagesField } from '../../../containers/ImagesField'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { InputField } from '../../../libComponents'

export const IdentityRecordDetailsForm = ({
  initialRecord,
  selectedFolder
}) => {
  const { t } = useLingui()
  const [isPassportOpen, setIsPassportOpen] = useState(true)
  const [isIdCardOpen, setIsIdCardOpen] = useState(true)
  const [isDrivingOpen, setIsDrivingOpen] = useState(true)
  const initialValues = useMemo(
    () => ({
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
      passportPicture: initialRecord?.data?.passportPicture ?? [],
      idCardNumber: initialRecord?.data?.idCardNumber ?? '',
      idCardDateOfIssue: initialRecord?.data?.idCardDateOfIssue ?? '',
      idCardExpiryDate: initialRecord?.data?.idCardExpiryDate ?? '',
      idCardIssuingCountry: initialRecord?.data?.idCardIssuingCountry ?? '',
      idCardPicture: initialRecord?.data?.idCardPicture ?? [],
      drivingLicenseNumber: initialRecord?.data?.drivingLicenseNumber ?? '',
      drivingLicenseDateOfIssue:
        initialRecord?.data?.drivingLicenseDateOfIssue ?? '',
      drivingLicenseExpiryDate:
        initialRecord?.data?.drivingLicenseExpiryDate ?? '',
      drivingLicenseIssuingCountry:
        initialRecord?.data?.drivingLicenseIssuingCountry ?? '',
      drivingLicensePicture: initialRecord?.data?.drivingLicensePicture ?? [],
      attachments: initialRecord?.data.attachments ?? []
    }),
    [initialRecord, selectedFolder]
  )

  const { register, registerArray, setValues, values, setValue } = useForm({
    initialValues: initialValues
  })

  const { value: list, registerItem } = registerArray('customFields')

  const { refetch } = useGetMultipleFiles({
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

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  useEffect(() => {
    // Preserve image fields that already have base64 data to prevent flickering/disappearing
    const imageFields = [
      'attachments',
      'passportPicture',
      'idCardPicture',
      'drivingLicensePicture'
    ]
    const preservedValues = { ...initialValues }

    // Keep existing image fields if they have base64 data
    imageFields.forEach((fieldName) => {
      const currentValue = values[fieldName]
      if (
        currentValue &&
        Array.isArray(currentValue) &&
        currentValue.length > 0 &&
        currentValue.some((item) => item.base64)
      ) {
        // Only preserve if the attachment IDs match (same attachments, just reloading)
        const initialValue = initialValues[fieldName]
        const currentIds = currentValue.map((item) => item.id).sort()
        const initialIds = (initialValue || []).map((item) => item.id).sort()

        // If IDs match, preserve the current values (they have base64 data)
        if (JSON.stringify(currentIds) === JSON.stringify(initialIds)) {
          preservedValues[fieldName] = currentValue
        }
      }
    })

    setValues(preservedValues)
  }, [initialValues, setValues])

  const hasFullName = !!values?.fullName?.length
  const hasEmail = !!values?.email?.length
  const hasPhoneNumber = !!values?.phoneNumber?.length
  const hasAddress = !!values?.address?.length
  const hasZip = !!values?.zip?.length
  const hasCity = !!values?.city?.length
  const hasRegion = !!values?.region?.length
  const hasCountry = !!values?.country?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!list.length
  const hasPassportFullName = !!values?.passportFullName?.length
  const hasPassportNumber = !!values?.passportNumber?.length
  const hasPassportIssuingCountry = !!values?.passportIssuingCountry?.length
  const hasPassportDateOfIssue = !!values?.passportDateOfIssue?.length
  const hasPassportExpiryDate = !!values?.passportExpiryDate?.length
  const hasPassportNationality = !!values?.passportNationality?.length
  const hasPassportDob = !!values?.passportDob?.length
  const hasPassportGender = !!values?.passportGender?.length
  const hasPassportPicture = !!values.passportPicture?.length
  const hasIdCardNumber = !!values?.idCardNumber?.length
  const hasIdCardDateOfIssue = !!values?.idCardDateOfIssue?.length
  const hasIdCardExpiryDate = !!values?.idCardExpiryDate?.length
  const hasIdCardIssuingCountry = !!values?.idCardIssuingCountry?.length
  const hasIdCardPicture = !!values.idCardPicture?.length
  const hasDrivingLicenseNumber = !!values?.drivingLicenseNumber?.length
  const hasDrivingLicenseDateOfIssue =
    !!values?.drivingLicenseDateOfIssue?.length
  const hasDrivingLicenseExpiryDate = !!values?.drivingLicenseExpiryDate?.length
  const hasDrivingLicenseIssuingCountry =
    !!values?.drivingLicenseIssuingCountry?.length
  const hasDrivingLicensePicture = !!values.drivingLicensePicture?.length
  const hasAttachments = !!values?.attachments?.length

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

  return (
    <>
      {(hasFullName || hasEmail || hasPhoneNumber) && (
        <FormGroup title={t`Personal information`} isCollapse>
          {hasFullName && (
            <InputField
              icon={UserIcon}
              label={t`Full name`}
              placeholder={t`John Smith`}
              variant="outline"
              isDisabled
              {...register('fullName')}
            />
          )}

          {hasEmail && (
            <InputField
              icon={EmailIcon}
              label={t`Email`}
              placeholder={t`Insert email`}
              variant="outline"
              isDisabled
              {...register('email')}
            />
          )}

          {hasPhoneNumber && (
            <InputField
              icon={PhoneIcon}
              label={t`Phone number`}
              placeholder={t`Insert phone number`}
              variant="outline"
              isDisabled
              {...register('phoneNumber')}
            />
          )}
        </FormGroup>
      )}

      {(hasAddress || hasZip || hasCity || hasRegion || hasCountry) && (
        <FormGroup title={t`Detail of address`} isCollapse>
          {hasAddress && (
            <InputField
              label={t`Address`}
              placeholder={t`Insert address`}
              variant="outline"
              isDisabled
              {...register('address')}
            />
          )}

          {hasZip && (
            <InputField
              label={t`ZIP`}
              placeholder={t`Insert ZIP`}
              variant="outline"
              isDisabled
              {...register('zip')}
            />
          )}

          {hasCity && (
            <InputField
              label={t`City`}
              placeholder={t`Insert city`}
              variant="outline"
              isDisabled
              {...register('city')}
            />
          )}

          {hasRegion && (
            <InputField
              label={t`Region`}
              placeholder={t`Insert region`}
              variant="outline"
              isDisabled
              {...register('region')}
            />
          )}

          {hasCountry && (
            <InputField
              label={t`Country`}
              placeholder={t`Insert country`}
              variant="outline"
              isDisabled
              {...register('country')}
            />
          )}
        </FormGroup>
      )}

      {hasPassport && (
        <FormGroup
          title={t`Passport`}
          isCollapse
          onToggle={setIsPassportOpen}
          isOpened={true}
        >
          {hasPassportFullName && (
            <InputField
              label={t`Full name`}
              placeholder={t`John Smith`}
              variant="outline"
              icon={UserIcon}
              isDisabled
              {...register('passportFullName')}
            />
          )}
          {hasPassportNumber && (
            <InputField
              label={t`Passport number`}
              placeholder={t`Insert numbers`}
              variant="outline"
              icon={GroupIcon}
              isDisabled
              {...register('passportNumber')}
            />
          )}
          {hasPassportIssuingCountry && (
            <InputField
              label={t`Issuing country`}
              placeholder={t`Insert country`}
              variant="outline"
              icon={NationalityIcon}
              isDisabled
              {...register('passportIssuingCountry')}
            />
          )}
          {hasPassportDateOfIssue && (
            <InputField
              label={t`Date of issue`}
              placeholder={DATE_FORMAT}
              variant="outline"
              icon={CalendarIcon}
              isDisabled
              {...register('passportDateOfIssue')}
            />
          )}
          {hasPassportExpiryDate && (
            <InputField
              label={t`Expiry date`}
              placeholder={DATE_FORMAT}
              variant="outline"
              icon={CalendarIcon}
              isDisabled
              {...register('passportExpiryDate')}
            />
          )}
          {hasPassportNationality && (
            <InputField
              label={t`Nationality`}
              placeholder={t`Insert your nationality`}
              variant="outline"
              icon={NationalityIcon}
              isDisabled
              {...register('passportNationality')}
            />
          )}
          {hasPassportDob && (
            <InputField
              label={t`Date of birth`}
              placeholder={DATE_FORMAT}
              variant="outline"
              icon={CalendarIcon}
              isDisabled
              {...register('passportDob')}
            />
          )}
          {hasPassportGender && (
            <InputField
              label={t`Gender`}
              placeholder={t`M/F`}
              variant="outline"
              icon={GenderIcon}
              isDisabled
              {...register('passportGender')}
            />
          )}
        </FormGroup>
      )}

      {hasPassportPicture && isPassportOpen && (
        <ImagesField
          title={t`Passport picture`}
          pictures={values.passportPicture}
        />
      )}

      {hasIdCard && (
        <FormGroup
          title={t`Identity card`}
          isCollapse
          onToggle={setIsIdCardOpen}
          isOpened={true}
        >
          {hasIdCardNumber && (
            <InputField
              label={t`ID number`}
              placeholder={'123456789'}
              variant="outline"
              icon={GroupIcon}
              isDisabled
              {...register('idCardNumber')}
            />
          )}
          {hasIdCardDateOfIssue && (
            <InputField
              label={t`Creation date`}
              placeholder={DATE_FORMAT}
              variant="outline"
              icon={CalendarIcon}
              isDisabled
              {...register('idCardDateOfIssue')}
            />
          )}
          {hasIdCardExpiryDate && (
            <InputField
              label={t`Expiry date`}
              placeholder={DATE_FORMAT}
              variant="outline"
              icon={CalendarIcon}
              isDisabled
              {...register('idCardExpiryDate')}
            />
          )}
          {hasIdCardIssuingCountry && (
            <InputField
              label={t`Issuing country`}
              placeholder={t`Insert country`}
              variant="outline"
              icon={NationalityIcon}
              isDisabled
              {...register('idCardIssuingCountry')}
            />
          )}
        </FormGroup>
      )}

      {hasIdCardPicture && isIdCardOpen && (
        <ImagesField
          title={t`ID card picture`}
          pictures={values.idCardPicture}
        />
      )}

      {hasDrivingLicense && (
        <FormGroup
          title={t`Driving license`}
          isCollapse
          onToggle={setIsDrivingOpen}
          isOpened={true}
        >
          {hasDrivingLicenseNumber && (
            <InputField
              label={t`ID number`}
              placeholder={t`123456789`}
              variant="outline"
              icon={GroupIcon}
              isDisabled
              {...register('drivingLicenseNumber')}
            />
          )}
          {hasDrivingLicenseDateOfIssue && (
            <InputField
              label={t`Creation date`}
              placeholder={DATE_FORMAT}
              variant="outline"
              icon={CalendarIcon}
              isDisabled
              {...register('drivingLicenseDateOfIssue')}
            />
          )}
          {hasDrivingLicenseExpiryDate && (
            <InputField
              label={t`Expiry date`}
              placeholder={DATE_FORMAT}
              variant="outline"
              icon={CalendarIcon}
              isDisabled
              {...register('drivingLicenseExpiryDate')}
            />
          )}
          {hasDrivingLicenseIssuingCountry && (
            <InputField
              label={t`Issuing country`}
              placeholder={t`Insert country`}
              variant="outline"
              icon={NationalityIcon}
              isDisabled
              {...register('drivingLicenseIssuingCountry')}
            />
          )}
        </FormGroup>
      )}

      {hasDrivingLicensePicture && isDrivingOpen && (
        <ImagesField
          title={t`Driving license picture`}
          pictures={values.drivingLicensePicture}
        />
      )}

      {hasAttachments && (
        <FormGroup>
          {values.attachments.map((attachment) => (
            <AttachmentField
              key={attachment?.id || attachment.name}
              attachment={attachment}
              label={'File'}
            />
          ))}
        </FormGroup>
      )}

      {hasNote && (
        <FormGroup>
          <InputFieldNote isDisabled {...register('note')} />
        </FormGroup>
      )}

      {hasCustomFields && (
        <CustomFields
          areInputsDisabled
          customFields={list}
          register={registerItem}
        />
      )}
    </>
  )
}
