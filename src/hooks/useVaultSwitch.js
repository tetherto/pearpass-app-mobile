import { useCallback, useState } from 'react'

import { useVault } from '@tetherto/pearpass-lib-vault'

import { VaultPasswordFormModalContent } from '../containers/Modal/VaultPasswordFormModalContent'
import { useGlobalLoading } from '../context/LoadingContext'
import { useModal } from '../context/ModalContext'

/**
 * @param {{
 *   onSameVault?: () => void;
 *   onSwitchComplete?: () => void;
 *   openModal?: (node: React.ReactNode) => void;
 *   closeModal?: () => void;
 * }} [options]
 */
export const useVaultSwitch = ({
  onSameVault,
  onSwitchComplete,
  openModal: openModalOption,
  closeModal: closeModalOption
} = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  useGlobalLoading({ isLoading })

  const { openModal: openModalFromContext, closeModal: closeModalFromContext } =
    useModal()
  const openModal = openModalOption ?? openModalFromContext
  const closeModal = closeModalOption ?? closeModalFromContext
  const {
    data: activeVault,
    isVaultProtected,
    refetch: refetchVault
  } = useVault()

  const switchVault = useCallback(
    async (vault) => {
      if (vault.id === activeVault?.id) {
        onSameVault?.()
        return
      }

      setIsLoading(true)
      try {
        const isProtected = await isVaultProtected(vault.id)

        if (isProtected) {
          setIsLoading(false)
          openModal(
            <VaultPasswordFormModalContent
              vault={vault}
              onSubmit={async (password) => {
                setIsLoading(true)
                try {
                  await refetchVault(vault.id, { password })
                  closeModal()
                  onSwitchComplete?.()
                } finally {
                  setIsLoading(false)
                }
              }}
            />
          )
        } else {
          await refetchVault(vault.id)
          onSwitchComplete?.()
        }
      } finally {
        setIsLoading(false)
      }
    },
    [
      activeVault?.id,
      closeModal,
      isVaultProtected,
      onSameVault,
      onSwitchComplete,
      openModal,
      refetchVault
    ]
  )

  return { switchVault }
}
