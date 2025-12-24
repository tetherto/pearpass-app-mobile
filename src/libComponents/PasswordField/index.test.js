jest.mock('pearpass-utils-password-check', () => ({
  checkPassphraseStrength: jest.fn(),
  checkPasswordStrength: jest.fn()
}))

import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'
import { checkPasswordStrength } from 'pearpass-utils-password-check'
import { Text } from 'react-native'

import { PasswordField } from './index'

const DummyAdditionalItem = () => (
  <Text testID="dummy-additional">Additional</Text>
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
    const { getByText, getByPlaceholderText } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          value="test value"
          error="Error occurred"
        />
      </ThemeProvider>
    )
    expect(getByText('Password')).toBeTruthy()
    expect(getByPlaceholderText('Enter password')).toBeTruthy()
    expect(getByText('Error occurred')).toBeTruthy()
  })

  test('calls onChange when text changes', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <PasswordField {...defaultProps} onChange={onChangeMock} value="" />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter password')
    fireEvent.changeText(input, 'new password')
    expect(onChangeMock).toHaveBeenCalledWith('new password')
  })

  test('triggers onFocus and onBlur events', () => {
    const onFocusMock = jest.fn()
    const onBlurMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          onFocus={onFocusMock}
          onBlur={onBlurMock}
          value=""
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter password')
    fireEvent(input, 'focus')
    expect(onFocusMock).toHaveBeenCalledTimes(1)
    fireEvent(input, 'blur')
    expect(onBlurMock).toHaveBeenCalledTimes(1)
  })

  test('calls onClick when outer container is pressed', () => {
    const onClickMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          onClick={onClickMock}
          value="click test"
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter password')
    fireEvent.press(input)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  test('renders password strongness as "Strong" when safe', () => {
    checkPasswordStrength.mockReturnValue({ isSafe: true })
    const { getByText } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          value="safePass"
          hasStrongness
          passType="password"
        />
      </ThemeProvider>
    )
    expect(getByText('Strong')).toBeTruthy()
  })

  test('renders password strongness as "Weak" when not safe', () => {
    checkPasswordStrength.mockReturnValue({ isSafe: false })
    const { getByText } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          value="weakPass"
          hasStrongness
          passType="password"
        />
      </ThemeProvider>
    )
    expect(getByText('Weak')).toBeTruthy()
  })

  test('renders additionalItems if provided', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          additionalItems={<DummyAdditionalItem />}
        />
      </ThemeProvider>
    )
    expect(getByTestId('dummy-additional')).toBeTruthy()
  })

  test('matches snapshot', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          value="snapshot value"
          label="Snapshot Label"
          error="Snapshot error"
          isSecure={true}
          hasStrongness={true}
        />
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('toggles password visibility when toggle button is pressed', () => {
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <PasswordField {...defaultProps} value="secret" />
      </ThemeProvider>
    )

    const input = getByPlaceholderText('Enter password')

    expect(input.props.secureTextEntry).toBe(true)
  })

  test('passes inputTestID to password input', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          inputTestID="password-input"
        />
      </ThemeProvider>
    )
    expect(getByTestId('password-input')).toBeTruthy()
  })

  test('renders visibility toggle with testID', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <PasswordField
          {...defaultProps}
          toggleTestID="password-toggle"
        />
      </ThemeProvider>
    )
    expect(getByTestId('password-toggle')).toBeTruthy()
  })
})
