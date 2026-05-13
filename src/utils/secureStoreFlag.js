import * as SecureStore from 'expo-secure-store'

export const storeOptionalFlag = async (key, value, defaultValue) => {
  if (value === defaultValue) {
    await SecureStore.deleteItemAsync(key)
  } else {
    await SecureStore.setItemAsync(key, String(value))
  }
}
