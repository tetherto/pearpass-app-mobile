import { deleteAttachmentsFolder, deleteJobFile } from './JobFileReader'
import { processJob } from './JobWorker'
import { processJobQueue } from './processJobQueue'
import { acquireDbWriteGuard, releaseDbWriteGuard } from '../utils/dbGuard'

jest.mock('./JobWorker', () => ({
  processJob: jest.fn()
}))

jest.mock('./JobFileReader', () => ({
  deleteJobFile: jest.fn(),
  deleteAttachmentsFolder: jest.fn()
}))

jest.mock('../utils/dbGuard', () => ({
  acquireDbWriteGuard: jest.fn(),
  releaseDbWriteGuard: jest.fn()
}))

jest.mock('../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('processJobQueue', () => {
  const mockCreateRecord = jest.fn()
  const mockGetRecord = jest.fn()
  const mockUpdateRecord = jest.fn()
  const activeVaultId = 'vault-123'
  let mockVaultClient

  const makeParams = (overrides = {}) => ({
    createRecord: mockCreateRecord,
    getRecord: mockGetRecord,
    updateRecord: mockUpdateRecord,
    activeVaultId,
    vaultClient: mockVaultClient,
    ...overrides
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockVaultClient = {
      readJobQueue: jest.fn(),
      writeJobQueue: jest.fn()
    }
    acquireDbWriteGuard.mockReturnValue(true)
  })

  it('should return empty result when DB write guard not acquired', async () => {
    acquireDbWriteGuard.mockReturnValue(false)

    const result = await processJobQueue(makeParams())

    expect(result).toEqual({
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: []
    })
    expect(mockVaultClient.readJobQueue).not.toHaveBeenCalled()
  })

  it('should return empty result when readJobQueue fails', async () => {
    mockVaultClient.readJobQueue.mockRejectedValue(new Error('Read failed'))

    const result = await processJobQueue(makeParams())

    expect(result).toEqual({
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: []
    })
    expect(releaseDbWriteGuard).toHaveBeenCalled()
  })

  it('should return empty result when no jobs exist', async () => {
    mockVaultClient.readJobQueue.mockResolvedValue([])

    const result = await processJobQueue(makeParams())

    expect(result).toEqual({
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: []
    })
  })

  it('should return empty result when jobs is null', async () => {
    mockVaultClient.readJobQueue.mockResolvedValue(null)

    const result = await processJobQueue(makeParams())

    expect(result).toEqual({
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: []
    })
  })

  it('should process pending jobs matching active vault', async () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'ADD_PASSKEY',
        status: 'PENDING',
        vaultId: 'vault-123',
        payload: {}
      }
    ]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)
    processJob.mockResolvedValue()

    const result = await processJobQueue(makeParams())

    expect(result.processed).toBe(1)
    expect(result.succeeded).toBe(1)
    expect(result.failed).toBe(0)
    expect(processJob).toHaveBeenCalledWith(jobs[0], {
      createRecord: mockCreateRecord,
      getRecord: mockGetRecord,
      updateRecord: mockUpdateRecord
    })
  })

  it('should skip jobs for different vault', async () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'ADD_PASSKEY',
        status: 'PENDING',
        vaultId: 'other-vault',
        payload: {}
      }
    ]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)

    const result = await processJobQueue(makeParams())

    expect(result.processed).toBe(0)
    expect(processJob).not.toHaveBeenCalled()
  })

  it('should skip non-pending jobs', async () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'ADD_PASSKEY',
        status: 'COMPLETED',
        vaultId: 'vault-123',
        payload: {}
      }
    ]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)

    const result = await processJobQueue(makeParams())

    expect(result.processed).toBe(0)
    expect(processJob).not.toHaveBeenCalled()
  })

  it('should handle job processing failure with retry', async () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'ADD_PASSKEY',
        status: 'PENDING',
        vaultId: 'vault-123',
        payload: {},
        retryCount: 0
      }
    ]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)
    processJob.mockRejectedValue(new Error('Processing failed'))

    const result = await processJobQueue(makeParams())

    expect(result.processed).toBe(1)
    expect(result.failed).toBe(1)
    expect(result.errors).toEqual([
      { jobId: 'job-1', error: 'Processing failed' }
    ])
    // Job should remain PENDING for retry (retryCount 1 < maxRetries 3)
    expect(jobs[0].status).toBe('PENDING')
    expect(jobs[0].retryCount).toBe(1)
  })

  it('should mark job as FAILED when max retries exceeded', async () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'ADD_PASSKEY',
        status: 'PENDING',
        vaultId: 'vault-123',
        payload: {},
        retryCount: 2,
        maxRetries: 3
      }
    ]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)
    processJob.mockRejectedValue(new Error('Still failing'))

    await processJobQueue(makeParams())

    expect(jobs[0].status).toBe('FAILED')
    expect(jobs[0].retryCount).toBe(3)
  })

  it('should delete job file and attachments when all jobs completed', async () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'ADD_PASSKEY',
        status: 'PENDING',
        vaultId: 'vault-123',
        payload: {}
      }
    ]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)
    processJob.mockResolvedValue()

    await processJobQueue(makeParams())

    expect(deleteJobFile).toHaveBeenCalled()
    expect(deleteAttachmentsFolder).toHaveBeenCalled()
  })

  it('should write remaining jobs when some are not completed', async () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'ADD_PASSKEY',
        status: 'PENDING',
        vaultId: 'vault-123',
        payload: {}
      },
      {
        id: 'job-2',
        type: 'ADD_PASSKEY',
        status: 'PENDING',
        vaultId: 'other-vault',
        payload: {}
      }
    ]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)
    processJob.mockResolvedValue()

    await processJobQueue(makeParams())

    // job-2 is still PENDING (different vault), so writeJobQueue should be called
    expect(deleteJobFile).not.toHaveBeenCalled()
    expect(mockVaultClient.writeJobQueue).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'job-2' })])
    )
  })

  it('should always release DB write guard even on error', async () => {
    mockVaultClient.readJobQueue.mockRejectedValue(new Error('Unexpected'))

    await processJobQueue(makeParams())

    expect(releaseDbWriteGuard).toHaveBeenCalled()
  })

  it('should process multiple pending jobs', async () => {
    const jobs = [
      {
        id: 'job-1',
        type: 'ADD_PASSKEY',
        status: 'PENDING',
        vaultId: 'vault-123',
        payload: {}
      },
      {
        id: 'job-2',
        type: 'UPDATE_PASSKEY',
        status: 'PENDING',
        vaultId: 'vault-123',
        payload: {}
      }
    ]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)
    processJob.mockResolvedValue()

    const result = await processJobQueue(makeParams())

    expect(result.processed).toBe(2)
    expect(result.succeeded).toBe(2)
    expect(processJob).toHaveBeenCalledTimes(2)
  })
})
