import * as FileSystem from 'expo-file-system'

import { logger } from '../../utils/logger'
import { getAttachmentsFolderPath } from '../JobFileReader'

/**
 * Ensures a website URL has an https:// prefix.
 * @param {string[]} urls
 * @returns {string[]}
 */
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
 * Handles ADD_PASSKEY jobs.
 *
 * @param {Object} payload - The AddPasskeyPayload from the job.
 * @param {Object} deps
 * @param {Function} deps.createRecord - Creates a new record in the active vault.
 * @returns {Promise<void>}
 */
export const handleAddPasskey = async (payload, { createRecord }) => {
  if (!payload) {
    throw new Error('ADD_PASSKEY payload is required')
  }

  if (!payload.credentialId) {
    throw new Error('ADD_PASSKEY payload missing credentialId')
  }

  if (!payload.rpId) {
    throw new Error('ADD_PASSKEY payload missing rpId')
  }

  const processedAttachments = await readAttachmentFiles(
    payload.attachments || []
  )

  const recordData = {
    type: 'login',
    folder: payload.folder || null,
    isFavorite: false,
    data: {
      title: payload.title || payload.rpName || payload.rpId,
      username: payload.userName || payload.userDisplayName || '',
      password: '',
      passwordUpdatedAt: Date.now(),
      passkeyCreatedAt: payload.createdAt || Date.now(),
      credential: {
        id: payload.credentialId,
        rawId: payload.credentialId,
        type: 'public-key',
        authenticatorAttachment: 'platform',
        clientExtensionResults: {
          credProps: { rk: true }
        },
        response: {
          clientDataJSON: payload.clientDataJSON,
          attestationObject: payload.attestationObject,
          authenticatorData: payload.authenticatorData,
          publicKey: payload.publicKey,
          publicKeyAlgorithm: payload.algorithm || -7,
          transports: payload.transports || ['internal']
        },
        _privateKeyBuffer: payload.privateKey,
        _userId: payload.userId
      },
      note: payload.note || '',
      websites: formatWebsites(payload.websites || [`https://${payload.rpId}`]),
      customFields: [],
      attachments: processedAttachments
    }
  }

  await createRecord(recordData)

  await cleanupJobAttachments(payload.attachments || [])
}
