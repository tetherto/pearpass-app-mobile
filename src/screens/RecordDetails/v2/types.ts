import type { OtpPublic } from '@tetherto/pearpass-lib-vault/src/types'

export interface CustomField {
  type: string
  note: string
}

export interface Attachment {
  id?: string
  name?: string
  base64?: string
}

export interface BaseRecord<T = unknown> {
  id?: string
  folder?: string
  type?: string
  attachments?: Attachment[]
  otpPublic?: OtpPublic
  passkeyCreatedAt?: Date | string | null
  data?: T
}

export interface CreditCardData {
  name?: string
  number?: string
  expireDate?: string
  securityCode?: string
  pinCode?: string
  note?: string
  customFields?: CustomField[]
}
export type CreditCardRecord = BaseRecord<CreditCardData>

export interface LoginData {
  username?: string
  password?: string
  note?: string
  websites?: string[]
  customFields?: CustomField[]
  attachments?: Attachment[]
  credential?: { id: string }
  passkeyCreatedAt?: string | Date | null
  passwordUpdatedAt?: string | Date | null
}
export type LoginRecord = BaseRecord<LoginData>

export interface PassPhraseData {
  title?: string
  passPhrase?: string
  note?: string
  customFields?: CustomField[]
}
export type PassPhraseRecord = BaseRecord<PassPhraseData>

export interface IdentityData {
  fullName?: string
  email?: string
  phoneNumber?: string
  address?: string
  zip?: string
  city?: string
  region?: string
  country?: string
  note?: string
  customFields?: CustomField[]
  passportFullName?: string
  passportNumber?: string
  passportIssuingCountry?: string
  passportDateOfIssue?: string
  passportExpiryDate?: string
  passportNationality?: string
  passportDob?: string
  passportGender?: string
  passportPicture?: Attachment[]
  idCardNumber?: string
  idCardDateOfIssue?: string
  idCardExpiryDate?: string
  idCardIssuingCountry?: string
  idCardPicture?: Attachment[]
  drivingLicenseNumber?: string
  drivingLicenseDateOfIssue?: string
  drivingLicenseExpiryDate?: string
  drivingLicenseIssuingCountry?: string
  drivingLicensePicture?: Attachment[]
  attachments?: Attachment[]
}
export type IdentityRecord = BaseRecord<IdentityData>

export interface WifiPasswordData {
  title?: string
  password?: string
  note?: string
  customFields?: CustomField[]
}
export type WifiPasswordRecord = BaseRecord<WifiPasswordData>

export interface CustomRecordData {
  note?: string
  customFields?: CustomField[]
}
export type CustomRecord = BaseRecord<CustomRecordData>

export interface NoteRecordData {
  note?: string
  customFields?: CustomField[]
}
export type NoteRecord = BaseRecord<NoteRecordData>
