import { renderHook, waitFor } from '@testing-library/react-native'

import { useRedirect } from './useRedirect'

const mockGetItemAsync = require('expo-secure-store').getItemAsync
const { useUserData } = require('pearpass-lib-vault')

const { logger } = require('../../../utils/logger')

// Mocks
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn()
}))
jest.mock('pearpass-lib-vault', () => ({
  useUserData: jest.fn()
}))
jest.mock('../../../utils/logger', () => ({
  logger: { error: jest.fn() }
}))
jest.mock('../../../utils/SplashScreen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn()
}))

const mockRefetchUserData = jest.fn()

describe('useRedirect', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useUserData.mockReturnValue({ refetch: mockRefetchUserData })
  })

  it('should set initialRouteName to "Intro" if user has not set password', async () => {
    mockRefetchUserData.mockResolvedValue({ hasPasswordSet: false })
    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.initialRouteName).toBe('Intro')
    expect(result.current.isLoading).toBe(false)
  })

  it('should set initialRouteName to "Welcome" if acceptedTerms is true', async () => {
    mockRefetchUserData.mockResolvedValue({ hasPasswordSet: true })
    mockGetItemAsync.mockResolvedValue('true')
    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.initialRouteName).toBe('Welcome')
    expect(result.current.isLoading).toBe(false)
  })

  it('should set initialRouteName to "Error" if an error occurs', async () => {
    mockRefetchUserData.mockRejectedValue(new Error('fail'))
    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.initialRouteName).toBe('Error')
    expect(result.current.isLoading).toBe(false)
    expect(logger.error).toHaveBeenCalled()
  })
})
