import './strict.css'
import '@expo/metro-runtime'

import { registerRootComponent } from 'expo'

import { isNightly } from './src/constants/distribution'
import { Main } from './src/main'
import { loadLogConfiguration } from './src/utils/logConfigurationStorage'
import { logger } from './src/utils/logger'

// Should happen first - awaiting AsyncStorage before
// registering races the native activity on Android — iOS happens to win
// the race, Android does not, and the JS root never mounts.
registerRootComponent(Main)

async function bootstrap() {
  await loadLogConfiguration()

  if (isNightly()) {
    const { initSentry } = require('./src/utils/sentry')
    initSentry()
  } else {
    logger.log('[sentry] disabled — non-nightly distribution')
  }
}

bootstrap()
