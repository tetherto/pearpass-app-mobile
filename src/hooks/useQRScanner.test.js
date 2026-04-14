import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, renderHook } from '@testing-library/react-native'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import { Camera } from 'react-native-vision-camera'
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
  useFrameProcessor: jest.fn(() => jest.fn()),
  VisionCameraProxy: { initFrameProcessorPlugin: jest.fn() }
}))

jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn((val) => ({ value: val }))
}))

jest.mock('react-native-worklets-core', () => ({
  Worklets: {
    createRunOnJS: jest.fn((fn) => fn)
  }
}))

jest.mock('vision-camera-zxing', () => ({
  zxing: jest.fn(),
  decodeBase64: jest.fn()
}))

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(() => Promise.resolve('base64data')),
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

  beforeEach(() => {
    onScanned = jest.fn()
    onError = jest.fn()
    jest.clearAllMocks()
    jest.useFakeTimers()
    Camera.getCameraPermissionStatus.mockReturnValue('granted')
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
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
})
