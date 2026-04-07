import { useState, useCallback } from 'react'

import { useLingui } from '@lingui/react/macro'
import { usePair, useVault } from '@tetherto/pearpass-lib-vault'
import { Platform } from 'react-native'

type ImportVaultState = {
  isLoading: boolean
  error: string
  pairedVault: Record<string, unknown> | null
}

export const useImportVault = () => {
  const { t } = useLingui()
  const [state, setState] = useState<ImportVaultState>({
    isLoading: false,
    error: '',
    pairedVault: null
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
        setState((prev) => ({ ...prev, error: '', isLoading: true }))
        const vaultId = await pairActiveVault(code)
        const vault = await refetchVault(vaultId)
        await addDevice(Platform.OS + ' ' + Platform.Version)
        setState((prev) => ({ ...prev, isLoading: false, pairedVault: vault }))
        return vault
      } catch {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: t`Something went wrong, please check invite code`
        }))
        return null
      }
    },
    [pairActiveVault, refetchVault, addDevice]
  )

  const cancelPairing = useCallback(async () => {
    await cancelPairActiveVault()
    setState({ isLoading: false, error: '', pairedVault: null })
  }, [cancelPairActiveVault])

  return {
    isLoading: state.isLoading || isPairing,
    error: state.error,
    pairedVault: state.pairedVault,
    pairWithCode,
    cancelPairing
  }
}
