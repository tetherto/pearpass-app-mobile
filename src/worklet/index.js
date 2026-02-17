import * as FileSystem from 'expo-file-system'
import { PearpassVaultClient } from 'pearpass-lib-vault-core'
import { AppState, Platform } from 'react-native'
import { Worklet } from 'react-native-bare-kit'
import Suspendify from 'suspendify'

import { getSharedDirectoryPath } from '../utils/AppGroupHelper.js'

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

/**
 * @param {{
 *   debugMode?: boolean
 * }} options
 * @returns {Promise<PearpassVaultClient>}
 */
export const createPearpassVaultClient = async ({ debugMode } = {}) => {
  const worklet = new Worklet()

  const bundle = Platform.select({
    ios: require('../../bundles/app-ios.bundle.js'),
    android: require('../../bundles/app-android.bundle.js')
  })

  if (!bundle) {
    throw new Error('File URI is not available.')
  }

  worklet.start('/worklet.bundle', bundle)

  const sharedDirectory = await getSharedDirectoryPath()

  const path = sharedDirectory
    ? `file://${sharedDirectory}/pearpass`
    : `${FileSystem.documentDirectory}pearpass`

  await ensureDirectoryExist(path)

  const client = new PearpassVaultClient(worklet.IPC, path, {
    debugMode: debugMode
  })

  const jobStoragePath = sharedDirectory
    ? `file://${sharedDirectory}/pearpass_jobs`
    : `${FileSystem.documentDirectory}pearpass_jobs`

  await ensureDirectoryExist(jobStoragePath)
  await client.setJobStoragePath(jobStoragePath)

  const suspender = new Suspendify({
    async suspend() {
      await client.beginBackground()
    },
    async resume() {
      await client.endBackground()
    }
  })

  AppState.addEventListener('change', (nextState) => {
    if (nextState === 'active') {
      suspender.resume()
      return
    }
    if (nextState === 'background') {
      suspender.suspend(0)
    }
  })

  return client
}
