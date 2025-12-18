import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useCountDown } from 'pear-apps-lib-ui-react-hooks'
import { generateQRCodeSVG } from 'pear-apps-utils-qr'
import {
  CopyIcon,
  TimeIcon,
  UserSecurityIcon,
  XIcon,
  YellowErrorIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  authoriseCurrentProtectedVault,
  useInvite,
  useVault
} from 'pearpass-lib-vault'
import { TouchableOpacity } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { useAutoLockContext } from 'src/context/AutoLockContext'

import { useModal } from '../../../context/ModalContext'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { VaultPasswordFormModalContent } from '../VaultPasswordFormModalContent'
import {
  CautionContainer,
  CautionIcon,
  CautionText,
  CopyAccount,
  CopyAccountContainer,
  CopyAccountTitle,
  CopyAddress,
  ExpireContainer,
  ExpireText,
  ItemHeader,
  ItemHeaderClose,
  ItemHeaderLabel,
  ItemHeaderTitle,
  ModalView,
  QrCodeContainer,
  QrCodeTitle
} from './styles'

/**
 * @param {{
 *  onClose: () => void
 * }} props
 */
export const AddDeviceModalContent = ({ onClose }) => {
  const { t } = useLingui()
  const { closeModal } = useModal()
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const expireTime = useCountDown({
    initialSeconds: 120,
    onFinish: () => {
      setTimeout(() => closeModal(), 0)
    }
  })

  const {
    data: vaultData,
    isVaultProtected,
    refetch: refetchVault
  } = useVault()
  const { createInvite, deleteInvite, data } = useInvite()
  const { setShouldBypassAutoLock } = useAutoLockContext()

  const [svg, setSvg] = useState('')
  const [isProtected, setIsProtected] = useState(true)

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

  useEffect(() => {
    const checkProtection = async () => {
      const result = await isVaultProtected(vaultData?.id)
      setIsProtected(result)
    }
    checkProtection()
  }, [vaultData])

  useEffect(() => {
    refetchVault()
  }, [])

  if (isProtected) {
    return (
      <VaultPasswordFormModalContent
        onSubmit={async (password) => {
          if (await authoriseCurrentProtectedVault(password)) {
            setIsProtected(false)
          }
        }}
        vault={vaultData}
      />
    )
  }

  return (
    <ModalView>
      <ItemHeader>
        <ItemHeaderTitle>
          <UserSecurityIcon size={20} />
          <ItemHeaderLabel>{t`Add a device`}</ItemHeaderLabel>
        </ItemHeaderTitle>
        <ItemHeaderClose activeOpacity={0.5} onPress={onClose}>
          <XIcon size={21} color={colors.primary400.mode1} />
        </ItemHeaderClose>
      </ItemHeader>
      <QrCodeTitle>{t`This device's QR code`}</QrCodeTitle>
      <QrCodeContainer>
        {svg.length > 0 && (
          <SvgXml testID="qr-code" xml={svg} width="100%" height="100%" />
        )}
      </QrCodeContainer>
      <QrCodeTitle>{t`or copy account link`}</QrCodeTitle>
      <ExpireContainer>
        <ExpireText>
          {t`This link expires in`} {expireTime}
        </ExpireText>
        <TimeIcon size={14} color={colors.primary400.mode1} />
      </ExpireContainer>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => copyToClipboard(data?.publicKey)}
      >
        <CopyAccountContainer>
          <CopyAccount>
            <CopyAccountTitle>{t`Copy account link`}</CopyAccountTitle>
            <CopyIcon size={14} color={colors.primary400.mode1} />
          </CopyAccount>
          <CopyAddress testID="copy-address">
            {isCopied ? t`Copied!` : data?.publicKey}
          </CopyAddress>
        </CopyAccountContainer>
      </TouchableOpacity>
      <CautionContainer>
        <CautionIcon>
          <YellowErrorIcon size={14} />
        </CautionIcon>
        <CautionText>
          {t`Caution: You’re generating a secure invitation to sync another device with your vault. Treat this invite with the same confidentiality as your password.`}
        </CautionText>
      </CautionContainer>
    </ModalView>
  )
}
