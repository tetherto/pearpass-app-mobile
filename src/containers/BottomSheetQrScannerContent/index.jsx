import { useEffect } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { CameraView } from 'expo-camera'

import {
  CameraSpot,
  Container,
  GrantPermissionContainer,
  GrantPermissionText,
  Title
} from './styles'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { useQRScanner } from '../../hooks/useQRScanner'
import { ButtonPrimary, ButtonSecondary } from '../../libComponents'

export const BottomSheetQrScannerContent = ({ onScanned }) => {
  const { t } = useLingui()
  const { setShouldBypassAutoLock } = useAutoLockContext()

  const {
    hasPermission,
    isScanning,
    cameraRef,
    pauseScanning,
    pickImageForScan,
    handleBarCodeScanned,
    requestPermission
  } = useQRScanner({
    onScanned: (data) => {
      pauseScanning()

      onScanned(data)
    },
    scanDelay: 1500
  })

  const handleRequestPermission = async () => {
    setShouldBypassAutoLock(true)
    try {
      await requestPermission()
    } finally {
      setShouldBypassAutoLock(false)
    }
  }

  useEffect(() => {
    handleRequestPermission()
  }, [])

  return (
    <BottomSheetScrollView
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        flex: 1
      }}
      contentContainerStyle={{ flex: 1 }}
    >
      <Container>
        {!hasPermission ? (
          <GrantPermissionContainer>
            <GrantPermissionText>{t`We need your permission to show the camera`}</GrantPermissionText>
            <ButtonPrimary
              stretch
              onPress={handleRequestPermission}
            >{t`Grant Permission`}</ButtonPrimary>
          </GrantPermissionContainer>
        ) : (
          <>
            <Title>{t`Join Vault from QR code`}</Title>
            <CameraView
              ref={cameraRef}
              onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
              zoom={0}
              style={{
                flex: 1,
                borderRadius: 10,
                aspectRatio: 1,
                alignSelf: 'center'
              }}
              barcodeScannerSettings={{
                barcodeTypes: ['qr']
              }}
            >
              <CameraSpot />
            </CameraView>
            <ButtonSecondary
              onPress={async () => {
                setShouldBypassAutoLock(true)
                try {
                  await pickImageForScan()
                } finally {
                  setShouldBypassAutoLock(false)
                }
              }}
              stretch
            >
              {t`Choose Image`}
            </ButtonSecondary>
          </>
        )}
      </Container>
    </BottomSheetScrollView>
  )
}
