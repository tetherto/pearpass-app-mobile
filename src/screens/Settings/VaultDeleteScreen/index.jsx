import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  AlertMessage,
  Button,
  PasswordField,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { ReportProblem } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Keyboard, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { Layout } from 'src/containers/Layout'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'

import { TOAST_CONFIG } from '../../../constants/toast'

export const VaultDeleteScreen = ({ route }) => {
  const { t } = useLingui()
  const navigation = useNavigation()

  const vaultName = route?.params?.vaultName || t`Personal`

  const [masterPassword, setMasterPassword] = useState('')

  const canSubmit = masterPassword.trim().length > 0

  const handleDelete = () => {
    if (!canSubmit) {
      return
    }

    Keyboard.dismiss()
    Toast.show({
      type: 'baseToast',
      text1: t`Vault deletion is not yet connected on mobile`,
      position: 'bottom',
      bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
    })
  }

  return (
    <Layout
      header={
        <BackScreenHeader
          title={t`Delete ${vaultName} vault`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.content}
      footer={
        <Button
          variant="destructive"
          size="medium"
          fullWidth
          disabled={!canSubmit}
          onClick={handleDelete}
          testID="vault-delete-submit-button"
        >
          {t`Delete Vault`}
        </Button>
      }
    >
      <View style={styles.fields}>
        <PasswordField
          label={t`Confirm With Master Password`}
          value={masterPassword}
          placeholder={t`Enter Master Password to Confirm Deletion`}
          onChange={(e) => setMasterPassword(e.target.value)}
          testID="vault-delete-master-password-input"
        />

        <AlertMessage
          variant="warning"
          size="small"
          title={t`Deletion unavailable`}
          description={t`Deleting this vault permanently removes all data on this device. Vault deletion remains blocked until mobile SDK support is available.`}
          icon={<ReportProblem />}
          testID="vault-delete-warning"
        />
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: rawTokens.spacing20
  },
  fields: {
    gap: rawTokens.spacing16
  }
})
