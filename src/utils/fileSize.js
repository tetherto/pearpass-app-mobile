import { MAX_FILE_SIZE_MB } from '@tetherto/pearpass-lib-constants'
/**
 * Calculates the file size in MB from base64 string
 * @param {string} base64 - The base64 string
 * @returns {number} File size in MB
 */
export const getBase64SizeMB = (base64) => {
  if (!base64) return 0
  const sizeInBytes = (base64.length * 3) / 4
  return sizeInBytes / (1024 * 1024)
}

/**
 * Validates base64 file size against the maximum allowed limit
 * @param {string} base64 - The base64 string to validate
 * @returns {{valid: boolean, sizeMB: number, maxSizeMB: number}} Validation result
 * @example
 */
export const validateBase64Size = (base64) => {
  const sizeMB = getBase64SizeMB(base64)

  return {
    valid: sizeMB <= MAX_FILE_SIZE_MB,
    sizeMB,
    maxSizeMB: MAX_FILE_SIZE_MB
  }
}
