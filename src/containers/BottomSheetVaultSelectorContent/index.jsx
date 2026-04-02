import { useLingui } from '@lingui/react/macro'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Check,
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

export const BottomSheetVaultSelectorContent = () => {
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

  return (
    <ContentContainer scrollable contentStyle={{ padding: 0 }}>
      <View style={styles.header}>
        <Text variant="bodyEmphasized">{t`Vaults`}</Text>
        <Button
          variant="tertiary"
          iconBefore={<Close color={theme.colors.colorTextPrimary} />}
          onClick={collapse}
          aria-label={t`Close`}
        />
      </View>

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
            <Text variant="label" style={styles.itemLabel}>
              {vault.name}
            </Text>
            {isActive && (
              <Check
                width={16}
                height={16}
                color={theme.colors.colorTextPrimary}
              />
            )}
            <Button
              variant="tertiary"
              iconBefore={
                <MoreVert
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />
              }
              onClick={() => handleVaultActionsPress(vault)}
              aria-label={t`Vault actions`}
            />
          </Pressable>
        )
      })}
    </ContentContainer>
  )
}
