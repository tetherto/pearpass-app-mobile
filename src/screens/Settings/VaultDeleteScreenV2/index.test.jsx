import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, fireEvent, render } from '@testing-library/react-native'
import {
  broadcastDeleteVault,
  useCreateVault,
  useUserData,
  useVault,
  useVaults
} from '@tetherto/pearpass-lib-vault'
import Toast from 'react-native-toast-message'

import { VaultDeleteScreenV2 } from './index'
import { useVaultSwitch } from '../../../hooks/useVaultSwitch'
import messages from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() })
}))

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const { View, Text: RNText, TextInput, Pressable } = require('react-native')
  return {
    rawTokens: new Proxy({}, { get: () => 0 }),
    AlertMessage: ({ description, testID }) => (
      <View testID={testID}>
        <RNText>{description}</RNText>
      </View>
    ),
    Button: ({ children, onClick, disabled, testID, isLoading }) => (
      <Pressable
        testID={testID}
        onPress={onClick}
        disabled={!!disabled || !!isLoading}
      >
        <RNText>{children}</RNText>
      </Pressable>
    ),
    Link: ({ children, onClick, testID }) => (
      <Pressable testID={testID} onPress={onClick}>
        <RNText>{children}</RNText>
      </Pressable>
    ),
    PasswordField: ({ value, onChangeText, testID, label }) => (
      <TextInput
        testID={testID}
        accessibilityLabel={label}
        value={value ?? ''}
        onChangeText={onChangeText}
      />
    ),
    Text: ({ children }) => <RNText>{children}</RNText>,
    ToggleSwitch: ({ checked, onChange, testID }) => (
      <Pressable
        testID={testID}
        onChange={(e) => onChange?.(e?.nativeEvent ?? !checked)}
        onPress={() => onChange?.(!checked)}
      >
        <RNText>{checked ? 'on' : 'off'}</RNText>
      </Pressable>
    )
  }
})

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  broadcastDeleteVault: jest.fn(),
  useCreateVault: jest.fn(),
  useUserData: jest.fn(),
  useVault: jest.fn(),
  useVaults: jest.fn()
}))

jest.mock('@tetherto/pearpass-lib-vault/src/utils/buffer', () => ({
  stringToBuffer: (s) => s,
  clearBuffer: jest.fn()
}))

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: jest.fn() }
}))

jest.mock('../../../hooks/useVaultSwitch', () => ({
  useVaultSwitch: jest.fn()
}))

jest.mock('../../../containers/BottomSheetPairedDevicesContent', () => ({
  BottomSheetPairedDevicesContent: () => null
}))

jest.mock('../../../containers/Layout', () => {
  const { View } = require('react-native')
  return {
    Layout: ({ children, footer }) => (
      <View>
        {children}
        {footer}
      </View>
    )
  }
})

jest.mock('../../../containers/ScreenHeader/BackScreenHeader', () => ({
  BackScreenHeader: () => null
}))

jest.mock('../../../utils/logger', () => ({
  logger: { error: jest.fn() }
}))

const renderScreen = () =>
  render(
    <VaultDeleteScreenV2
      route={{ params: { vaultId: 'v1', vaultName: 'V1' } }}
    />,
    {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    }
  )

describe('VaultDeleteScreenV2', () => {
  const logIn = jest.fn()
  const deleteVaultLocal = jest.fn()
  const addDevice = jest.fn()
  const createVault = jest.fn()
  const switchVault = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    logIn.mockResolvedValue(undefined)
    deleteVaultLocal.mockResolvedValue(undefined)
    addDevice.mockResolvedValue(undefined)
    createVault.mockResolvedValue(undefined)
    switchVault.mockResolvedValue(undefined)
    broadcastDeleteVault.mockResolvedValue({ results: [], failures: [] })

    useUserData.mockReturnValue({ logIn })
    useVault.mockReturnValue({
      data: { id: 'v1', devices: [{ id: 'd1' }, { id: 'd2' }] },
      deleteVaultLocal,
      addDevice
    })
    useVaults.mockReturnValue({
      data: [
        { id: 'v1', name: 'V1' },
        { id: 'v2', name: 'V2' }
      ]
    })
    useCreateVault.mockReturnValue({ createVault })
    useVaultSwitch.mockReturnValue({ switchVault })
  })

  const typePassword = (api, value) => {
    const input = api.getByTestId('vault-delete-v2-password-input')
    fireEvent.changeText(input, value)
  }

  const submit = async (api) => {
    await act(async () => {
      fireEvent.press(api.getByTestId('vault-delete-v2-submit-button'))
    })
  }

  it('rejects an invalid master password: no broadcast, no delete', async () => {
    logIn.mockRejectedValue(new Error('bad password'))

    const api = renderScreen()
    typePassword(api, 'wrong')
    await submit(api)

    expect(logIn).toHaveBeenCalled()
    expect(broadcastDeleteVault).not.toHaveBeenCalled()
    expect(deleteVaultLocal).not.toHaveBeenCalled()
  })

  it('with erase-all on and broadcast failure: surfaces toast but still deletes locally', async () => {
    broadcastDeleteVault.mockResolvedValue({
      results: [],
      failures: [{ targetDeviceId: 'peer-A', error: new Error('boom') }]
    })

    const api = renderScreen()
    typePassword(api, 'right')
    fireEvent(
      api.getByTestId('vault-delete-v2-eraseall-toggle'),
      'onChange',
      true
    )
    await submit(api)

    expect(broadcastDeleteVault).toHaveBeenCalledWith('v1')
    expect(deleteVaultLocal).toHaveBeenCalledWith('v1')
    expect(Toast.show).toHaveBeenCalled()
  })

  it('creates a fallback Personal vault when the last vault is removed', async () => {
    useVaults.mockReturnValue({ data: [{ id: 'v1', name: 'V1' }] })

    const api = renderScreen()
    typePassword(api, 'right')
    await submit(api)

    expect(deleteVaultLocal).toHaveBeenCalledWith('v1')
    expect(createVault).toHaveBeenCalled()
    expect(addDevice).toHaveBeenCalled()
  })

  it('logs and still proceeds when fallback Personal creation fails', async () => {
    useVaults.mockReturnValue({ data: [{ id: 'v1', name: 'V1' }] })
    createVault.mockRejectedValue(new Error('boom'))

    const api = renderScreen()
    typePassword(api, 'right')
    await submit(api)

    expect(deleteVaultLocal).toHaveBeenCalledWith('v1')
    // Toast called multiple times across the flow; at least the recovery
    // path should have triggered one of them.
    expect(Toast.show).toHaveBeenCalled()
  })
})
