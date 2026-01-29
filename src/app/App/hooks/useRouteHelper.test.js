import { renderHook } from '@testing-library/react-native'

import { useRouteHelper } from './useRouteHelper'
import { NAVIGATION_ROUTES } from '../../../constants/navigation'

const { useNavigation } = require('@react-navigation/native')

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}))

describe('useRouteHelper', () => {
  const getStateMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigation.mockReturnValue({
      getState: getStateMock
    })
  })

  it('returns the current route from navigation state', () => {
    getStateMock.mockReturnValue({
      index: 1,
      routes: [{ name: 'Welcome' }, { name: 'MainTabNavigator' }]
    })

    const { result } = renderHook(() => useRouteHelper())

    expect(result.current.getCurrentRoute()).toEqual({
      name: 'MainTabNavigator'
    })
  })

  it('treats Welcome with ENTER_MASTER_PASSWORD as master password screen', () => {
    const { result } = renderHook(() => useRouteHelper())

    expect(
      result.current.isMasterPasswordScreen({
        name: 'Welcome',
        params: { state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD }
      })
    ).toBe(true)
  })

  it('treats Welcome without params as master password screen', () => {
    const { result } = renderHook(() => useRouteHelper())

    expect(
      result.current.isMasterPasswordScreen({
        name: 'Welcome'
      })
    ).toBe(true)
  })

  it('returns false for non-Welcome routes', () => {
    const { result } = renderHook(() => useRouteHelper())

    expect(
      result.current.isMasterPasswordScreen({
        name: 'MainTabNavigator'
      })
    ).toBe(false)
  })

  it('returns false for Welcome with other states', () => {
    const { result } = renderHook(() => useRouteHelper())

    expect(
      result.current.isMasterPasswordScreen({
        name: 'Welcome',
        params: { state: NAVIGATION_ROUTES.SELECT_OR_LOAD }
      })
    ).toBe(false)
  })
})
