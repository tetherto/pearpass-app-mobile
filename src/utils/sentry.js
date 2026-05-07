/* global __DEV__ */
import * as Sentry from '@sentry/react-native'
import Constants from 'expo-constants'

export function initSentry() {
  if (__DEV__) return
  const dsn = Constants.expoConfig?.extra?.sentryDsn
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: 'nightly',
    tracesSampleRate: 1,
    profilesSampleRate: 1,
    integrations: [Sentry.reactNavigationIntegration()]
  })
}
