import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import Toast from 'react-native-toast-message'

import { VaultRenameScreen } from './index'
import messages from '../../../locales/en/messages'

const mockGoBack = jest.fn()
const mockUseVault = jest.fn()

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack
  })
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useVault: () => mockUseVault()
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  BackIcon: (props) => {
    const { View } = require('react-native')
    return <View {...props} testID="back-icon" />
  },
  EyeClosedIcon: (props) => {
    const { View } = require('react-native')
    return <View {...props} testID="eye-closed-icon" />
  },
  EyeIcon: (props) => {
    const { View } = require('react-native')
    return <View {...props} testID="eye-icon" />
  }
}))

jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    white: { mode1: '#FFFFFF' }
  }
}))

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native')
  return {
    SafeAreaView: ({ children, ...props }) => <View {...props}>{children}</View>
  }
})

jest.mock('react-native-svg', () => {
  const { View } = require('react-native')

  const MockComponent = ({ children, ...props }) => (
    <View {...props}>{children}</View>
  )

  return {
    __esModule: true,
    default: MockComponent,
    Defs: MockComponent,
    LinearGradient: MockComponent,
    Rect: MockComponent,
    Stop: MockComponent
  }
})

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn()
  }
}))

jest.mock('../../../libComponents', () => ({
  ButtonPrimary: ({ children, disabled, onPress, testID }) => {
    const { Text, TouchableOpacity } = require('react-native')
    return (
      <TouchableOpacity
        testID={testID}
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
      >
        <Text>{children}</Text>
      </TouchableOpacity>
    )
  }
}))

jest.mock('../../../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

describe('VaultRenameScreen', () => {
  const updateProtectedVault = jest.fn()
  const updateUnprotectedVault = jest.fn()
  const isVaultProtected = jest.fn()

  const renderScreen = (
    route = { params: { vaultId: 'vault-1', vaultName: 'Personal Vault' } }
  ) =>
    render(
      <I18nProvider i18n={i18n}>
        <VaultRenameScreen route={route} />
      </I18nProvider>
    )

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseVault.mockReturnValue({
      data: { id: 'vault-1', name: 'Personal Vault' },
      isVaultProtected,
      updateProtectedVault,
      updateUnprotectedVault
    })
  })

  it('renders the rename screen with the existing vault name', async () => {
    isVaultProtected.mockResolvedValue(false)

    const { getByText, getByDisplayValue, queryByTestId } = renderScreen()

    expect(getByText('Rename Vault')).toBeTruthy()
    expect(getByDisplayValue('Personal Vault')).toBeTruthy()

    await waitFor(() =>
      expect(queryByTestId('rename-vault-current-password-input')).toBeNull()
    )
  })

  it('renames an unprotected vault and navigates back', async () => {
    isVaultProtected.mockResolvedValue(false)
    updateUnprotectedVault.mockResolvedValue(undefined)

    const { getByTestId } = renderScreen()

    fireEvent.changeText(getByTestId('rename-vault-name-input'), 'Work Vault')
    fireEvent.press(getByTestId('rename-vault-save-button'))

    await waitFor(() =>
      expect(updateUnprotectedVault).toHaveBeenCalledWith('vault-1', {
        name: 'Work Vault'
      })
    )

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        text1: 'Vault renamed'
      })
    )
    expect(mockGoBack).toHaveBeenCalled()
  })

  it('requires the current password for protected vaults', async () => {
    isVaultProtected.mockResolvedValue(true)
    updateProtectedVault.mockResolvedValue(undefined)

    const { getByTestId } = renderScreen()

    await waitFor(() =>
      expect(getByTestId('rename-vault-current-password-input')).toBeTruthy()
    )

    fireEvent.changeText(getByTestId('rename-vault-name-input'), 'Family Vault')
    fireEvent.changeText(
      getByTestId('rename-vault-current-password-input'),
      'vault-password'
    )
    fireEvent.press(getByTestId('rename-vault-save-button'))

    await waitFor(() =>
      expect(updateProtectedVault).toHaveBeenCalledWith('vault-1', {
        name: 'Family Vault',
        currentPassword: 'vault-password'
      })
    )
  })
})
