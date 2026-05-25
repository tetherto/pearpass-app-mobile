import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'

import { CreditCardRecordDetailsForm } from './CreditCardRecordDetailsForm'
import { CustomRecordDetailsForm } from './CustomRecordDetailsForm'
import { IdentityRecordDetailsForm } from './IdentityRecordDetailsForm'
import { LoginRecordDetailsForm } from './LoginRecordDetailsForm'
import { NoteRecordDetailsForm } from './NoteRecordDetailsForm'
import { PassPhraseRecordDetailsForm } from './PassPhraseRecordDetailsForm'
import { WifiPasswordDetailsForm } from './WifiPasswordDetailsForm'

export const RecordDetailsContent = ({ record, selectedFolder }) => {
  if (record?.type === RECORD_TYPES.CREDIT_CARD) {
    return (
      <CreditCardRecordDetailsForm
        initialRecord={record}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (record?.type === RECORD_TYPES.CUSTOM) {
    return (
      <CustomRecordDetailsForm
        initialRecord={record}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (record?.type === RECORD_TYPES.IDENTITY) {
    return (
      <IdentityRecordDetailsForm
        initialRecord={record}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (record?.type === RECORD_TYPES.LOGIN) {
    return (
      <LoginRecordDetailsForm
        initialRecord={record}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (record?.type === RECORD_TYPES.NOTE) {
    return (
      <NoteRecordDetailsForm
        initialRecord={record}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (record?.type === RECORD_TYPES.PASS_PHRASE) {
    return (
      <PassPhraseRecordDetailsForm
        initialRecord={record}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (record?.type === RECORD_TYPES.WIFI_PASSWORD) {
    return (
      <WifiPasswordDetailsForm
        initialRecord={record}
        selectedFolder={selectedFolder}
      />
    )
  }
}
