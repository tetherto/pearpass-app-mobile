import { useEffect, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { Keyboard, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { CardSingleSetting } from 'src/components/CardSingleSetting'
import { ListItem } from 'src/components/ListItem'
import { TOAST_CONFIG } from 'src/constants/toast'
import { BottomSheetBiometricsLoginPrompt } from 'src/containers/BottomSheetBiometricsLoginPrompt'
import { ModifyMasterVaultModalContent } from 'src/containers/Modal/ModifyMasterVaultModalContent'
import { useBottomSheet } from 'src/context/BottomSheetContext'
import { useModal } from 'src/context/ModalContext'
import { useBiometricsAuthentication } from 'src/hooks/useBiometricsAuthentication'
import { logger } from 'src/utils/logger'

export const MasterPasswordSection = () => {
  const { t } = useLingui()

  const { enableBiometrics, isBiometricsEnabled, disableBiometrics } =
    useBiometricsAuthentication()

  const timeoutRef = useRef(null)

  const { openModal } = useModal()
  const { expand, collapse } = useBottomSheet()

  const handleMasterEditClick = () => {
    openModal(
      <ModifyMasterVaultModalContent
        onPasswordChange={handleShowBiometricsLoginPrompt}
      />
    )
  }

  const handleShowBiometricsLoginPrompt = async () => {
    Keyboard.dismiss()

    if (isBiometricsEnabled) {
      await disableBiometrics()
    } else {
      return
    }

    timeoutRef.current = setTimeout(() => {
      expand({
        children: (
          <BottomSheetBiometricsLoginPrompt
            title={t`Continue using Biometric Access`}
            description={t`Your password was updated, so biometric login was turned off. Enable it again to continue signing in with your biometrics.`}
            onConfirm={() => enableBiometricAuthentication()}
            onDismiss={collapse}
          />
        ),
        snapPoints: ['10%', '80%'],
        enableContentPanningGesture: false
      })
    }, TOAST_CONFIG.TIMEOUT_DELAY)
  }

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current)
    },
    []
  )

  const enableBiometricAuthentication = async () => {
    try {
      const { error } = await enableBiometrics()

      if (error) {
        logger.error('Failed to enable biometric authentication:', error)
        Toast.show({
          type: 'baseToast',
          text1: t`Failed to enable biometric authentication.`,
          position: 'bottom',
          bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
        })
      }
    } catch (error) {
      logger.error('Error while enabling biometric authentication:', error)
    }
  }

  return (
    <CardSingleSetting title={t`Passwords`}>
      <View style={styles.manageVaultsContainer}>
        <ListItem name={t`Master Vault`} onEditClick={handleMasterEditClick} />
      </View>
    </CardSingleSetting>
  )
}

const styles = StyleSheet.create({
  manageVaultsContainer: {
    gap: 15
  }
})
