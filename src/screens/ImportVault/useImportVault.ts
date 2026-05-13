import { useState, useCallback } from 'react'

import { useLingui } from '@lingui/react/macro'
import { usePair, useVault } from '@tetherto/pearpass-lib-vault'
import { Platform } from 'react-native'

type ImportVaultState = {
  isLoading: boolean
  error: string
}

export const useImportVault = () => {
  const { t } = useLingui()
  const [state, setState] = useState<ImportVaultState>({
    isLoading: false,
    error: ''
  })

  const { refetch: refetchVault, addDevice } = useVault()
  const {
    pairActiveVault,
    cancelPairActiveVault,
    isLoading: isPairing
  } = usePair()

  const pairWithCode = useCallback(
    async (code: string) => {
      try {
        setState({ error: '', isLoading: true })
        const vaultId = await pairActiveVault(code)
        await refetchVault(vaultId)
        await addDevice(Platform.OS + ' ' + Platform.Version)
        setState({ isLoading: false, error: '' })
        return true
      } catch {
        setState({
          isLoading: false,
          error: t`Something went wrong, please check invite code`
        })
        return false
      }
    },
    [pairActiveVault, refetchVault, addDevice, t]
  )

  const cancelPairing = useCallback(async () => {
    await cancelPairActiveVault()
    setState({ isLoading: false, error: '' })
  }, [cancelPairActiveVault])

  return {
    isLoading: state.isLoading || isPairing,
    error: state.error,
    pairWithCode,
    cancelPairing
  }
}
