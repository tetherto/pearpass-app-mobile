import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useCreateVault, useVault } from '@tetherto/pearpass-lib-vault'
import {
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import Toast from 'react-native-toast-message'

import { StepIdentity } from './StepIdentity'
import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { TOAST_CONFIG } from '../../../constants/toast'
import { logger } from '../../../utils/logger'

export const VaultWizard = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
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
    navigation.navigate('Welcome', {
      state: NAVIGATION_ROUTES.SELECT_OR_LOAD
    })
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

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary400.mode1} />
          </View>
        ) : (
          <StepIdentity
            initialData={formData}
            onSubmit={handleCreate}
            onBack={handleBack}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
