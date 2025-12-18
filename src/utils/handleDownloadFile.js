import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import { Platform } from 'react-native'

import { getMimeType } from './getMimeType'
import { logger } from './logger'

/**
 * @param {{ base64: string, name: string }} file
 */
export const handleDownloadFile = async (file) => {
  try {
    const fileUri = `${FileSystem.cacheDirectory}${file.name}`

    await FileSystem.writeAsStringAsync(fileUri, file.base64, {
      encoding: FileSystem.EncodingType.Base64
    })

    if (Platform.OS !== 'web') {
      await shareAsync(fileUri, {
        mimeType: getMimeType(file.name),
        dialogTitle: 'Share file'
      })
    }
  } catch (error) {
    logger.error('Error saving file:', error)
  }
}
