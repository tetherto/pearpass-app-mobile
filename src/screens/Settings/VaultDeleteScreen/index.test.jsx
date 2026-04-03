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

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  BackIcon: (props) => {
    const { View } = require('react-native')
    return <View {...props} testID="back-icon" />
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

jest.mock('../../../components/AppWarning', () => ({
  AppWarning: ({ warning, testID }) => {
    const { Text } = require('react-native')
    return <Text testID={testID}>{warning}</Text>
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
