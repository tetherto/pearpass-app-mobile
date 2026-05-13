import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  InputField,
  PasswordField,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../../constants/toast'
import { Layout } from '../../../containers/Layout'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { logger } from '../../../utils/logger'

export const VaultRenameScreen = ({ route }) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const {
    data: vault,
    isVaultProtected,
    updateProtectedVault,
    updateUnprotectedVault
  } = useVault()

  const vaultId = route?.params?.vaultId || vault?.id
  const currentVaultName =
    vault?.id === vaultId ? vault?.name : route?.params?.vaultName || vault?.id

  const [name, setName] = useState(currentVaultName || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [isProtected, setIsProtected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentVaultName) {
      setName(currentVaultName)
    }
  }, [currentVaultName])

  useEffect(() => {
    const checkProtection = async () => {
      if (!vaultId) {
        return
      }

      const result = await isVaultProtected(vaultId)
      setIsProtected(result)
    }

    checkProtection()
  }, [isVaultProtected, vaultId])

  const trimmedName = name.trim()
  const isUnchanged = trimmedName === (currentVaultName || '').trim()
  const canSubmit =
    trimmedName.length > 0 &&
    !isUnchanged &&
    (!isProtected || currentPassword.length > 0)

  const handleSave = async () => {
    if (!canSubmit || !vaultId) {
      return
    }

    try {
      setIsLoading(true)

      if (isProtected) {
        await updateProtectedVault(vaultId, {
          name: trimmedName,
          currentPassword
        })
      } else {
        await updateUnprotectedVault(vaultId, {
          name: trimmedName
        })
      }

      Toast.show({
        type: 'baseToast',
        text1: t`Vault renamed`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
      navigation.goBack()
    } catch (error) {
      logger.error('Error renaming vault:', error)
      Toast.show({
        type: 'baseToast',
        text1: isProtected
          ? t`Invalid vault password`
          : t`Could not rename vault`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout
      scrollable
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={t`Rename Vault`}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <Button
          variant="primary"
          size="medium"
          fullWidth
          disabled={!canSubmit || isLoading}
          isLoading={isLoading}
          onClick={handleSave}
          testID="rename-vault-save-button"
        >
          {t`Save`}
        </Button>
      }
    >
      <View style={styles.fields}>
        <InputField
          label={t`Vault Name`}
          placeholder={t`Enter Name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          testID="rename-vault-name-input"
        />

        {isProtected && (
          <PasswordField
            label={t`Current Password`}
            placeholder={t`Enter vault password`}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            testID="rename-vault-current-password-input"
          />
        )}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16
  },
  fields: {
    gap: rawTokens.spacing16
  }
})
