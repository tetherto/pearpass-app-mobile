import * as FileSystem from 'expo-file-system'

/**
 * Converts a base64 data URI to a file URI by writing the data to a temporary file
 * @param {string} dataUri - The base64 data URI
 * @param {string} [fileName='image.jpg'] - The name to use for the temporary file
 * @returns {Promise<string>} The file URI pointing to the saved file
 * @throws {Error} If the data URI format is invalid
 */
export const convertDataUriToFileUri = async (
  dataUri,
  fileName = 'image.jpg'
) => {
  const base64Data = dataUri.split(',')[1]
  if (!base64Data) {
    throw new Error('Invalid data URI format')
  }
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`
  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64
  })
  return fileUri
}
