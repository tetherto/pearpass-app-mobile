import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { Button, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { QrCode } from '@tetherto/pearpass-lib-ui-kit/icons'

import { BottomSheetQrScannerSheet } from '../../containers/BottomSheetQrScannerContent/Sheet'

type Props = {
  onScanned: (secret: string) => void
}

export const OtpSecretScanButton = ({ onScanned }: Props) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <BottomSheetQrScannerSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          size="small"
          variant="tertiary"
          aria-label={t`Scan QR code`}
          iconBefore={<QrCode color={theme.colors.colorTextPrimary} />}
        />
      }
      onScanned={(data: string) => {
        const secret = data.startsWith('otpauth://')
          ? new URL(data).searchParams.get('secret') ?? data
          : data
        onScanned(secret)
        setIsOpen(false)
      }}
    />
  )
}
