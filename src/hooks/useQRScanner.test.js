import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, renderHook } from '@testing-library/react-native'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { Alert, AppState, PermissionsAndroid, Platform } from 'react-native'

import { useQRScanner } from './useQRScanner'
import { isFdroid } from '../constants/distribution'
import messages from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

// Mock Camera and ImagePicker
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(),
    getCameraPermissionsAsync: jest.fn(),
    scanFromURLAsync: jest.fn()
  },
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined'
  }
}))

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn()
}))

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openSettings: jest.fn()
}))

jest.mock('../constants/distribution', () => ({
  isFdroid: jest.fn(() => false)
}))

jest.spyOn(Alert, 'alert')

describe('useQRScanner', () => {
  let onScanned, onError
  let appStateSubscription
  let permissionsCheckSpy
  let appStateListenerSpy
  const originalPlatformOs = Platform.OS

  beforeEach(() => {
    onScanned = jest.fn()
    onError = jest.fn()
    jest.clearAllMocks()
    jest.useFakeTimers()
    isFdroid.mockReturnValue(false)
    appStateSubscription = { remove: jest.fn() }
    if (!PermissionsAndroid.check) {
      PermissionsAndroid.check = jest.fn()
    }
    permissionsCheckSpy = jest
      .spyOn(PermissionsAndroid, 'check')
      .mockResolvedValue(false)
    appStateListenerSpy = jest
      .spyOn(AppState, 'addEventListener')
      .mockReturnValue(appStateSubscription)
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalPlatformOs
    })
    // Default mock for getCameraPermissionsAsync
    Camera.getCameraPermissionsAsync.mockResolvedValue({
      status: 'granted',
      canAskAgain: true
    })
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    permissionsCheckSpy?.mockRestore()
    appStateListenerSpy?.mockRestore()
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalPlatformOs
    })
  })

  it('should request and grant camera permission', async () => {
    Camera.getCameraPermissionsAsync.mockResolvedValue({
      status: 'granted',
      canAskAgain: true
    })
    Camera.requestCameraPermissionsAsync.mockResolvedValue({
      status: 'granted',
      canAskAgain: true
    })

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    await act(async () => {
      const permission = await result.current.requestPermission()
      expect(permission).toBe(true)
    })

    expect(result.current.hasPermission).toBe(true)
  })

  it('should deny camera permission and show alert', async () => {
    Camera.getCameraPermissionsAsync.mockResolvedValue({
      status: 'denied',
      canAskAgain: false
    })
    Camera.requestCameraPermissionsAsync.mockResolvedValue({
      status: 'denied',
      canAskAgain: false
    })

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    await act(async () => {
      const permission = await result.current.requestPermission()
      expect(permission).toBe(false)
    })

    expect(result.current.hasPermission).toBe(false)
    expect(Alert.alert).toHaveBeenCalledWith(
      expect.stringContaining('Permission Required'),
      expect.stringContaining("You've previously denied"),
      expect.any(Array)
    )
  })

  it('should trust native Android camera permission for fdroid builds', async () => {
    isFdroid.mockReturnValue(true)
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'android'
    })
    PermissionsAndroid.check.mockResolvedValue(true)
    Camera.getCameraPermissionsAsync.mockResolvedValue({
      status: 'denied',
      canAskAgain: false
    })

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    await act(async () => {
      const permission = await result.current.requestPermission()
      expect(permission).toBe(true)
    })

    expect(PermissionsAndroid.check).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.CAMERA
    )
    expect(AppState.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    )
    expect(Camera.requestCameraPermissionsAsync).not.toHaveBeenCalled()
    expect(result.current.hasPermission).toBe(true)
  })

  it('should call onScanned when a valid QR code is scanned', () => {
    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    act(() => {
      result.current.handleBarCodeScanned({ type: 'qr', data: 'test-data' })
    })

    expect(onScanned).toHaveBeenCalledWith('test-data', 'qr')
  })

  it('should not scan if scan delay is not met', () => {
    const { result } = renderHook(
      () => useQRScanner({ onScanned, scanDelay: 5000 }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    act(() => {
      result.current.handleBarCodeScanned({ type: 'qr', data: 'test-data' })
    })

    act(() => {
      result.current.handleBarCodeScanned({ type: 'qr', data: 'test-data' })
    })

    expect(onScanned).toHaveBeenCalledTimes(1)
  })

  it('should open image picker and scan barcode from image', async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: true,
      canAskAgain: true
    })

    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'image-uri' }]
    })

    Camera.scanFromURLAsync.mockResolvedValue([
      { type: 'qr', data: 'image-scanned-data' }
    ])

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    await act(async () => {
      await result.current.pickImageForScan()
    })

    expect(Camera.scanFromURLAsync).toHaveBeenCalledWith(
      'image-uri',
      expect.any(Array)
    )
    expect(onScanned).toHaveBeenCalledWith('image-scanned-data', 'qr')
  })

  it('should show an alert if no QR code is found in image', async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: true,
      canAskAgain: true
    })

    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'image-uri' }]
    })

    Camera.scanFromURLAsync.mockResolvedValue([])

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    await act(async () => {
      await result.current.pickImageForScan()
    })

    expect(Alert.alert).toHaveBeenCalledWith(
      expect.stringContaining('Error'),
      expect.stringContaining('No QR code found in the image'),
      expect.any(Array)
    )
  })
})
