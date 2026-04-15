import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  PageHeader,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Devices,
  LaptopMac,
  LaptopWindows,
  MoreVert,
  PhoneIphone,
  Swap,
  Sync,
  Tablet
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { Pressable, StyleSheet, View } from 'react-native'
import { Layout } from 'src/containers/Layout'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { unsupportedFeaturesEnabled } from 'src/utils/unsupportedFeatures'

const formatDeviceDate = (dateInput) => {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}

const getDeviceDisplayName = (deviceName) => {
  const { t } = useLingui()
  if (!deviceName) return t`Unknown Device`
  const lowerName = deviceName.toLowerCase()
  if (lowerName.startsWith('ios')) return t`iPhone`
  if (lowerName.startsWith('android')) return t`Android`
  return deviceName
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

export const MyDevices = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { data, refetch: refetchVault } = useVault()
  const showUnsupported = unsupportedFeaturesEnabled()

  useEffect(() => {
    refetchVault()
  }, [])

  const devices = data?.devices ?? []
  const styles = getStyles(theme)

  return (
    <Layout
      scrollable
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.content}
      hideFooter
    >
      <PageHeader
        title={t`Your Devices`}
        subtitle={t`Devices listed here stay in sync. Changes made on one device update across all your vaults on every synced device.`}
      />

      {devices.length > 0 && (
        <View style={styles.section}>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Synced Personal Devices`}
          </Text>
          <View style={styles.deviceList}>
            {devices.map((device, index) => {
              const isLast = index === devices.length - 1
              const DeviceIcon = getDeviceIcon(device?.name)

              return (
                <View
                  key={device.name + index}
                  style={[
                    styles.deviceItem,
                    !isLast && styles.deviceItemBorder
                  ]}
                >
                  <View style={styles.deviceIconContainer}>
                    <DeviceIcon
                      color={theme.colors.colorTextPrimary}
                      width={16}
                      height={16}
                    />
                  </View>

                  <View style={styles.deviceInfo}>
                    <Text variant="bodyEmphasized" style={{ lineClamp: 1 }}>
                      {getDeviceDisplayName(device?.name)}
                    </Text>
                    <View style={styles.deviceDates}>
                      {showUnsupported && (
                        <Text
                          variant="caption"
                          color={theme.colors.colorTextSecondary}
                          style={{ lineClamp: 1 }}
                        >
                          {t`Last used on ${formatDeviceDate(device.createdAt)}`}
                        </Text>
                      )}
                      {device.createdAt && (
                        <Text
                          variant="caption"
                          color={theme.colors.colorTextSecondary}
                          style={{ lineClamp: 1 }}
                        >
                          {t`Paired on ${formatDeviceDate(device.createdAt)}`}
                        </Text>
                      )}
                    </View>
                  </View>

                  {showUnsupported && (
                    <View style={styles.deviceActions}>
                      <View style={styles.syncIndicator}>
                        <Sync
                          color={theme.colors.colorPrimary}
                          width={12}
                          height={12}
                        />
                        <Text
                          variant="caption"
                          color={theme.colors.colorPrimary}
                        >
                          {t`Sync Activated`}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.verticalDivider,
                          {
                            backgroundColor: theme.colors.colorBorderPrimary
                          }
                        ]}
                      />
                      <Pressable style={styles.moreButton}>
                        <MoreVert
                          color={theme.colors.colorTextPrimary}
                          width={20}
                          height={20}
                        />
                      </Pressable>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      )}

      {showUnsupported && (
        <View style={styles.section}>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Browser Extensions`}
          </Text>
          <View style={styles.extensionContainer}>
            <Pressable style={styles.extensionCta}>
              <Swap color={theme.colors.colorPrimary} width={14} height={14} />
              <Text variant="caption" color={theme.colors.colorPrimary}>
                {t`Generate Pair Code for Browser Extension`}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </Layout>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    content: {
      padding: rawTokens.spacing16,
      paddingTop: rawTokens.spacing24,
      gap: rawTokens.spacing24,
      flexGrow: 1
    },
    section: {
      gap: rawTokens.spacing12
    },
    deviceList: {
      borderWidth: 1,
      borderColor: theme.colors.colorBorderPrimary,
      borderRadius: 8
    },
    deviceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: rawTokens.spacing12,
      gap: rawTokens.spacing12
    },
    deviceItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.colorBorderPrimary
    },
    deviceIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.colorSurfaceElevatedOnInteraction,
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
    },
    deviceActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rawTokens.spacing8,
      flexShrink: 0
    },
    syncIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    },
    verticalDivider: {
      width: 1,
      height: 24
    },
    moreButton: {
      padding: rawTokens.spacing8
    },
    extensionContainer: {
      borderWidth: 1,
      borderColor: theme.colors.colorBorderPrimary,
      borderRadius: 8
    },
    extensionCta: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: rawTokens.spacing12,
      gap: 4
    }
  })
