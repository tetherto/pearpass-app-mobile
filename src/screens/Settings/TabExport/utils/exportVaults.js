import { parseDataToCsvText, parseDataToJson } from 'pearpass-lib-data-export'
import { encryptExportData } from 'pearpass-lib-vault'

import { downloadFile } from './downloadFile'
import { downloadZip } from './downloadZip'

/**
 * Handles the download of vaults, either as a single file or a zip archive.
 *
 * @param {Array} vaultsToExport - The array of vault data objects to export.
 * @param {string} exportType - The type of export (e.g., 'csv', 'json', 'pearpass').
 * @returns {Promise<boolean>} Returns true if the download was successful, false otherwise.
 */
const handleDownloadVaults = async (vaultsToExport, exportType) => {
  if (vaultsToExport.length === 0) {
    return false
  }

  try {
    if (vaultsToExport.length > 1) {
      await downloadZip(vaultsToExport)
    } else {
      const data = vaultsToExport[0]?.data

      if (!data) {
        return false
      }

      await downloadFile(
        {
          filename: vaultsToExport[0]?.filename ?? 'file',
          content: data
        },
        exportType
      )
    }
    return true
  } catch (error) {
    throw error
  }
}

/**
 * Exports vault data as CSV files.
 *
 * @param {any} data - The data to be parsed and exported.
 * @returns {Promise<boolean>} Returns true if the export was successful.
 */
export const handleExportCSVPerVault = async (data) => {
  const vaultsToExport = await parseDataToCsvText(data)
  return handleDownloadVaults(vaultsToExport, 'csv')
}

/**
 * Exports vault data as JSON files.
 *
 * @param {any} data - The data to be parsed and exported.
 * @param {string|null} encryptionPassword - Optional password to encrypt the exported data.
 * @returns {Promise<boolean>} Returns true if the export was successful.
 */
export const handleExportJsonPerVault = async (
  data,
  encryptionPassword = null
) => {
  const vaultsToExport = await parseDataToJson(data)

  const processedVaults = encryptionPassword
    ? await Promise.all(
        vaultsToExport.map(async (vault) => {
          const encryptedData = await encryptExportData(
            vault.data,
            encryptionPassword
          )
          return {
            filename: vault.filename.replace('.json', '.pearpass'),
            data: JSON.stringify(encryptedData, null, 2)
          }
        })
      )
    : vaultsToExport

  return handleDownloadVaults(
    processedVaults,
    encryptionPassword ? 'pearpass' : 'json'
  )
}
