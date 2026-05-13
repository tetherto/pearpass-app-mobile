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

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const RN = require('react-native')
  return {
    Button: ({ children, disabled, onClick, testID }) => (
      <RN.TouchableOpacity
        testID={testID}
        disabled={disabled}
        onPress={disabled ? undefined : onClick}
      >
        <RN.Text>{children}</RN.Text>
      </RN.TouchableOpacity>
    ),
    InputField: ({ label, value, onChange, testID }) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={testID}
          value={value}
          onChangeText={(text) => onChange?.({ target: { value: text } })}
        />
      </RN.View>
    ),
    PasswordField: ({ label, value, onChange, testID }) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={testID}
          value={value}
          onChangeText={(text) => onChange?.({ target: { value: text } })}
        />
      </RN.View>
    ),
    rawTokens: { spacing16: 16 }
  }
})

jest.mock('../../../containers/Layout', () => ({
  Layout: ({ header, children, footer }) => {
    const { View } = require('react-native')
    return (
      <View>
        {header}
        {children}
        {footer}
      </View>
    )
  }
}))

jest.mock('../../../containers/ScreenHeader/BackScreenHeader', () => ({
  BackScreenHeader: ({ title, onBack }) => {
    const { Text, TouchableOpacity } = require('react-native')
    return (
      <TouchableOpacity testID="rename-vault-back-button" onPress={onBack}>
        <Text>{title}</Text>
      </TouchableOpacity>
    )
  }
}))

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn()
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
