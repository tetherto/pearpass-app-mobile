import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Settings } from '../../screens/Settings'
import { About } from '../../screens/Settings/About'
import { Appearance } from '../../screens/Settings/Appearance'
import { Autofill } from '../../screens/Settings/Autofill'
import { Security } from '../../screens/Settings/Security'
import { Syncing } from '../../screens/Settings/Syncing'
import { VaultDeleteScreen } from '../../screens/Settings/VaultDeleteScreen'
import { VaultPasswordScreen } from '../../screens/Settings/VaultPasswordScreen'
import { VaultRenameScreen } from '../../screens/Settings/VaultRenameScreen'
import { Vaults } from '../../screens/Settings/Vaults'
import { VaultSettingsScreen } from '../../screens/Settings/VaultSettingsScreen'
import { VaultShareScreen } from '../../screens/Settings/VaultShareScreen'

const Stack = createNativeStackNavigator()

export const SettingsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}
  >
    <Stack.Screen name="SettingsMenu" component={Settings} />
    <Stack.Screen name="Security" component={Security} />
    <Stack.Screen name="Syncing" component={Syncing} />
    <Stack.Screen name="Autofill" component={Autofill} />
    <Stack.Screen name="Vaults" component={Vaults} />
    <Stack.Screen name="VaultSettingsScreen" component={VaultSettingsScreen} />
    <Stack.Screen name="VaultDeleteScreen" component={VaultDeleteScreen} />
    <Stack.Screen name="VaultPasswordScreen" component={VaultPasswordScreen} />
    <Stack.Screen name="VaultRenameScreen" component={VaultRenameScreen} />
    <Stack.Screen name="VaultShareScreen" component={VaultShareScreen} />
    <Stack.Screen name="Appearance" component={Appearance} />
    <Stack.Screen name="About" component={About} />
  </Stack.Navigator>
)
