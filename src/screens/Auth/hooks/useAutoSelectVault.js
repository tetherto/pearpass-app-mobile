import { useCallback } from 'react'

import { useNavigation } from '@react-navigation/native'
import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'

import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { getLastAccessedVaultId } from '../../../utils/lastAccessedVaultStorage'

export const useAutoSelectVault = () => {
  const navigation = useNavigation()
  const { refetch: refetchVaults } = useVaults()
  const { isVaultProtected, refetch: refetchVault } = useVault()

  const autoSelectVault = useCallback(async () => {
    let vaults = await refetchVaults()

    // Retry once: the underlying vault store is occasionally not fully
    // readable on the first list call right after initVaults, so an empty
    // result here is usually a race rather than a genuinely empty registry.
    if (!vaults?.length) {
      await new Promise((resolve) => setTimeout(resolve, 250))
      vaults = await refetchVaults()
    }

    if (!vaults?.length) {
      navigation.replace('Welcome', {
        state: NAVIGATION_ROUTES.SELECT_OR_LOAD
      })
      return
    }

    const lastAccessedVaultId = await getLastAccessedVaultId()
    const targetVault =
      vaults.find((vault) => vault.id === lastAccessedVaultId) ?? vaults[0]

    const isProtected = await isVaultProtected(targetVault.id)
    if (isProtected) {
      navigation.replace('Welcome', {
        state: NAVIGATION_ROUTES.UNLOCK,
        vaultId: targetVault.id
      })
      return
    }

    await refetchVault(targetVault.id)
    navigation.replace('MainTabNavigator')
  }, [refetchVaults, isVaultProtected, refetchVault, navigation])

  return { autoSelectVault }
}
