import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from 'pearpass-lib-constants'

const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export const readFileContent = async (acceptedTypes) => {
  const type = acceptedTypes.flatMap((type) => {
    if (type === '.csv') {
      return ['text/csv', 'text/comma-separated-values']
    } else if (type === '.json') {
      return ['application/json']
    } else if (type === '.kdbx') {
      return ['application/octet-stream', '*/*']
    } else if (type === '.xml') {
      return ['text/xml', 'application/xml']
    } else {
      return [type]
    }
  })

  const result = await DocumentPicker.getDocumentAsync({ type })

  if (!result.canceled) {
    const file = result.assets[0]

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`)
    }

    const filename = file.name || ''
    const fileType = filename.split('.').pop()?.toLowerCase() || 'unknown'

    if (fileType === 'kdbx') {
      const base64Content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64
      })
      return {
        fileContent: base64ToArrayBuffer(base64Content),
        fileType
      }
    }

    const fileContent = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.UTF8
    })

    return {
      fileContent,
      fileType
    }
  } else {
    throw new Error('File picking was canceled.')
  }
}
