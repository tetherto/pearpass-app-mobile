import { useNavigation } from '@react-navigation/native'
import { render, act, cleanup } from '@testing-library/react-native'
import { closeAllInstances, useUserData, useVaults } from 'pearpass-lib-vault'
import { AppState, View } from 'react-native'

import { AutoLockHandler } from './index'
import { NAVIGATION_ROUTES } from '../../constants/navigation'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useModal } from '../../context/ModalContext'
import {
  getLastActivityAt,
  setLastActivityAt
} from '../../utils/autoLockStorage'
import { clearAllFileCache } from '../../utils/filesCache'

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}))
jest.mock('pearpass-lib-vault', () => ({
  useVaults: jest.fn(),
  closeAllInstances: jest.fn(),
  useUserData: jest.fn()
}))
jest.mock('../../context/AutoLockContext', () => ({
  useAutoLockContext: jest.fn()
}))
jest.mock('../../context/BottomSheetContext', () => ({
  useBottomSheet: jest.fn()
}))
jest.mock('../../context/ModalContext', () => ({
  useModal: jest.fn()
}))
jest.mock('../../utils/autoLockStorage', () => ({
  getLastActivityAt: jest.fn(),
  setLastActivityAt: jest.fn()
}))
jest.mock('../../utils/filesCache', () => ({
  clearAllFileCache: jest.fn()
}))
const flushPromises = () => new Promise((resolve) => setImmediate(resolve))

describe('AutoLockHandler', () => {
  const resetStateMock = jest.fn()
  const collapseMock = jest.fn()
  const closeModalMock = jest.fn()
  const refetchMock = jest.fn()
  const resetMock = jest.fn()
  const removeListenerMock = jest.fn()
  let currentRouteName = 'Home'
  let contextValue = {
    shouldBypassAutoLock: false,
    autoLockTimeout: 5000,
    isAutoLockEnabled: true
  }

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout').mockImplementation(() => 0)
    jest.spyOn(global, 'clearTimeout').mockImplementation(() => {})

    currentRouteName = 'Home'
    contextValue = {
      shouldBypassAutoLock: false,
      autoLockTimeout: 5000,
      isAutoLockEnabled: true
    }

    useVaults.mockReturnValue({ resetState: resetStateMock })
    useBottomSheet.mockReturnValue({ collapse: collapseMock })
    useModal.mockReturnValue({ closeModal: closeModalMock })
    useUserData.mockReturnValue({ refetch: refetchMock })
    useNavigation.mockReturnValue({
      getState: jest.fn(() => ({
        index: 0,
        routes: [{ name: currentRouteName }]
      })),
      reset: resetMock
    })
    useAutoLockContext.mockImplementation(() => contextValue)

    refetchMock.mockResolvedValue({ hasPasswordSet: true })
    getLastActivityAt.mockResolvedValue(null)
    setLastActivityAt.mockResolvedValue()

    Object.defineProperty(AppState, 'currentState', {
      value: 'active',
      writable: true
    })
    if (!AppState.addEventListener) {
      AppState.addEventListener = jest.fn()
    }
    jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation(() => ({ remove: removeListenerMock }))
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('schedules a timer from the last activity timestamp', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(10000)
    getLastActivityAt.mockResolvedValue(null)

    render(
      <AutoLockHandler>
        <View />
      </AutoLockHandler>
    )

    await act(async () => {
      await flushPromises()
    })

    expect(setLastActivityAt).toHaveBeenCalledWith(10000)
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000)
  })

  it('locks when remaining time is exhausted', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(10000)
    getLastActivityAt.mockResolvedValue(0)

    render(
      <AutoLockHandler>
        <View />
      </AutoLockHandler>
    )

    await act(async () => {
      await flushPromises()
    })

    expect(closeAllInstances).toHaveBeenCalled()
    expect(clearAllFileCache).toHaveBeenCalled()
    expect(resetMock).toHaveBeenCalledWith({
      index: 0,
      routes: [
        {
          name: 'Welcome',
          params: { state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD }
        }
      ]
    })
    expect(resetStateMock).toHaveBeenCalled()
  })

  it('does not lock when already on Welcome', async () => {
    currentRouteName = 'Welcome'
    jest.spyOn(Date, 'now').mockReturnValue(10000)
    getLastActivityAt.mockResolvedValue(0)

    render(
      <AutoLockHandler>
        <View />
      </AutoLockHandler>
    )

    await act(async () => {
      await flushPromises()
    })

    expect(resetMock).not.toHaveBeenCalled()
    expect(closeAllInstances).not.toHaveBeenCalled()
  })

  it('resets inactivity when auto-lock timeout changes', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(20000)

    const { rerender } = render(
      <AutoLockHandler>
        <View />
      </AutoLockHandler>
    )

    contextValue = {
      shouldBypassAutoLock: false,
      autoLockTimeout: 10000,
      isAutoLockEnabled: true
    }

    rerender(
      <AutoLockHandler>
        <View />
      </AutoLockHandler>
    )

    await act(async () => {
      await flushPromises()
    })

    expect(setLastActivityAt).toHaveBeenCalledWith(20000)
  })

  it('records interaction and reschedules the timer', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(30000)
    const { UNSAFE_getByType } = render(
      <AutoLockHandler>
        <View />
      </AutoLockHandler>
    )

    const handlerView = UNSAFE_getByType(View)

    act(() => {
      handlerView.props.onStartShouldSetResponderCapture()
    })

    await act(async () => {
      await flushPromises()
    })

    expect(setLastActivityAt).toHaveBeenCalledWith(30000)
    expect(setTimeout).toHaveBeenCalled()
  })
})
