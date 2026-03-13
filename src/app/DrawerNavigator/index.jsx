import { createDrawerNavigator } from '@react-navigation/drawer'
import { AUTHENTICATOR_ENABLED } from 'pearpass-lib-constants'

import { DrawerContent } from '../../containers/DrawerContent'
import { Authenticator } from '../../screens/Authenticator'
import { Home } from '../../screens/Home'

const Drawer = createDrawerNavigator()

export const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerStyle: {
        backgroundColor: '#f5f5f5',
        width: '70%'
      },
      drawerType: 'front',
      overlayColor: 'rgba(0, 0, 0, 0.5)'
    }}
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false
      }}
    />
    {AUTHENTICATOR_ENABLED && (
      <Drawer.Screen
        name="Authenticator"
        component={Authenticator}
        options={{
          headerShown: false
        }}
      />
    )}
  </Drawer.Navigator>
)
