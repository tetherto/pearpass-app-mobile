import { useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { Button, ListItem, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { Add, LockFilled, MoreVert } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { useGlobalLoading } from '../../context/LoadingContext'
import { useModal } from '../../context/ModalContext'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { BottomSheetVaultAction } from '../BottomSheetVaultAction'
import { Layout } from '../Layout'
import { VaultPasswordFormModalContent } from '../Modal/VaultPasswordFormModalContent'

export const BottomSheetVaultSelectorContent = ({ onCreateVault }) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse, expand } = useBottomSheet()
  const { bottom } = useSafeAreaInsets()
  const { openModal, closeModal } = useModal()

  const [isLoading, setIsLoading] = useState(false)
  useGlobalLoading({ isLoading })

  const { data: vaultsData } = useVaults()
  const {
    data: activeVault,
    isVaultProtected,
    refetch: refetchVault
  } = useVault()

  const replacingRef = useRef(false)

  const handleVaultPress = async (vault) => {
    if (vault.id === activeVault?.id) {
      collapse()
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
                collapse()
              } finally {
                setIsLoading(false)
              }
            }}
          />
        )
      } else {
        await refetchVault(vault.id)
        collapse()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVaultActionsPress = (vault) => {
    replacingRef.current = true
    expand({
      children: (
        <BottomSheetVaultAction
          vaultId={vault.id}
          vaultName={vault.name}
          onDismiss={() => {
            if (!replacingRef.current) {
              expand({
                children: (
                  <BottomSheetVaultSelectorContent
                    onCreateVault={onCreateVault}
                  />
                )
              })
            }
            replacingRef.current = false
          }}
        />
      )
    })
  }

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={<SheetHeader title={t`Vaults`} onClose={collapse} />}
    >
      {vaultsData?.map((vault) => {
        const isActive = vault.id === activeVault?.id
        return (
          <ListItem
            key={vault.id}
            icon={<LockFilled color={theme.colors.colorTextPrimary} />}
            title={vault.name}
            selected={isActive}
            showDivider
            iconSize={16}
            rightElement={
              <Button
                variant="tertiary"
                size="small"
                iconBefore={<MoreVert color={theme.colors.colorTextPrimary} />}
                onClick={() => handleVaultActionsPress(vault)}
                aria-label={t`Vault actions`}
              />
            }
            onClick={() => handleVaultPress(vault)}
          />
        )
      })}

      <ListItem
        icon={<Add color={theme.colors.colorTextPrimary} />}
        title={t`Create New Vault`}
        iconSize={16}
        onClick={onCreateVault}
      />
    </Layout>
  )
}
