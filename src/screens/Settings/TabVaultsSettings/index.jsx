import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ListItem } from '../../../components/ListItem'
import { ButtonLittle } from '../../../libComponents'
import { settingsStyles } from '../styles'

export const VaultsManageSection = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { data: vault } = useVault()

  const handleVaultEditClick = (vaultId, vaultName) => {
    navigation.navigate('VaultSettingsScreen', { vaultId, vaultName })
  }

  return (
    <CardSingleSetting title={t`Your Vault`}>
      <View style={styles.sectionContent}>
        <Text style={styles.description}>
          {t`Share, edit, or delete your vault from one place.`}
        </Text>
        <ListItem
          key={vault.id}
          name={vault?.name ?? vault?.id}
          date={vault.createdAt}
          testID="vault-item"
          accessibilityLabel="vault-item"
          nameTestID="vault-name"
          nameAccessibilityLabel="Vault Name"
          dateTestID="vault-date"
          dateAccessibilityLabel="Vault Date"
          onEditClick={() => handleVaultEditClick(vault.id, vault.name)}
        />
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
