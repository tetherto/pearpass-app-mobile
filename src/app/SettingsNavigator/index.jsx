import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Settings } from '../../screens/Settings'
import { About } from '../../screens/Settings/About'
import { Appearance } from '../../screens/Settings/Appearance'
import { Autofill } from '../../screens/Settings/Autofill'
import { Security } from '../../screens/Settings/Security'
import { Syncing } from '../../screens/Settings/Syncing'
import { Vaults } from '../../screens/Settings/Vaults'

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
    <Stack.Screen name="Appearance" component={Appearance} />
    <Stack.Screen name="About" component={About} />
  </Stack.Navigator>
)
