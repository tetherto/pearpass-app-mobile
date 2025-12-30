jest.mock('pearpass-utils-password-check', () => ({
  checkPassphraseStrength: jest.fn(),
  checkPasswordStrength: jest.fn(),
  PASSWORD_STRENGTH: {
    SAFE: 'SAFE',
    VULNERABLE: 'VULNERABLE',
    WEAK: 'WEAK'
  }
}))

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'
import { checkPasswordStrength } from 'pearpass-utils-password-check'
import { Text } from 'react-native'

import { PasswordField } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const DummyAdditionalItem = () => (
  <Text testID="dummy-additional">Additional</Text>
)

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('PasswordField Component', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    label: 'Password',
    error: '',
    passType: 'password',
    additionalItems: null,
    placeholder: 'Enter password',
    isDisabled: false,
    onClick: jest.fn(),
    isLast: false,
    isFirst: false,
    hasStrongness: false,
    index: 0,
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onInputLayout: jest.fn(),
    focusedIndex: 0
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders label, placeholder, and error correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <PasswordField
        {...defaultProps}
        value="test value"
        error="Error occurred"
      />
    )
    expect(getByText('Password')).toBeTruthy()
    expect(getByPlaceholderText('Enter password')).toBeTruthy()
    expect(getByText('Error occurred')).toBeTruthy()
  })

  test('calls onChange when text changes', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = renderWithProviders(
      <PasswordField {...defaultProps} onChange={onChangeMock} value="" />
    )
    const input = getByPlaceholderText('Enter password')
    fireEvent.changeText(input, 'new password')
    expect(onChangeMock).toHaveBeenCalledWith('new password')
  })

  test('triggers onFocus and onBlur events', () => {
    const onFocusMock = jest.fn()
    const onBlurMock = jest.fn()
    const { getByPlaceholderText } = renderWithProviders(
      <PasswordField
        {...defaultProps}
        onFocus={onFocusMock}
        onBlur={onBlurMock}
        value=""
      />
    )
    const input = getByPlaceholderText('Enter password')
    fireEvent(input, 'focus')
    expect(onFocusMock).toHaveBeenCalledTimes(1)
    fireEvent(input, 'blur')
    expect(onBlurMock).toHaveBeenCalledTimes(1)
  })

  test('calls onClick when outer container is pressed', () => {
    const onClickMock = jest.fn()
    const { getByPlaceholderText } = renderWithProviders(
      <PasswordField
        {...defaultProps}
        onClick={onClickMock}
        value="click test"
      />
    )
    const input = getByPlaceholderText('Enter password')
    fireEvent.press(input)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  test('renders password strongness as "Strong" when safe', () => {
    checkPasswordStrength.mockReturnValue({
      isSafe: true,
      success: true,
      strengthType: 'success',
      strengthText: 'Strong'
    })
    const { getByText } = renderWithProviders(
      <PasswordField
        {...defaultProps}
        value="safePass"
        hasStrongness
        passType="password"
      />
    )
    expect(getByText('Strong')).toBeTruthy()
  })

  test('renders password strongness as "Weak" when not safe', () => {
    checkPasswordStrength.mockReturnValue({
      isSafe: false,
      success: true,
      strengthType: 'error',
      strengthText: 'Weak'
    })
    const { getByText } = renderWithProviders(
      <PasswordField
        {...defaultProps}
        value="weakPass"
        hasStrongness
        passType="password"
      />
    )
    expect(getByText('Weak')).toBeTruthy()
  })

  test('renders additionalItems if provided', () => {
    const { getByTestId } = renderWithProviders(
      <PasswordField
        {...defaultProps}
        additionalItems={<DummyAdditionalItem />}
      />
    )
    expect(getByTestId('dummy-additional')).toBeTruthy()
  })

  test('matches snapshot', () => {
    const { toJSON } = renderWithProviders(
      <PasswordField
        {...defaultProps}
        value="snapshot value"
        label="Snapshot Label"
        error="Snapshot error"
        isSecure={true}
        hasStrongness={true}
      />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('toggles password visibility when toggle button is pressed', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <PasswordField {...defaultProps} value="secret" />
    )

    const input = getByPlaceholderText('Enter password')

    expect(input.props.secureTextEntry).toBe(true)
  })
})
