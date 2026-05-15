import { useCallback, useEffect, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  useCreateVault,
  useVault,
  useVaults
} from '@tetherto/pearpass-lib-vault'
import { pearpassVaultClient } from '@tetherto/pearpass-lib-vault/src/instances'
import Toast from 'react-native-toast-message'

import { useVaultSwitch } from './useVaultSwitch'
import { TOAST_CONFIG } from '../constants/toast'
import { AccessRemovedModalContent } from '../containers/Modal/AccessRemovedModalContent'
import { useModal } from '../context/ModalContext'
import { logger } from '../utils/logger'

/**
 * Receive-side handler for "another device removed me from this vault".
 * Wipes local data, recovers to a fresh "Personal" vault when nothing
 * remains, and opens the access-removed modal.
 */
export const useVaultAccessRevoked = () => {
  const { t } = useLingui()
  const { openModal } = useModal()
  const { data: vaults } = useVaults()
  const { data: activeVault, deleteVaultLocal, addDevice } = useVault()
  const { switchVault } = useVaultSwitch()
  const { createVault } = useCreateVault()

  const latest = useRef({
    vaults,
    activeVault,
    deleteVaultLocal,
    addDevice,
    switchVault,
    createVault,
    openModal,
    t
  })
  useEffect(() => {
    latest.current = {
      vaults,
      activeVault,
      deleteVaultLocal,
      addDevice,
      switchVault,
      createVault,
      openModal,
      t
    }
  })

  const handleAccessRevoked = useCallback(async ({ vaultId, actor } = {}) => {
    if (!vaultId) return
    const {
      vaults,
      activeVault,
      deleteVaultLocal,
      addDevice,
      switchVault,
      createVault,
      openModal,
      t
    } = latest.current

    const list = vaults ?? []
    const vault = list.find((v) => v.id === vaultId)
    if (!vault) return
    const vaultName = vault.name ?? vaultId
    const deviceName = vault.devices?.find((d) => d?.id === actor)?.name
    const wasActive = activeVault?.id === vaultId

    try {
      await deleteVaultLocal(vaultId)
    } catch (error) {
      logger.error('useVaultAccessRevoked', 'deleteVaultLocal failed:', error)
      openModal(
        <AccessRemovedModalContent
          vaultName={vaultName}
          deviceName={deviceName}
        />
      )
      return
    }

    if (wasActive) {
      const next = list.find((v) => v.id !== vaultId)
      if (next) {
        await switchVault(next)
      } else {
        try {
          await createVault({ name: t`Personal` })
          await addDevice()
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
          Toast.show({
            type: 'baseToast',
            text1: t`Couldn't create a starter vault. Please try again.`,
            position: 'bottom',
            bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
          })
        }
      }
    }

    openModal(
      <AccessRemovedModalContent
        vaultName={vaultName}
        deviceName={deviceName}
      />
    )
  }, [])

  useEffect(() => {
    if (!pearpassVaultClient?.on) return
    pearpassVaultClient.on('vault-access-revoked', handleAccessRevoked)
    return () => {
      pearpassVaultClient.off?.('vault-access-revoked', handleAccessRevoked)
    }
  }, [handleAccessRevoked])
}
