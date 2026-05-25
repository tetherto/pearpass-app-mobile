import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Settings } from '../../screens/Settings'

const Stack = createNativeStackNavigator()

export const SettingsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}
  >
    <Stack.Screen name="SettingsMenu" component={Settings} />
  </Stack.Navigator>
)
