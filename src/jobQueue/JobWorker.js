import { JobType } from './constants'
import { handleAddPasskey } from './handlers/addPasskeyHandler'
import { handleUpdatePasskey } from './handlers/updatePasskeyHandler'

/**
 * Dispatches a job to its type-specific handler.
 *
 * @param {Object} job - The job to process.
 * @param {Object} deps - Dependencies for processing.
 * @param {Function} deps.createRecord - Creates a new record in the active vault.
 * @param {Function} deps.getRecord - Fetches a record by ID from the active vault.
 * @param {Function} deps.updateRecord - Updates a record in the active vault.
 * @returns {Promise<void>}
 */
export const processJob = async (
  job,
  { createRecord, getRecord, updateRecord }
) => {
  switch (job.type) {
    case JobType.ADD_PASSKEY:
      await handleAddPasskey(job.payload, { createRecord })
      break

    case JobType.UPDATE_PASSKEY:
      await handleUpdatePasskey(job.payload, { getRecord, updateRecord })
      break

    default:
      throw new Error(`Unknown job type: ${job.type}`)
  }
}
