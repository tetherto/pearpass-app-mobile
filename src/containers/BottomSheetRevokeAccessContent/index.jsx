import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  Button,
  Text,
  rawTokens,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { kickDevice } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../constants/toast'
import { logger } from '../../utils/logger'
import { SheetHeader } from '../BottomSheet/SheetHeader'

export const BottomSheetRevokeAccessContent = ({
  vaultId,
  targetDeviceId,
  deviceName
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const close = useBottomSheetClose()
  const { bottom } = useSafeAreaInsets()
  const [isLoading, setIsLoading] = useState(false)

  const onRevoke = async () => {
    if (isLoading) return
    setIsLoading(true)
    let failures = []
    try {
      ;({ failures } = await kickDevice({ vaultId, targetDeviceId }))
    } catch (error) {
      logger.error(
        'BottomSheetRevokeAccessContent',
        'kickDevice failed:',
        error
      )
      Toast.show({
        type: 'baseToast',
        text1: t`Couldn't revoke access. Please try again.`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
      setIsLoading(false)
      return
    }

    close()
    Toast.show({
      type: 'baseToast',
      text1: failures?.length
        ? t`Couldn't reach the device. It will lose access next time it comes online.`
        : t`"${deviceName}" no longer has access to this vault`,
      position: 'bottom',
      bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
    })
  }

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <SheetHeader
        title={t`Revoke access for ${deviceName}?`}
        onClose={close}
      />

      <View style={styles.content}>
        <View style={styles.body}>
          <View>
            <Text variant="label" color={theme.colors.colorTextSecondary}>
              {t`This will disconnect the device from future syncing.`}
            </Text>
            <Text variant="label" color={theme.colors.colorTextSecondary}>
              {t`Before you proceed, please note:`}
            </Text>
          </View>

          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <Text variant="label" style={styles.bulletGlyph}>
                {'•'}
              </Text>
              <Text variant="label" style={styles.bulletText}>
                {t`For Your Security: We recommend moving your items to a new vault and updating your passwords. This is especially important if the device was lost or stolen, as it ensures your data remains protected even if a local copy exists on the revoked device.`}
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text variant="label" style={styles.bulletGlyph}>
                {'•'}
              </Text>
              <Text variant="label" style={styles.bulletText}>
                {t`Offline Data: Revoking access prevents future syncing, but it cannot remotely delete data that was already exported.`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            variant="destructive"
            size="medium"
            fullWidth
            isLoading={isLoading}
            onClick={onRevoke}
            testID="revoke-access-submit"
          >
            {t`Revoke Access`}
          </Button>
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            disabled={isLoading}
            onClick={close}
            testID="revoke-access-cancel"
          >
            {t`Cancel`}
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  content: {
    paddingHorizontal: rawTokens.spacing16,
    paddingTop: rawTokens.spacing8,
    gap: rawTokens.spacing16
  },
  body: {
    gap: rawTokens.spacing12
  },
  bulletList: {
    gap: rawTokens.spacing12
  },
  bulletRow: {
    flexDirection: 'row',
    gap: rawTokens.spacing8
  },
  bulletGlyph: {
    width: rawTokens.spacing12
  },
  bulletText: {
    flex: 1
  },
  actions: {
    gap: rawTokens.spacing16
  }
})
