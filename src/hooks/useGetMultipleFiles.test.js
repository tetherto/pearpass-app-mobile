import { renderHook, waitFor } from '@testing-library/react-native'
import { vaultGetFile } from 'pearpass-lib-vault'

import { useGetMultipleFiles } from './useGetMultipleFiles'
import { clearAllFileCache } from '../utils/filesCache'
import { logger } from '../utils/logger'

jest.mock('pearpass-lib-vault', () => ({
  vaultGetFile: jest.fn()
}))

jest.mock('../utils/logger', () => ({
  logger: { error: jest.fn() }
}))

const mockSetIsLoading = jest.fn()
jest.mock('../context/LoadingContext', () => ({
  useLoadingContext: () => ({
    setIsLoading: mockSetIsLoading,
    isLoading: false
  })
}))

// Mock requestIdleCallback and cancelIdleCallback
global.requestIdleCallback = (callback) =>
  setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 0)
global.cancelIdleCallback = (id) => clearTimeout(id)

describe('useGetMultipleFiles', () => {
  const mockUpdateValues = jest.fn()
  const initialRecord = {
    id: 'rec-1',
    data: {
      fieldA: [
        { id: 'file-1', name: 'file1.txt' },
        { id: 'file-2', name: 'file2.txt' }
      ],
      fieldB: []
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockSetIsLoading.mockClear()
    clearAllFileCache() // Clear file cache between tests
  })

  it('fetches files for each field and calls updateValues', async () => {
    vaultGetFile
      .mockResolvedValueOnce('buffer1')
      .mockResolvedValueOnce('buffer2')

    await renderHook(() =>
      useGetMultipleFiles({
        fieldNames: ['fieldA', 'fieldB'],
        updateValues: mockUpdateValues,
        initialRecord
      })
    )

    await waitFor(() => {
      expect(vaultGetFile).toHaveBeenCalledTimes(2)
      expect(vaultGetFile).toHaveBeenCalledWith('record/rec-1/file/file-1')
      expect(vaultGetFile).toHaveBeenCalledWith('record/rec-1/file/file-2')

      expect(mockUpdateValues).toHaveBeenCalledWith('fieldA', [
        { id: 'file-1', name: 'file1.txt', base64: 'YnVmZmVyMQ==' },
        { id: 'file-2', name: 'file2.txt', base64: 'YnVmZmVyMg==' }
      ])
      expect(mockUpdateValues).toHaveBeenCalledTimes(1)
    })
  })

  it('does not call updateValues if attachments are empty', async () => {
    await renderHook(() =>
      useGetMultipleFiles({
        fieldNames: ['fieldB'],
        updateValues: mockUpdateValues,
        initialRecord
      })
    )

    await Promise.resolve()

    expect(vaultGetFile).not.toHaveBeenCalled()
    expect(mockUpdateValues).not.toHaveBeenCalled()
  })

  it('logs error if getFile throws', async () => {
    vaultGetFile.mockRejectedValueOnce(new Error('fail'))
    vaultGetFile.mockRejectedValueOnce(new Error('fail2'))

    await renderHook(() =>
      useGetMultipleFiles({
        fieldNames: ['fieldA'],
        updateValues: mockUpdateValues,
        initialRecord
      })
    )

    await waitFor(() => {
      // Promise.allSettled handles rejections per-file, logging each error individually
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error loading file'),
        expect.anything()
      )
    })
  })

  it('does nothing if fieldNames, updateValues, or initialRecord are missing', async () => {
    await renderHook(() =>
      useGetMultipleFiles({
        fieldNames: [],
        updateValues: mockUpdateValues,
        initialRecord
      })
    )
    await renderHook(() =>
      useGetMultipleFiles({
        fieldNames: ['fieldA'],
        updateValues: null,
        initialRecord
      })
    )
    await renderHook(() =>
      useGetMultipleFiles({
        fieldNames: ['fieldA'],
        updateValues: mockUpdateValues,
        initialRecord: null
      })
    )

    await Promise.resolve()

    expect(vaultGetFile).not.toHaveBeenCalled()
    expect(mockUpdateValues).not.toHaveBeenCalled()
  })
})
