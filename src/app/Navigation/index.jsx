import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CreateFolder } from '../../screens/CreateFolder'
import { CreateRecord } from '../../screens/CreateRecord'
import { ErrorScreen } from '../../screens/ErrorScreen'
import { ImagePreview } from '../../screens/ImagePreview'
import { ImportVault } from '../../screens/ImportVault'
import { Intro } from '../../screens/Intro'
import { Onboarding } from '../../screens/Onboarding'
import { RecordDetails } from '../../screens/RecordDetails'
import { ShareVault } from '../../screens/ShareVault'
import { Welcome } from '../../screens/Welcome'
import { TabNavigator } from '../TabNavigator'

const Stack = createNativeStackNavigator()

/**
 * Navigation component for the app.
 * @param {{ initialRouteName: string | null }} props - The initial route name.
 * @returns {JSX.Element} The navigation stack.
 */
export const Navigation = ({ initialRouteName }) => (
  <Stack.Navigator
    initialRouteName={initialRouteName}
    screenOptions={() => ({
      headerShown: false
    })}
  >
    <Stack.Screen
      name="Error"
      component={ErrorScreen}
      options={{ gestureEnabled: false }}
    />
    <Stack.Screen
      name="Intro"
      component={Intro}
      options={{ gestureEnabled: false }}
    />
    <Stack.Screen
      name="Onboarding"
      component={Onboarding}
      options={{ gestureEnabled: false }}
    />
    <Stack.Screen
      name="Welcome"
      component={Welcome}
      options={{ gestureEnabled: false }}
    />
    <Stack.Screen
      name="MainTabNavigator"
      component={TabNavigator}
      options={{ gestureEnabled: false }}
    />
    <Stack.Screen name="RecordDetails" component={RecordDetails} />
    <Stack.Screen name="ImagePreview" component={ImagePreview} />
    <Stack.Screen name="CreateRecord" component={CreateRecord} />
    <Stack.Screen name="CreateFolder" component={CreateFolder} />
    <Stack.Screen name="ImportVault" component={ImportVault} />
    <Stack.Screen name="ShareVault" component={ShareVault} />
  </Stack.Navigator>
)
