import { useCallback } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useLingui } from '@lingui/react/macro'
import { AUTHENTICATOR_ENABLED } from '@tetherto/pearpass-lib-constants'
import { AlertMessage, useTheme, rawTokens, Text } from '@tetherto/pearpass-lib-ui-kit'
import {
  LockFilled,
  LockOutlined,
  UnfoldMoreOutlined,
  TwoFactorAuthenticationFilled,
  TwoFactorAuthenticationOutlined,
  Settings as SettingsIcon,
  SettingsOutlined,
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { DrawerNavigator } from '../DrawerNavigator'
import { SettingsNavigator } from '../SettingsNavigator'
import { Authenticator } from '../../screens/Authenticator'
import { useVaultSelector } from '../../context/VaultSelectorContext'

const Tab = createBottomTabNavigator()

const VaultTabButton = ({ onPress, onLongPress: _onLongPress, accessibilityState, ...rest }: Record<string, unknown>) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const { open: openVaultSelector } = useVaultSelector()
  const isFocused = (accessibilityState as { selected?: boolean })?.selected
  const toastOffset = 66 + insets.bottom + 8

  const handlePress = useCallback(() => {
    if (isFocused) {
      Toast.show({
        type: 'alertToast',
        props: {
          render: () => (
            <AlertMessage
              variant="info"
              size="small"
              backgroundColor={theme.colors.backgroundSnackbar}
              color={theme.colors.colorOnPrimary}
              title=""
              description={t`Press and hold to open vault manager`}
            />
          )
        },
        position: 'bottom',
        bottomOffset: toastOffset
      })
      return
    }
    (onPress as () => void)?.()
  }, [isFocused, onPress, t, toastOffset])

  const handleLongPress = useCallback(() => {
    if (isFocused) {
      openVaultSelector()
    }
  }, [isFocused, openVaultSelector])

  return (
    <Pressable
      {...rest}
      accessibilityState={accessibilityState}
      onPress={handlePress}
      onLongPress={handleLongPress}
    />
  )
}

export const TabNavigatorV2 = () => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  const baseHeight = 66
  const tabBarHeight = baseHeight + insets.bottom

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.colors.colorSurfacePrimary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.colorBorderPrimary,
          borderColor: theme.colors.colorBorderPrimary,
          elevation: 0,
          paddingTop: rawTokens.spacing12,
          paddingBottom: rawTokens.spacing8 + insets.bottom,
          paddingLeft: rawTokens.spacing16,
          paddingRight: rawTokens.spacing16,
          height: tabBarHeight
        },
        tabBarItemStyle: {
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: rawTokens.spacing8,
          paddingTop: 0,
          paddingBottom: 0
        },
        tabBarIcon: ({ focused }) => {
          const color = focused
            ? theme.colors.colorTextPrimary
            : theme.colors.colorTextSecondary

          if (route.name === 'MainDrawerNavigator') {
            return focused
              ? <LockFilled color={color} />
              : <LockOutlined color={color} />
          }
          if (route.name === 'Authenticator') {
            return focused
              ? <TwoFactorAuthenticationFilled color={color} />
              : <TwoFactorAuthenticationOutlined color={color} />
          }
          if (route.name === 'Settings') {
            return focused
              ? <SettingsIcon color={color} />
              : <SettingsOutlined color={color} />
          }
          return null
        },
        tabBarActiveTintColor: theme.colors.colorTextPrimary,
        tabBarInactiveTintColor: theme.colors.colorTextSecondary,
        tabBarLabel: ({ color }) => {
          if (route.name === 'MainDrawerNavigator') {
            return (
              <View style={styles.vaultLabelContainer}>
                <Text
                  variant="caption"
                  color={color}
                >
                  Vault
                </Text>
                <UnfoldMoreOutlined width={12} height={12} color={color} />
              </View>
            )
          }

          const labels: Record<string, string> = {
            Authenticator: 'Authenticator',
            Settings: 'Settings'
          }

          return (
            <Text
              variant="caption"
              color={color}
            >
              {labels[route.name]}
            </Text>
          )
        }
      })}
    >
      <Tab.Screen
        name="MainDrawerNavigator"
        component={DrawerNavigator}
        options={{ tabBarButton: (props) => <VaultTabButton {...props} /> }}
      />

      {AUTHENTICATOR_ENABLED && (
        <Tab.Screen name="Authenticator" component={Authenticator} />
      )}

      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  vaultLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing2
  }
})

