import { useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  ContextMenu,
  NativeBottomSheet,
  NavbarListItem,
  rawTokens,
  Text,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { DoNotDisturb, MoreVert } from '@tetherto/pearpass-lib-ui-kit/icons'
import { getMyDeviceId, useVault } from '@tetherto/pearpass-lib-vault'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BottomSheetRevokeAccessContent } from '../../../containers/BottomSheetRevokeAccessContent'
import { Layout } from '../../../containers/Layout'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import {
  formatDeviceDate,
  getDeviceIcon
} from '../../../utils/devicePresentation'
import { logger } from '../../../utils/logger'

const RevokeActionMenu = ({ onRevoke }) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const close = useBottomSheetClose()
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={{ paddingBottom: bottom }}>
      <NavbarListItem
        platform="mobile"
        icon={
          <DoNotDisturb color={theme.colors.colorSurfaceDestructiveElevated} />
        }
        label={t`Revoke Access`}
        variant="destructive"
        onClick={() => {
          close()
          onRevoke()
        }}
      />
    </View>
  )
}

export const PairedDevicesScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { data, refetch: refetchVault } = useVault()

  useEffect(() => {
    refetchVault()
  }, [])

  const currentDeviceName = useMemo(
    () => `${Platform.OS} ${Platform.Version}`,
    []
  )

  const [myDeviceId, setMyDeviceId] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMyDeviceId()
      .then((id) => {
        if (!cancelled) setMyDeviceId(id ?? null)
      })
      .catch((error) => {
        logger.error('PairedDevicesScreen', 'getMyDeviceId failed:', error)
      })
    return () => {
      cancelled = true
    }
  }, [data?.devices])

  const isCurrentDevice = (device) => {
    if (!device) return false
    if (myDeviceId && device.id === myDeviceId) return true
    return device.name === currentDeviceName
  }

  const [revokeTarget, setRevokeTarget] = useState(null)

  const getDeviceDisplayName = (deviceName) => {
    if (!deviceName) return t`Unknown Device`
    const lowerName = deviceName.toLowerCase()
    if (lowerName.startsWith('ios')) return t`iPhone`
    if (lowerName.startsWith('android')) return t`Android`
    return deviceName
  }

  const devices = data?.devices ?? []
  const vaultId = data?.id

  return (
    <Layout
      scrollable
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={t`Paired Devices`}
          onBack={() => navigation.goBack()}
        />
      }
    >
      {devices.length > 0 && (
        <View
          style={[
            styles.deviceList,
            { borderColor: theme.colors.colorBorderPrimary }
          ]}
        >
          {devices.map((device, index) => {
            const isLast = index === devices.length - 1
            const DeviceIcon = getDeviceIcon(device?.name)
            const displayName = getDeviceDisplayName(device?.name)
            const isSelf = isCurrentDevice(device)

            return (
              <View
                key={device.id ?? `${device.name}-${index}`}
                style={[
                  styles.deviceItem,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.colorBorderPrimary
                  }
                ]}
              >
                <View
                  style={[
                    styles.deviceIconContainer,
                    {
                      backgroundColor:
                        theme.colors.colorSurfaceElevatedOnInteraction
                    }
                  ]}
                >
                  <DeviceIcon
                    color={theme.colors.colorAccentActive}
                    width={16}
                    height={16}
                  />
                </View>

                <View style={styles.deviceInfo}>
                  <Text variant="bodyEmphasized" numberOfLines={1}>
                    {displayName}
                  </Text>
                  <View style={styles.deviceDates}>
                    {device.createdAt && (
                      <Text
                        variant="caption"
                        color={theme.colors.colorTextSecondary}
                        numberOfLines={1}
                      >
                        {t`Paired on ${formatDeviceDate(device.createdAt)}`}
                      </Text>
                    )}
                  </View>
                </View>

                {!isSelf && device.id && (
                  <ContextMenu
                    trigger={
                      <Button
                        variant="tertiary"
                        size="small"
                        aria-label={t`Device actions`}
                        iconBefore={
                          <MoreVert color={theme.colors.colorTextPrimary} />
                        }
                      />
                    }
                  >
                    <RevokeActionMenu
                      onRevoke={() =>
                        setRevokeTarget({
                          deviceId: device.id,
                          deviceName: displayName
                        })
                      }
                    />
                  </ContextMenu>
                )}
              </View>
            )
          })}
        </View>
      )}

      <NativeBottomSheet
        open={revokeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null)
        }}
      >
        {revokeTarget && vaultId && (
          <BottomSheetRevokeAccessContent
            vaultId={vaultId}
            targetDeviceId={revokeTarget.deviceId}
            deviceName={revokeTarget.deviceName}
          />
        )}
      </NativeBottomSheet>
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing16
  },
  deviceList: {
    borderWidth: 1,
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rawTokens.spacing12,
    gap: rawTokens.spacing12
  },
  deviceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: rawTokens.radius8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deviceInfo: {
    flex: 1,
    gap: 2,
    overflow: 'hidden'
  },
  deviceDates: {
    gap: 2
  }
})
