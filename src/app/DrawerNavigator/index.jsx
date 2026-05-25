import { createDrawerNavigator } from '@react-navigation/drawer'

import { DrawerContent } from '../../containers/DrawerContent'
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
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      swipeEnabled: false
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
  </Drawer.Navigator>
)
