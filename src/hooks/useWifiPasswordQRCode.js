import { useEffect, useState } from 'react'

import { generateQRCodeSVG } from '@tetherto/pear-apps-utils-qr'

import { logger } from '../utils/logger'

export const generateWifiQRString = (
  ssid,
  password,
  encryptionType = 'WPA',
  isHidden = false
) => `WIFI:T:${encryptionType};S:${ssid};P:${password};H:${isHidden};;`

export const useWifiPasswordQRCode = ({
  ssid,
  password,
  encryptionType = 'WPA',
  isHidden = false
}) => {
  const [qrCodeSvg, setQrCodeSvg] = useState('')

  useEffect(() => {
    let isMounted = true

    if (!ssid || !password) {
      setQrCodeSvg('')
      return () => {
        isMounted = false
      }
    }

    const wifiString = generateWifiQRString(
      ssid,
      password,
      encryptionType,
      isHidden
    )

    generateQRCodeSVG(wifiString, { type: 'svg', margin: 0 })
      .then((svgString) => {
        if (isMounted) {
          setQrCodeSvg(svgString)
        }
      })
      .catch((error) => {
        logger.error('Error generating QR code:', error)
      })

    return () => {
      isMounted = false
    }
  }, [ssid, password, encryptionType, isHidden])

  return qrCodeSvg
}
