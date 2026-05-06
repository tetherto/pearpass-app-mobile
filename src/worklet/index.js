import { PearpassVaultClient } from '@tetherto/pearpass-lib-vault-core'
import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'
import { Worklet } from 'react-native-bare-kit'

import { getSharedDirectoryPath } from '../utils/AppGroupHelper.js'
import { logger } from '../utils/logger'

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
      logger.log('[pearpass] init: createPearpassVaultClient start')
      worklet = new Worklet()

      logger.log('[pearpass] init: worklet created')

      const bundle = Platform.select({
        ios: require('../../bundles/app-ios.bundle.js'),
        android: require('../../bundles/app-android.bundle.js')
      })

      if (!bundle) {
        throw new Error('File URI is not available.')
      }

      worklet.start('/worklet.bundle', bundle)

      logger.log('[pearpass] init: worklet started')

      const sharedDirectory = await getSharedDirectoryPath()

      logger.log('[pearpass] init: shared directory resolved')

      const path = sharedDirectory
        ? `file://${sharedDirectory}/pearpass`
        : `${FileSystem.documentDirectory}pearpass`

      await ensureDirectoryExist(path)

      logger.log('[pearpass] init: storage path ensured')

      const client = new PearpassVaultClient(worklet.IPC, path, {
        debugMode: debugMode
      })

      logger.log('[pearpass] init: client created')

      const jobStoragePath = sharedDirectory
        ? `file://${sharedDirectory}/pearpass_jobs`
        : `${FileSystem.documentDirectory}pearpass_jobs`

      await ensureDirectoryExist(jobStoragePath)
      logger.log('[pearpass] init: job storage path ensured')
      await withTimeout(
        client.setJobStoragePath(jobStoragePath),
        30_000,
        'setJobStoragePath'
      )

      logger.log('[pearpass] init: job storage path set')

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
