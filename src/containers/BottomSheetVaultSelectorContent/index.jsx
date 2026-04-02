import { useLingui } from '@lingui/react/macro'
import {
  Button,
  NavbarListItem,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Add,
  Close,
  LockFilled,
  MoreVert
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'
import { Pressable, View } from 'react-native'

import { createStyles } from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useModal } from '../../context/ModalContext'
import { BottomSheetVaultAction } from '../BottomSheetVaultAction'
import { ContentContainer } from '../ContentContainer'
import { VaultPasswordFormModalContent } from '../Modal/VaultPasswordFormModalContent'

export const BottomSheetVaultSelectorContent = ({ onCreateVault }) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse, expand } = useBottomSheet()
  const { openModal, closeModal } = useModal()
  const styles = createStyles(theme.colors)

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

    const isProtected = await isVaultProtected(vault.id)
    if (isProtected) {
      openModal(
        <VaultPasswordFormModalContent
          vault={vault}
          onSubmit={async (password) => {
            await refetchVault(vault.id, { password })
            closeModal()
            collapse()
          }}
        />
      )
    } else {
      await refetchVault(vault.id)
      collapse()
    }
  }

  const handleVaultActionsPress = (vault) => {
    expand({
      children: (
        <BottomSheetVaultAction vaultId={vault.id} vaultName={vault.name} />
      ),
      snapPoints: ['10%', '20%', '20%']
    })
  }

  const handleColor = theme.colors.colorSurfaceElevatedOnInteraction

  return (
    <ContentContainer
      scrollable
      contentStyle={{ padding: 0 }}
      header={
        <>
          <View style={styles.dragHandleArea}>
            <View
              style={[styles.dragHandle, { backgroundColor: handleColor }]}
            />
          </View>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text variant="bodyEmphasized" style={styles.headerTitle}>
              {t`Vaults`}
            </Text>
            <Button
              variant="tertiary"
              size="medium"
              iconBefore={<Close color={theme.colors.colorTextPrimary} />}
              onClick={collapse}
              aria-label={t`Close`}
            />
          </View>
        </>
      }
    >
      {vaultsData?.map((vault) => {
        const isActive = vault.id === activeVault?.id
        return (
          <Pressable
            key={vault.id}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => handleVaultPress(vault)}
          >
            <LockFilled
              width={16}
              height={16}
              color={theme.colors.colorTextPrimary}
            />
            <View style={styles.labelContainer}>
              <Text variant="label" numberOfLines={1}>
                {vault.name}
              </Text>
            </View>
            <Button
              variant="tertiary"
              size="small"
              iconBefore={<MoreVert color={theme.colors.colorTextPrimary} />}
              onClick={() => handleVaultActionsPress(vault)}
              aria-label={t`Vault actions`}
            />
          </Pressable>
        )
      })}

      <NavbarListItem
        icon={<Add color={theme.colors.colorTextPrimary} />}
        label={t`Create New Vault`}
        platform="mobile"
        onClick={onCreateVault}
      />
    </ContentContainer>
  )
}
