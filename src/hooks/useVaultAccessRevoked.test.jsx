import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, renderHook } from '@testing-library/react-native'
import {
  useCreateVault,
  useVault,
  useVaults
} from '@tetherto/pearpass-lib-vault'
import { pearpassVaultClient } from '@tetherto/pearpass-lib-vault/src/instances'
import Toast from 'react-native-toast-message'

import { useVaultAccessRevoked } from './useVaultAccessRevoked'
import { useVaultSwitch } from './useVaultSwitch'
import { useModal } from '../context/ModalContext'
import messages from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const renderRevokedHook = () =>
  renderHook(() => useVaultAccessRevoked(), {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    )
  })

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useCreateVault: jest.fn(),
  useVault: jest.fn(),
  useVaults: jest.fn()
}))

jest.mock('@tetherto/pearpass-lib-vault/src/instances', () => ({
  pearpassVaultClient: {
    on: jest.fn(),
    off: jest.fn()
  }
}))

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: jest.fn() }
}))

jest.mock('./useVaultSwitch', () => ({
  useVaultSwitch: jest.fn()
}))

jest.mock('../context/ModalContext', () => ({
  useModal: jest.fn()
}))

jest.mock('../containers/Modal/AccessRemovedModalContent', () => ({
  AccessRemovedModalContent: jest.fn(() => null)
}))

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({ t: (text) => text })
}))

jest.mock('../utils/logger', () => ({
  logger: { error: jest.fn() }
}))

describe('useVaultAccessRevoked', () => {
  const openModal = jest.fn()
  const deleteVaultLocal = jest.fn()
  const switchVault = jest.fn()
  const createVault = jest.fn()
  const addDevice = jest.fn()

  const activeVault = { id: 'v-active', name: 'Active', devices: [] }
  const otherVault = { id: 'v-other', name: 'Other' }

  let revokedHandler = () => {}

  beforeEach(() => {
    jest.clearAllMocks()

    pearpassVaultClient.on.mockImplementation((event, handler) => {
      if (event === 'vault-access-revoked') revokedHandler = handler
    })

    useModal.mockReturnValue({ openModal })
    useVaultSwitch.mockReturnValue({ switchVault })
    useCreateVault.mockReturnValue({ createVault })

    useVaults.mockReturnValue({ data: [activeVault, otherVault] })
    useVault.mockReturnValue({
      data: activeVault,
      deleteVaultLocal,
      addDevice
    })

    deleteVaultLocal.mockResolvedValue(undefined)
    switchVault.mockResolvedValue(undefined)
    createVault.mockResolvedValue(undefined)
    addDevice.mockResolvedValue(undefined)
  })

  it('subscribes on mount and unsubscribes on unmount', () => {
    const { unmount } = renderRevokedHook()
    expect(pearpassVaultClient.on).toHaveBeenCalledWith(
      'vault-access-revoked',
      expect.any(Function)
    )
    unmount()
    expect(pearpassVaultClient.off).toHaveBeenCalledWith(
      'vault-access-revoked',
      expect.any(Function)
    )
  })

  it('ignores payloads with no vaultId or unknown vault', async () => {
    renderRevokedHook()
    await act(async () => revokedHandler({}))
    await act(async () => revokedHandler({ vaultId: 'v-unknown' }))
    expect(deleteVaultLocal).not.toHaveBeenCalled()
    expect(openModal).not.toHaveBeenCalled()
  })

  it('wipes the active vault and switches to the next when one exists', async () => {
    renderRevokedHook()
    await act(async () => revokedHandler({ vaultId: 'v-active' }))

    expect(deleteVaultLocal).toHaveBeenCalledWith('v-active')
    expect(switchVault).toHaveBeenCalledWith(otherVault)
    expect(createVault).not.toHaveBeenCalled()
    expect(openModal).toHaveBeenCalledTimes(1)
  })

  it('falls back to a Personal vault when no other vault remains', async () => {
    useVaults.mockReturnValue({ data: [activeVault] })

    renderRevokedHook()
    await act(async () => revokedHandler({ vaultId: 'v-active' }))

    expect(createVault).toHaveBeenCalled()
    expect(addDevice).toHaveBeenCalled()
    expect(Toast.show).toHaveBeenCalled()
  })

  it('toasts a recovery error when fallback Personal creation fails', async () => {
    useVaults.mockReturnValue({ data: [activeVault] })
    createVault.mockRejectedValue(new Error('boom'))

    renderRevokedHook()
    await act(async () => revokedHandler({ vaultId: 'v-active' }))

    // Toast fires twice on the failure path: once for the recovery error
    // toast and once for the original delete-confirmation toast.
    expect(Toast.show).toHaveBeenCalled()
    expect(createVault).toHaveBeenCalled()
  })

  it('still opens the access-removed modal when delete fails locally', async () => {
    deleteVaultLocal.mockRejectedValue(new Error('disk-full'))

    renderRevokedHook()
    await act(async () => revokedHandler({ vaultId: 'v-active' }))

    expect(openModal).toHaveBeenCalledTimes(1)
    expect(switchVault).not.toHaveBeenCalled()
    expect(createVault).not.toHaveBeenCalled()
  })
})
