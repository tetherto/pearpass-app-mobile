import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

export const readFileContent = async (acceptedTypes) => {
  const type = acceptedTypes.flatMap((type) => {
    if (type === '.csv') {
      return ['text/csv', 'text/comma-separated-values']
    } else if (type === '.json') {
      return ['application/json']
    } else {
      return [type]
    }
  })

  const result = await DocumentPicker.getDocumentAsync({ type })

  if (!result.canceled) {
    const file = result.assets[0]

    const fileContent = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.UTF8
    })

    const filename = file.name || ''
    const fileType = filename.split('.').pop()?.toLowerCase() || 'unknown'

    return {
      fileContent,
      fileType
    }
  } else {
    throw new Error('File picking was canceled.')
  }
}
