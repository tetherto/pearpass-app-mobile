import { renderHook, act } from '@testing-library/react-native'
import { AppState } from 'react-native'

import { useAutoLockWatcher } from './useAutoLockWatcher'

const { useNavigation } = require('@react-navigation/native')
const {
  closeAllInstances,
  useUserData,
  useVaults
} = require('pearpass-lib-vault')

const { useRouteHelper } = require('./useRouteHelper')
const { useAutoLockContext } = require('../../../context/AutoLockContext')
const { useBottomSheet } = require('../../../context/BottomSheetContext')
const { useModal } = require('../../../context/ModalContext')
const {
  getLastActivityAt,
  setLastActivityAt
} = require('../../../utils/autoLockStorage')
const { clearAllFileCache } = require('../../../utils/filesCache')

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}))
jest.mock('pearpass-lib-vault', () => ({
  useUserData: jest.fn(),
  useVaults: jest.fn(),
  closeAllInstances: jest.fn()
}))
jest.mock('../../../context/AutoLockContext', () => ({
  useAutoLockContext: jest.fn()
}))
jest.mock('../../../context/BottomSheetContext', () => ({
  useBottomSheet: jest.fn()
}))
jest.mock('../../../context/ModalContext', () => ({
  useModal: jest.fn()
}))
jest.mock('./useRouteHelper', () => ({
  useRouteHelper: jest.fn()
}))
jest.mock('../../../utils/autoLockStorage', () => ({
  getLastActivityAt: jest.fn(),
  setLastActivityAt: jest.fn()
}))
jest.mock('../../../utils/filesCache', () => ({
  clearAllFileCache: jest.fn()
}))

describe('useAutoLockWatcher', () => {
  const addListenerRemoveMock = jest.fn()
  const resetMock = jest.fn()
  const resetStateMock = jest.fn()
  const collapseMock = jest.fn()
  const closeModalMock = jest.fn()
  const refetchMock = jest.fn()
  const registerInteractionListenerMock = jest.fn()
  const getCurrentRouteMock = jest.fn()
  const isMasterPasswordScreenMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    Object.defineProperty(AppState, 'currentState', {
      value: 'active',
      writable: true
    })
    if (!AppState.addEventListener) {
      AppState.addEventListener = jest.fn()
    }
    jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation(() => ({ remove: addListenerRemoveMock }))

    useNavigation.mockReturnValue({
      reset: resetMock
    })
    useVaults.mockReturnValue({ resetState: resetStateMock })
    useBottomSheet.mockReturnValue({ collapse: collapseMock })
    useModal.mockReturnValue({ closeModal: closeModalMock })
    useUserData.mockReturnValue({
      refetch: refetchMock,
      hasPasswordSet: true
    })
    useAutoLockContext.mockReturnValue({
      shouldBypassAutoLock: false,
      autoLockTimeout: 5000,
      isAutoLockEnabled: true,
      registerInteractionListener: registerInteractionListenerMock
    })
    useRouteHelper.mockReturnValue({
      getCurrentRoute: getCurrentRouteMock,
      isMasterPasswordScreen: isMasterPasswordScreenMock
    })

    getCurrentRouteMock.mockReturnValue({ name: 'MainTabNavigator' })
    isMasterPasswordScreenMock.mockReturnValue(false)
    getLastActivityAt.mockResolvedValue(0)
    setLastActivityAt.mockResolvedValue()
    refetchMock.mockResolvedValue({ hasPasswordSet: true })

    jest.spyOn(global, 'setTimeout').mockImplementation(() => 0)
    jest.spyOn(global, 'clearTimeout').mockImplementation(() => {})
  })

  it('registers interaction listener when auto-lock is active', () => {
    const { unmount } = renderHook(() => useAutoLockWatcher())

    expect(registerInteractionListenerMock).toHaveBeenCalledWith(
      expect.any(Function)
    )

    unmount()

    expect(registerInteractionListenerMock).toHaveBeenCalledWith(null)
  })

  it('does not register interaction listener when auto-lock is inactive', () => {
    useAutoLockContext.mockReturnValue({
      shouldBypassAutoLock: true,
      autoLockTimeout: 5000,
      isAutoLockEnabled: true,
      registerInteractionListener: registerInteractionListenerMock
    })

    renderHook(() => useAutoLockWatcher())

    expect(registerInteractionListenerMock).not.toHaveBeenCalled()
  })

  it('resets the timer when an interaction is reported', () => {
    jest.spyOn(Date, 'now').mockReturnValue(10000)

    renderHook(() => useAutoLockWatcher())

    const handler = registerInteractionListenerMock.mock.calls[0]?.[0]
    expect(handler).toEqual(expect.any(Function))

    setTimeout.mockClear()

    act(() => {
      handler(9000)
    })

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 4000)
  })

  it('locks when remaining time is exhausted', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(10000)

    renderHook(() => useAutoLockWatcher())

    const handler = registerInteractionListenerMock.mock.calls[0]?.[0]
    expect(handler).toEqual(expect.any(Function))

    await act(async () => {
      handler(0)
    })

    expect(closeAllInstances).toHaveBeenCalled()
    expect(clearAllFileCache).toHaveBeenCalled()
    expect(resetMock).toHaveBeenCalledWith({
      index: 0,
      routes: [
        {
          name: 'Welcome',
          params: { state: 'enterMasterPassword' }
        }
      ]
    })
    expect(resetStateMock).toHaveBeenCalled()
  })
})
