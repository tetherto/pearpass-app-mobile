import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  HomeIcon,
  PlusIcon,
  SettingsIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { BottomSheetRecordCreateContent } from '../../containers/BottomSheetRecordCreateContent'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'
import { Settings } from '../../screens/Settings'
import { DrawerNavigator } from '../DrawerNavigator'

const Tab = createBottomTabNavigator()

export const TabNavigator = () => {
  const { expand } = useBottomSheet()
  const { hapticButtonPrimary } = useHapticFeedback()

  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: () => {
          hapticButtonPrimary()
        }
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          zIndex: 10,
          backgroundColor: colors.black.mode1,
          height: 84,
          borderTopWidth: 0,
          elevation: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          borderTopWidth: 1,
          borderTopColor: colors.grey100.mode1
        },
        tabBarItemStyle: {
          paddingTop: 12,
          paddingBottom: 12
        },
        tabBarIcon: ({ focused }) => {
          const icons = {
            MainDrawerNavigator: HomeIcon,
            Settings: SettingsIcon
          }

          const IconComponent = icons[route.name]

          return (
            <IconComponent
              size="24"
              color={focused ? colors.primary400.mode1 : colors.white.mode1}
            />
          )
        },
        tabBarActiveTintColor: colors.white.mode1,
        tabBarInactiveTintColor: colors.white.mode1,
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
          color: colors.white.mode1,
          marginTop: 4,
          marginBottom: 0,
          fontFamily: 'inter'
        }
      })}
    >
      <Tab.Screen
        options={{
          tabBarLabel: 'Home'
        }}
        name="MainDrawerNavigator"
        component={DrawerNavigator}
      />

      <Tab.Screen
        name="Plus"
        children={() => null}
        options={{
          tabBarLabel: () => null,
          tabBarButton: () => (
            <View style={styles.tabBarButtonContainer}>
              <TouchableOpacity
                testID="button-create-record"
                style={styles.tabBarButton}
                onPress={() => {
                  hapticButtonPrimary()
                  expand({
                    children: <BottomSheetRecordCreateContent />,
                    snapPoints: ['1%', '80%']
                  })
                }}
              >
                <PlusIcon size="28" color={colors.black.mode1} />
              </TouchableOpacity>
            </View>
          )
        }}
      />

      <Tab.Screen
        options={{
          tabBarLabel: 'Settings'
        }}
        name="Settings"
        component={Settings}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 84
  },
  tabBarButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: colors.primary400.mode1
  }
})
