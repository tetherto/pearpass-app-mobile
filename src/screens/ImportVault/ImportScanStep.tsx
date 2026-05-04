import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  useTheme,
  rawTokens,
  Text,
  Button,
  InputField
} from '@tetherto/pearpass-lib-ui-kit'
import { ContentPaste } from '@tetherto/pearpass-lib-ui-kit/icons'
import * as Clipboard from 'expo-clipboard'
import {
  Dimensions,
  StyleSheet,
  Text as RNText,
  View
} from 'react-native'
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { Camera } from 'react-native-vision-camera'

import { useQRScanner } from '../../hooks/useQRScanner'

const SCREEN_WIDTH = Dimensions.get('window').width
const LOADING_ACCENT = '#BDC3AC'
const SPINNER_SIZE = 20
const SPINNER_STROKE = 2

type ImportScanStepProps = {
  isLoading: boolean
  error: string
  inviteCode: string
  setInviteCode: (code: string) => void
  onCodeScanned: (data: string) => void
}

const LoadingArcSpinner = ({ color }: { color: string }) => {
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = 0
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false
    )
    return () => cancelAnimation(rotation)
  }, [rotation])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }))

  const radius = (SPINNER_SIZE - SPINNER_STROKE) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={SPINNER_SIZE} height={SPINNER_SIZE}>
        <Circle
          cx={SPINNER_SIZE / 2}
          cy={SPINNER_SIZE / 2}
          r={radius}
          stroke={color}
          strokeWidth={SPINNER_STROKE}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  )
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
    codeScanner,
    device,
    cameraRef,
    pauseScanning,
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

  const showPermissionPrompt =
    !isLoading && (hasPermission === false || hasPermission === null)

  return (
    <View style={styles.content}>
      <Text variant="caption" color={theme.colors.colorTextSecondary}>
        {t`Scan QR code`}
      </Text>

      {showPermissionPrompt ? (
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
      ) : isLoading ? (
        <View
          style={[
            styles.cameraWrapper,
            styles.loadingWrapper,
            {
              borderColor: theme.colors.colorBorderPrimary,
              backgroundColor: theme.colors.colorSurfacePrimary
            }
          ]}
          testID="import-vault-loading-panel"
        >
          <LoadingArcSpinner color={LOADING_ACCENT} />
          <RNText style={[styles.loadingText, { color: LOADING_ACCENT }]}>
            {t`Importing Vault...`}
          </RNText>
        </View>
      ) : (
        <View
          style={[
            styles.cameraWrapper,
            { borderColor: theme.colors.colorBorderPrimary }
          ]}
        >
          <View style={styles.cameraInner}>
            {device ? (
              <Camera
                ref={cameraRef}
                device={device}
                isActive
                style={styles.camera}
                codeScanner={codeScanner}
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
              </Camera>
            ) : null}
          </View>
        </View>
      )}

      <InputField
        label={t`Vault Link`}
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
              <ContentPaste
                width={24}
                height={24}
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
  },
  loadingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: rawTokens.spacing12
  },
  loadingText: {
    fontFamily: 'Inter',
    fontSize: rawTokens.fontSize14,
    fontWeight: '400'
  }
})
