/* global __DEV__ */
import { PearpassVaultClient } from '@tetherto/pearpass-lib-vault-core'
import Constants from 'expo-constants'
import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'
import { Worklet } from 'react-native-bare-kit'

import { isNightly } from '../constants/distribution.js'
import { getSharedDirectoryPath } from '../utils/AppGroupHelper.js'
import {
  getLogLevelSync,
  subscribeLogLevel
} from '../utils/logConfigurationStorage'
import { coreLogsFileURI, logger } from '../utils/logger'

/**
 * @param {string} dirPath
 * @returns {Promise<void>}
 */
const ensureDirectoryExist = async (dirPath) => {
  const dirInfo = await FileSystem.getInfoAsync(dirPath)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true })
  }
}

const withTimeout = (promise, ms, label) => {
  let timeoutId
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`))
    }, ms)
  })

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId)
  })
}

let cachedClientPromise = null

/**
 * @param {{
 *   debugMode?: boolean
 * }} options
 * @returns {Promise<PearpassVaultClient>}
 */
export const createPearpassVaultClient = async ({ debugMode } = {}) => {
  if (cachedClientPromise) {
    return cachedClientPromise
  }

  cachedClientPromise = (async () => {
    let worklet = null

    try {
      logger.debug('[pearpass] init: createPearpassVaultClient start')
      worklet = new Worklet()

      logger.debug('[pearpass] init: worklet created')

      const bundle = Platform.select({
        ios: require('../../bundles/app-ios.bundle.js'),
        android: require('../../bundles/app-android.bundle.js')
      })

      if (!bundle) {
        throw new Error('File URI is not available.')
      }

      worklet.start('/worklet.bundle', bundle)

      logger.debug('[pearpass] init: worklet started')

      const sharedDirectory = await getSharedDirectoryPath()

      logger.debug('[pearpass] init: shared directory resolved')

      const path = sharedDirectory
        ? `file://${sharedDirectory}/pearpass`
        : `${FileSystem.documentDirectory}pearpass`

      await ensureDirectoryExist(path)

      logger.debug('[pearpass] init: storage path ensured')

      const client = new PearpassVaultClient(worklet.IPC, path, {
        debugMode: debugMode
      })

      logger.debug('[pearpass] init: client created')

      const corePath = coreLogsFileURI.replace(/^file:\/\//, '')
      const sentryDsn =
        isNightly() && !__DEV__
          ? (Constants.expoConfig?.extra?.sentryDsn ?? null)
          : null

      // null logFile closes vault-core's file sink; string opens/swaps it.
      // 'off' means "no file"; vault-core has no 'off' logLevel, so we send
      // a valid level (kept as the last non-off choice doesn't matter — the
      // file sink is closed). For boot/off we just default to 'info'.
      const buildLogOptions = (level) => {
        const enabled = level !== 'off'
        return {
          logFile: enabled ? corePath : null,
          logLevel: enabled ? level : 'info',
          dev: __DEV__,
          sentryDsn
        }
      }

      try {
        await client.setLogOptions(buildLogOptions(getLogLevelSync()))
        logger.debug('[pearpass] init: setLogOptions sent')
      } catch (err) {
        logger.error('[pearpass] init: setLogOptions failed', err)
      }

      subscribeLogLevel(async (level) => {
        try {
          await client.setLogOptions(buildLogOptions(level))
        } catch (err) {
          logger.error('[pearpass] setLogOptions update failed', err)
        }
      })

      const jobStoragePath = sharedDirectory
        ? `file://${sharedDirectory}/pearpass_jobs`
        : `${FileSystem.documentDirectory}pearpass_jobs`

      await ensureDirectoryExist(jobStoragePath)
      logger.debug('[pearpass] init: job storage path ensured')
      await withTimeout(
        client.setJobStoragePath(jobStoragePath),
        30_000,
        'setJobStoragePath'
      )

      logger.debug('[pearpass] init: job storage path set')

      return client
    } catch (err) {
      if (worklet) {
        try {
          worklet.terminate()
        } catch {}
      }
      cachedClientPromise = null
      throw err
    }
  })()

  return cachedClientPromise
}
