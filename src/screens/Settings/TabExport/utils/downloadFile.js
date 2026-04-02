import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

export const downloadFile = async ({ filename, content }, type) => {
  const fileUri = FileSystem.documentDirectory + filename

  let mimeType = 'text/csv'
  let uti = 'public.comma-separated-values-text'

  if (type === 'json') {
    mimeType = 'application/json'
    uti = 'public.json'
  }

  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: FileSystem.EncodingType.UTF8
  })

  if (await Sharing.isAvailableAsync()) {
    try {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: 'Share file',
        UTI: uti
      })
    } catch (error) {
      throw error
    }
    return
  }

  throw new Error('Sharing is not available on this platform')
}
