import { useCallback, useEffect, useRef, useState } from 'react'

import { generateQRCodeSVG } from '@tetherto/pear-apps-utils-qr'
import { useInvite } from '@tetherto/pearpass-lib-vault'
import { AppState } from 'react-native'

import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

const EXPIRE_SECONDS = 120

const formatTime = (seconds: number) => {
  const safe = Math.max(0, seconds)
  const minutes = Math.floor(safe / 60)
  const remaining = safe % 60
  return `${minutes}:${remaining.toString().padStart(2, '0')}`
}

export const useShareVault = () => {
  const { createInvite, deleteInvite, data } = useInvite()
  const { copyToClipboard } = useCopyToClipboard()

  const [svg, setSvg] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(EXPIRE_SECONDS)
  const startedAtRef = useRef<number>(Date.now())

  const tick = useCallback(() => {
    const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000)
    setSecondsLeft(Math.max(0, EXPIRE_SECONDS - elapsed))
  }, [])

  useEffect(() => {
    startedAtRef.current = Date.now()
    tick()
    const intervalId = setInterval(tick, 1000)
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        tick()
      }
    })
    return () => {
      clearInterval(intervalId)
      subscription.remove()
    }
  }, [tick])

  useEffect(() => {
    createInvite()

    return () => {
      deleteInvite()
    }
  }, [])

  useEffect(() => {
    if (data?.publicKey) {
      generateQRCodeSVG(data.publicKey, { type: 'svg', margin: 0 }).then(
        (svgString: string) => {
          setSvg(svgString)
        }
      )
    }
  }, [data?.publicKey])

  const handleCopy = useCallback(() => {
    if (data?.publicKey) {
      copyToClipboard(data.publicKey)
    }
  }, [data?.publicKey, copyToClipboard])

  const isExpired = secondsLeft <= 0
  const formattedTime = formatTime(secondsLeft)
  const vaultLink = data?.publicKey ?? ''

  return {
    svg,
    isExpired,
    formattedTime,
    secondsLeft,
    vaultLink,
    handleCopy
  }
}
