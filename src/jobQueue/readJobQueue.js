import { logger } from '../utils/logger'

/**
 * Reads and decrypts the job queue via the worklet RPC.
 * @param {Object} vaultClient - The PearpassVaultClient instance.
 * @returns {Promise<Array>} Parsed job array, or empty array on failure.
 */
export const readJobQueue = async (vaultClient) => {
  try {
    const jobs = await vaultClient.readJobQueue()
    return jobs || []
  } catch (error) {
    logger.error('[jobQueue] Failed to read job queue:', error)
    return []
  }
}
