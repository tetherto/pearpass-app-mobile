import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useVault, useVaults } from 'pearpass-lib-vault'
import { View, ScrollView, Text, StyleSheet } from 'react-native'

import { ListItem } from '../../components/ListItem'
import { NAVIGATION_ROUTES } from '../../constants/navigation'
import { ButtonPrimary, ButtonSecondary } from '../../libComponents'
import { LogoTextWithLock } from '../../svgs/LogoTextWithLock'
import { sortAlphabetically } from '../../utils/sortAlphabetically'

export const SelectVaultType = () => {
  const navigation = useNavigation()
  const { t } = useLingui()

  const { data: vaultsData } = useVaults()
  const { isVaultProtected, refetch: refetchVault } = useVault()

  const sortedVaults = useMemo(
    () => sortAlphabetically(vaultsData),
    [vaultsData]
  )

  const [loadingVaultId, setLoadingVaultId] = useState(null)

  const handleCreateVault = () => {
    navigation.navigate('Welcome', { state: 'credentials' })
  }

  const handleVaultSelect = async (vaultId) => {
    try {
      setLoadingVaultId(vaultId)
      const isProtected = await isVaultProtected(vaultId)
      if (isProtected) {
        navigation.navigate('Welcome', {
          state: NAVIGATION_ROUTES.UNLOCK,
          vaultId
        })
        return
      }
      await refetchVault(vaultId)
      navigation.replace('MainTabNavigator')
    } finally {
      setLoadingVaultId(null)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer} testID="select-vault-type-logo">
        <LogoTextWithLock width={170} height={50} />
      </View>

      <View style={styles.topSection}>
        {!vaultsData?.length ? (
          <View style={styles.textWrapper}>
            <Text
              style={styles.headerText}
              testID="select-vault-type-empty-title"
            >{t`Enter Master Password`}</Text>
            <Text
              style={styles.subHeaderText}
              testID="select-vault-type-empty-subtitle"
            >
              {t`Now create a secure vault or load an existing one to get started.`}
            </Text>
          </View>
        ) : (
          <View style={styles.vaultsSection}>
            <Text
              style={styles.headerText}
              testID="select-vault-type-list-title"
            >{t`Select a vault, create a new one or load another one`}</Text>

            <ScrollView
              style={styles.vaultsList}
              showsVerticalScrollIndicator={false}
            >
              {sortedVaults?.map((vault) => (
                <View key={vault.id} style={styles.vaultItemWrapper}>
                  <ListItem
                    onPress={() => handleVaultSelect(vault.id)}
                    name={vault.name ?? vault.id}
                    date={vault.createdAt}
                    isLoading={loadingVaultId === vault.id}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.bottomSection}>
        <ButtonPrimary
          testID="select-vault-type-create-new"
          stretch
          onPress={handleCreateVault}
        >
          {t`Create a new vault`}
        </ButtonPrimary>

        <ButtonSecondary
          testID="select-vault-type-load-existing"
          stretch
          onPress={() => navigation.navigate('Welcome', { state: 'load' })}
        >
          {t`Load a vault`}
        </ButtonSecondary>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: 15 },
  logoContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 140,
    gap: 10,
    justifyContent: 'center'
  },
  textWrapper: { gap: 5 },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white.mode1,
    textAlign: 'center',
    marginBottom: 5
  },
  subHeaderText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.white.mode1,
    textAlign: 'center'
  },
  vaultsSection: { width: '100%', height: 300 },
  vaultsList: { flex: 1, width: '100%', paddingTop: 15 },
  vaultItemWrapper: { marginBottom: 25 },
  bottomSection: { paddingHorizontal: 20, gap: 10 }
})
