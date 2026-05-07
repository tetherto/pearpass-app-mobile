import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useCreateVault, useVault } from '@tetherto/pearpass-lib-vault'
import { Platform, View, StyleSheet, ActivityIndicator } from 'react-native'
import Toast from 'react-native-toast-message'

import { StepIdentity } from './StepIdentity'
import { TOAST_CONFIG } from '../../../constants/toast'
import { logger } from '../../../utils/logger'

export const VaultWizard = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    passwordConfirm: '',
    usePassword: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const { createVault } = useCreateVault()
  const { addDevice } = useVault()

  const handleBack = () => {
    navigation.goBack()
  }

  const handleCreate = async (data) => {
    try {
      setIsLoading(true)
      setFormData(data)
      await createVault({
        name: data.name,
        password: data.usePassword ? data.password : undefined
      })
      await addDevice(Platform.OS + ' ' + Platform.Version)
      Toast.show({
        type: 'baseToast',
        text1: t`Vault created`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
      navigation.replace('MainTabNavigator')
    } catch (error) {
      logger.error('Error creating vault:', error)
      Toast.show({
        type: 'baseToast',
        text1: t`Could not create vault`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.colorSurfacePrimary }
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.colorPrimary} />
      </View>
    )
  }

  return (
    <StepIdentity
      initialData={formData}
      onSubmit={handleCreate}
      onBack={handleBack}
    />
  )
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
