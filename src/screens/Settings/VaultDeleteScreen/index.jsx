import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  AlertMessage,
  Button,
  PageHeader,
  PasswordField,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { ReportProblem } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Keyboard, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from 'src/containers/ScreenLayout'

import { TOAST_CONFIG } from '../../../constants/toast'

export const VaultDeleteScreen = ({ route }) => {
  const { t } = useLingui()
  const navigation = useNavigation()

  const vaultName = route?.params?.vaultName || t`Personal Vault`

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
    <ScreenLayout
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
          style={styles.header}
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
      <PageHeader
        title={t`Delete Personal Vault`}
        subtitle={t`Are you sure you want to delete “${vaultName}”? All items in this vault will be permanently deleted. This cannot be undone.`}
      />

      <View style={styles.fields}>
        <PasswordField
          label={t`Confirm With Master Password`}
          value={masterPassword}
          placeholderText={t`Enter Master Password to Confirm Deletion`}
          onChangeText={setMasterPassword}
          testID="vault-delete-master-password-input"
          onSubmitEditing={handleDelete}
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
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: rawTokens.spacing16
  },
  content: {
    flex: 1,
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing20
  },
  fields: {
    gap: rawTokens.spacing16
  }
})
