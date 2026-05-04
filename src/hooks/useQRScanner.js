import { useCallback, useEffect, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { Alert, Linking, Platform } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import {
  Camera,
  useCodeScanner,
  useCameraDevice,
  useFrameProcessor
} from 'react-native-vision-camera'
import { Worklets } from 'react-native-worklets-core'
import { zxing, decodeBase64 } from 'vision-camera-zxing'

import { logger } from '../utils/logger'

export const useQRScanner = ({
  onScanned,
  onError,
  scanDelay = 2000,
  supportedTypes = [
    'qr',
    'aztec',
    'code128',
    'code39',
    'code93',
    'datamatrix',
    'ean13',
    'ean8',
    'pdf417',
    'upc_e'
  ],
  enableGallery = true
}) => {
  const [hasPermission, setHasPermission] = useState(null)
  const [isScanning, setIsScanning] = useState(true)

  const { t } = useLingui()

  const cameraRef = useRef(null)
  const lastScanTimeRef = useRef(0)
  const isScanningShared = useSharedValue(true)

  const device = useCameraDevice('back')

  const mapSupportedTypeToCodeScannerType = useCallback((type) => {
    const formatMap = {
      qr: 'qr',
      aztec: 'aztec',
      code128: 'code-128',
      code39: 'code-39',
      code93: 'code-93',
      datamatrix: 'data-matrix',
      ean13: 'ean-13',
      ean8: 'ean-8',
      pdf417: 'pdf-417',
      upc_e: 'upc-e'
    }

    return formatMap[type]
  }, [])

  // Check current permission status on mount
  const checkCurrentPermissions = useCallback(() => {
    try {
      const status = Camera.getCameraPermissionStatus()
      const granted = status === 'granted'
      setHasPermission(granted)
      return { granted, status }
    } catch (error) {
      logger.error('Error checking camera permissions:', error)
      setHasPermission(false)
      return { granted: false, status: undefined }
    }
  }, [])

  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings()
    } catch (error) {
      logger.error('Error opening settings:', error)

      Alert.alert(
        t`Error`,
        t`Unable to open settings. Please open settings manually.`
      )
    }
  }, [t])

  const showPermissionAlert = useCallback(
    (type) => {
      Alert.alert(
        t`Permission Required`,
        t`You've previously denied ${type} access. Please enable it in your device settings to use this feature.`,
        [
          { text: t`Cancel`, style: 'cancel' },
          {
            text: t`Open Settings`,
            onPress: openSettings
          }
        ]
      )
    },
    [t, openSettings]
  )

  const requestPermission = useCallback(async () => {
    try {
      const { granted: alreadyGranted, status: permissionStatus } =
        checkCurrentPermissions()

      if (alreadyGranted) {
        return true
      }

      const result = await Camera.requestCameraPermission()
      const granted = result === 'granted'

      if (granted) {
        setHasPermission(true)
        return true
      }

      if (
        permissionStatus === 'denied' ||
        permissionStatus === 'restricted' ||
        result === 'denied' ||
        result === 'restricted'
      ) {
        showPermissionAlert(t`Camera`)
      }

      setHasPermission(false)
      return false
    } catch (error) {
      logger.error('Camera permission request failed:', error)

      if (onError) {
        onError(error)
      }

      setHasPermission(false)
      return false
    }
  }, [checkCurrentPermissions, showPermissionAlert, t, onError])

  const handleBarCodeScanned = useCallback(
    (scanResult) => {
      const { type, data } = scanResult

      if (
        isScanning &&
        supportedTypes.includes(type) &&
        Date.now() - lastScanTimeRef.current > scanDelay
      ) {
        lastScanTimeRef.current = Date.now()

        if (onScanned) {
          onScanned(data, type)
        }
      }
    },
    [isScanning, supportedTypes, scanDelay, onScanned]
  )

  const mapFormat = (zxingFormat) => {
    const formatMap = {
      QR_CODE: 'qr',
      AZTEC: 'aztec',
      CODE_128: 'code128',
      CODE_39: 'code39',
      CODE_93: 'code93',
      DATA_MATRIX: 'datamatrix',
      EAN_13: 'ean13',
      EAN_8: 'ean8',
      PDF_417: 'pdf417',
      UPC_E: 'upc_e'
    }
    return formatMap[zxingFormat] || zxingFormat.toLowerCase()
  }

  const onCodeScannedJS = Worklets.createRunOnJS((results) => {
    if (results.length > 0) {
      const { barcodeText, barcodeFormat } = results[0]
      handleBarCodeScanned({
        type: mapFormat(barcodeFormat),
        data: barcodeText
      })
    }
  })

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet'
      if (!isScanningShared.value) return
      const results = zxing(frame)
      if (results && results.length > 0) {
        onCodeScannedJS(results)
      }
    },
    [onCodeScannedJS, isScanningShared]
  )

  const codeScanner = useCodeScanner({
    codeTypes: supportedTypes
      .map(mapSupportedTypeToCodeScannerType)
      .filter(Boolean),
    onCodeScanned: (codes) => {
      if (!codes.length) return

      const { type, value } = codes[0]

      if (!value) return

      handleBarCodeScanned({
        type,
        data: value
      })
    }
  })

  const activeCodeScanner = Platform.OS === 'ios' ? codeScanner : undefined
  const activeFrameProcessor =
    Platform.OS === 'android' ? frameProcessor : undefined

  const pauseScanning = useCallback(() => {
    setIsScanning(false)
    isScanningShared.value = false
  }, [isScanningShared])

  const resumeScanning = useCallback(() => {
    setIsScanning(true)
    isScanningShared.value = true
  }, [isScanningShared])

  const scanBarcodeFromImage = useCallback(
    async (imageUri) => {
      try {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64
        })

        const results = await decodeBase64(base64)

        if (results && results.length > 0) {
          const { barcodeText, barcodeFormat } = results[0]

          if (onScanned) {
            onScanned(barcodeText, mapFormat(barcodeFormat))
          }
        } else {
          Alert.alert(t`Error`, t`No QR code found in the image`, [
            { text: t`OK` }
          ])
        }
      } catch (scanError) {
        if (onError) {
          onError(scanError)
        }

        Alert.alert(t`Error`)
      }
    },
    [onScanned, onError, t]
  )

  const pickImageForScan = useCallback(async () => {
    if (!enableGallery) return

    try {
      if (Platform.OS !== 'ios') {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permissionResult.granted) {
          if (onError) {
            onError()
          }

          if (!permissionResult.canAskAgain) {
            showPermissionAlert(t`Media Library`)
          }

          return
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: false
      })

      if (!result?.canceled && result?.assets?.length) {
        scanBarcodeFromImage(result.assets[0].uri)
      }
    } catch (error) {
      if (onError) {
        onError(error)
      }
    }
  }, [enableGallery, onError, showPermissionAlert, t, scanBarcodeFromImage])

  // Check permissions on mount
  useEffect(() => {
    checkCurrentPermissions()
  }, [checkCurrentPermissions])

  return {
    hasPermission,
    isScanning,
    cameraRef,
    device,
    codeScanner: activeCodeScanner,
    frameProcessor: activeFrameProcessor,
    pauseScanning,
    resumeScanning,
    pickImageForScan,
    requestPermission,
    handleBarCodeScanned,
    checkCurrentPermissions
  }
}
