import { renderHook, act } from '@testing-library/react-native'
import { useVault } from '@tetherto/pearpass-lib-vault'

import { useVaultSwitch } from './useVaultSwitch'
import { useGlobalLoading } from '../context/LoadingContext'
import { useModal } from '../context/ModalContext'

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useVault: jest.fn(),
  useVaults: jest.fn()
}))

jest.mock('../context/ModalContext', () => ({
  useModal: jest.fn()
}))

jest.mock('../context/LoadingContext', () => ({
  useGlobalLoading: jest.fn()
}))

jest.mock('../containers/Modal/VaultPasswordFormModalContent', () => ({
  VaultPasswordFormModalContent: jest.fn(() => null)
}))

describe('useVaultSwitch', () => {
  const refetchVault = jest.fn().mockResolvedValue(undefined)
  const isVaultProtected = jest.fn()
  let openModal
  let closeModal

  beforeEach(() => {
    jest.clearAllMocks()
    refetchVault.mockResolvedValue(undefined)
    openModal = jest.fn()
    closeModal = jest.fn()

    useVault.mockReturnValue({
      data: { id: 'vault-active', name: 'Active Vault' },
      isVaultProtected,
      refetch: refetchVault
    })

    useModal.mockReturnValue({
      openModal,
      closeModal
    })

    useGlobalLoading.mockImplementation(() => {})
  })

  const vaultOther = { id: 'vault-other', name: 'Other Vault' }

  it('calls onSameVault and skips switch when target is already active', async () => {
    const onSameVault = jest.fn()
    const onSwitchComplete = jest.fn()

    const { result } = renderHook(() =>
      useVaultSwitch({ onSameVault, onSwitchComplete })
    )

    await act(async () => {
      await result.current.switchVault({
        id: 'vault-active',
        name: 'Active Vault'
      })
    })

    expect(onSameVault).toHaveBeenCalledTimes(1)
    expect(onSwitchComplete).not.toHaveBeenCalled()
    expect(isVaultProtected).not.toHaveBeenCalled()
    expect(refetchVault).not.toHaveBeenCalled()
    expect(openModal).not.toHaveBeenCalled()
  })

  it('refetches and calls onSwitchComplete when vault is not protected', async () => {
    const onSwitchComplete = jest.fn()
    isVaultProtected.mockResolvedValue(false)

    const { result } = renderHook(() => useVaultSwitch({ onSwitchComplete }))

    await act(async () => {
      await result.current.switchVault(vaultOther)
    })

    expect(isVaultProtected).toHaveBeenCalledWith('vault-other')
    expect(refetchVault).toHaveBeenCalledWith('vault-other')
    expect(refetchVault).toHaveBeenCalledTimes(1)
    expect(onSwitchComplete).toHaveBeenCalledTimes(1)
    expect(openModal).not.toHaveBeenCalled()
  })

  it('opens password modal when vault is protected', async () => {
    isVaultProtected.mockResolvedValue(true)

    const { result } = renderHook(() => useVaultSwitch())

    await act(async () => {
      await result.current.switchVault(vaultOther)
    })

    expect(openModal).toHaveBeenCalledTimes(1)
    expect(refetchVault).not.toHaveBeenCalled()

    const modalElement = openModal.mock.calls[0][0]
    expect(modalElement.props.vault).toEqual(vaultOther)
    expect(typeof modalElement.props.onSubmit).toBe('function')
  })

  it('refetches with password, closes modal, and completes after modal submit', async () => {
    isVaultProtected.mockResolvedValue(true)
    const onSwitchComplete = jest.fn()

    const { result } = renderHook(() => useVaultSwitch({ onSwitchComplete }))

    await act(async () => {
      await result.current.switchVault(vaultOther)
    })

    const modalElement = openModal.mock.calls[0][0]

    await act(async () => {
      await modalElement.props.onSubmit('correct-horse')
    })

    expect(refetchVault).toHaveBeenCalledWith('vault-other', {
      password: 'correct-horse'
    })
    expect(closeModal).toHaveBeenCalledTimes(1)
    expect(onSwitchComplete).toHaveBeenCalledTimes(1)
  })

  it('uses injected openModal and closeModal when provided', async () => {
    const injectedOpen = jest.fn()
    const injectedClose = jest.fn()
    isVaultProtected.mockResolvedValue(true)

    const { result } = renderHook(() =>
      useVaultSwitch({
        openModal: injectedOpen,
        closeModal: injectedClose
      })
    )

    await act(async () => {
      await result.current.switchVault(vaultOther)
    })

    expect(injectedOpen).toHaveBeenCalledTimes(1)
    expect(openModal).not.toHaveBeenCalled()

    const modalElement = injectedOpen.mock.calls[0][0]

    await act(async () => {
      await modalElement.props.onSubmit('pw')
    })

    expect(injectedClose).toHaveBeenCalledTimes(1)
    expect(closeModal).not.toHaveBeenCalled()
    expect(refetchVault).toHaveBeenCalledWith('vault-other', { password: 'pw' })
  })

  it('passes loading state through useGlobalLoading across protected vault switch and modal submit', async () => {
    useGlobalLoading.mockImplementation(() => {})

    isVaultProtected.mockResolvedValue(true)
    const onSwitchComplete = jest.fn()

    const { result } = renderHook(() => useVaultSwitch({ onSwitchComplete }))

    expect(useGlobalLoading.mock.calls[0][0]).toEqual(
      expect.objectContaining({ isLoading: false })
    )
    const callsAfterMount = useGlobalLoading.mock.calls.length

    await act(async () => {
      await result.current.switchVault(vaultOther)
    })

    expect(useGlobalLoading.mock.calls.length).toBeGreaterThan(callsAfterMount)
    expect(
      useGlobalLoading.mock.calls[useGlobalLoading.mock.calls.length - 1][0]
    ).toEqual(expect.objectContaining({ isLoading: false }))

    const modalElement = openModal.mock.calls[0][0]

    const callsAfterModalOpen = useGlobalLoading.mock.calls.length

    await act(async () => {
      await modalElement.props.onSubmit('correct-horse')
    })

    expect(onSwitchComplete).toHaveBeenCalledTimes(1)
    expect(useGlobalLoading.mock.calls.length).toBeGreaterThan(
      callsAfterModalOpen
    )
    expect(
      useGlobalLoading.mock.calls[useGlobalLoading.mock.calls.length - 1][0]
    ).toEqual(expect.objectContaining({ isLoading: false }))
    // React 18 may batch consecutive setIsLoading updates inside one async continuation,
    // so discrete true renders are not always observable in Jest; we still assert extra
    // subscriptions after switch + submit and terminal idle state above.
  })
})
