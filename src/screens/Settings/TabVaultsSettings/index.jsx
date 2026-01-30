import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { PROTECTED_VAULT_ENABLED } from 'pearpass-lib-constants'
import { useVaults } from 'pearpass-lib-vault'

import { ManageVaultsContainer } from './styles'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ListItem } from '../../../components/ListItem'
import { BottomSheetVaultAction } from '../../../containers/BottomSheetVaultAction'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { sortAlphabetically } from '../../../utils/sortAlphabetically'

export const TabVaultsSettings = () => {
  const { t } = useLingui()
  const { expand } = useBottomSheet()
  const { data } = useVaults()

  const sortedVaults = useMemo(() => sortAlphabetically(data), [data])

  const handleVaultEditClick = (vaultId, vaultName) => {
    const snapPoints = PROTECTED_VAULT_ENABLED ? ['30%', '90%'] : ['20%', '90%']
    expand({
      children: (
        <BottomSheetVaultAction vaultId={vaultId} vaultName={vaultName} />
      ),
      snapPoints,
      enableContentPanningGesture: false
    })
  }

  return (
    <CardSingleSetting title={t`Manage Vaults`}>
      <ManageVaultsContainer>
        {sortedVaults?.map((vault, index) => (
          <ListItem
            key={vault.id}
            name={vault?.name ?? vault?.id}
            date={vault.createdAt}
            testID={`vault-item-${index}`}
            accessibilityLabel={`vault-item-${index}`}
            onEditClick={() => handleVaultEditClick(vault.id, vault.name)}
          />
        ))}
      </ManageVaultsContainer>
    </CardSingleSetting>
  )
}
