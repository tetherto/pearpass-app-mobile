import * as FileSystem from 'expo-file-system'
import JSZip from 'jszip'

import { ExportCancelledError, shareExportFile } from './shareExportFile'
import { logger } from '../../../../utils/logger'

export const downloadZip = async (files) => {
  try {
    const zip = new JSZip()

    files.forEach(({ filename, data }) => {
      zip.file(filename, data)
    })

    const content = await zip.generateAsync({ type: 'base64' })

    const filename = `PearPass_Export_${new Date()
      .toISOString()
      .replace(/[:.-]/g, '_')}.zip`

    await shareExportFile({
      filename,
      content,
      encoding: FileSystem.EncodingType.Base64,
      mimeType: 'application/zip'
    })
  } catch (error) {
    // Let cancellation propagate so callers can stay silent instead of
    // showing a success message.
    if (error instanceof ExportCancelledError) {
      throw error
    }
    logger.error('Error creating or saving zip:', error)
  }
}
