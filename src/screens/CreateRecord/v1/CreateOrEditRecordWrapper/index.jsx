import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'
import { CreateOrEditCreditCardContent } from '../CreateOrEditCreditCardContent'
import { CreateOrEditCustomContent } from '../CreateOrEditCustomContent'
import { CreateOrEditIdentityContent } from '../CreateOrEditIdentityContent'
import { CreateOrEditLoginContent } from '../CreateOrEditLoginContent'
import { CreateOrEditNoteContent } from '../CreateOrEditNoteContent'
import { CreateOrEditPassphraseContent } from '../CreateOrEditPassphraseContent'
import { CreateOrEditWifiPasswordContent } from '../CreateOrEditWifiPasswordContent'

export const CreateOrEditRecordWrapper = ({
  recordType,
  initialRecord,
  selectedFolder
}) => {
  if (recordType === RECORD_TYPES.CREDIT_CARD) {
    return (
      <CreateOrEditCreditCardContent
        initialRecord={initialRecord}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (recordType === RECORD_TYPES.CUSTOM) {
    return (
      <CreateOrEditCustomContent
        initialRecord={initialRecord}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (recordType === RECORD_TYPES.IDENTITY) {
    return (
      <CreateOrEditIdentityContent
        initialRecord={initialRecord}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (recordType === RECORD_TYPES.LOGIN) {
    return (
      <CreateOrEditLoginContent
        initialRecord={initialRecord}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (recordType === RECORD_TYPES.NOTE) {
    return (
      <CreateOrEditNoteContent
        initialRecord={initialRecord}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (recordType === RECORD_TYPES.PASS_PHRASE) {
    return (
      <CreateOrEditPassphraseContent
        initialRecord={initialRecord}
        selectedFolder={selectedFolder}
      />
    )
  }
  if (recordType === RECORD_TYPES.WIFI_PASSWORD) {
    return (
      <CreateOrEditWifiPasswordContent
        initialRecord={initialRecord}
        selectedFolder={selectedFolder}
      />
    )
  }
}
