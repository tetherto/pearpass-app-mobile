import * as FileSystem from 'expo-file-system'

import { handleAddPasskey } from './addPasskeyHandler'
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

describe('handleAddPasskey', () => {
  const mockCreateRecord = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    getAttachmentsFolderPath.mockResolvedValue('file:///attachments')
    // Mock atob for base64 decoding
    global.atob = jest.fn((str) => str)
  })

  afterEach(() => {
    delete global.atob
  })

  it('should throw when payload is missing', async () => {
    await expect(
      handleAddPasskey(null, { createRecord: mockCreateRecord })
    ).rejects.toThrow('ADD_PASSKEY payload is required')
  })

  it('should throw when credentialId is missing', async () => {
    await expect(
      handleAddPasskey(
        { rpId: 'example.com' },
        { createRecord: mockCreateRecord }
      )
    ).rejects.toThrow('ADD_PASSKEY payload missing credentialId')
  })

  it('should throw when rpId is missing', async () => {
    await expect(
      handleAddPasskey(
        { credentialId: 'cred-1' },
        { createRecord: mockCreateRecord }
      )
    ).rejects.toThrow('ADD_PASSKEY payload missing rpId')
  })

  it('should create a record with correct data', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com',
      rpName: 'Example',
      title: 'My Passkey',
      userName: 'user@example.com',
      userDisplayName: 'User',
      clientDataJSON: 'clientDataJSON-data',
      attestationObject: 'attestation-data',
      authenticatorData: 'auth-data',
      publicKey: 'pub-key',
      privateKey: 'priv-key',
      userId: 'user-id',
      algorithm: -7,
      transports: ['internal'],
      createdAt: 1700000000000,
      note: 'Test note',
      websites: ['example.com'],
      folder: 'folder-1'
    }

    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(mockCreateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'login',
        folder: 'folder-1',
        isFavorite: false,
        data: expect.objectContaining({
          title: 'My Passkey',
          username: 'user@example.com',
          password: '',
          passkeyCreatedAt: 1700000000000,
          credential: expect.objectContaining({
            id: 'cred-1',
            rawId: 'cred-1',
            type: 'public-key',
            response: expect.objectContaining({
              clientDataJSON: 'clientDataJSON-data',
              publicKey: 'pub-key',
              publicKeyAlgorithm: -7
            }),
            _privateKeyBuffer: 'priv-key',
            _userId: 'user-id'
          }),
          note: 'Test note',
          websites: ['https://example.com'],
          customFields: [],
          attachments: []
        })
      })
    )
  })

  it('should use rpName as title fallback when title is missing', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com',
      rpName: 'Example Site'
    }

    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(mockCreateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Example Site'
        })
      })
    )
  })

  it('should use rpId as title fallback when title and rpName are missing', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com'
    }

    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(mockCreateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'example.com'
        })
      })
    )
  })

  it('should add https:// prefix to websites', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com',
      websites: ['example.com', 'https://already-prefixed.com']
    }

    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(mockCreateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          websites: ['https://example.com', 'https://already-prefixed.com']
        })
      })
    )
  })

  it('should default websites to rpId when not provided', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com'
    }

    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(mockCreateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          websites: ['https://example.com']
        })
      })
    )
  })

  it('should read and include attachment files', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com',
      attachments: [{ id: 'att-1', name: 'file.txt', relativePath: 'file.txt' }]
    }

    // Mock atob to return a simple string
    global.atob = jest.fn(() => 'decoded-content')
    FileSystem.readAsStringAsync.mockResolvedValue('base64data')
    FileSystem.deleteAsync.mockResolvedValue()
    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      'file:///attachments/file.txt',
      { encoding: 'base64' }
    )
    expect(mockCreateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          attachments: [
            expect.objectContaining({
              name: 'file.txt',
              buffer: expect.any(Uint8Array)
            })
          ]
        })
      })
    )
  })

  it('should clean up attachment files after successful processing', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com',
      attachments: [{ id: 'att-1', name: 'file.txt', relativePath: 'file.txt' }]
    }

    global.atob = jest.fn(() => 'decoded')
    FileSystem.readAsStringAsync.mockResolvedValue('base64data')
    FileSystem.deleteAsync.mockResolvedValue()
    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      'file:///attachments/file.txt',
      { idempotent: true }
    )
  })

  it('should handle attachment read errors gracefully', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com',
      attachments: [
        { id: 'att-1', name: 'good.txt', relativePath: 'good.txt' },
        { id: 'att-2', name: 'bad.txt', relativePath: 'bad.txt' }
      ]
    }

    global.atob = jest.fn(() => 'decoded')
    FileSystem.readAsStringAsync
      .mockResolvedValueOnce('base64data')
      .mockRejectedValueOnce(new Error('File not found'))
    FileSystem.deleteAsync.mockResolvedValue()
    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    // Should still create record with the successful attachment
    expect(mockCreateRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          attachments: [expect.objectContaining({ name: 'good.txt' })]
        })
      })
    )
  })

  it('should use default algorithm -7 when not provided', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com'
    }

    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(mockCreateRecord).toHaveBeenCalledWith(
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

  it('should set folder to null when not provided', async () => {
    const payload = {
      credentialId: 'cred-1',
      rpId: 'example.com'
    }

    mockCreateRecord.mockResolvedValue()

    await handleAddPasskey(payload, { createRecord: mockCreateRecord })

    expect(mockCreateRecord).toHaveBeenCalledWith(
      expect.objectContaining({ folder: null })
    )
  })
})
