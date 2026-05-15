import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'

import { CreateOrEditAuthenticatorContent } from './CreateOrEditAuthenticatorContent'
import { CreateOrEditCreditCardContent } from './CreateOrEditCreditCardContent'
import { CreateOrEditCustomContent } from './CreateOrEditCustomContent'
import { CreateOrEditIdentityContent } from './CreateOrEditIdentityContent'
import { CreateOrEditLoginContent } from './CreateOrEditLoginContent'
import { CreateOrEditNoteContent } from './CreateOrEditNoteContent'
import { CreateOrEditPassphraseContent } from './CreateOrEditPassphraseContent'
import { CreateOrEditWifiPasswordContent } from './CreateOrEditWifiPasswordContent'

import { KeyboardAvoidingWrapper } from '../../../components/KeyboardAvoidingWrapper'
import { useSharedFilter } from '../../../context/SharedFilterContext'

type CreateRecordV2Props = {
  route: {
    params: {
      recordType: string
      record?: unknown
      selectedFolder?: string
    }
  }
}

export const CreateRecordV2 = ({ route }: CreateRecordV2Props) => {
  const { recordType, record: initialRecord, selectedFolder } = route.params
  const { state } = useSharedFilter()

  const folder =
    state?.folder === 'allFolder' ||
      state?.folder === 'favorite' ||
      state?.folder === 'authenticator'
      ? undefined
      : state?.folder

  const resolvedFolder = selectedFolder ?? folder

  const renderContent = () => {
    switch (recordType) {
      case RECORD_TYPES.OTP:
        if (initialRecord) {
          return <CreateOrEditLoginContent initialRecord={initialRecord} selectedFolder={resolvedFolder} />
        }
        return <CreateOrEditAuthenticatorContent selectedFolder={resolvedFolder} />
      case RECORD_TYPES.CREDIT_CARD:
        return <CreateOrEditCreditCardContent initialRecord={initialRecord} selectedFolder={resolvedFolder} />
      case RECORD_TYPES.CUSTOM:
        return <CreateOrEditCustomContent initialRecord={initialRecord} selectedFolder={resolvedFolder} />
      case RECORD_TYPES.IDENTITY:
        return <CreateOrEditIdentityContent initialRecord={initialRecord} selectedFolder={resolvedFolder} />
      case RECORD_TYPES.LOGIN:
        return <CreateOrEditLoginContent initialRecord={initialRecord} selectedFolder={resolvedFolder} />
      case RECORD_TYPES.NOTE:
        return <CreateOrEditNoteContent initialRecord={initialRecord} selectedFolder={resolvedFolder} />
      case RECORD_TYPES.PASS_PHRASE:
        return <CreateOrEditPassphraseContent initialRecord={initialRecord} selectedFolder={resolvedFolder} />
      case RECORD_TYPES.WIFI_PASSWORD:
        return <CreateOrEditWifiPasswordContent initialRecord={initialRecord} selectedFolder={resolvedFolder} />
      default:
        return null
    }
  }

  return (
    <KeyboardAvoidingWrapper>
      <GestureHandlerRootView>
          {renderContent()}
      </GestureHandlerRootView>
    </KeyboardAvoidingWrapper>
  )
}
