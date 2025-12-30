const mimeTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  txt: 'text/plain',
  json: 'application/json',
  zip: 'application/zip'
}

/**
 * Get MIME type from filename extension
 * @param {string} filename - The filename to extract MIME type from
 * @param {string} [defaultType='application/octet-stream'] - Default MIME type if extension not found
 * @returns {string} The MIME type
 */
export const getMimeType = (
  filename,
  defaultType = 'application/octet-stream'
) => {
  const ext = filename?.split('.').pop()?.toLowerCase()
  return mimeTypes[ext] || defaultType
}
