import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import Toast from 'react-native-toast-message'

import { VaultDeleteScreen } from './index'
import messages from '../../../locales/en/messages'

const mockGoBack = jest.fn()

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack
  })
}))

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const RN = require('react-native')

  return {
    AlertMessage: ({ description, testID }) => (
      <RN.Text testID={testID}>{description}</RN.Text>
    ),
    Button: ({ children, disabled, onClick, testID }) => (
      <RN.TouchableOpacity
        testID={testID}
        disabled={disabled}
        onPress={disabled ? undefined : onClick}
      >
        <RN.Text>{children}</RN.Text>
      </RN.TouchableOpacity>
    ),
    PageHeader: ({ title, subtitle }) => (
      <RN.View>
        <RN.Text>{title}</RN.Text>
        <RN.Text>{subtitle}</RN.Text>
      </RN.View>
    ),
    PasswordField: ({ label, value, onChangeText, testID }) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
        />
      </RN.View>
    ),
    rawTokens: {
      spacing16: 16,
      spacing20: 20
    }
  }
})

jest.mock('@tetherto/pearpass-lib-ui-kit/icons', () => ({
  ReportProblem: () => null
}))

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn()
  }
}))

jest.mock(
  'src/containers/ScreenHeader/BackScreenHeader',
  () => ({
    BackScreenHeader: ({ onBack }) => {
      const { Text, TouchableOpacity } = require('react-native')
      return (
        <TouchableOpacity testID="vault-delete-back-button" onPress={onBack}>
          <Text>Back</Text>
        </TouchableOpacity>
      )
    }
  }),
  { virtual: true }
)

jest.mock(
  'src/containers/Layout',
  () => ({
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
  }),
  { virtual: true }
)

describe('VaultDeleteScreen', () => {
  const renderScreen = (route = { params: { vaultName: 'Personal Vault' } }) =>
    render(
      <I18nProvider i18n={i18n}>
        <VaultDeleteScreen route={route} />
      </I18nProvider>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the destructive copy and warning', () => {
    const { getByText, getByTestId } = renderScreen()

    expect(getByText('Delete Personal Vault')).toBeTruthy()
    expect(
      getByText(
        'Are you sure you want to delete “Personal Vault”? All items in this vault will be permanently deleted. This cannot be undone.'
      )
    ).toBeTruthy()
    expect(getByTestId('vault-delete-warning')).toBeTruthy()
  })

  it('shows a toast once the master password is provided', async () => {
    const { getByTestId } = renderScreen()

    fireEvent.changeText(
      getByTestId('vault-delete-master-password-input'),
      'master-password'
    )
    fireEvent.press(getByTestId('vault-delete-submit-button'))

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          text1: 'Vault deletion is not yet connected on mobile'
        })
      )
    )
  })

  it('navigates back from the header control', () => {
    const { getByTestId } = renderScreen()

    fireEvent.press(getByTestId('vault-delete-back-button'))

    expect(mockGoBack).toHaveBeenCalled()
  })
})
