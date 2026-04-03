import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  AboutIcon,
  AppearanceIcon,
  AutoFillIcon,
  SecurityIcon,
  SyncingIcon,
  VaultIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider'
import { useVault } from '@tetherto/pearpass-lib-vault'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const MenuItem = ({ label, icon: Icon, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    {Icon && <Icon size="20" color={colors.grey100.mode1} />}
    <Text style={styles.menuItemText}>{label}</Text>
  </TouchableOpacity>
)

export const Settings = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { data: vault } = useVault()
  const isDev = process.env.NODE_ENV === 'development'

  const navigateRoot = (screen, params) => {
    let nav = navigation
    while (nav?.getParent?.()) {
      nav = nav.getParent()
    }
    nav.navigate(screen, params)
  }

  const menuItems = [
    { label: t`Security`, screen: 'Security', icon: SecurityIcon },
    { label: t`Syncing`, screen: 'Syncing', icon: SyncingIcon },
    { label: t`Autofill`, screen: 'Autofill', icon: AutoFillIcon },
    { label: t`Vault`, screen: 'Vaults', icon: VaultIcon },
    { label: t`Appearance`, screen: 'Appearance', icon: AppearanceIcon },
    { label: t`About`, screen: 'About', icon: AboutIcon }
  ]

  if (isDev) {
    menuItems.unshift({
      label: t`Vault Wizard (V2)`,
      screen: '__vault_wizard_v2__'
    })
    menuItems.unshift({
      label: t`Vault Settings (V2)`,
      screen: '__vault_settings_v2__'
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t`Settings`}</Text>
      </View>
      <ScrollView>
        <View>
          {menuItems.map((item) => (
            <MenuItem
              key={item.screen}
              label={item.label}
              icon={item.icon}
              onPress={() => {
                if (item.screen === '__vault_wizard_v2__') {
                  navigateRoot('Welcome', { state: 'credentials' })
                  return
                }

                if (item.screen === '__vault_settings_v2__') {
                  navigation.navigate('VaultSettingsScreen', {
                    vaultId: vault?.id,
                    vaultName: vault?.name
                  })
                  return
                }

                navigation.navigate(item.screen)
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 20,
    paddingBottom: 0,
    height: '100%',
    gap: 20,
    backgroundColor: colors.grey500.mode1
  },
  header: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  screenTitle: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: colors.grey400.mode1
  },
  menuItemText: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10
  }
})
