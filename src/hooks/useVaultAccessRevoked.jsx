import { useCallback } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  useCreateVault,
  useVault,
  useVaults
} from '@tetherto/pearpass-lib-vault'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'

import { useVaultSwitch } from './useVaultSwitch'
import { TOAST_CONFIG } from '../constants/toast'
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
  const { t } = useLingui()
  const { openModal } = useModal()
  const { data: vaults } = useVaults()
  const { data: activeVault, deleteVaultLocal, addDevice } = useVault()
  const { switchVault } = useVaultSwitch()
  const { createVault } = useCreateVault()

  const triggerAccessRevoked = useCallback(
    async (vaultId, deviceName) => {
      const list = vaults ?? []
      const vault = list.find((v) => v.id === vaultId)
      const vaultName = vault?.name ?? vaultId
      const wasActive = activeVault?.id === vaultId

      try {
        await deleteVaultLocal(vaultId)
      } catch (error) {
        logger.error('useVaultAccessRevoked', 'deleteVaultLocal failed:', error)
        return
      }

      if (wasActive) {
        const next = list.find((v) => v.id !== vaultId)
        if (next) {
          await switchVault(next)
        } else {
          try {
            await createVault({ name: t`Personal` })
            await addDevice(Platform.OS + ' ' + Platform.Version)
            Toast.show({
              type: 'baseToast',
              text1: t`A new "Personal" vault was created`,
              position: 'bottom',
              bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
            })
          } catch (error) {
            logger.error(
              'useVaultAccessRevoked',
              'failed to create fallback Personal vault:',
              error
            )
          }
        }
      }

      openModal(
        <AccessRemovedModalContent
          vaultName={vaultName}
          deviceName={deviceName}
        />
      )
    },
    [
      vaults,
      activeVault?.id,
      deleteVaultLocal,
      switchVault,
      createVault,
      addDevice,
      openModal,
      t
    ]
  )

  return { triggerAccessRevoked }
}
