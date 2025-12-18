import * as FileSystem from 'expo-file-system'
import { PearpassVaultClient } from 'pearpass-lib-vault-core'
import { Platform } from 'react-native'
import { Worklet } from 'react-native-bare-kit'

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

  return new PearpassVaultClient(worklet.IPC, path, {
    debugMode: debugMode
  })
}
