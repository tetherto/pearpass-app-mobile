import { useEffect } from 'react'

import { useVault } from '@tetherto/pearpass-lib-vault'

import { setLastAccessedVaultId } from '../utils/lastAccessedVaultStorage'

export const useTrackLastAccessedVault = () => {
  const { data: activeVault } = useVault()
  const activeVaultId = activeVault?.id

  useEffect(() => {
    if (activeVaultId) {
      setLastAccessedVaultId(activeVaultId)
    }
  }, [activeVaultId])
}
