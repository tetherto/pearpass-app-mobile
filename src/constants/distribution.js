import Constants from 'expo-constants'

export const getDistributionChannel = () =>
  Constants.expoConfig?.extra?.distribution || 'production'

export const isFdroid = () => getDistributionChannel() === 'fdroid'

export const isNightly = () => getDistributionChannel() === 'nightly'
