import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { CreateOrEditRecordWrapper } from './CreateOrEditRecordWrapper'
import { RecordFormContainer } from './styles'
import { KeyboardAvoidingWrapper } from '../../components/KeyboardAvoidingWrapper'
import { useSharedFilter } from '../../context/SharedFilterContext'

export const CreateRecord = ({ route }) => {
  const { recordType, record: initialRecord, selectedFolder } = route.params
  const { state } = useSharedFilter()

  const folder =
    state?.folder === 'allFolder' ||
    state?.folder === 'favorite' ||
    state?.folder === 'authenticator'
      ? undefined
      : state?.folder

  return (
    <KeyboardAvoidingWrapper>
      <GestureHandlerRootView>
        <RecordFormContainer>
          <CreateOrEditRecordWrapper
            recordType={recordType}
            initialRecord={initialRecord}
            selectedFolder={selectedFolder ?? folder}
          />
        </RecordFormContainer>
      </GestureHandlerRootView>
    </KeyboardAvoidingWrapper>
  )
}
