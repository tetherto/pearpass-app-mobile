import Constants from 'expo-constants'

export const DISTRIBUTION_CHANNEL =
  Constants.expoConfig?.extra?.distribution || 'standard'

export const IS_FDROID = DISTRIBUTION_CHANNEL === 'fdroid'
