import { useCallback } from 'react'

import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'

import { useVaultSwitch } from './useVaultSwitch'
import { AccessRemovedModalContent } from '../containers/Modal/AccessRemovedModalContent'
import { useModal } from '../context/ModalContext'
import { logger } from '../utils/logger'

/**
 * Receive-side handler for "another device removed me from this vault".
 * Wipes local data and opens the access-removed modal.
 *
 * Currently invoked manually via `globalThis.__pearpassTriggerAccessRevoked`
 * for testing; will be wired into the action-bus once it lands.
 */
export const useVaultAccessRevoked = () => {
  const { openModal } = useModal()
  const { data: vaults } = useVaults()
  const { deleteVaultLocal } = useVault()
  const { switchVault } = useVaultSwitch()

  const triggerAccessRevoked = useCallback(
    async (vaultId, deviceName) => {
      const list = vaults ?? []
      const vault = list.find((v) => v.id === vaultId)
      const vaultName = vault?.name ?? vaultId

      try {
        await deleteVaultLocal(vaultId)
      } catch (error) {
        logger.error('useVaultAccessRevoked', 'deleteVaultLocal failed:', error)
        return
      }

      const next = list.find((v) => v.id !== vaultId)
      if (next) {
        await switchVault(next)
      }

      openModal(
        <AccessRemovedModalContent
          vaultName={vaultName}
          deviceName={deviceName}
        />
      )
    },
    [vaults, deleteVaultLocal, switchVault, openModal]
  )

  return { triggerAccessRevoked }
}
