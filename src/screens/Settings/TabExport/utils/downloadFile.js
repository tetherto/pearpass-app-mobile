import { shareExportFile } from './shareExportFile'

export const downloadFile = async ({ filename, content }, type) => {
  const mimeType = type === 'json' ? 'application/json' : 'text/csv'

  await shareExportFile({ filename, content, mimeType })
}
