import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import { getMasterEncryption } from 'pearpass-lib-vault'

import { useBiometricsAuthentication } from './useBiometricsAuthentication'
import { IOS_APP_GROUP_ID } from '../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../constants/secureStorageKeys'
import messages from '../locales/en/messages'
import { logger } from '../utils/logger'

i18n.load('en', messages)
i18n.activate('en')

// Mocks
jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (msg) => msg
  })
}))
jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(),
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  supportedAuthenticationTypesAsync: jest.fn()
}))
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn()
}))
jest.mock('pearpass-lib-vault', () => ({
  getMasterEncryption: jest.fn()
}))
jest.mock('../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

const wrapper = ({ children }) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
)

describe('useBiometricsAuthentication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default values', async () => {
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(false)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(false)
    SecureStore.getItemAsync.mockResolvedValue(null)

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })

    await waitFor(() => {
      expect(result.current.isBiometricsSupported).toBeDefined()
    })

    expect(result.current.isBiometricsSupported).toBe(false)
    expect(result.current.isBiometricsEnabled).toBe(false)
    expect(result.current.biometricTypes).toBe(null)
  })

  it('should enable biometrics successfully', async () => {
    LocalAuthentication.authenticateAsync.mockResolvedValue({ success: true })
    getMasterEncryption.mockResolvedValue({
      ciphertext: 'cipher',
      nonce: 'nonce',
      hashedPassword: 'hash'
    })
    SecureStore.setItemAsync.mockResolvedValue()
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true)
    SecureStore.getItemAsync.mockResolvedValue('false')

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })

    await waitFor(() => {
      expect(result.current.isBiometricsSupported).toBe(true)
    })

    let response
    await act(async () => {
      response = await result.current.enableBiometrics()
    })

    expect(LocalAuthentication.authenticateAsync).toHaveBeenCalled()
    expect(getMasterEncryption).toHaveBeenCalled()
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      SECURE_STORAGE_KEYS.ENCRYPTION_DATA,
      JSON.stringify({
        ciphertext: 'cipher',
        nonce: 'nonce',
        hashedPassword: 'hash'
      }),
      { requireAuthentication: true, accessGroup: IOS_APP_GROUP_ID }
    )
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      SECURE_STORAGE_KEYS.BIOMETRICS_ENABLED,
      JSON.stringify(true),
      { accessGroup: IOS_APP_GROUP_ID }
    )
    expect(response).toEqual({ success: true })
    expect(result.current.isBiometricsEnabled).toBe(true)
  })

  it('should handle failed biometric authentication', async () => {
    LocalAuthentication.authenticateAsync.mockResolvedValue({ success: false })
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true)
    SecureStore.getItemAsync.mockResolvedValue('false')

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })

    let response
    await act(async () => {
      response = await result.current.enableBiometrics()
    })

    expect(response).toBe(false)
    expect(result.current.isBiometricsEnabled).toBe(false)
  })

  it('should handle error when enabling biometrics', async () => {
    LocalAuthentication.authenticateAsync.mockRejectedValue(new Error('fail'))
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true)
    SecureStore.getItemAsync.mockResolvedValue('false')

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })
    await waitFor(() => {
      expect(result.current.isBiometricsSupported).toBe(true)
    })

    let response
    await act(async () => {
      response = await result.current.enableBiometrics()
    })

    expect(logger.error).toHaveBeenCalled()
    expect(response.success).toBe(false)
    expect(response.error).toContain('fail')
  })

  it('should disable biometrics successfully', async () => {
    SecureStore.deleteItemAsync.mockResolvedValue()
    SecureStore.setItemAsync.mockResolvedValue()
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true)
    SecureStore.getItemAsync.mockResolvedValue('true')

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })
    await waitFor(() => {
      expect(result.current.isBiometricsSupported).toBe(true)
    })

    let response
    await act(async () => {
      response = await result.current.disableBiometrics()
    })

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      SECURE_STORAGE_KEYS.ENCRYPTION_DATA
    )
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      SECURE_STORAGE_KEYS.BIOMETRICS_ENABLED,
      JSON.stringify(false),
      { accessGroup: IOS_APP_GROUP_ID }
    )
    expect(response).toEqual({ success: true })
    expect(result.current.isBiometricsEnabled).toBe(false)
  })

  it('should handle error when disabling biometrics', async () => {
    SecureStore.deleteItemAsync.mockRejectedValue(new Error('fail'))
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true)
    SecureStore.getItemAsync.mockResolvedValue('true')

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })
    await waitFor(() => {
      expect(result.current.isBiometricsSupported).toBe(true)
    })

    let response
    await act(async () => {
      response = await result.current.disableBiometrics()
    })

    expect(logger.error).toHaveBeenCalled()
    expect(response.success).toBe(false)
    expect(response.error).toContain('fail')
  })

  it('should toggle biometrics on', async () => {
    LocalAuthentication.authenticateAsync.mockResolvedValue({ success: true })
    getMasterEncryption.mockResolvedValue({
      ciphertext: 'cipher',
      nonce: 'nonce',
      hashedPassword: 'hash'
    })
    SecureStore.setItemAsync.mockResolvedValue()
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true)
    SecureStore.getItemAsync.mockResolvedValue('false')

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })
    await waitFor(() => {
      expect(result.current.isBiometricsSupported).toBe(true)
    })

    let response
    await act(async () => {
      response = await result.current.toggleBiometrics(true)
    })

    expect(response).toEqual({ success: true })
    expect(result.current.isBiometricsEnabled).toBe(true)
  })

  it('should toggle biometrics off', async () => {
    SecureStore.deleteItemAsync.mockResolvedValue()
    SecureStore.setItemAsync.mockResolvedValue()
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true)
    SecureStore.getItemAsync.mockResolvedValue('true')

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })
    await waitFor(() => {
      expect(result.current.isBiometricsSupported).toBe(true)
    })

    let response
    await act(async () => {
      response = await result.current.toggleBiometrics(false)
    })

    expect(response).toEqual({ success: true })
    expect(result.current.isBiometricsEnabled).toBe(false)
  })

  it('should set biometricTypes if enabled', async () => {
    LocalAuthentication.hasHardwareAsync.mockResolvedValue(true)
    LocalAuthentication.isEnrolledAsync.mockResolvedValue(true)
    SecureStore.getItemAsync.mockResolvedValue('true')
    LocalAuthentication.supportedAuthenticationTypesAsync.mockResolvedValue([
      'fingerprint',
      'face'
    ])

    const { result } = renderHook(() => useBiometricsAuthentication(), {
      wrapper
    })
    await waitFor(() => {
      expect(result.current.isBiometricsSupported).toBe(true)
    })

    expect(result.current.biometricTypes).toEqual(['fingerprint', 'face'])
  })
})
