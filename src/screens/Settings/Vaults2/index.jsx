import { useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  PageHeader,
  rawTokens,
  useTheme,
  Text
} from '@tetherto/pearpass-lib-ui-kit'
import { Add } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'
import { Layout } from 'src/containers/Layout'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'

import { VaultRow } from './VaultRow'
import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { VAULT_ACTION } from '../../../constants/vaultActions'
import { BottomSheetPairedDevicesContent } from '../../../containers/BottomSheetPairedDevicesContent'
import { DeleteVaultModalContentV2 } from '../../../containers/Modal/DeleteVaultModalContentV2'
import { ModifyVaultModalContentV2 } from '../../../containers/Modal/ModifyVaultModalContentV2'
import { useModal } from '../../../context/ModalContext'
import { useVaultSwitch } from '../../../hooks/useVaultSwitch'

export const VaultsV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { openModal } = useModal()
  const [pairedDevicesOpen, setPairedDevicesOpen] = useState(false)
  const { data: currentVault, refetch: refetchVault } = useVault()
  const { switchVault } = useVaultSwitch()
  const { data: allVaults } = useVaults()

  useEffect(() => {
    refetchVault()
  }, [])

  const otherVaults = useMemo(
    () => allVaults?.filter((vault) => vault?.id !== currentVault?.id) ?? [],
    [allVaults, currentVault]
  )

  const handleAddMember = () => {
    navigation.navigate('ShareVault')
  }

  const handleCreateNewVault = () => {
    navigation.navigate('Welcome', { state: NAVIGATION_ROUTES.CREDENTIALS })
  }

  const buildVaultActions = (vault) => ({
    onRename: () =>
      navigation.navigate('VaultRenameScreen', {
        vaultId: vault.id,
        vaultName: vault.name
      }),
    onViewPairedDevices: () => setPairedDevicesOpen(true),
    onSetPassword: () =>
      openModal(
        <ModifyVaultModalContentV2
          vaultId={vault.id}
          vaultName={vault.name}
          action={VAULT_ACTION.PASSWORD}
        />
      ),
    onDelete: () =>
      openModal(
        <DeleteVaultModalContentV2
          vaultId={vault.id}
          vaultName={vault.name}
          onDeviceCountPress={() => setPairedDevicesOpen(true)}
        />
      )
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
      onClick={() => (!isCurrentVault ? switchVault(vault) : null)}
    />
  )

  return (
    <Layout
      scrollable
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.content}
      footer={
        <Button
          variant="primary"
          iconBefore={<Add />}
          fullWidth
          onClick={handleCreateNewVault}
        >
          {t`Create New Vault`}
        </Button>
      }
    >
      <PageHeader
        title={t`Your Vaults`}
        subtitle={t`Manage your vaults. Select the vault you want to apply changes to.`}
      />

      <BottomSheetPairedDevicesContent
        open={pairedDevicesOpen}
        onOpenChange={setPairedDevicesOpen}
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
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    paddingTop: rawTokens.spacing24,
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
