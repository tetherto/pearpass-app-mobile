import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render } from '@testing-library/react-native'

import { StepIdentity } from './StepIdentity'
import { messages } from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const RN = require('react-native')

  return {
    Button: ({ children, onClick, disabled, testID }) => (
      <RN.Pressable
        onPress={() => {
          if (!disabled) {
            onClick?.()
          }
        }}
        testID={testID}
      >
        <RN.Text>{children}</RN.Text>
      </RN.Pressable>
    ),
    InputField: ({ label, value, onChangeText, testID }) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
        />
      </RN.View>
    ),
    ToggleSwitch: ({ label, description, checked, onChange }) => (
      <RN.Pressable
        testID="new-vault-password-toggle"
        onPress={() => onChange?.(!checked)}
      >
        <RN.Text>{label}</RN.Text>
        <RN.Text>{description}</RN.Text>
        <RN.Text>{checked ? 'on' : 'off'}</RN.Text>
      </RN.Pressable>
    ),
    Form: ({ children, testID }) => (
      <RN.View testID={testID}>{children}</RN.View>
    ),
    PasswordField: ({ label, value, onChangeText, testID, errorMessage }) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
        />
        {errorMessage ? <RN.Text>{errorMessage}</RN.Text> : null}
      </RN.View>
    )
  }
})

jest.mock('@tetherto/pearpass-lib-ui-kit/icons', () => ({
  KeyboardArrowRightFilled: () => null
}))

jest.mock('../shared/AuthFlowFormLayout', () => {
  const RN = require('react-native')

  return {
    AuthFlowFormLayout: ({ title, subtitle, children, footer }) => (
      <RN.View>
        <RN.Text>{title}</RN.Text>
        <RN.Text>{subtitle}</RN.Text>
        {children}
        {footer}
      </RN.View>
    )
  }
})

const renderWithProviders = (ui) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

describe('StepIdentity', () => {
  it('creates an unprotected vault when only the name is provided', () => {
    const onSubmit = jest.fn()
    const { getByTestId } = renderWithProviders(
      <StepIdentity onSubmit={onSubmit} onBack={jest.fn()} />
    )

    fireEvent.changeText(getByTestId('new-vault-name-input'), 'Personal Vault')
    fireEvent.press(getByTestId('new-vault-submit-button'))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Personal Vault',
      usePassword: false,
      password: '',
      passwordConfirm: ''
    })
  })

  it('requires matching strong passwords before submitting a protected vault', () => {
    const onSubmit = jest.fn()
    const { getByTestId, queryByText } = renderWithProviders(
      <StepIdentity onSubmit={onSubmit} onBack={jest.fn()} />
    )

    fireEvent.changeText(getByTestId('new-vault-name-input'), 'Shared Vault')
    fireEvent.press(getByTestId('new-vault-password-toggle'))
    fireEvent.changeText(getByTestId('new-vault-password-input'), 'weak')
    fireEvent.changeText(
      getByTestId('new-vault-password-confirm-input'),
      'weak'
    )
    fireEvent.press(getByTestId('new-vault-submit-button'))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(
      queryByText('Password must be at least 8 characters long')
    ).toBeTruthy()

    fireEvent.changeText(
      getByTestId('new-vault-password-input'),
      'StrongVault#2026'
    )
    fireEvent.changeText(
      getByTestId('new-vault-password-confirm-input'),
      'StrongVault#2026'
    )
    fireEvent.press(getByTestId('new-vault-submit-button'))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Shared Vault',
      usePassword: true,
      password: 'StrongVault#2026',
      passwordConfirm: 'StrongVault#2026'
    })
  })
})
