import { readJobQueue } from './readJobQueue'

jest.mock('../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    log: jest.fn()
  }
}))

describe('readJobQueue', () => {
  let mockVaultClient

  beforeEach(() => {
    jest.clearAllMocks()
    mockVaultClient = {
      readJobQueue: jest.fn()
    }
  })

  it('should return jobs from vaultClient', async () => {
    const jobs = [{ id: '1', type: 'ADD_PASSKEY' }]
    mockVaultClient.readJobQueue.mockResolvedValue(jobs)

    const result = await readJobQueue(mockVaultClient)

    expect(mockVaultClient.readJobQueue).toHaveBeenCalled()
    expect(result).toEqual(jobs)
  })

  it('should return empty array when vaultClient returns null', async () => {
    mockVaultClient.readJobQueue.mockResolvedValue(null)

    const result = await readJobQueue(mockVaultClient)

    expect(result).toEqual([])
  })

  it('should return empty array when vaultClient returns undefined', async () => {
    mockVaultClient.readJobQueue.mockResolvedValue(undefined)

    const result = await readJobQueue(mockVaultClient)

    expect(result).toEqual([])
  })

  it('should return empty array and log error on failure', async () => {
    const { logger } = require('../utils/logger')
    mockVaultClient.readJobQueue.mockRejectedValue(new Error('RPC failed'))

    const result = await readJobQueue(mockVaultClient)

    expect(result).toEqual([])
    expect(logger.error).toHaveBeenCalledWith(
      '[jobQueue] Failed to read job queue:',
      expect.any(Error)
    )
  })
})
