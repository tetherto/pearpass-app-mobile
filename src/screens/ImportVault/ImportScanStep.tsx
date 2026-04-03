import { useLingui } from '@lingui/react/macro'
import {
  useTheme,
  rawTokens,
  Text,
  Button,
  InputField
} from '@tetherto/pearpass-lib-ui-kit'
import { Clipboard as ClipboardIcon } from '@tetherto/pearpass-lib-ui-kit/icons'
import { CameraView } from 'expo-camera'
import * as Clipboard from 'expo-clipboard'
import { Dimensions, StyleSheet, View } from 'react-native'

import { useQRScanner } from '../../hooks/useQRScanner'

const SCREEN_WIDTH = Dimensions.get('window').width

type ImportScanStepProps = {
  isLoading: boolean
  error: string
  inviteCode: string
  setInviteCode: (code: string) => void
  onCodeScanned: (data: string) => void
}

export const ImportScanStep = ({
  isLoading,
  error,
  inviteCode,
  setInviteCode,
  onCodeScanned
}: ImportScanStepProps) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  const {
    hasPermission,
    isScanning,
    cameraRef,
    pauseScanning,
    handleBarCodeScanned,
    requestPermission
  } = useQRScanner({
    onScanned: (data: string) => {
      pauseScanning()
      onCodeScanned(data)
    },
    onError: () => {},
    scanDelay: 1500
  })

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync()
    if (text) {
      setInviteCode(text)
    }
  }

  const spotSize = SCREEN_WIDTH * 0.35

  return (
    <View style={styles.content}>
      <Text variant="caption" color={theme.colors.colorTextSecondary}>
        {t`Scan QR code`}
      </Text>

      {hasPermission === false || hasPermission === null ? (
        <>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Camera access is required to scan codes.`}
          </Text>
          <View style={styles.permissionButton}>
            <Button
              variant="primary"
              size="medium"
              fullWidth
              onClick={requestPermission}
              data-testid="import-vault-allow-camera"
            >
              {t`Allow Access`}
            </Button>
          </View>
        </>
      ) : (
        <View
          style={[
            styles.cameraWrapper,
            { borderColor: theme.colors.colorBorderPrimary }
          ]}
        >
          <View style={styles.cameraInner}>
            <CameraView
              ref={cameraRef}
              onBarcodeScanned={
                isScanning && !isLoading ? handleBarCodeScanned : undefined
              }
              zoom={0}
              style={styles.camera}
              barcodeScannerSettings={{
                barcodeTypes: ['qr']
              }}
            >
              <View
                style={[
                  styles.cameraSpot,
                  {
                    width: spotSize,
                    height: spotSize,
                    borderColor: theme.colors.colorBorderPrimary
                  }
                ]}
              />
            </CameraView>
          </View>
        </View>
      )}

      <InputField
        label={t`Item / Vault Link`}
        value={inviteCode}
        onChangeText={setInviteCode}
        placeholderText={t`Enter Share Link`}
        data-testid="import-vault-code-input"
        rightSlot={
          <Button
            variant="tertiary"
            size="small"
            onClick={handlePaste}
            aria-label="Paste"
            data-testid="import-vault-paste-button"
            iconBefore={
              <ClipboardIcon
                width={12}
                height={15}
                color={theme.colors.colorTextSecondary}
              />
            }
          />
        }
      />

      {error ? (
        <Text
          variant="caption"
          color={theme.colors.colorSurfaceDestructiveElevated}
          data-testid="import-vault-scan-error"
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: rawTokens.spacing16
  },
  cameraWrapper: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing16,
    overflow: 'hidden',
    aspectRatio: 1,
    width: '100%'
  },
  cameraInner: {
    flex: 1,
    borderRadius: rawTokens.spacing12,
    overflow: 'hidden'
  },
  permissionButton: {
    marginTop: rawTokens.spacing12,
    marginBottom: rawTokens.spacing16
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraSpot: {
    borderWidth: 2,
    borderRadius: rawTokens.spacing8
  }
})
