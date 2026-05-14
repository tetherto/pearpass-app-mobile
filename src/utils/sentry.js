/* global __DEV__ */
import * as Sentry from '@sentry/react-native'

import { registerErrorReporter } from './errorReporter'
import { logger } from './logger'

// Sentry's mobile feedback/replay/viewhierarchy/screenshot default integrations
// pull a deep module tree that breaks Metro's dev-server module table at scale
// ("Requiring unknown module 345X" errors during `expo start`). The integrations
// are instantiated eagerly during Sentry.init, so the `integrations` callback
// filter runs too late — by then the require chain has already fired. The
// supported escape hatch is `defaultIntegrations: false` + an explicit list of
// only the integrations we actually use.
export function initSentry() {
  if (__DEV__) return

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN
  if (!dsn) return

  logger.debug('[sentry] init: dsn:', dsn)

  Sentry.init({
    dsn,
    environment: 'nightly',
    tracesSampleRate: 1,
    profilesSampleRate: 1,
    defaultIntegrations: false,
    integrations: [
      Sentry.reactNativeErrorHandlersIntegration(),
      Sentry.breadcrumbsIntegration(),
      Sentry.dedupeIntegration(),
      Sentry.inboundFiltersIntegration(),
      Sentry.nativeLinkedErrorsIntegration(),
      Sentry.rewriteFramesIntegration(),
      Sentry.reactNativeInfoIntegration(),
      Sentry.eventOriginIntegration(),
      Sentry.httpContextIntegration(),
      Sentry.reactNavigationIntegration()
    ]
  })

  registerErrorReporter({
    captureException: (error, context) =>
      Sentry.captureException(error, context ? { extra: context } : undefined),
    captureMessage: (message, level) => Sentry.captureMessage(message, level)
  })
}
