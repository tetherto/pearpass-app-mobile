import { useCallback, useEffect, useState } from 'react'

import { useCountDown } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { generateQRCodeSVG } from '@tetherto/pear-apps-utils-qr'
import { useInvite } from '@tetherto/pearpass-lib-vault'

import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

const EXPIRE_SECONDS = 120

type ShareVaultState = {
  svg: string
  isExpired: boolean
}

export const useShareVault = () => {
  const { createInvite, deleteInvite, data } = useInvite()
  const { copyToClipboard } = useCopyToClipboard()

  const [state, setState] = useState<ShareVaultState>({
    svg: '',
    isExpired: false
  })

  const [secondsLeft, setSecondsLeft] = useState(EXPIRE_SECONDS)

  const formattedTime = useCountDown({
    initialSeconds: EXPIRE_SECONDS,
    onFinish: () => {
      setState((prev) => ({ ...prev, isExpired: true }))
    }
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    createInvite()

    return () => {
      deleteInvite()
    }
  }, [])

  useEffect(() => {
    if (data?.publicKey) {
      generateQRCodeSVG(data.publicKey, { type: 'svg', margin: 0 }).then(
        (svgString) => {
          setState((prev) => ({ ...prev, svg: svgString }))
        }
      )
    }
  }, [data])

  const handleCopy = useCallback(() => {
    if (data?.publicKey) {
      copyToClipboard(data.publicKey)
    }
  }, [data?.publicKey, copyToClipboard])

  const vaultLink = data?.publicKey ?? ''

  return {
    svg: state.svg,
    isExpired: state.isExpired,
    formattedTime,
    secondsLeft,
    vaultLink,
    handleCopy
  }
}
