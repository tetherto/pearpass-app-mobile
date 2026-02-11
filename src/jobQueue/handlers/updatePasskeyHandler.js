/**
 * Handles UPDATE_PASSKEY jobs.
 * Reads the existing record, merges the new passkey credential, and updates it.
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
    transports
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

  const updatedData = {
    ...existingRecord.data,
    credential,
    passkeyCreatedAt: createdAt || Date.now()
  }

  await updateRecord(existingRecordId, { data: updatedData })
}
