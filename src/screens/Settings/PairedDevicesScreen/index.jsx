import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { rawTokens, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Devices,
  LaptopMac,
  LaptopWindows,
  PhoneIphone,
  Tablet
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'

import { Layout } from '../../../containers/Layout'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { unsupportedFeaturesEnabled } from '../../../utils/unsupportedFeatures'

const formatDeviceDate = (dateInput) => {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}

const getDeviceIcon = (deviceName) => {
  if (!deviceName) return Devices
  const lowerName = deviceName.toLowerCase()
  if (lowerName.startsWith('ios') || lowerName.includes('iphone'))
    return PhoneIphone
  if (lowerName.startsWith('android')) return PhoneIphone
  if (lowerName.includes('ipad') || lowerName.includes('tablet')) return Tablet
  if (
    lowerName.includes('mac') ||
    lowerName.includes('imac') ||
    lowerName.includes('macbook')
  )
    return LaptopMac
  if (lowerName.includes('windows')) return LaptopWindows
  return Devices
}

export const PairedDevicesScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { data, refetch: refetchVault } = useVault()
  const showUnsupported = unsupportedFeaturesEnabled()

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

            return (
              <View
                key={device.name + index}
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
                    {showUnsupported && (
                      <Text
                        variant="caption"
                        color={theme.colors.colorTextSecondary}
                        numberOfLines={1}
                      >
                        {t`Last used on ${formatDeviceDate(device.createdAt)}`}
                      </Text>
                    )}
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
