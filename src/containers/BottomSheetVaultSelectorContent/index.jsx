import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  Button,
  ContextMenu,
  ListItem,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Add, LockFilled, MoreVert } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { createStyles } from './styles'
import { useGlobalLoading } from '../../context/LoadingContext'
import { useModal } from '../../context/ModalContext'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { BottomSheetVaultAction } from '../BottomSheetVaultAction'
import { Layout } from '../Layout'
import { VaultPasswordFormModalContent } from '../Modal/VaultPasswordFormModalContent'

export const BottomSheetVaultSelectorContent = ({ onCreateVault }) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const styles = createStyles()
  const collapse = useBottomSheetClose()
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

  const handleCreateVault = () => {
    collapse()
    onCreateVault?.()
  }

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={<SheetHeader title={t`Vaults`} onClose={collapse} />}
    >
      {vaultsData?.map((vault) => (
        <ListItem
          key={vault.id}
          icon={<LockFilled color={theme.colors.colorTextPrimary} />}
          title={vault.name}
          selected={vault.id === activeVault?.id}
          showDivider
          iconSize={16}
          style={styles.listItem}
          rightElement={
            <ContextMenu
              trigger={
                <Button
                  variant="tertiary"
                  size="small"
                  iconBefore={
                    <MoreVert color={theme.colors.colorTextPrimary} />
                  }
                  aria-label={t`Vault actions`}
                />
              }
            >
              <BottomSheetVaultAction
                vaultId={vault.id}
                vaultName={vault.name}
              />
            </ContextMenu>
          }
          onClick={() => handleVaultPress(vault)}
        />
      ))}

      <ListItem
        icon={<Add color={theme.colors.colorTextPrimary} />}
        title={t`Create New Vault`}
        iconSize={16}
        style={styles.listItem}
        onClick={handleCreateVault}
      />
    </Layout>
  )
}
