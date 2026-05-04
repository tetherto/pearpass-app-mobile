import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { Alert, Platform } from 'react-native'
import { Camera, useCodeScanner } from 'react-native-vision-camera'
import { decodeBase64 } from 'vision-camera-zxing'

import { useQRScanner } from './useQRScanner'
import messages from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('react-native-vision-camera', () => ({
  Camera: {
    getCameraPermissionStatus: jest.fn(),
    requestCameraPermission: jest.fn()
  },
  useCameraDevice: jest.fn(() => ({ id: 'back', position: 'back' })),
  useCodeScanner: jest.fn((config) => config)
}))

jest.mock('vision-camera-zxing', () => ({
  decodeBase64: jest.fn()
}))

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(() => Promise.resolve('base64data')),
  deleteAsync: jest.fn(() => Promise.resolve()),
  EncodingType: { Base64: 'base64' }
}))

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn()
}))

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openSettings: jest.fn()
}))

jest.spyOn(Alert, 'alert')

describe('useQRScanner', () => {
  let onScanned, onError
  const originalPlatform = Platform.OS

  beforeEach(() => {
    onScanned = jest.fn()
    onError = jest.fn()
    jest.clearAllMocks()
    Camera.getCameraPermissionStatus.mockReturnValue('granted')
  })

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', {
      value: originalPlatform
    })
  })

  it('should request and grant camera permission', async () => {
    Camera.getCameraPermissionStatus.mockReturnValue('granted')
    Camera.requestCameraPermission.mockResolvedValue('granted')

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
    Camera.getCameraPermissionStatus.mockReturnValue('denied')
    Camera.requestCameraPermission.mockResolvedValue('denied')

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

  it('should still request permission when current status is denied', async () => {
    Camera.getCameraPermissionStatus.mockReturnValue('denied')
    Camera.requestCameraPermission.mockResolvedValue('granted')

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    await act(async () => {
      const permission = await result.current.requestPermission()
      expect(permission).toBe(true)
    })

    expect(Camera.requestCameraPermission).toHaveBeenCalledTimes(1)
    expect(Alert.alert).not.toHaveBeenCalled()
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

    decodeBase64.mockResolvedValue([
      { barcodeText: 'image-scanned-data', barcodeFormat: 'QR_CODE' }
    ])

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    await act(async () => {
      await result.current.pickImageForScan()
    })

    expect(decodeBase64).toHaveBeenCalledWith('base64data')
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

    decodeBase64.mockResolvedValue([])

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

  it('should use native code scanner on ios and forward scanned qr values', () => {
    Object.defineProperty(Platform, 'OS', {
      value: 'ios'
    })

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    expect(useCodeScanner).toHaveBeenCalledWith(
      expect.objectContaining({
        codeTypes: expect.arrayContaining(['qr'])
      })
    )
    expect(result.current.codeScanner).toEqual(
      expect.objectContaining({
        codeTypes: expect.arrayContaining(['qr']),
        onCodeScanned: expect.any(Function)
      })
    )

    act(() => {
      result.current.codeScanner.onCodeScanned([
        { type: 'qr', value: 'ios-native-scan' }
      ])
    })

    expect(onScanned).toHaveBeenCalledWith('ios-native-scan', 'qr')
  })

  it('should not expose a code scanner on android (uses snapshot polling instead)', () => {
    Object.defineProperty(Platform, 'OS', {
      value: 'android'
    })

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    expect(result.current.codeScanner).toBeUndefined()
    expect(result.current.cameraRef).toBeDefined()
    expect(result.current.cameraRef.current).toBeNull()
  })

  it('should poll the camera via takeSnapshot on android and decode QR codes', async () => {
    Object.defineProperty(Platform, 'OS', {
      value: 'android'
    })

    const takeSnapshot = jest
      .fn()
      .mockResolvedValue({ path: '/tmp/snap-1.jpg' })

    decodeBase64.mockResolvedValue([
      { barcodeText: 'android-poll-data', barcodeFormat: 'QR_CODE' }
    ])

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    // Attach a fake camera so the polling tick has something to call
    result.current.cameraRef.current = { takeSnapshot }

    await waitFor(() => {
      expect(onScanned).toHaveBeenCalledWith('android-poll-data', 'qr')
    })

    expect(takeSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({ quality: expect.any(Number) })
    )
    expect(decodeBase64).toHaveBeenCalledWith('base64data')
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      '/tmp/snap-1.jpg',
      expect.objectContaining({ idempotent: true })
    )
  })

  it('should stop polling on android when scanning is paused', async () => {
    Object.defineProperty(Platform, 'OS', {
      value: 'android'
    })

    const takeSnapshot = jest
      .fn()
      .mockResolvedValue({ path: '/tmp/snap-2.jpg' })
    decodeBase64.mockResolvedValue([])

    const { result } = renderHook(() => useQRScanner({ onScanned, onError }), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    result.current.cameraRef.current = { takeSnapshot }

    await waitFor(() => {
      expect(takeSnapshot).toHaveBeenCalled()
    })

    act(() => {
      result.current.pauseScanning()
    })

    const callsAfterPause = takeSnapshot.mock.calls.length
    await new Promise((resolve) => setTimeout(resolve, 700))
    expect(takeSnapshot.mock.calls.length).toBe(callsAfterPause)
  })
})
