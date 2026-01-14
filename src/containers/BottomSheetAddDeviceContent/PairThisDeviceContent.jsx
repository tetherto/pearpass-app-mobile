import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useCountDown } from 'pear-apps-lib-ui-react-hooks'
import { generateQRCodeSVG } from 'pear-apps-utils-qr'
import { CopyIcon, TimeIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useInvite } from 'pearpass-lib-vault'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'

import { useAutoLockContext } from '../../context/AutoLockContext'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

export const PairThisDeviceContent = ({ tabs }) => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const { createInvite, deleteInvite, data } = useInvite()
  const { setShouldBypassAutoLock } = useAutoLockContext()

  const [svg, setSvg] = useState('')

  const expireTime = useCountDown({
    initialSeconds: 120,
    onFinish: () => {
      setTimeout(() => collapse(), 0)
    }
  })

  useEffect(() => {
    const setup = async () => {
      setShouldBypassAutoLock(true)
      await createInvite()
    }

    setup()

    return () => {
      const cleanup = async () => {
        setShouldBypassAutoLock(false)
        await deleteInvite()
      }

      cleanup()
    }
  }, [])

  useEffect(() => {
    if (data?.publicKey) {
      generateQRCodeSVG(data?.publicKey, { type: 'svg', margin: 0 }).then(
        (svgString) => {
          setSvg(svgString)
        }
      )
    }
  }, [data])

  return (
    <View style={styles.contentWrapper}>
      {tabs}
      <Text
        style={styles.qrCodeTitle}
      >{t`Scan this QR code while in the PearPass App`}</Text>
      <View style={styles.qrCodeContainer}>
        {svg.length > 0 && (
          <SvgXml testID="qr-code" xml={svg} width="100%" height="100%" />
        )}
      </View>
      <View style={styles.expireContainer}>
        <Text style={styles.expireText}>
          {t`Expires in`} {expireTime}
        </Text>
        <TimeIcon size={14} color={colors.primary400.mode1} />
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => copyToClipboard(data?.publicKey)}
      >
        <View style={styles.copyAccountContainer}>
          <View style={styles.copyAccountHeader}>
            <CopyIcon size={14} color={colors.primary400.mode1} />
            <Text style={styles.copyAccountTitle}>{t`Copy vault key`}</Text>
          </View>
          <Text
            testID="copy-address"
            style={[styles.copyAddress, isCopied && styles.copyAddressCopied]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {isCopied ? t`Copied!` : data?.publicKey}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
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
  qrCodeContainer: {
    backgroundColor: colors.white.mode1,
    padding: 12,
    width: 226,
    height: 226,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  qrCodeTitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 10
  },
  expireContainer: {
    backgroundColor: colors.grey500.mode1,
    borderRadius: 10,
    marginTop: 12,
    height: 32,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  expireText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#fff',
    textAlign: 'center'
  },
  copyAccountContainer: {
    backgroundColor: colors.grey500.mode1,
    borderRadius: 10,
    marginTop: 12,
    padding: 10
  },
  copyAccountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  copyAccountTitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: colors.primary400.mode1,
    marginLeft: 8
  },
  copyAddress: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: colors.grey200.mode1
  },
  copyAddressCopied: {
    textAlign: 'center'
  }
})
