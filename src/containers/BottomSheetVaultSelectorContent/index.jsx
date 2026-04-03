import { useContext, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { Button, ListItem, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Add,
  Close,
  LockFilled,
  MoreVert
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault, useVaults } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { createStyles } from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useGlobalLoading } from '../../context/LoadingContext'
import { useModal } from '../../context/ModalContext'
import { BottomSheetVaultAction } from '../BottomSheetVaultAction'
import { ContentContainer } from '../ContentContainer'
import { VaultPasswordFormModalContent } from '../Modal/VaultPasswordFormModalContent'

export const BottomSheetVaultSelectorContent = ({ onCreateVault }) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse, expand } = useBottomSheet()
  const insets = useContext(SafeAreaInsetsContext)
  const bottom = insets?.bottom ?? 0
  const { openModal, closeModal } = useModal()
  const styles = createStyles()

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
    const isProtected = await isVaultProtected(vault.id)

    if (isProtected) {
      setIsLoading(false)
      openModal(
        <VaultPasswordFormModalContent
          vault={vault}
          onSubmit={async (password) => {
            setIsLoading(true)
            await refetchVault(vault.id, { password })
            setIsLoading(false)
            closeModal()
            collapse()
          }}
        />
      )
    } else {
      await refetchVault(vault.id)
      setIsLoading(false)
      collapse()
    }
  }

  const handleVaultActionsPress = (vault) => {
    expand({
      children: (
        <BottomSheetVaultAction
          vaultId={vault.id}
          vaultName={vault.name}
          onDismiss={() =>
            expand({
              children: (
                <BottomSheetVaultSelectorContent
                  onCreateVault={onCreateVault}
                />
              )
            })
          }
        />
      )
    })
  }

  const handleColor = theme.colors.colorSurfaceElevatedOnInteraction

  return (
    <ContentContainer
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
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
    </ContentContainer>
  )
}
