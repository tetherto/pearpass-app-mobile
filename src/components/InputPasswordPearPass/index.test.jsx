import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { InputPasswordPearPass } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => {
  const { Text } = require('react-native')
  return {
    ButtonLittle: (props) => (
      <Text {...props} testID="button-little">
        ButtonLittle
      </Text>
    ),
    ErrorIcon: () => <Text testID="error-icon">ErrorIcon</Text>,
    EyeClosedIcon: () => <Text testID="eye-closed-icon">EyeClosedIcon</Text>,
    EyeIcon: () => <Text testID="eye-icon">EyeIcon</Text>,
    LockCircleIcon: () => <Text testID="lock-icon">LockCircleIcon</Text>
  }
})

jest.mock('./styles', () => {
  const { forwardRef } = require('react')

  const { TouchableOpacity, View, Text, TextInput } = require('react-native')
  return {
    InputWrapper: (props) => (
      <TouchableOpacity {...props} testID="input-wrapper">
        {props.children}
      </TouchableOpacity>
    ),
    IconWrapper: (props) => (
      <View {...props} testID="icon-wrapper">
        {props.children}
      </View>
    ),
    MainWrapper: (props) => (
      <View {...props} testID="main-wrapper">
        {props.children}
      </View>
    ),
    AdditionalItems: (props) => (
      <View {...props} testID="additional-items">
        {props.children}
      </View>
    ),
    ErrorMessageWrapper: (props) => (
      <View {...props} testID="error-message-wrapper">
        {props.children}
      </View>
    ),
    ErrorMessage: (props) => (
      <Text {...props} testID="error-message">
        {props.children}
      </Text>
    ),
    Input: forwardRef((props, ref) => (
      <TextInput ref={ref} {...props} testID="input" />
    ))
  }
})

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('InputPasswordPearPass component', () => {
  test('renders correctly with default props (password input with no error)', () => {
    const { getByTestId, queryByTestId, getByPlaceholderText, toJSON } =
      renderWithProviders(
        <InputPasswordPearPass isPassword placeholder="Enter password" />
      )

    expect(getByTestId('lock-icon')).toBeTruthy()

    expect(getByPlaceholderText('Enter password')).toBeTruthy()

    expect(getByTestId('additional-items')).toBeTruthy()

    expect(queryByTestId('error-message')).toBeNull()

    expect(toJSON()).toMatchSnapshot()
  })

  test('calls onChange when text input changes (if not disabled)', () => {
    const onChangeMock = jest.fn()
    const { getByTestId } = renderWithProviders(
      <InputPasswordPearPass
        isPassword
        placeholder="Enter password"
        onChange={onChangeMock}
      />
    )

    const input = getByTestId('input')
    fireEvent.changeText(input, 'new value')
    expect(onChangeMock).toHaveBeenCalledWith('new value')
  })

  test('does not call onChange when isDisabled is true', () => {
    const onChangeMock = jest.fn()
    const { getByTestId } = renderWithProviders(
      <InputPasswordPearPass
        isPassword
        placeholder="Enter password"
        onChange={onChangeMock}
        isDisabled
      />
    )

    const input = getByTestId('input')
    fireEvent.changeText(input, 'attempt change')
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  test('displays error message when error prop is provided', () => {
    const errorText = 'Invalid password'
    const { getByTestId } = renderWithProviders(
      <InputPasswordPearPass
        isPassword
        placeholder="Enter password"
        error={errorText}
      />
    )

    expect(getByTestId('error-message').props.children[1]).toBe(errorText)
  })

  test('toggles password visibility when the toggle button is pressed', () => {
    const { getByTestId } = renderWithProviders(
      <InputPasswordPearPass isPassword placeholder="Enter password" />
    )

    const input = getByTestId('input')
    expect(input.props.secureTextEntry).toBe(true)

    // Find the toggle icon (eye-icon or eye-closed-icon)
    const toggleIcon = getByTestId('eye-icon')
    fireEvent.press(toggleIcon)

    const updatedInput = getByTestId('input')

    expect(updatedInput.props.secureTextEntry).toBe(false)

    // After toggling, the icon should change to eye-closed-icon
    const toggleIconClosed = getByTestId('eye-closed-icon')
    fireEvent.press(toggleIconClosed)
    const revertedInput = getByTestId('input')
    expect(revertedInput.props.secureTextEntry).toBe(true)
  })

  test('calls onClick when InputWrapper is pressed and focuses the input', () => {
    const onClickMock = jest.fn()
    const { getByTestId } = renderWithProviders(
      <InputPasswordPearPass
        isPassword
        placeholder="Enter password"
        onClick={onClickMock}
      />
    )

    const wrapper = getByTestId('input-wrapper')

    fireEvent.press(wrapper)
    expect(onClickMock).toHaveBeenCalled()
  })
})
