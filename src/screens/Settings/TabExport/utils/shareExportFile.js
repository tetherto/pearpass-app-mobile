import * as FileSystem from 'expo-file-system'
import { Platform, Share } from 'react-native'

/**
 * Thrown when the user dismisses the share sheet / save dialog instead of
 * completing the export. Callers should treat this as a no-op (no success or
 * error message).
 */
export class ExportCancelledError extends Error {
  constructor() {
    super('Export cancelled by user')
    this.name = 'ExportCancelledError'
  }
}

/**
 * Writes `content` to a file and lets the user save or share it.
 *
 * `expo-sharing`'s `shareAsync` resolves whether the user completes OR cancels
 * the share sheet (on both iOS and Android), so it can't tell us when an export
 * was aborted. That is what made the app show a false "Export successful"
 * message after the user dismissed the pop-up. To detect cancellation we use
 * cancellation-aware APIs instead:
 *   - iOS: react-native `Share`, which resolves with `dismissedAction` on cancel.
 *   - Android: the Storage Access Framework picker, which resolves with
 *     `granted: false` when the user backs out.
 *
 * @param {Object} params
 * @param {string} params.filename - File name including its extension.
 * @param {string} params.content - File contents to write.
 * @param {string} [params.encoding] - Encoding for the written content.
 * @param {string} [params.mimeType] - MIME type used for the saved file.
 * @throws {ExportCancelledError} when the user cancels the share/save dialog.
 */
export const shareExportFile = async ({
  filename,
  content,
  encoding = FileSystem.EncodingType.UTF8,
  mimeType = 'application/octet-stream'
}) => {
  if (Platform.OS === 'android') {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

    if (!permissions.granted) {
      throw new ExportCancelledError()
    }

    // `createFileAsync` appends the extension based on the MIME type, so we
    // strip any existing extension to avoid names like "file.json.json".
    const baseName = filename.replace(/\.[^./\\]+$/, '')

    const destinationUri =
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        baseName,
        mimeType
      )

    await FileSystem.writeAsStringAsync(destinationUri, content, { encoding })
    return
  }

  const fileUri = FileSystem.documentDirectory + filename
  await FileSystem.writeAsStringAsync(fileUri, content, { encoding })

  const result = await Share.share({ url: fileUri })

  if (result.action === Share.dismissedAction) {
    throw new ExportCancelledError()
  }
}
