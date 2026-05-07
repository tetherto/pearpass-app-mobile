import type { ReactNode } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  Button,
  ContextMenu,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Camera } from 'react-native-vision-camera'

import { withAutoLockBypass } from '../../HOCs'
import { useQRScanner } from '../../hooks/useQRScanner'
import { SheetHeader } from '../BottomSheet/SheetHeader'

const CAMERA_SIZE = Dimensions.get('window').width - rawTokens.spacing16 * 2

type BodyProps = {
  title: string
  onScanned: (data: string) => void
  onClose: () => void
}

const BottomSheetQrScannerBodyContent = ({
  title,
  onScanned,
  onClose
}: BodyProps) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  const {
    hasPermission,
    codeScanner,
    device,
    frameProcessor,
    pauseScanning,
    requestPermission
  } = useQRScanner({
    onScanned: (data: string) => {
      pauseScanning()
      onScanned(data)
      onClose()
    },
    onError: () => {},
    scanDelay: 1500
  })

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.colorSurfacePrimary }
      ]}
    >
      <SheetHeader title={title} onClose={onClose} />

      <View style={styles.body}>
        {hasPermission === false || hasPermission === null ? (
          <View style={styles.permissionContainer}>
            <Text
              variant="body"
              color={theme.colors.colorTextSecondary}
            >
              {t`Camera access is required to scan QR codes.`}
            </Text>
            <Button
              variant="primary"
              fullWidth
              onClick={requestPermission}
            >
              {t`Allow Access`}
            </Button>
          </View>
        ) : (
          <View
            style={[
              styles.cameraWrapper,
              { borderColor: theme.colors.colorBorderPrimary }
            ]}
          >
            {device ? (
              <Camera
                device={device}
                isActive
                style={styles.camera}
                codeScanner={codeScanner}
                frameProcessor={frameProcessor}
              >
                <View
                  style={[
                    styles.cameraSpot,
                    { borderColor: theme.colors.colorBorderPrimary }
                  ]}
                />
              </Camera>
            ) : null}
          </View>
        )}
      </View>
    </View>
  )
}

const BottomSheetQrScannerBody = withAutoLockBypass(
  BottomSheetQrScannerBodyContent
)

type Props = {
  onScanned: (data: string) => void
  title?: string
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const BottomSheetQrScannerContentV2 = withAutoLockBypass(
  ({ onScanned, title, trigger, open, onOpenChange }: Props) => {
    const { t } = useLingui()
    const sheetTitle = title ?? t`Scan Authenticator QR Code`

    return (
      <ContextMenu trigger={trigger} open={open} onOpenChange={onOpenChange}>
        <BottomSheetQrScannerBody
          title={sheetTitle}
          onScanned={onScanned}
          onClose={() => onOpenChange?.(false)}
        />
      </ContextMenu>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    paddingBottom: rawTokens.spacing24,
    minHeight: CAMERA_SIZE + 110
  },
  body: {
    paddingHorizontal: rawTokens.spacing16,
    paddingTop: rawTokens.spacing8,
    gap: rawTokens.spacing16
  },
  permissionContainer: {
    gap: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing16,
    alignItems: 'center'
  },
  cameraWrapper: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: rawTokens.radius16,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraSpot: {
    width: CAMERA_SIZE * 0.55,
    height: CAMERA_SIZE * 0.55,
    borderRadius: rawTokens.radius8,
    borderWidth: 2,
    backgroundColor: 'transparent'
  }
})
