import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { CameraView } from 'expo-camera'
import * as Clipboard from 'expo-clipboard'
import {
  PasteFromClipboardIcon,
  QrCodeIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { usePair, useVault } from 'pearpass-lib-vault'
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'
import { useQRScanner } from '../../hooks/useQRScanner'
import { ButtonPrimary, ButtonSecondary } from '../../libComponents'

export const PairAnotherDeviceContent = ({
  tabs,
  showScanner,
  setShowScanner
}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { collapse } = useBottomSheet()

  const { hapticButtonSecondary } = useHapticFeedback()
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const { refetch: refetchVault, addDevice } = useVault()
  const { pairActiveVault, cancelPairActiveVault, isLoading } = usePair()

  const {
    hasPermission,
    isScanning,
    cameraRef,
    pauseScanning,
    handleBarCodeScanned,
    requestPermission
  } = useQRScanner({
    onScanned: (data) => {
      pauseScanning()
      setInviteCode(data)
      setShowScanner(false)
    },
    scanDelay: 1500
  })

  const handleQRPress = async () => {
    hapticButtonSecondary()
    if (!hasPermission) {
      await requestPermission()
    }
    setShowScanner(true)
  }

  const handlePaste = async () => {
    hapticButtonSecondary()
    const text = await Clipboard.getStringAsync()
    if (text) {
      setInviteCode(text)
    }
  }

  const pairWithCode = async (code) => {
    try {
      setError('')
      const vaultId = await pairActiveVault(code)
      const vault = await refetchVault(vaultId)
      await addDevice(Platform.OS + ' ' + Platform.Version)
      if (vault) {
        collapse()
        navigation.replace('MainTabNavigator')
      }
    } catch {
      setError(t`Something went wrong, please check invite code`)
    }
  }

  if (showScanner) {
    return (
      <>
        <View style={styles.contentWrapper}>
          {tabs}
          <View style={styles.cameraContainer}>
            {!hasPermission ? (
              <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                  {t`We need your permission to show the camera`}
                </Text>
                <ButtonPrimary stretch onPress={requestPermission}>
                  {t`Grant Permission`}
                </ButtonPrimary>
              </View>
            ) : (
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
                <View style={styles.cameraSpot} />
              </CameraView>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color={colors.primary400.mode1} />
              <ButtonSecondary stretch onPress={cancelPairActiveVault}>
                {t`Cancel Pairing`}
              </ButtonSecondary>
            </>
          ) : (
            <ButtonPrimary
              stretch
              onPress={() => pairWithCode(inviteCode)}
              disabled={!inviteCode.length}
            >
              {t`Continue`}
            </ButtonPrimary>
          )}
        </View>
      </>
    )
  }

  return (
    <>
      <View style={styles.contentWrapper}>
        {tabs}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>{t`Vault key`}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.inputText, inviteCode && styles.inputTextFilled]}
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder={t`Insert vault key...`}
              placeholderTextColor={colors.grey200.mode1}
              numberOfLines={1}
            />
            <TouchableOpacity onPress={handleQRPress} activeOpacity={0.7}>
              <QrCodeIcon size={24} color={colors.primary400.mode1} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.pasteButton}
          onPress={handlePaste}
          activeOpacity={0.7}
        >
          <PasteFromClipboardIcon size={16} color={colors.primary400.mode1} />
          <Text style={styles.pasteText}>{t`Paste`}</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.buttonContainer}>
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color={colors.primary400.mode1} />
            <ButtonSecondary stretch onPress={cancelPairActiveVault}>
              {t`Cancel Pairing`}
            </ButtonSecondary>
          </>
        ) : (
          <ButtonPrimary
            stretch
            onPress={() => pairWithCode(inviteCode)}
            disabled={!inviteCode.length}
          >
            {t`Continue`}
          </ButtonPrimary>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    backgroundColor: colors.grey400.mode1,
    borderWidth: 1,
    borderColor: colors.grey100.mode1,
    borderRadius: 10,
    padding: 12
  },
  inputWrapper: {
    backgroundColor: colors.grey500.mode1,
    borderRadius: 10,
    padding: 12
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: colors.grey200.mode1,
    marginBottom: 4
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: colors.grey200.mode1,
    flex: 1,
    marginRight: 10
  },
  inputTextFilled: {
    color: colors.white.mode1
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey500.mode1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 12,
    gap: 6
  },
  pasteText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: colors.primary400.mode1
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 8
  },
  cameraContainer: {
    backgroundColor: colors.grey400.mode1,
    borderRadius: 10,
    overflow: 'hidden',
    aspectRatio: 1,
    width: '100%',
    marginBottom: 16
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraSpot: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: colors.primary400.mode1,
    borderRadius: 10
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16
  },
  permissionText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: colors.white.mode1,
    textAlign: 'center'
  },
  buttonContainer: {
    gap: 10,
    marginTop: 16
  }
})
