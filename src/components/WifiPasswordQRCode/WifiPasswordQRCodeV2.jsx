import { useLingui } from '@lingui/react/macro'
import { Text, rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'
import { SvgXml } from 'react-native-svg'

import { useWifiPasswordQRCode } from '../../hooks/useWifiPasswordQRCode'

/**
 * @param {{
 *   ssid: string
 *   password: string
 *   encryptionType?: string
 *   isHidden?: boolean
 * }} props
 */
export const WifiPasswordQRCodeV2 = ({
  ssid,
  password,
  encryptionType = 'WPA',
  isHidden = false
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const qrCodeSvg = useWifiPasswordQRCode({
    ssid,
    password,
    encryptionType,
    isHidden
  })

  if (!ssid || !password || !qrCodeSvg) {
    return null
  }

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.colorBorderPrimary,
          backgroundColor: theme.colors.colorSurfacePrimary
        }
      ]}
    >
      <Text variant="label" color={theme.colors.colorTextSecondary}>
        {t`Scan QR Code to connect with the Wi-Fi`}
      </Text>
      <View
        style={[
          styles.qrWrapper,
          { backgroundColor: theme.colors.colorSurfaceHover }
        ]}
      >
        <SvgXml xml={qrCodeSvg} width={188} height={188} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing20,
    paddingVertical: rawTokens.spacing24,
    alignItems: 'center',
    gap: rawTokens.spacing20
  },
  qrWrapper: {
    padding: rawTokens.spacing12,
    borderRadius: rawTokens.spacing8,
    overflow: 'hidden'
  }
})
