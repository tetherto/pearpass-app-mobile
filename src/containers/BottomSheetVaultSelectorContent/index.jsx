import { useState } from 'react'

import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import {
  Button,
  ListItem,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Add,
  LockFilled,
  MoreVert,
  PersonAdd
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { VAULT_ACTION } from 'src/constants/vaultActions'

import { createStyles } from './styles'
import { useModal } from '../../context/ModalContext'
import { useVaultSwitch } from '../../hooks/useVaultSwitch'
import { isModifyVaultModalV2Enabled } from '../../utils/modifyVaultModalV2Flag'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { BottomSheetVaultAction } from '../BottomSheetVaultAction'
import { Layout } from '../Layout'
import { ModifyVaultModalContentV2 } from '../Modal/ModifyVaultModalContentV2'

export const BottomSheetVaultSelectorContent = ({
  onCreateVault,
  onRequestClose,
  onNavigate
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const styles = createStyles()
  const collapse = useBottomSheetClose()
  const { bottom } = useSafeAreaInsets()
  const { openModal, closeModal } = useModal()
  const { dismiss } = useBottomSheetModal()
  const [menuVault, setMenuVault] = useState(null)

  const { data: vaultsData } = useVaults()
  const { data: activeVault } = useVault()

  const closeSelector = () => {
    onRequestClose?.()
    collapse()
  }

  const { switchVault } = useVaultSwitch({
    openModal,
    closeModal
  })

  const openModifyVaultModal = (vault, action) => {
    openModal(
      <ModifyVaultModalContentV2
        vaultId={vault.id}
        vaultName={vault.name}
        action={action}
      />
    )
  }

  const onNavigateToShareVault = (vault) => {
    onNavigate?.('ShareVault', {
      vaultId: vault.id,
      vaultName: vault.name
    })
  }

  const buildVaultActions = (vault) => ({
    onRename: () => {
      if (isModifyVaultModalV2Enabled()) {
        openModifyVaultModal(vault, VAULT_ACTION.NAME)
        return
      }

      onNavigate?.('VaultRenameScreen', {
        vaultId: vault.id,
        vaultName: vault.name
      })
    },
    onPassword: () => {
      if (isModifyVaultModalV2Enabled()) {
        openModifyVaultModal(vault, VAULT_ACTION.PASSWORD)
        return
      }

      onNavigate?.('VaultPasswordScreen', {
        vaultId: vault.id,
        vaultName: vault.name
      })
    },
    onMembers: () => {
      onNavigateToShareVault(vault)
    },
    onShare: () => {
      onNavigateToShareVault(vault)
    },
    onDelete: () => {
      onNavigate?.('VaultDeleteScreen', {
        vaultId: vault.id,
        vaultName: vault.name
      })
    }
  })

  if (menuVault) {
    const actions = buildVaultActions(menuVault)
    return (
      <BottomSheetVaultAction
        vaultName={menuVault.name}
        showBackButton
        onBack={() => setMenuVault(null)}
        onClose={closeSelector}
        {...actions}
      />
    )
  }

  const closeAndRun = (action) => {
    dismiss()
    action?.()
  }

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={<SheetHeader title={t`Vaults`} onClose={closeSelector} />}
    >
      {vaultsData?.map((vault) => {
        const isSelected = vault.id === activeVault?.id
        return (
          <ListItem
            key={vault.id}
            icon={<LockFilled color={theme.colors.colorTextPrimary} />}
            title={vault.name}
            selected={isSelected}
            showDivider
            iconSize={16}
            style={styles.listItem}
            rightElement={
              isSelected ? (
                <View style={styles.rowActions}>
                  <Button
                    variant="tertiary"
                    size="small"
                    iconBefore={
                      <PersonAdd color={theme.colors.colorTextPrimary} />
                    }
                    onClick={() =>
                      closeAndRun(() => onNavigateToShareVault(vault))
                    }
                  />
                  <Button
                    variant="tertiary"
                    size="small"
                    iconBefore={
                      <MoreVert color={theme.colors.colorTextPrimary} />
                    }
                    aria-label={t`Vault actions`}
                    onClick={() => setMenuVault(vault)}
                  />
                </View>
              ) : undefined
            }
            onClick={isSelected ? undefined : () => switchVault(vault)}
          />
        )
      })}

      <ListItem
        icon={<Add color={theme.colors.colorTextPrimary} />}
        title={t`Create New Vault`}
        iconSize={16}
        style={styles.listItem}
        onClick={() => {
          closeSelector()
          onCreateVault?.()
        }}
      />
    </Layout>
  )
}
