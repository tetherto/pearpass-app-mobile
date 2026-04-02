import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { generateQRCodeSVG } from '@tetherto/pear-apps-utils-qr'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { View, Text, StyleSheet } from 'react-native'
import { SvgXml } from 'react-native-svg'

import { logger } from '../../utils/logger'

/**
 * @param {{
 *   ssid: string
 *   password: string
 *   encryptionType?: string
 *   isHidden?: boolean
 * }} props
 */
export const WifiPasswordQRCode = ({
  ssid,
  password,
  encryptionType = 'WPA',
  isHidden = false
}) => {
  const { t } = useLingui()
  const [qrCodeSvg, setQrCodeSvg] = useState('')

  const generateWifiQRString = (
    ssid,
    password,
    encryptionType = 'WPA',
    isHidden = false
  ) => `WIFI:T:${encryptionType};S:${ssid};P:${password};H:${isHidden};;`

  useEffect(() => {
    if (ssid && password) {
      const wifiString = generateWifiQRString(
        ssid,
        password,
        encryptionType,
        isHidden
      )

      generateQRCodeSVG(wifiString, { type: 'svg', margin: 0 })
        .then((svgString) => {
          setQrCodeSvg(svgString)
        })
        .catch((error) => {
          logger.error('Error generating QR code:', error)
        })
    }
  }, [ssid, password, encryptionType, isHidden])

  if (!ssid || !password || !qrCodeSvg) {
    return null
  }

  return (
    <View style={styles.qrCodeContainer}>
      <Text style={styles.qrCodeTitle}>
        {t`Scan the QR-Code to connect to the Wi-Fi`}
      </Text>
      <View style={styles.qrCodeWrapper}>
        <SvgXml xml={qrCodeSvg} width={180} height={180} />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  qrCodeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.grey500.mode1,
    borderRadius: 10,
    flexDirection: 'column',
    marginHorizontal: 10,
    marginBottom: 10
  },
  qrCodeTitle: {
    marginBottom: 10,
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.white.mode1
  },
  qrCodeWrapper: {
    backgroundColor: colors.white.mode1,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden'
  }
})
