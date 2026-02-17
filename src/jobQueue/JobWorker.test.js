import { handleAddPasskey } from './handlers/addPasskeyHandler'
import { handleUpdatePasskey } from './handlers/updatePasskeyHandler'
import { processJob } from './JobWorker'

jest.mock('./handlers/addPasskeyHandler', () => ({
  handleAddPasskey: jest.fn()
}))

jest.mock('./handlers/updatePasskeyHandler', () => ({
  handleUpdatePasskey: jest.fn()
}))

describe('JobWorker', () => {
  const mockDeps = {
    createRecord: jest.fn(),
    getRecord: jest.fn(),
    updateRecord: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should dispatch ADD_PASSKEY jobs to handleAddPasskey', async () => {
    const job = { type: 'ADD_PASSKEY', payload: { credentialId: 'cred-1' } }
    handleAddPasskey.mockResolvedValue()

    await processJob(job, mockDeps)

    expect(handleAddPasskey).toHaveBeenCalledWith(job.payload, {
      createRecord: mockDeps.createRecord
    })
    expect(handleUpdatePasskey).not.toHaveBeenCalled()
  })

  it('should dispatch UPDATE_PASSKEY jobs to handleUpdatePasskey', async () => {
    const job = {
      type: 'UPDATE_PASSKEY',
      payload: { existingRecordId: 'rec-1' }
    }
    handleUpdatePasskey.mockResolvedValue()

    await processJob(job, mockDeps)

    expect(handleUpdatePasskey).toHaveBeenCalledWith(job.payload, {
      getRecord: mockDeps.getRecord,
      updateRecord: mockDeps.updateRecord
    })
    expect(handleAddPasskey).not.toHaveBeenCalled()
  })

  it('should throw error for unknown job type', async () => {
    const job = { type: 'UNKNOWN_TYPE', payload: {} }

    await expect(processJob(job, mockDeps)).rejects.toThrow(
      'Unknown job type: UNKNOWN_TYPE'
    )
  })

  it('should propagate handler errors', async () => {
    const job = { type: 'ADD_PASSKEY', payload: { credentialId: 'cred-1' } }
    handleAddPasskey.mockRejectedValue(new Error('Handler failed'))

    await expect(processJob(job, mockDeps)).rejects.toThrow('Handler failed')
  })
})
