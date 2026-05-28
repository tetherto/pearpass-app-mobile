import * as FileSystem from 'expo-file-system'

import { logger } from '../../utils/logger'
import { getAttachmentsFolderPath } from '../JobFileReader'

const formatWebsites = (urls) =>
  urls
    .filter((w) => w && w.trim())
    .map((w) => {
      const lower = w.toLowerCase()
      if (lower.startsWith('http://') || lower.startsWith('https://')) {
        return lower
      }
      return `https://${lower}`
    })

/**
 * Reads attachment files from pearpass_jobs/attachments/ and converts to { name, buffer }.
 * @param {Array} attachments - Array of { id, name, relativePath } from job payload.
 * @returns {Promise<Array<{ name: string, buffer: Uint8Array }>>}
 */
const readAttachmentFiles = async (attachments) => {
  if (!attachments || attachments.length === 0) {
    return []
  }

  const attachmentsFolder = await getAttachmentsFolderPath()
  const processedAttachments = []

  for (const attachment of attachments) {
    const { name, relativePath } = attachment
    const filePath = `${attachmentsFolder}/${relativePath}`

    try {
      const base64Content = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64
      })

      const binaryString = atob(base64Content)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      processedAttachments.push({ name, buffer: bytes })
    } catch (error) {
      logger.error(
        `[jobQueue] Failed to read attachment ${relativePath}:`,
        error
      )
    }
  }

  return processedAttachments
}

/**
 * Cleans up attachment files for a single job after successful processing.
 * @param {Array} attachments - Array of { id, name, relativePath } from job payload.
 * @returns {Promise<void>}
 */
const cleanupJobAttachments = async (attachments) => {
  if (!attachments || attachments.length === 0) {
    return
  }

  const attachmentsFolder = await getAttachmentsFolderPath()

  for (const attachment of attachments) {
    const filePath = `${attachmentsFolder}/${attachment.relativePath}`
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true })
    } catch (error) {
      logger.error(
        `[jobQueue] Failed to clean up attachment ${attachment.relativePath}:`,
        error
      )
    }
  }
}

/**
 * Handles UPDATE_PASSKEY jobs.
 * Reads the existing record, merges the new passkey credential, and updates it.
 * Preserves existing attachments listed in keepAttachmentIds and adds new ones.
 *
 * @param {Object} payload - The UpdatePasskeyPayload from the job.
 * @param {Object} deps
 * @param {Function} deps.getRecord - Fetches a record by ID from the active vault.
 * @param {Function} deps.updateRecord - Updates a record in the active vault.
 * @returns {Promise<void>}
 */
export const handleUpdatePasskey = async (
  payload,
  { getRecord, updateRecord }
) => {
  if (!payload) {
    throw new Error('UPDATE_PASSKEY payload is required')
  }

  if (!payload.existingRecordId) {
    throw new Error('UPDATE_PASSKEY payload missing existingRecordId')
  }

  if (!payload.credentialId) {
    throw new Error('UPDATE_PASSKEY payload missing credentialId')
  }

  const {
    existingRecordId,
    userId,
    credentialId,
    publicKey,
    privateKey,
    clientDataJSON,
    attestationObject,
    authenticatorData,
    algorithm,
    createdAt,
    transports,
    title,
    username,
    websites,
    folder,
    note,
    keepAttachmentIds,
    attachments: jobAttachments
  } = payload

  const existingRecord = await getRecord(existingRecordId)
  if (!existingRecord) {
    throw new Error(`Record ${existingRecordId} not found`)
  }

  const credential = {
    id: credentialId,
    rawId: credentialId,
    type: 'public-key',
    authenticatorAttachment: 'platform',
    clientExtensionResults: { credProps: { rk: true } },
    response: {
      clientDataJSON,
      attestationObject,
      authenticatorData,
      publicKey,
      publicKeyAlgorithm: algorithm || -7,
      transports: transports || ['internal']
    },
    _privateKeyBuffer: privateKey,
    _userId: userId
  }

  // Filter existing attachments to only keep the ones the user didn't remove
  const idsToKeep = keepAttachmentIds || []
  const existingAttachments = existingRecord.data?.attachments || []
  const keptAttachments = existingAttachments.filter((a) =>
    idsToKeep.includes(a.id || a.name)
  )

  // Read new attachment files from disk
  const newAttachments = await readAttachmentFiles(jobAttachments || [])

  const updatedData = {
    ...existingRecord.data,
    credential,
    passkeyCreatedAt: createdAt || Date.now(),
    ...(title !== undefined && title !== null && title !== '' && { title }),
    ...(username !== undefined && { username: username ?? '' }),
    ...(websites !== undefined && { websites: formatWebsites(websites || []) }),
    ...(note !== undefined && { note: note ?? '' }),
    attachments: [...keptAttachments, ...newAttachments]
  }

  const updates = { data: updatedData }
  if (folder !== undefined) {
    updates.folder = folder
  }

  await updateRecord(existingRecordId, updates)

  await cleanupJobAttachments(jobAttachments || [])
}
