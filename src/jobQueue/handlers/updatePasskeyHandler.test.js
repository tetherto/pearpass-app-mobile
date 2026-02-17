import * as FileSystem from 'expo-file-system'

import { handleUpdatePasskey } from './updatePasskeyHandler'
import { getAttachmentsFolderPath } from '../JobFileReader'

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64'
  }
}))

jest.mock('../JobFileReader', () => ({
  getAttachmentsFolderPath: jest.fn()
}))

jest.mock('../../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    log: jest.fn()
  }
}))

describe('handleUpdatePasskey', () => {
  const mockGetRecord = jest.fn()
  const mockUpdateRecord = jest.fn()
  const deps = { getRecord: mockGetRecord, updateRecord: mockUpdateRecord }

  const existingRecord = {
    data: {
      title: 'Existing Record',
      username: 'user@example.com',
      password: 'secret',
      note: 'old note',
      websites: ['https://example.com'],
      attachments: [
        {
          id: 'existing-att-1',
          name: 'old-file.txt',
          buffer: new Uint8Array([1])
        }
      ]
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    getAttachmentsFolderPath.mockResolvedValue('file:///attachments')
    mockGetRecord.mockResolvedValue({
      ...existingRecord,
      data: { ...existingRecord.data }
    })
    mockUpdateRecord.mockResolvedValue()
    global.atob = jest.fn((str) => str)
  })

  afterEach(() => {
    delete global.atob
  })

  it('should throw when payload is missing', async () => {
    await expect(handleUpdatePasskey(null, deps)).rejects.toThrow(
      'UPDATE_PASSKEY payload is required'
    )
  })

  it('should throw when existingRecordId is missing', async () => {
    await expect(
      handleUpdatePasskey({ credentialId: 'cred-1' }, deps)
    ).rejects.toThrow('UPDATE_PASSKEY payload missing existingRecordId')
  })

  it('should throw when credentialId is missing', async () => {
    await expect(
      handleUpdatePasskey({ existingRecordId: 'rec-1' }, deps)
    ).rejects.toThrow('UPDATE_PASSKEY payload missing credentialId')
  })

  it('should throw when existing record not found', async () => {
    mockGetRecord.mockResolvedValue(null)

    await expect(
      handleUpdatePasskey(
        { existingRecordId: 'rec-1', credentialId: 'cred-1' },
        deps
      )
    ).rejects.toThrow('Record rec-1 not found')
  })

  it('should update record with new credential', async () => {
    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred',
      publicKey: 'new-pub-key',
      privateKey: 'new-priv-key',
      clientDataJSON: 'new-client-data',
      attestationObject: 'new-attestation',
      authenticatorData: 'new-auth-data',
      userId: 'user-123',
      algorithm: -7,
      createdAt: 1700000000000,
      transports: ['internal']
    }

    await handleUpdatePasskey(payload, deps)

    expect(mockGetRecord).toHaveBeenCalledWith('rec-1')
    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          credential: expect.objectContaining({
            id: 'new-cred',
            rawId: 'new-cred',
            type: 'public-key',
            response: expect.objectContaining({
              publicKey: 'new-pub-key',
              publicKeyAlgorithm: -7
            }),
            _privateKeyBuffer: 'new-priv-key',
            _userId: 'user-123'
          }),
          passkeyCreatedAt: 1700000000000
        })
      })
    )
  })

  it('should preserve existing record data fields', async () => {
    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred',
      createdAt: 1700000000000
    }

    await handleUpdatePasskey(payload, deps)

    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Existing Record',
          username: 'user@example.com',
          password: 'secret',
          websites: ['https://example.com']
        })
      })
    )
  })

  it('should update note when provided in payload', async () => {
    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred',
      note: 'updated note'
    }

    await handleUpdatePasskey(payload, deps)

    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          note: 'updated note'
        })
      })
    )
  })

  it('should not update note when not provided in payload', async () => {
    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred'
    }

    await handleUpdatePasskey(payload, deps)

    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          note: 'old note'
        })
      })
    )
  })

  it('should keep only specified existing attachments', async () => {
    const record = {
      data: {
        ...existingRecord.data,
        attachments: [
          { id: 'att-1', name: 'keep.txt' },
          { id: 'att-2', name: 'remove.txt' }
        ]
      }
    }
    mockGetRecord.mockResolvedValue(record)

    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred',
      keepAttachmentIds: ['att-1']
    }

    await handleUpdatePasskey(payload, deps)

    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          attachments: [
            expect.objectContaining({ id: 'att-1', name: 'keep.txt' })
          ]
        })
      })
    )
  })

  it('should match keepAttachmentIds by name when id is not present', async () => {
    const record = {
      data: {
        ...existingRecord.data,
        attachments: [{ name: 'keep-by-name.txt' }, { name: 'remove.txt' }]
      }
    }
    mockGetRecord.mockResolvedValue(record)

    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred',
      keepAttachmentIds: ['keep-by-name.txt']
    }

    await handleUpdatePasskey(payload, deps)

    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          attachments: [expect.objectContaining({ name: 'keep-by-name.txt' })]
        })
      })
    )
  })

  it('should add new attachments from job files', async () => {
    mockGetRecord.mockResolvedValue({
      data: { ...existingRecord.data, attachments: [] }
    })

    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred',
      attachments: [
        { id: 'new-att', name: 'new-file.txt', relativePath: 'new-file.txt' }
      ]
    }

    global.atob = jest.fn(() => 'decoded')
    FileSystem.readAsStringAsync.mockResolvedValue('base64data')
    FileSystem.deleteAsync.mockResolvedValue()

    await handleUpdatePasskey(payload, deps)

    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      'file:///attachments/new-file.txt',
      { encoding: 'base64' }
    )
    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          attachments: [expect.objectContaining({ name: 'new-file.txt' })]
        })
      })
    )
  })

  it('should clean up attachment files after processing', async () => {
    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred',
      attachments: [{ id: 'att-1', name: 'file.txt', relativePath: 'file.txt' }]
    }

    global.atob = jest.fn(() => 'decoded')
    FileSystem.readAsStringAsync.mockResolvedValue('base64data')
    FileSystem.deleteAsync.mockResolvedValue()

    await handleUpdatePasskey(payload, deps)

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      'file:///attachments/file.txt',
      { idempotent: true }
    )
  })

  it('should use default algorithm -7 when not provided', async () => {
    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred'
    }

    await handleUpdatePasskey(payload, deps)

    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          credential: expect.objectContaining({
            response: expect.objectContaining({
              publicKeyAlgorithm: -7
            })
          })
        })
      })
    )
  })

  it('should use Date.now() when createdAt not provided', async () => {
    const now = 1700000000000
    jest.spyOn(Date, 'now').mockReturnValue(now)

    const payload = {
      existingRecordId: 'rec-1',
      credentialId: 'new-cred'
    }

    await handleUpdatePasskey(payload, deps)

    expect(mockUpdateRecord).toHaveBeenCalledWith(
      'rec-1',
      expect.objectContaining({
        data: expect.objectContaining({
          passkeyCreatedAt: now
        })
      })
    )

    jest.spyOn(Date, 'now').mockRestore()
  })
})
