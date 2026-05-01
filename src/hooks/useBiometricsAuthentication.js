import { useState, useCallback, useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { getMasterEncryption } from '@tetherto/pearpass-lib-vault'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'

import { IOS_APP_GROUP_ID } from '../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../constants/secureStorageKeys'
import { logger } from '../utils/logger'

/**
 * @returns {{
 *  biometricTypes: string[] | null,
 *  isBiometricsSupported: boolean,
 *  isBiometricsEnabled: boolean,
 *  enableBiometrics: () => Promise<{ success: boolean, error?: string }>,
 *  disableBiometrics: () => Promise<{ success: boolean, error?: string }>,
 *  toggleBiometrics: (enabled: boolean) => Promise<{ success: boolean, error?: string }>
 * }}
 */
export const useBiometricsAuthentication = () => {
  const { t } = useLingui()
  const [isBiometricsSupported, setIsBiometricsSupported] = useState(false)
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false)
  const [biometricTypes, setBiometricTypes] = useState(null)

  const enableBiometrics = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t`Authenticate to enable biometric login`
      })

      if (!result.success) {
        return false
      }

      const { ciphertext, nonce, hashedPassword } = await getMasterEncryption()

      if (isBiometricsSupported) {
        await SecureStore.setItemAsync(
          SECURE_STORAGE_KEYS.ENCRYPTION_DATA,
          JSON.stringify({
            ciphertext,
            nonce,
            hashedPassword
          }),
          {
            requireAuthentication: true,
            accessGroup: IOS_APP_GROUP_ID
          }
        )
      }

      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.BIOMETRICS_ENABLED,
        JSON.stringify(true),
        {
          accessGroup: IOS_APP_GROUP_ID
        }
      )

      setIsBiometricsEnabled(true)

      return { success: true }
    } catch (error) {
      logger.error('Error enabling biometrics:', error)
      return { success: false, error: error.toString() }
    }
  }, [isBiometricsSupported, t])

  const disableBiometrics = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(SECURE_STORAGE_KEYS.ENCRYPTION_DATA)
      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.BIOMETRICS_ENABLED,
        JSON.stringify(false),
        {
          accessGroup: IOS_APP_GROUP_ID
        }
      )
      setIsBiometricsEnabled(false)

      return { success: true }
    } catch (error) {
      logger.error('Error disabling biometrics:', error)
      return { success: false, error: error.toString() }
    }
  }, [])

  const toggleBiometrics = useCallback(
    async (enabled) => {
      if (enabled) {
        return enableBiometrics()
      } else {
        return disableBiometrics()
      }
    },
    [enableBiometrics, disableBiometrics]
  )

  /**
   * Re-saves ENCRYPTION_DATA in SecureStore with the current vault's
   * ciphertext/nonce/hashedPassword. Call this after operations that rotate
   * the master encryption (e.g. master password change) so autofill's
   * biometric unlock keeps working without prompting the user to re-enable
   * biometrics. No-op when biometrics aren't enabled.
   */
  const refreshBiometricEncryption = useCallback(async () => {
    try {
      const enabled = await SecureStore.getItemAsync(
        SECURE_STORAGE_KEYS.BIOMETRICS_ENABLED,
        { accessGroup: IOS_APP_GROUP_ID }
      )
      if (enabled !== 'true') {
        return { success: true, skipped: true }
      }

      const { ciphertext, nonce, hashedPassword } = await getMasterEncryption()

      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.ENCRYPTION_DATA,
        JSON.stringify({ ciphertext, nonce, hashedPassword }),
        {
          requireAuthentication: true,
          accessGroup: IOS_APP_GROUP_ID
        }
      )

      return { success: true }
    } catch (error) {
      logger.error('Error refreshing biometric encryption:', error)
      return { success: false, error: error.toString() }
    }
  }, [])

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()

      setIsBiometricsSupported(hasHardware && isEnrolled)
    }

    const loadUserPref = async () => {
      const biometricsEnabled = await SecureStore.getItemAsync(
        SECURE_STORAGE_KEYS.BIOMETRICS_ENABLED,
        {
          accessGroup: IOS_APP_GROUP_ID
        }
      )

      const isEnabled = biometricsEnabled === 'true'

      setIsBiometricsEnabled(isEnabled)

      if (isEnabled) {
        const supportedTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync()
        setBiometricTypes(supportedTypes)
      }
    }

    checkBiometricSupport()
    loadUserPref()
  }, [])

  return {
    biometricTypes,
    isBiometricsSupported,
    isBiometricsEnabled,
    enableBiometrics,
    disableBiometrics,
    toggleBiometrics,
    refreshBiometricEncryption
  }
}
