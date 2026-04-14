import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  PageHeader,
  rawTokens,
  useTheme,
  Text
} from '@tetherto/pearpass-lib-ui-kit'
import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from 'src/containers/ScreenLayout'

import { VaultRow } from './VaultRow'
import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { VAULT_ACTION } from '../../../constants/vaultActions'
import { BottomSheetAddDeviceContent } from '../../../containers/BottomSheetAddDeviceContent'
import { ModifyVaultModalContent } from '../../../containers/Modal/ModifyVaultModalContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useModal } from '../../../context/ModalContext'

export const VaultsV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { expand } = useBottomSheet()
  const { openModal } = useModal()
  const { data: currentVault, refetch: refetchVault } = useVault()
  const { data: allVaults } = useVaults()

  useEffect(() => {
    refetchVault()
  }, [])

  const otherVaults = useMemo(
    () => allVaults?.filter((vault) => vault?.id !== currentVault?.id) ?? [],
    [allVaults, currentVault]
  )

  const handleAddMember = () => {
    expand({
      children: <BottomSheetAddDeviceContent />,
      snapPoints: ['10%', '50%', '90%']
    })
  }

  const handleCreateNewVault = () => {
    navigation.navigate('Welcome', { state: NAVIGATION_ROUTES.CREDENTIALS })
  }

  const buildVaultActions = (vault) => ({
    onRename: () =>
      openModal(
        <ModifyVaultModalContent
          vaultId={vault.id}
          vaultName={vault.name}
          action={VAULT_ACTION.NAME}
        />
      ),
    onManageMembers: () =>
      expand({
        children: <BottomSheetAddDeviceContent />,
        snapPoints: ['10%', '50%', '90%']
      }),
    onSetPassword: () =>
      openModal(
        <ModifyVaultModalContent
          vaultId={vault.id}
          vaultName={vault.name}
          action={VAULT_ACTION.PASSWORD}
        />
      ),
    onDelete: () => {}
  })

  const renderVaultItem = (
    vault,
    showDivider = false,
    isCurrentVault = false
  ) => (
    <VaultRow
      key={vault.id}
      vault={vault}
      showDivider={showDivider}
      onAddMember={handleAddMember}
      isCurrentVault={isCurrentVault}
      vaultActions={buildVaultActions(vault)}
    />
  )

  return (
    <ScreenLayout
      scrollable
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.content}
      footer={
        <Button variant="primary" fullWidth onClick={handleCreateNewVault}>
          {t`+ Create New Vault`}
        </Button>
      }
    >
      <PageHeader
        title={t`Your Vaults`}
        subtitle={t`Manage your vaults, control access permissions, and take protective measures if needed.`}
      />

      {currentVault && (
        <View style={styles.section}>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Current Vault`}
          </Text>
          <View
            style={[
              styles.card,
              { borderColor: theme.colors.colorBorderSecondary }
            ]}
          >
            {renderVaultItem(currentVault, false, true)}
          </View>
        </View>
      )}

      {otherVaults.length > 0 && (
        <View style={styles.section}>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Other Vaults`}
          </Text>
          <View
            style={[
              styles.card,
              { borderColor: theme.colors.colorBorderSecondary }
            ]}
          >
            {otherVaults.map((vault, index) =>
              renderVaultItem(vault, index < otherVaults.length - 1)
            )}
          </View>
        </View>
      )}
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing20,
    flexGrow: 1
  },
  section: {
    gap: rawTokens.spacing8
  },
  card: {
    borderWidth: 1,
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  }
})
