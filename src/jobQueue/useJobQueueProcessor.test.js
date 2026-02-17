import { renderHook, act } from '@testing-library/react-native'
import { AppState } from 'react-native'
import { useSelector } from 'react-redux'

import { jobFileExists } from './JobFileReader'
import { processJobQueue } from './processJobQueue'
import { useJobQueueProcessor } from './useJobQueueProcessor'
import { useAutoLockContext } from '../context/AutoLockContext'
import { getLastActivityAt, setLastActivityAt } from '../utils/autoLockStorage'

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}))

jest.mock('pearpass-lib-vault', () => ({
  useCreateRecord: jest.fn(() => ({
    createRecord: jest.fn()
  })),
  useRecords: jest.fn(() => ({
    updateRecords: jest.fn()
  }))
}))

jest.mock('pearpass-lib-vault/src/instances', () => ({
  pearpassVaultClient: {
    activeVaultGet: jest.fn(),
    readJobQueue: jest.fn(),
    writeJobQueue: jest.fn()
  }
}))

jest.mock('pearpass-lib-vault/src/selectors/selectVault', () => ({
  selectVault: jest.fn()
}))

jest.mock('./JobFileReader', () => ({
  jobFileExists: jest.fn()
}))

jest.mock('./processJobQueue', () => ({
  processJobQueue: jest.fn()
}))

jest.mock('../context/AutoLockContext', () => ({
  useAutoLockContext: jest.fn()
}))

jest.mock('../utils/autoLockStorage', () => ({
  getLastActivityAt: jest.fn(),
  setLastActivityAt: jest.fn()
}))

jest.mock('../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('useJobQueueProcessor', () => {
  let mockAppStateListener
  const mockNotifyInteraction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    // Default: vault is active
    useSelector.mockReturnValue({
      data: { id: 'vault-123' },
      isInitialized: true
    })

    useAutoLockContext.mockReturnValue({
      autoLockTimeout: 60000,
      isAutoLockEnabled: true,
      notifyInteraction: mockNotifyInteraction
    })

    jobFileExists.mockResolvedValue(true)
    processJobQueue.mockResolvedValue({
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: []
    })
    getLastActivityAt.mockResolvedValue(Date.now() - 1000)
    setLastActivityAt.mockResolvedValue()

    // Capture AppState listener
    jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation((event, handler) => {
        mockAppStateListener = handler
        return { remove: jest.fn() }
      })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should trigger processing on mount when vault is active', async () => {
    renderHook(() => useJobQueueProcessor())

    // Advance past POST_RESUME_DELAY_MS (500ms)
    await act(async () => {
      jest.advanceTimersByTime(600)
      await Promise.resolve()
    })

    expect(setLastActivityAt).toHaveBeenCalled()
    expect(mockNotifyInteraction).toHaveBeenCalled()
  })

  it('should not trigger processing when vault is not active', async () => {
    useSelector.mockReturnValue({
      data: null,
      isInitialized: false
    })

    renderHook(() => useJobQueueProcessor())

    await act(async () => {
      jest.advanceTimersByTime(600)
      await Promise.resolve()
    })

    expect(setLastActivityAt).not.toHaveBeenCalled()
  })

  it('should register AppState listener', () => {
    renderHook(() => useJobQueueProcessor())

    expect(AppState.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    )
  })

  it('should process jobs on app resume', async () => {
    renderHook(() => useJobQueueProcessor())

    // Simulate app coming to foreground
    await act(async () => {
      mockAppStateListener('active')
      jest.advanceTimersByTime(600)
      await Promise.resolve()
    })

    expect(setLastActivityAt).toHaveBeenCalled()
  })

  it('should not process on app state change to background', async () => {
    renderHook(() => useJobQueueProcessor())

    // Clear initial mount calls
    jest.clearAllMocks()
    setLastActivityAt.mockResolvedValue()

    await act(async () => {
      mockAppStateListener('background')
      jest.advanceTimersByTime(600)
      await Promise.resolve()
    })

    // setLastActivityAt should not be called for background transition
    expect(setLastActivityAt).not.toHaveBeenCalled()
  })

  it('should skip processing when no job file exists', async () => {
    jobFileExists.mockResolvedValue(false)

    renderHook(() => useJobQueueProcessor())

    await act(async () => {
      jest.advanceTimersByTime(600)
      await Promise.resolve()
    })

    expect(processJobQueue).not.toHaveBeenCalled()
  })

  it('should skip processing when auto-lock is imminent', async () => {
    // Set last activity far in the past so remaining time < SAFETY_THRESHOLD_MS
    getLastActivityAt.mockResolvedValue(Date.now() - 59500)
    useAutoLockContext.mockReturnValue({
      autoLockTimeout: 60000,
      isAutoLockEnabled: true,
      notifyInteraction: mockNotifyInteraction
    })

    renderHook(() => useJobQueueProcessor())

    await act(async () => {
      jest.advanceTimersByTime(600)
      await Promise.resolve()
    })

    expect(processJobQueue).not.toHaveBeenCalled()
  })

  it('should clean up AppState listener on unmount', () => {
    const mockRemove = jest.fn()
    AppState.addEventListener.mockReturnValue({ remove: mockRemove })

    const { unmount } = renderHook(() => useJobQueueProcessor())

    unmount()

    expect(mockRemove).toHaveBeenCalled()
  })
})
