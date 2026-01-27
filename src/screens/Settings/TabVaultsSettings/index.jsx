import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { PROTECTED_VAULT_ENABLED } from 'pearpass-lib-constants'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useVaults } from 'pearpass-lib-vault'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ListItem } from '../../../components/ListItem'
import { BottomSheetVaultAction } from '../../../containers/BottomSheetVaultAction'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { ButtonLittle } from '../../../libComponents'
import { sortAlphabetically } from '../../../utils/sortAlphabetically'
import { settingsStyles } from '../styles'

export const VaultsManageSection = () => {
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
    <CardSingleSetting title={t`Your Vault`}>
      <View style={styles.sectionContent}>
        <Text style={styles.description}>
          {t`Share, edit, or delete your vault from one place.`}
        </Text>
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
      </View>
    </CardSingleSetting>
  )
}

const styles = StyleSheet.create({
  sectionContent: {
    gap: 15
  },
  description: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  }
})

export const TabVaultsSettings = () => {
  const { t } = useLingui()
  const navigation = useNavigation()

  return (
    <SafeAreaView
      style={settingsStyles.container}
      edges={['top', 'left', 'right']}
    >
      <View style={settingsStyles.header}>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />
        <Text style={settingsStyles.screenTitle}>{t`Vaults`}</Text>
      </View>
      <ScrollView contentContainerStyle={settingsStyles.contentContainer}>
        <VaultsManageSection />
      </ScrollView>
    </SafeAreaView>
  )
}
