import { renderHook, waitFor } from '@testing-library/react-native'

import { useRedirect } from './useRedirect'

const { useUserData } = require('@tetherto/pearpass-lib-vault')
const mockGetItemAsync = require('expo-secure-store').getItemAsync

const { hasOrphanedVaultData } = require('../../../utils/hasOrphanedVaultData')
const { logger } = require('../../../utils/logger')

// Mocks
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn()
}))
jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useUserData: jest.fn()
}))
jest.mock('../../../utils/hasOrphanedVaultData', () => ({
  hasOrphanedVaultData: jest.fn()
}))
jest.mock('../../../utils/logger', () => ({
  logger: { error: jest.fn() }
}))
jest.mock('../../../utils/SplashScreen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn()
}))
jest.mock('../../../utils/unsupportedFeatures', () => ({
  unsupportedFeaturesEnabled: jest.fn(() => false)
}))

const mockRefetchUserData = jest.fn()

describe('useRedirect', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useUserData.mockReturnValue({ refetch: mockRefetchUserData })
    hasOrphanedVaultData.mockResolvedValue(false)
  })

  it('should set initialRouteName to "OnboardingV2" if user has not set password', async () => {
    mockRefetchUserData.mockResolvedValue({ hasPasswordSet: false })
    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.initialRouteName).toBe('OnboardingV2')
  })

  it('should set initialRouteName to "AuthV2MasterPassword" if user has password and is not locked', async () => {
    mockRefetchUserData.mockResolvedValue({ hasPasswordSet: true })
    mockGetItemAsync.mockResolvedValue('true')
    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.initialRouteName).toBe('AuthV2MasterPassword')
  })

  it('should set initialRouteName to "Welcome" if user is locked', async () => {
    mockRefetchUserData.mockResolvedValue({
      hasPasswordSet: true,
      masterPasswordStatus: { isLocked: true, lockoutRemainingMs: 60000 }
    })
    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.initialRouteName).toBe('Welcome')
  })

  it('should set initialRouteName to "Error" if hasPasswordSet=false but vault data exists on disk', async () => {
    mockRefetchUserData.mockResolvedValue({ hasPasswordSet: false })
    hasOrphanedVaultData.mockResolvedValue(true)

    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.initialRouteName).toBe('Error')
    expect(logger.error).toHaveBeenCalledWith(
      'Auto-redirect: hasPasswordSet=false but vault data exists on disk'
    )
  })

  it('should not check for orphaned vault data when hasPasswordSet=true', async () => {
    mockRefetchUserData.mockResolvedValue({ hasPasswordSet: true })
    mockGetItemAsync.mockResolvedValue('true')

    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(hasOrphanedVaultData).not.toHaveBeenCalled()
    expect(result.current.initialRouteName).toBe('AuthV2MasterPassword')
  })

  it('should set initialRouteName to "Error" if an error occurs', async () => {
    mockRefetchUserData.mockResolvedValue(new Error('fail'))
    mockRefetchUserData.mockRejectedValue(new Error('fail'))
    const { result } = renderHook(() => useRedirect())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.initialRouteName).toBe('Error')
    expect(logger.error).toHaveBeenCalled()
  })
})
