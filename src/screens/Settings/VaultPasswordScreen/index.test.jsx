import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import Toast from 'react-native-toast-message'

import { VaultPasswordScreen } from './index'
import messages from '../../../locales/en/messages'

const mockGoBack = jest.fn()
const mockUseVault = jest.fn()
const mockValidatePasswordChange = jest.fn()

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

jest.mock('@tetherto/pearpass-utils-password-check', () => ({
  validatePasswordChange: (...args) => mockValidatePasswordChange(...args)
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

describe('VaultPasswordScreen', () => {
  const updateProtectedVault = jest.fn()
  const updateUnprotectedVault = jest.fn()
  const isVaultProtected = jest.fn()

  const renderScreen = (
    route = { params: { vaultId: 'vault-1', vaultName: 'Personal Vault' } }
  ) =>
    render(
      <I18nProvider i18n={i18n}>
        <VaultPasswordScreen route={route} />
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

    mockValidatePasswordChange.mockReturnValue({
      success: true
    })
  })

  it('updates the password for an unprotected vault', async () => {
    isVaultProtected.mockResolvedValue(false)
    updateUnprotectedVault.mockResolvedValue(undefined)

    const { getByTestId, queryByTestId } = renderScreen()

    fireEvent.changeText(getByTestId('vault-password-new-input'), 'Strong#2026')
    fireEvent.changeText(
      getByTestId('vault-password-repeat-input'),
      'Strong#2026'
    )
    fireEvent.press(getByTestId('vault-password-save-button'))

    await waitFor(() =>
      expect(updateUnprotectedVault).toHaveBeenCalledWith('vault-1', {
        name: 'Personal Vault',
        password: 'Strong#2026'
      })
    )

    expect(mockValidatePasswordChange).toHaveBeenCalled()
    expect(queryByTestId('vault-password-current-input')).toBeNull()
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        text1: 'Vault password updated'
      })
    )
    expect(mockGoBack).toHaveBeenCalled()
  })

  it('shows a toast when password validation fails', async () => {
    isVaultProtected.mockResolvedValue(false)
    mockValidatePasswordChange.mockReturnValue({
      success: false,
      error: 'Passwords do not match'
    })

    const { getByTestId } = renderScreen()

    fireEvent.changeText(getByTestId('vault-password-new-input'), 'Strong#2026')
    fireEvent.changeText(getByTestId('vault-password-repeat-input'), 'Mismatch')
    fireEvent.press(getByTestId('vault-password-save-button'))

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          text1: 'Passwords do not match'
        })
      )
    )

    expect(updateUnprotectedVault).not.toHaveBeenCalled()
  })

  it('renders and updates the current password path for protected vaults', async () => {
    isVaultProtected.mockResolvedValue(true)
    updateProtectedVault.mockResolvedValue(undefined)

    const { getByTestId } = renderScreen()

    await waitFor(() =>
      expect(getByTestId('vault-password-current-input')).toBeTruthy()
    )

    fireEvent.changeText(
      getByTestId('vault-password-current-input'),
      'old-password'
    )
    fireEvent.changeText(getByTestId('vault-password-new-input'), 'Strong#2026')
    fireEvent.changeText(
      getByTestId('vault-password-repeat-input'),
      'Strong#2026'
    )
    fireEvent.press(getByTestId('vault-password-save-button'))

    await waitFor(() =>
      expect(updateProtectedVault).toHaveBeenCalledWith('vault-1', {
        name: 'Personal Vault',
        password: 'Strong#2026',
        currentPassword: 'old-password'
      })
    )
  })
})
