import { NativeModules, Platform } from 'react-native'

const { CustomSplashScreen } = NativeModules

/**
 * Custom SplashScreen module that replaces expo-splash-screen
 * Uses our native CustomSplashScreen module on Android
 */
export const preventAutoHideAsync = async () =>
  // On Android, the native splash is shown automatically via the theme
  // Nothing to do here - splash is already visible
  true

export const hideAsync = async () => {
  if (Platform.OS === 'android' && CustomSplashScreen) {
    CustomSplashScreen.hide()
  }
  // On iOS, implement if needed
  return true
}

export const show = () => {
  if (Platform.OS === 'android' && CustomSplashScreen) {
    CustomSplashScreen.show()
  }
}

export const hide = () => {
  if (Platform.OS === 'android' && CustomSplashScreen) {
    CustomSplashScreen.hide()
  }
}

export default {
  preventAutoHideAsync,
  hideAsync,
  show,
  hide
}
