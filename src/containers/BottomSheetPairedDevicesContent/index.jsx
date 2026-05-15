import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  ContextMenu,
  Text,
  rawTokens,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { formatDeviceDate, getDeviceIcon } from '../../utils/devicePresentation'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { Layout } from '../Layout'

const PairedDevicesSheetBody = () => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
  const { bottom } = useSafeAreaInsets()
  const { data, refetch: refetchVault } = useVault()

  useEffect(() => {
    refetchVault()
  }, [])

  const getDeviceDisplayName = (deviceName) => {
    if (!deviceName) return t`Unknown Device`
    const lowerName = deviceName.toLowerCase()
    if (lowerName.startsWith('ios')) return t`iPhone`
    if (lowerName.startsWith('android')) return t`Android`
    return deviceName
  }

  const devices = data?.devices ?? []

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={[styles.content, { paddingBottom: bottom }]}
      header={<SheetHeader title={t`Paired Devices`} onClose={collapse} />}
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
                    {getDeviceDisplayName(device?.name)}
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
              </View>
            )
          })}
        </View>
      )}
    </Layout>
  )
}

export const BottomSheetPairedDevicesContent = ({ open, onOpenChange }) => (
  <ContextMenu open={open} onOpenChange={onOpenChange}>
    <PairedDevicesSheetBody />
  </ContextMenu>
)

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    paddingTop: rawTokens.spacing16,
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
